import { http, useAccount } from "wagmi";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  usdt,
  USDC,
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
import { getGasPrice, getTransactionReceipt } from "@wagmi/core";
import { config } from "../../constant/config";
import { createPublicClient, encodeFunctionData } from "viem";

// Utility: format token data for use in the widget
const formatToken = (token) => ({
  chainId: celo.id,
  address: token.address,
  symbol: token.symbol,
  decimals: token.decimals,
  name: token.name,
  logoURI: token.icon,
});

const tokens = [cEUR, cUsd, cREAL, celoToken, commons, usdt, USDC].map(
  formatToken
);

const Swap = () => {
  const { address } = useAccount();
  const provider = new JsonRpcProvider("https://forno.celo.org");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);
  const [tokenBalance, setTokenBalance] = useState({});
  const [error, setError] = useState(null);
  const [fromToken, setFromToken] = useState(tokens[1]);
  const [toToken, setToToken] = useState(tokens[3]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [fees, setFees] = useState(null);
  const [slippageTolerance, setSlippageTolerance] = useState("0");

  
  // Fetch token balances from the blockchain
  const fetchTokenBalance = async () => {
    if (!address) {
      setError("Wallet address not available");
      setIsLoading(false);
      return;
    }
    try {
      const balances = {};
      for (const token of tokens) {
        const contract = new Contract(
          token.address,
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

  useEffect(() => {
    fetchTokenBalance();
  }, [address]);

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

  // Approve the SquidRouter contract to spend your token.

  // Helper: poll for a transaction receipt manually

  const erc20Abi = [
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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const approveSpending = async (
    transactionRequestTarget,
    tokenAddress,
    amount
  ) => {
    try {

      const publicClient = createPublicClient({
        chain: celo,
        transport: http("https://forno.celo.org"),
      });
      const gasPrice = await publicClient.getGasPrice();
      
      // Create the viem account and client
      const viemParaAccount = await createParaAccount(para);
      const paraViemSigner = createParaViemClient(para, {
        account: viemParaAccount,
        chain: celo,
        transport: http("https://forno.celo.org"),
      });

      const tx = await paraViemSigner.sendTransaction({
        to: tokenAddress,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [transactionRequestTarget, amount],
        }),
      });

      console.log("Approval transaction hash:", tx);

      let receipt = null;
      let attempts = 0;
      const maxAttempts = 10;
      const pollInterval = 3000;

      while (!receipt && attempts < maxAttempts) {
        await sleep(pollInterval);
        receipt = await getTransactionReceipt(config, { hash: tx });
        attempts++;
        console.log(`Polling for receipt... Attempt ${attempts}`);
      }

      if (!receipt) {
        throw new Error(
          "Approval transaction receipt not found after polling."
        );
      }

      console.log("Received approval receipt:", receipt);
      console.log(
        `Approved ${fromAmount} tokens for ${transactionRequestTarget}`
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Approval failed:", error);
      throw error;
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

    // Check if the selected tokens are the same.
    if (fromToken.address.toLowerCase() === toToken.address.toLowerCase()) {
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
        fromChain: `${celo.id}`,
        fromToken: fromToken.address,
        fromAmount: ethers.parseUnits(amount, fromToken.decimals).toString(),
        toChain: `${celo.id}`,
        toToken: toToken.address,
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

      // Log the response for debugging
      console.log("Squid API response:", route);

      // Check if the estimate object exists
      if (!route.estimate || !route.estimate.toAmount) {
        // If the API returned an error message, you might see it here
        const errorMsg =
          route.message || "Missing estimate data from SquidRouter API";
        throw new Error(errorMsg);
      }

      setSlippageTolerance(route.estimate.aggregateSlippage);
      // Format the to-token amount and calculate the exchange rate.
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
    } catch (error) {
      console.error("Error fetching exchange details:", error);
      // Optionally, show the error message to the user via toast:
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

    const viemParaAccount = await createParaAccount(para);
    const paraViemSigner = createParaViemClient(para, {
      account: viemParaAccount,
      chain: celo,
      transport: http("https://forno.celo.org"),
    });
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.warn("Enter a valid amount");
      return;
    }
    if (!paraViemSigner) {
      toast.error("Wallet not connected");
      setIsSwapping(false);

      return;
    }
    try {
      const fromAmountInUnits = ethers
        .parseUnits(fromAmount, fromToken.decimals)
        .toString();
      const params = {
        fromAddress: address,
        fromChain: `${celo.id}`,
        fromToken: fromToken.address,
        fromAmount: fromAmountInUnits,
        toChain: `${celo.id}`,
        toToken: toToken.address,
        toAddress: address,
      };

      console.log("Swap parameters:", params);

      // 1. Get the optimal swap route from SquidRouter.
      const { route, requestId } = await getRoute(params);
      console.log("Calculated route:", route, "Request ID:", requestId);

      const transactionRequest = route.transactionRequest;
      if (!transactionRequest?.target || !transactionRequest?.data) {
        throw new Error("Invalid transaction request");
      }

      // 2. Approve the SquidRouter contract to spend your token.
      await approveSpending(
        transactionRequest.target,
        fromToken.address,
        fromAmountInUnits
      );

      // 3. Execute the swap transaction.
      const gasPrice = await getGasPrice(config)
      console.log(gasPrice)
      const tx = await paraViemSigner.sendTransaction({
        to: transactionRequest.target,
        data: transactionRequest.data,
        value: BigInt(transactionRequest.value),
        gasPrice: BigInt(gasPrice.toString()),
        gasLimit: BigInt(transactionRequest.gasLimit),
      });

      const txReceipt = await tx.wait();
      console.log("Transaction Receipt:", txReceipt);

      const explorerLink = `https://explorer.celo.org/tx/${txReceipt.transactionHash}`;
      console.log(explorerLink);
      toast.info(`Transaction sent! Check: ${explorerLink}`);

      // 4. Poll for the transaction status until completion.
      await updateTransactionStatus(tx.hash, requestId);
      toast.success("Swap successful! 🔥");
      navigate("/dashboard");
    } catch (error) {
      console.error("Swap failed:", error);
      toast.error("Swap failed: " + error.message);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleMaxClick = () => {
    const maxBalance = tokenBalance[fromToken.symbol] || "0.00";
    setFromAmount(maxBalance);
    fetchExchangeDetails(maxBalance);
  };

  return (
    <section className="bg-[#0F0140] h-screen w-full flex justify-center">
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
                value={fromToken.address}
                onChange={(e) => {
                  const token = tokens.find(
                    (t) => t.address === e.target.value
                  );
                  setFromToken(token);
                  if (fromAmount) fetchExchangeDetails(fromAmount);
                }}
              >
                {tokens.map((token) => (
                  <option key={token.address} value={token.address}>
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
              value={toToken.address}
              onChange={(e) => {
                const token = tokens.find((t) => t.address === e.target.value);
                if (
                  token.address.toLowerCase() ===
                  fromToken.address.toLowerCase()
                ) {
                  toast.warn("Please select a different token for swapping.");
                  return;
                }
                setToToken(token);
                if (fromAmount) fetchExchangeDetails(fromAmount);
              }}
            >
              {tokens.map((token) => (
                <option
                  key={token.address}
                  value={token.address}
                  disabled={
                    token.address.toLowerCase() ===
                    fromToken.address.toLowerCase()
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
          className="bg-[#F2E205] p-[10px] rounded-[10px] w-full absolute bottom-6 text-[16px] text-[#4F4E50]"
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
