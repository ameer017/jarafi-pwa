import { http, useAccount } from "wagmi";
import {
  CELO_CHAIN,
  ETHEREUM_CHAIN,
  RPC_URLS,
  TOKENS,
} from "../../constant/otherChains";
import { Contract, ethers, JsonRpcProvider } from "ethers";
import axios from "axios";
import { useEffect, useState } from "react";
import { celo } from "viem/chains";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbInfoHexagon } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  createParaAccount,
  createParaViemClient,
} from "@getpara/viem-v2-integration";
import para from "../../constant/paraClient";
import { createPublicClient } from "viem";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  CELO_MAINNET,
  USDC_ADAPTER_MAINNET,
  USDC_MAINNET,
  USDT_ADAPTER_MAINNET,
  USDT_MAINNET,
} from "../../constant/constant";

const formatToken = (token) => ({
  chainId: celo.id,
  address: token.address,
  symbol: token.symbol,
  decimals: token.decimals,
  name: token.name,
  logoURI: token.icon,
});

const tokens = TOKENS.map(formatToken);
const CHAINS = [CELO_CHAIN, ETHEREUM_CHAIN];

const Swap = () => {
  const { address } = useAccount();
  const navigate = useNavigate();

  const provider = new JsonRpcProvider("https://forno.celo.org");

  // state management.
  const [isLoading, setIsLoading] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);
  const [tokenBalance, setTokenBalance] = useState({});
  const [error, setError] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [fees, setFees] = useState(null);
  const [slippageTolerance, setSlippageTolerance] = useState("0");
  const [transactionRequest, setTransactionRequest] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(CHAINS[0].id);
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [fromToken, setFromToken] = useState(filteredTokens[0]);
  const [toToken, setToToken] = useState(filteredTokens[1]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const hexToBigInt = (hexValue) => BigInt(hexValue);

  const isStablecoin = (token) =>
    [USDC_MAINNET, USDT_MAINNET].includes(token?.address?.toLowerCase());

  const handleNetworkChange = (event) => {
    setSelectedNetwork(Number(event.target.value));
  };

  const publicClient = createPublicClient({
    chain: selectedNetwork === CELO_CHAIN.id ? celo : mainnet,
    transport: http(RPC_URLS[selectedNetwork]),
  });

  // Fetch token balances from the blockchain ==== functions.
  const fetchTokenBalance = async () => {
    if (!address) {
      setError("Wallet address not available");
      setIsLoading(false);
      return;
    }

    try {
      const balances = {};
      for (const token of tokens) {
        const tokenAddress = getTokenAddress(token, selectedNetwork);

        // Skip tokens not listed on the selected network
        if (!tokenAddress) {
          balances[token.symbol] = "0.00";
          continue;
        }

        // Handle native tokens (e.g., ETH, CELO)
        if (tokenAddress === null) {
          const balance = await provider.getBalance(address);
          balances[token.symbol] = ethers.formatUnits(balance, token.decimals);
          continue;
        }

        // Handle ERC-20 tokens
        const contract = new Contract(
          tokenAddress,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        const balance = await contract.balanceOf(address);
        balances[token.symbol] = ethers.formatUnits(balance, token.decimals);
      }
      setTokenBalance(balances);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setError("Failed to fetch token balance");
      setIsLoading(false);
    }
  };

  const getTokenAddress = (token, selectedNetwork) => {
    // If the token has a networks object, use the address for the selected network
    if (token.networks && token.networks[selectedNetwork]) {
      return token.networks[selectedNetwork].address;
    }

    // If the token does not have a networks object, check if its chainId matches the selected network
    if (!token.networks && token.chainId === selectedNetwork) {
      return token.address;
    }

    // If the token is not listed on the selected network, return null
    return null;
  };

  // ---------------- SquidRouter Integration Helpers ----------------

  // Get the optimal route from SquidRouter.
  const getRoute = async (params) => {
    try {
      const response = await axios.post(
        "https://apiplus.squidrouter.com/v2/route",
        params,
        {
          headers: {
            "x-integrator-id": import.meta.env.VITE_APP_SQUID_INTEGRATOR_ID,
            "Content-Type": "application/json",
          },
        }
      );
      const requestId = response.headers["x-request-id"];
      return { route: response.data.route, requestId };
    } catch (error) {
      console.error("Route error:", error.response?.data || error);
      throw error;
    }
  };

  // Check the transaction status via SquidRouter.
  const getStatus = async (params) => {
    try {
      const response = await axios.get(
        "https://apiplus.squidrouter.com/v2/status",
        {
          params: {
            transactionId: params.transactionId,
            requestId: params.requestId,
            fromChainId: params.fromChainId,
            toChainId: params.toChainId,
          },
          headers: {
            "x-integrator-id": import.meta.env.VITE_APP_SQUID_INTEGRATOR_ID,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Status error:", error.response?.data || error);
      throw error;
    }
  };

  // Poll the SquidRouter API until the transaction status reaches a completed state.
  const updateTransactionStatus = async (txHash, requestId) => {
    const getStatusParams = {
      transactionId: txHash,
      requestId: requestId,
      fromChainId: `${celo.id}`,
      toChainId: `${celo.id}`,
    };

    let status;
    const completedStatuses = [
      "success",
      "partial_success",
      "needs_gas",
      "not_found",
    ];
    const maxRetries = 10;
    let retryCount = 0;

    do {
      try {
        status = await getStatus(getStatusParams);
        console.log(`Route status: ${status.squidTransactionStatus}`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error("Max retries reached. Transaction not found.");
            break;
          }
          console.log("Transaction not found. Retrying...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        } else {
          throw error;
        }
      }

      if (!completedStatuses.includes(status.squidTransactionStatus)) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } while (!completedStatuses.includes(status.squidTransactionStatus));
  };

  // Approve the SquidRouter contract to spend token.

  const erc20Abi = [
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const approveSpending = async (spender, tokenAddress, amount) => {
    try {
      const viemParaAccount = await createParaAccount(para);
      if (!viemParaAccount) {
        throw new Error("Failed to retrieve account details.");
      }

      const paraViemSigner = createParaViemClient(para, {
        account: viemParaAccount,
        chain: selectedNetwork === CELO_CHAIN.id ? celo : mainnet,
        transport: http(RPC_URLS[selectedNetwork]),
      });

      // Use existing publicClient instead of creating new provider
      const allowance = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [viemParaAccount.address, spender],
      });

      // console.log("Current Allowance:", allowance.toString());

      if (allowance >= BigInt(amount)) {
        console.log("Sufficient allowance already granted.");
        return;
      }

      toast.info("Initiating approval transaction...");

      const txHash = await paraViemSigner.writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      });

      console.log("Approval transaction hash:", txHash);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 2,
      });

      if (receipt.status === "success") {
        // console.log("Approval successful:", receipt);
        toast.success("Token approval successful ✅");
        return receipt;
      } else {
        throw new Error("Transaction reverted");
      }
    } catch (error) {
      console.error("Approval failed:", error);

      if (error.reason) {
        toast.error("Approval failed: " + error.reason);
      } else if (error.data && error.data.message) {
        toast.error("Approval failed: " + error.data.message);
      } else {
        toast.error("Approval failed: " + error.message);
      }
    }
  };

  // ---------------- End SquidRouter Helpers ----------------

  // Fetch exchange details and update exchangeRate, fees, and the calculated tokenTo amount.
  const fetchExchangeDetails = async (amount) => {
    if (!amount || parseFloat(amount) <= 0) {
      setExchangeRate(null);
      setFees(null);
      setToAmount("");
      return;
    }

    // Resolve token addresses for the selected network
    const fromTokenAddress = getTokenAddress(fromToken, selectedNetwork);
    const toTokenAddress = getTokenAddress(toToken, selectedNetwork);

    if (!fromTokenAddress || !toTokenAddress) {
      toast.error("Invalid token addresses for the selected network");
      return;
    }

    // Check if the selected tokens are the same
    if (fromTokenAddress.toLowerCase() === toTokenAddress.toLowerCase()) {
      console.warn(
        "Same token selected for both sides. Using 1:1 exchange rate."
      );
      setExchangeRate("1.0000");
      setFees("0.00");
      setToAmount(amount);
      return;
    }

    try {
      const params = {
        fromAddress: address,
        fromChain: `${selectedNetwork}`,
        fromToken: fromTokenAddress,
        fromAmount: ethers.parseUnits(amount, fromToken.decimals).toString(),
        toChain: `${selectedNetwork}`,
        toToken: toTokenAddress,
        toAddress: address,
      };

      const { data } = await axios.post(
        "https://apiplus.squidrouter.com/v2/route",
        params,
        {
          headers: {
            "x-integrator-id": import.meta.env.VITE_APP_SQUID_INTEGRATOR_ID,
            "Content-Type": "application/json",
          },
        }
      );
      const route = data.route;

      if (!route.estimate || !route.estimate.toAmount) {
        const errorMsg =
          route.message || "Missing estimate data from SquidRouter API";
        throw new Error(errorMsg);
      }

      setSlippageTolerance(route.estimate.aggregateSlippage);
      const toAmountFormatted = ethers.formatUnits(
        route.estimate.toAmount,
        toToken.decimals
      );
      const rate = parseFloat(toAmountFormatted) / parseFloat(amount);
      const estimatedFees =
        parseFloat(route.estimate.feeCosts?.[0]?.amount) || 0;
      setExchangeRate(rate.toFixed(4));
      setFees(estimatedFees.toFixed(4));
      setToAmount(toAmountFormatted);

      let transactionValue = BigInt(0);

      if (
        route.transactionRequest?.value &&
        route.transactionRequest.value !== "0"
      ) {
        transactionValue = BigInt(route.transactionRequest.value);
      } else if (fromToken.symbol.toUpperCase() === "CELO") {
        transactionValue = BigInt(
          ethers.parseUnits(amount, fromToken.decimals)
        );
      }

      setTransactionRequest({
        ...route.transactionRequest,
        value: transactionValue,
      });
    } catch (error) {
      console.error("Error fetching exchange details:", error);
      toast.error(`Exchange details error: ${error.message}`);
      setExchangeRate(null);
      setFees(null);
      setToAmount("");
    }
  };

  // When the fromAmount input changes, update state and fetch the new exchange details.
  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    setFromAmount(value);
    if (value && parseFloat(value) > 0) {
      fetchExchangeDetails(value);
    } else {
      setExchangeRate(null);
      setFees(null);
      setToAmount("");
    }
  };

  // The main swap handler integrating the SquidRouter flow.
  const handleSwap = async () => {
    setIsSwapping(true);

    try {
      const fromTokenAddress = getTokenAddress(fromToken, selectedNetwork);
      const toTokenAddress = getTokenAddress(toToken, selectedNetwork);

      if (!fromTokenAddress || !toTokenAddress) {
        toast.error("Invalid token addresses for the selected network");
        setIsSwapping(false);
        return;
      }

      // Create the Para account and signer
      const viemParaAccount = await createParaAccount(para);
      const paraViemSigner = createParaViemClient(para, {
        account: viemParaAccount,
        chain: selectedNetwork === CELO_CHAIN.id ? celo : mainnet,
        transport: http(RPC_URLS[selectedNetwork]),
      });

      if (!paraViemSigner) {
        toast.error("Wallet not connected");
        setIsSwapping(false);
        return;
      }

      if (fromToken.decimals === undefined || fromToken.decimals === null) {
        toast.error("Invalid token decimals");
        setIsSwapping(false);
        return;
      }

      // console.log("From Token Symbol:", fromToken.symbol);
      // console.log("From Amount:", fromAmount);
      // console.log("Decimals:", fromToken.decimals);

      const fromAmountInUnits = ethers
        .parseUnits(fromAmount, fromToken.decimals)
        .toString();
      console.log("Parsed Amount in Units:", fromAmountInUnits);

      const params = {
        fromAddress: address,
        fromChain: `${celo.id}`,
        fromToken: fromToken.address,
        fromAmount: fromAmountInUnits,
        toChain: `${celo.id}`,
        toToken: toToken.address,
        toAddress: address,
      };

      // console.log("Swap parameters:", params);

      // 1. Get the optimal swap route from SquidRouter.
      const { route, requestId } = await getRoute(params);
      // console.log("Route response:", route, "Request ID:", requestId);

      if (!route || !route.transactionRequest) {
        throw new Error("Invalid route received from SquidRouter");
      }

      let transactionRequest = route.transactionRequest;

      if (!transactionRequest?.target || !transactionRequest?.data) {
        throw new Error("Invalid transaction request");
      }

      transactionRequest.value =
        fromToken.symbol.toUpperCase() === "CELO" ? fromAmountInUnits : "0";

      // console.log("Transaction Request:", transactionRequest);

      // 2. Check token allowance before approving spending
      const allowance = await publicClient.readContract({
        address: fromToken.address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, transactionRequest.target],
      });

      // console.log("Token Allowance:", allowance.toString());

      // Add more detailed approval verification
      if (BigInt(allowance) < BigInt(fromAmountInUnits)) {
        console.log(
          "Approval needed. Current allowance:",
          allowance.toString()
        );
        const approveTx = await approveSpending(
          transactionRequest.target,
          fromToken.address,
          fromAmountInUnits
        );
        toast.success("Approval transaction:", approveTx);
        await publicClient.waitForTransactionReceipt({ hash: approveTx });
        console.log("Approval confirmed");
      }

      const isCelo =
        fromToken.address.toLowerCase() === CELO_MAINNET.toLowerCase();

      const getAdapterAddress = (token) => {
        if (token.address.toLowerCase() === USDC_MAINNET.toLowerCase())
          return USDC_ADAPTER_MAINNET;
        if (token.address.toLowerCase() === USDT_MAINNET.toLowerCase())
          return USDT_ADAPTER_MAINNET;
        return token.address;
      };

      let feeCurrency;
      if (isCelo) {
        feeCurrency = undefined;
      } else if (isStablecoin(fromToken)) {
        feeCurrency = getAdapterAddress(fromToken);
      } else {
        feeCurrency = fromToken.address;
      }

      const gasPriceParams = feeCurrency ? [feeCurrency] : [];
      const minGasPrice = await publicClient
        .request({
          method: "eth_gasPrice",
          params: gasPriceParams,
        })
        .then(hexToBigInt);

      const gasPrice = (minGasPrice * BigInt(130)) / BigInt(100);

      // 4. Estimate Gas
      const estimatedGas = await publicClient.estimateGas({
        to: transactionRequest.target,
        data: transactionRequest.data,
        value: BigInt(transactionRequest.value || 0),
        chain: selectedNetwork === CELO_CHAIN.id ? celo : mainnet,
        ...(feeCurrency && { feeCurrency }),
        account: viemParaAccount,
      });

      // console.log("Estimated Gas:", estimatedGas.toString());

      const transactionFee = gasPrice * estimatedGas;

      const isUSDC =
        fromToken.address.toLowerCase() === USDC_MAINNET.toLowerCase();

      const adjustedAmount = isUSDC
        ? BigInt(fromAmountInUnits) -
          transactionFee / 10n ** (18n - BigInt(fromToken.decimals))
        : BigInt(fromAmountInUnits) - transactionFee;

      if (adjustedAmount <= BigInt(0)) {
        throw new Error("Insufficient balance after fee deduction");
      }

      const nonce = await publicClient.getTransactionCount({
        address: viemParaAccount.address,
        blockTag: "pending",
      });

      const transactionValue = BigInt(transactionRequest.value || 0);

      // console.log("Final Transaction Value:", transactionValue.toString());

      const tx = {
        to: transactionRequest.target,
        data: transactionRequest.data,
        value: transactionValue,
        gasPrice,
        gas: estimatedGas,
        nonce,
        chain: selectedNetwork === CELO_CHAIN.id ? celo : mainnet,
        ...(feeCurrency && { feeCurrency }),
        type: "cip42",
        gatewayFee: BigInt(0),
        gatewayFeeRecipient: "0x0000000000000000000000000000000000000000",
      };

      console.log("Final Transaction:", tx);

      await publicClient.call({
        ...tx,
        account: viemParaAccount,
      });

      console.log("Adjusted Amount after Fees:", adjustedAmount.toString());
      if (adjustedAmount <= BigInt(0)) {
        throw new Error("Insufficient balance after fee deduction");
      }

      // 6. Sign the transaction
      const signedTx = await paraViemSigner.signTransaction(tx);
      // console.log("Signed Transaction:", signedTx);

      // 7. Send the signed transaction
      const txHash = await paraViemSigner.sendRawTransaction({
        serializedTransaction: signedTx,
      });
      // console.log("Transaction Hash:", txHash);

      const explorerLink = `https://explorer.celo.org/tx/${txHash}`;
      // console.log("Explorer Link:", explorerLink);
      toast.info(`Transaction sent! Check: ${explorerLink}`);

      // 8. Poll for transaction status until completion
      await updateTransactionStatus(txHash, requestId);
      toast.success("Swap successful! 🎉");
      // Show confetti and navigate to dashboard
      setShowConfetti(true);
      const confettiTimeout = setTimeout(() => {
        setShowConfetti(false);
        navigate("/dashboard");
      }, 5000);

      return () => clearTimeout(confettiTimeout);
    } catch (error) {
      console.error("Swap failed:", {
        message: error.message,
        data: error.cause?.data || error.cause?.cause?.data,
        stack: error.stack,
      });
      toast.error(`Swap failed: ${error.shortMessage || error.message}`);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleMaxClick = () => {
    const maxBalance = tokenBalance[fromToken.symbol] || "0.00";
    setFromAmount(maxBalance);
    fetchExchangeDetails(maxBalance);
  };

  const filterTokensByNetwork = (tokens, selectedNetwork) => {
    return tokens.filter((token) => {
      // Check if the token is available on the selected network
      const tokenAddress = getTokenAddress(token, selectedNetwork);
      return tokenAddress !== null && tokenAddress !== undefined;
    });
  };

  // Side actions --> useEffects
  useEffect(() => {
    const filtered = filterTokensByNetwork(tokens, selectedNetwork);
    setFilteredTokens(filtered);

    if (filtered.length > 0) {
      setFromToken(filtered[0]);
      setToToken(filtered[1] || filtered[0]); // Fallback to the first token if only one is available
    }
  }, [selectedNetwork]);

  useEffect(() => {
    fetchTokenBalance();
  }, [address]);

  return (
    <section className="bg-[#0F0140] h-screen w-full flex justify-center">
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="flex gap-2 flex-col items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 text-white"
        >
          <FaArrowLeftLong size={25} />
        </button>
        <p className="text-[22px] text-[#F6F5F6] font-[700] my-6">
          Swap Assets
        </p>

        <div className="w-full items-center justify-center text-center">
          <label className="text-white text-sm mb-2 block">Network</label>
          <select
            className="w-full text-center text-white bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4 appearance-none focus:outline-none"
            value={selectedNetwork}
            onChange={handleNetworkChange}
          >
            {CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id} className="">
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* From Token Input */}
        <div className="flex w-[450px] h-[85px] bg-[#1D143E] rounded-lg border border-[#FFFFFF80] flex-col p-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0.00"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="w-full bg-transparent text-white outline-none border-none"
            />
            <div>
              <select
                className="bg-transparent text-[#fff] outline-none border-none"
                value={getTokenAddress(fromToken, selectedNetwork)}
                onChange={(e) => {
                  const selectedAddress = e.target.value;
                  const token = filteredTokens.find(
                    (t) =>
                      getTokenAddress(t, selectedNetwork) === selectedAddress
                  );
                  setFromToken(token);
                }}
              >
                {filteredTokens.map((token) => (
                  <option
                    key={`${token.symbol}-${getTokenAddress(
                      token,
                      selectedNetwork
                    )}`}
                    value={getTokenAddress(token, selectedNetwork)}
                  >
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end mt-4 gap-4">
            <p className="text-[12px] text-[#F6F5F6]">
              Avail Bal:{" "}
              {parseFloat(tokenBalance[fromToken.symbol]).toFixed(2) || "0.00"}
            </p>
            <p
              className="text-[10px] text-[#F2E205] cursor-pointer"
              onClick={handleMaxClick}
            >
              MAX
            </p>
          </div>
        </div>

        {/* To Token Input (Read Only) */}
        <div className="w-[450px] h-[85px] bg-[#1D143E] rounded-lg border border-[#FFFFFF80] flex items-center justify-between p-4">
          <input
            type="text"
            placeholder="0.00"
            value={toAmount}
            readOnly
            className="w-full bg-transparent text-white outline-none border-none"
          />
          <div>
            <select
              className="bg-transparent text-[#fff] outline-none border-none"
              value={getTokenAddress(toToken, selectedNetwork)} // Resolved value
              onChange={(e) => {
                const selectedAddress = e.target.value;
                const token = filteredTokens.find(
                  (t) => getTokenAddress(t, selectedNetwork) === selectedAddress
                );
                if (
                  getTokenAddress(token, selectedNetwork)?.toLowerCase() ===
                  getTokenAddress(fromToken, selectedNetwork)?.toLowerCase()
                ) {
                  toast.warn("Please select a different token for swapping.");
                  return;
                }
                setToToken(token);
                if (fromAmount) fetchExchangeDetails(fromAmount);
              }}
            >
              {filteredTokens.map((token) => (
                <option
                  key={`${token.symbol}-${getTokenAddress(
                    token,
                    selectedNetwork
                  )}`} // Unique key
                  value={getTokenAddress(token, selectedNetwork)} // Resolved address
                  disabled={
                    getTokenAddress(token, selectedNetwork)?.toLowerCase() ===
                    getTokenAddress(fromToken, selectedNetwork)?.toLowerCase()
                  }
                >
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Details */}
        <div className="w-[450px] bg-[#1D143E] rounded-lg border border-[#FFFFFF80] flex flex-col p-4 my-6">
          <div className="flex justify-between text-[#FFFFFF80] text-[14px]">
            <div className="flex gap-4 items-center">
              <p>Exchange Rate:</p>
              <TbInfoHexagon size={15} />
            </div>
            <p>
              1 {fromToken.symbol} ≈ {exchangeRate || "0.00"} {toToken.symbol}
            </p>
          </div>
          <div className="flex justify-between text-[#FFFFFF80] text-[14px] mt-2">
            <div className="flex gap-4 items-center">
              <p>Fees:</p>
              <TbInfoHexagon size={15} />
            </div>
            <p>
              {fees || "0.00"} {fromToken.symbol}
            </p>
          </div>
          <div className="flex justify-between text-[#FFFFFF80] text-[14px] mt-2">
            <div className="flex gap-4 items-center">
              <p>Slippage Tolerance:</p>
              <TbInfoHexagon size={15} />
            </div>
            <p>{parseFloat(slippageTolerance).toFixed(2)}%</p>
          </div>
        </div>

        <button
          className={
            isSwapping
              ? "bg-[#4F4E50] text-[#F2E205] p-[10px] rounded-[10px] w-full absolute bottom-6 text-[16px] cursor-not-allowed "
              : "bg-[#F2E205] p-[10px] rounded-[10px] w-full absolute bottom-6 text-[16px] text-[#4F4E50]"
          }
          onClick={handleSwap}
          disabled={isSwapping}
        >
          {isSwapping ? "Processing..." : "Continue"}
        </button>
      </div>
    </section>
  );
};

export default Swap;
