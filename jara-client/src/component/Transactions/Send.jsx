import React, { useState, useEffect } from "react";
import { Contract, ethers, JsonRpcProvider } from "ethers";
import { Loader2 } from "lucide-react";
import TokenModal from "../Homepage/TokenModal";
import { useAccount, useConfig, useWalletClient } from "wagmi";
import { switchChain } from "wagmi/actions";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  usdt,
} from "../../constant/otherChains";
import para from "../../constant/paraClient";
import {
  createParaAccount,
  createParaViemClient,
} from "@getpara/viem-v2-integration";
import {
  encodeFunctionData,
  http,
  parseUnits,
  createPublicClient,
  getContract,
  formatUnits,
} from "viem";
import { getStorageAt } from "@wagmi/core";
import { celo } from "viem/chains";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";

const Send = () => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [estimatedGas, setEstimatedGas] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);

  const navigate = useNavigate();
  const { address } = useAccount();
  const config = useConfig();
  const { data: walletClient } = useWalletClient();
  const tokens = [cEUR, cUsd, cREAL, celoToken, commons, usdt];

  const selectedChain = selectedToken
    ? tokens[selectedToken.name] || celo
    : celo;

  useEffect(() => {
    if (walletClient) {
      setCurrentChainId(walletClient.chain.id);
    }
  }, [walletClient]);

  useEffect(() => {
    const fetchBalanceAndGas = async () => {
      if (!selectedToken || !address) return;

      // console.log(selectedToken.address);
      const provider = new JsonRpcProvider("https://forno.celo.org");
      try {
        const contract = new Contract(
          selectedToken.address,
          [
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
          ],
          provider
        );

        const tokenBalance = await contract.balanceOf(address);
        const formattedBalance = ethers.formatUnits(
          tokenBalance,
          selectedToken.decimals
        );
        setBalance(formattedBalance);

        const currentGasPrice = await provider.getFeeData();
        setGasPrice(currentGasPrice.gasPrice);
      } catch (error) {
        console.error("Error fetching balance and gas:", error);
        setError("Failed to fetch balance and gas price");
      }
    };

    fetchBalanceAndGas();
  }, [selectedToken, address]);

  const validateTransaction = () => {
    if (!selectedToken) {
      setError("Please select a token");
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    if (!recipientAddress) {
      setError("Please enter a recipient address");
      return false;
    }
    if (!ethers.isAddress(recipientAddress)) {
      setError("Invalid recipient address");
      return false;
    }
    return true;
  };

  const publicClient = createPublicClient({
    chain: celo,
    transport: http("https://forno.celo.org"),
  });

  const IMPLEMENTATION_SLOT =
    "0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC";
  const USDC_ADAPTER_MAINNET = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B";
  const USDC_MAINNET = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";

  const USDT_ADAPTER_MAINNET = "0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72";
  const USDT_MAINNET = "0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e";
  const CELO_MAINNET = "0x471EcE3750Da237f93B8E339c536989b8978a438";

  const isStablecoin = (token) =>
    [USDC_MAINNET, USDT_MAINNET].includes(token?.address?.toLowerCase());
  const isUSDC = (token) =>
    token?.address?.toLowerCase() === USDC_MAINNET.toLowerCase();

  const hexToBigInt = (hexValue) => BigInt(hexValue);

  async function getImplementationAddress(proxyAddress) {
    try {
      const rawImplAddress = await getStorageAt(config, {
        address: proxyAddress,
        slot: IMPLEMENTATION_SLOT,
      });

      return `0x${rawImplAddress.slice(-40)}`;
    } catch (error) {
      console.error(
        `Failed to fetch implementation for ${proxyAddress}:`,
        error
      );
      return null;
    }
  }

  async function getAbi(implementationAddress) {
    try {
      const contract = getContract({
        address: implementationAddress,
        abi: [
          "function transfer(address to, uint256 amount)",
          "function balanceOf(address) view returns (uint256)",
        ],
        config,
      });

      return contract.abi;
    } catch (error) {
      console.error(`Failed to fetch ABI for ${implementationAddress}:`, error);
      return null;
    }
  }

  async function fetchAllData() {
    const updatedTokens = await Promise.all(
      tokens.map(async (token) => {
        const implementationAddress = await getImplementationAddress(
          token.address
        );
        const abi = implementationAddress
          ? await getAbi(implementationAddress)
          : null;
        return {
          ...token,
          implementationAddress,
          abi,
        };
      })
    );

    return updatedTokens;
  }

  fetchAllData().then((updatedTokens) => {
    // console.log(
    //   "Final Token List with Implementation Addresses & ABIs:",
    //   updatedTokens
    // );
  });

  useEffect(() => {
    const estimateGasFee = async () => {
      setIsEstimatingGas(true);
      setEstimatedGas(null);
      setGasPrice(null);
      if (!selectedToken || !amount || !recipientAddress || !address) {
        setIsEstimatingGas(false);
        return;
      }
      try {
        const isStable = [USDC_MAINNET, USDT_MAINNET].includes(
          selectedToken.address.toLowerCase()
        );
        const isCelo =
          selectedToken.address.toLowerCase() === CELO_MAINNET.toLowerCase();

        let feeCurrency;
        if (isCelo) {
          feeCurrency = undefined;
        } else if (isStable) {
          feeCurrency =
            selectedToken.address === USDC_MAINNET.toLowerCase()
              ? USDC_ADAPTER_MAINNET
              : USDT_ADAPTER_MAINNET;
        } else {
          feeCurrency = selectedToken.address;
        }

        const gasPriceParams = feeCurrency ? [feeCurrency] : [];

        const minGasPrice = await publicClient
          .request({
            method: "eth_gasPrice",
            params: gasPriceParams,
          })
          .then((hexValue) => BigInt(hexValue));

        const gasPriceWithBuffer = (minGasPrice * BigInt(125)) / BigInt(100);
        setGasPrice(gasPriceWithBuffer);

        const amountInWei = parseUnits(amount, selectedToken.decimals);
        const transferAbi = {
          constant: false,
          inputs: [
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
          ],
          name: "transfer",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        };
        const data = encodeFunctionData({
          abi: [transferAbi],
          args: [recipientAddress, amountInWei],
        });
        const gasEstimate = await publicClient.estimateGas({
          account: address,
          to: selectedToken.address,
          data,
          feeCurrency,
          gasPrice: gasPriceWithBuffer,
        });
        setEstimatedGas(gasEstimate);
      } catch (error) {
        console.error("Gas estimation error:", error);
      } finally {
        setIsEstimatingGas(false);
      }
    };
    const debounceTimer = setTimeout(estimateGasFee, 500);
    return () => clearTimeout(debounceTimer);
  }, [amount, recipientAddress, selectedToken, address]);

  const handleSend = async () => {
    if (!validateTransaction()) return;
    if (!walletClient) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError("");
    setIsTransactionPending(true);

    try {
      if (currentChainId !== selectedToken.id) {
        await switchChain(config, { chainId: selectedToken.id });
      }

      const viemParaAccount = await createParaAccount(para);
      const paraViemSigner = createParaViemClient(para, {
        account: viemParaAccount,
        chain: celo,
        transport: http("https://forno.celo.org"),
      });

      const isCelo =
        selectedToken.address.toLowerCase() === CELO_MAINNET.toLowerCase();

      const amountInWei = parseUnits(amount, selectedToken.decimals);
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
      } else if (isStablecoin(selectedToken)) {
        feeCurrency = getAdapterAddress(selectedToken);
      } else {
        feeCurrency = selectedToken.address;
      }

      const gasPriceParams = feeCurrency ? [feeCurrency] : [];
      const minGasPrice = await publicClient
        .request({
          method: "eth_gasPrice",
          params: gasPriceParams,
        })
        .then(hexToBigInt);

      const gasPrice = (minGasPrice * BigInt(125)) / BigInt(100);

      const transferAbi = {
        constant: false,
        inputs: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      };

      const unsignedTx = {
        account: viemParaAccount,
        to: selectedToken.address,
        data: encodeFunctionData({
          abi: [transferAbi],
          args: [recipientAddress, amountInWei],
        }),
        gasPrice,
        ...(feeCurrency && { feeCurrency }),
      };

      const estimatedGas = await publicClient.estimateGas({
        ...unsignedTx,
        chain: celo,
      });

      const transactionFee = gasPrice * estimatedGas;

      const adjustedAmount = isUSDC
        ? amountInWei - transactionFee / BigInt(1e12)
        : amountInWei - transactionFee;

      if (adjustedAmount <= BigInt(0)) {
        throw new Error("Insufficient balance after fee deduction");
      }

      const txParams = {
        ...unsignedTx,
        chain: celo,
        data: encodeFunctionData({
          abi: [transferAbi],
          args: [recipientAddress, adjustedAmount],
        }),
        gas: estimatedGas,
        nonce: await publicClient.getTransactionCount({
          address: viemParaAccount.address,
          blockTag: "pending",
        }),
        type: "cip42",
        gatewayFee: BigInt(0),
        gatewayFeeRecipient: "0x0000000000000000000000000000000000000000",
      };

      const signedTx = await paraViemSigner.signTransaction(txParams);
      const txHash = await paraViemSigner.sendRawTransaction({
        serializedTransaction: signedTx,
      });

      setAmount("");
      setRecipientAddress("");
      setSelectedToken(null);
      toast.success(
        `${formatUnits(adjustedAmount, selectedToken.decimals)} ${
          selectedToken.symbol
        } sent successfully!`
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Transaction failed:", error);
      setError(
        error.message.includes("gas price")
          ? "Transaction failed: Network fee issue. Please try again."
          : error.shortMessage || error.message || "Transaction failed"
      );
    } finally {
      setIsLoading(false);
      setIsTransactionPending(false);
    }
  };
  const handleQuickAmount = (percentage) => {
    if (!balance) return;

    if (percentage === "MAX") {
      const maxAmount = parseFloat(balance) * 0.95;
      setAmount(maxAmount.toString());
    } else {
      const value = (parseFloat(balance) * parseInt(percentage)) / 100;
      setAmount(value.toString());
    }
  };

  const getEstimatedTotalCost = () => {
    if (!estimatedGas || !gasPrice || !amount) return null;

    if (isUSDC(selectedToken)) {
      const transactionFee = (gasPrice * estimatedGas) / BigInt(1e12);
      console.log(transactionFee);
      return {
        gas: formatUnits(transactionFee, 6),
        total: (
          parseFloat(amount) - parseFloat(formatUnits(transactionFee, 6))
        ).toFixed(6),
        symbol: "USDC",
      };
    }

    // Existing logic for other tokens
    const gasCostInWei = estimatedGas * gasPrice;
    return {
      gas: formatUnits(gasCostInWei, 18),
      total: parseFloat(amount).toFixed(6),
      symbol: "CELO",
    };
  };
  const QuickAmountButton = ({ label }) => (
    <button
      onClick={() => handleQuickAmount(label.replace("%", ""))}
      className="flex-1 py-3 bg-[#1A1831] border border-[#2D2B54] rounded-xl hover:bg-[#231f42] transition-colors"
    >
      <span className="text-white text-sm">{label}</span>
    </button>
  );

  const estimatedCost = getEstimatedTotalCost();

  return (
    <div className="min-h-screen bg-[#0F0140] flex items-center justify-center p-4 relative">
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4">
        <IoIosArrowBack size={25} color="#F6F5F6" />
      </button>
      <div className="max-w-xl w-full">
        <div className="space-y-6">
          <div>
            <label className="text-white text-sm mb-2 block">Network</label>
            <button className="w-full text-left text-white bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4">
              Celo
            </button>
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-4 bg-[#1A1831] border border-[#2D2B54] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFDE00]"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">Token</label>
            <button
              onClick={() => setIsTokenModalOpen(true)}
              className="w-full text-left text-white bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4 hover:bg-[#231f42] transition-colors"
            >
              {selectedToken ? (
                <div className="flex items-center">
                  <img
                    src={selectedToken.icon}
                    alt={selectedToken.nativeCurrency.symbol}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                  <span>{selectedToken.nativeCurrency.symbol}</span>
                </div>
              ) : (
                "Select Token"
              )}
            </button>
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">Amount</label>
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-[#1A1831] border border-[#2D2B54] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFDE00]"
            />
            <div className="text-right mt-2">
              <span className="text-gray-400 text-sm">
                Available: {parseFloat(balance).toFixed(2)}{" "}
                {selectedToken?.symbol || ""}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {["25%", "50%", "75%", "MAX"].map((label) => (
              <QuickAmountButton key={label} label={label} />
            ))}
          </div>

          {isEstimatingGas ? (
            <div className="bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4">
              <div className="flex items-center justify-center text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating fees...
              </div>
            </div>
          ) : estimatedCost ? (
            <div className="bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4">
              <div className="text-gray-400 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Network Fees:</span>
                  <span>
                    {estimatedCost.gas} {selectedToken.symbol}
                  </span>
                </div>
                {[USDC_MAINNET, USDT_MAINNET].includes(
                  selectedToken?.address.toLowerCase()
                ) && (
                  <div className="flex justify-between text-white font-medium">
                    <span>Total Sent:</span>
                    <span>
                      {estimatedCost.total} {selectedToken.symbol}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={
              isLoading || !selectedToken || !amount || !recipientAddress
            }
            className="w-full py-4 rounded-xl bg-[#FFDE00] text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5C800] transition-colors mt-8"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {isTransactionPending ? "Processing..." : "Preparing..."}
              </div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>

      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSelect={(token) => {
          setSelectedToken(token);
          setIsTokenModalOpen(false);
        }}
        tokens={tokens}
      />
    </div>
  );
};

export default Send;
