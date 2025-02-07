import React, { useState, useEffect } from "react";
import { Token, CurrencyAmount, Percent } from "@uniswap/sdk-core";
import { Pool, SwapRouter } from "@uniswap/v3-sdk";
// import { CapsuleEthersSigner } from "@usecapsule/ethers-v6-integration"; This doesn't work anymore as well
import { ethers } from "ethers";
// import capsuleClient from '../../constant/capsuleClient';

// There's no more capsuleClient but paraClient... review and use as necessary

// Network configurations
const NETWORKS = {
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum",
    rpc: "https://ethereum.rpc.endpoint",
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    tokens: {
      USDT: {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: 6,
      },
      USDC: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
      },
    },
  },
  CELO: {
    chainId: 42220,
    name: "Celo",
    rpc: "https://forno.celo.org",
    swapRouter: "0x5615CDAb10dc425a742d643d949a7F474C01abc4", // Uniswap V3 router on Celo
    tokens: {
      USDC: {
        address: "0x37f750B7cC259A2f741AF45294f6a16572CF5cAd",
        decimals: 6,
      },
      cUSD: {
        address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
        decimals: 18,
      },
      cEUR: {
        address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
        decimals: 18,
      },
    },
  },
};

function getNetworkSigner(network, capsule, walletId) {
  const providers = {
    celo: new ethers.JsonRpcProvider(NETWORKS.CELO.rpc), // Celo mainnet
    ethereum: new ethers.JsonRpcProvider(NETWORKS.ETHEREUM.rpc), // Arbitrum One mainnet
    // Add more networks as needed
  };

  const provider = providers[network];
  if (!provider) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return new CapsuleEthersSigner(capsule, provider, walletId);
}

const getWalletId = () => {
  const wallets = capsuleClient.getWallets();
  const walletId = Object.values(wallets)[0].id;
  return walletId;
};

const UniSwap = () => {
  const signer = getNetworkSigner("celo", capsuleClient, getWalletId());

  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    const detectNetwork = async () => {
      if (signer?.provider) {
        const network = await signer.provider.getNetwork();
        const networkConfig = Object.values(NETWORKS).find(
          (n) => n.chainId === network.chainId
        );
        setCurrentNetwork(networkConfig);
      }
    };

    detectNetwork();
  }, [signer]);

  const getPool = async (tokenA, tokenB, fee = 500) => {
    if (!currentNetwork) {
      throw new Error("Network not supported or not detected");
    }

    const tokenAConfig = currentNetwork.tokens[tokenA];
    const tokenBConfig = currentNetwork.tokens[tokenB];

    if (!tokenAConfig || !tokenBConfig) {
      throw new Error("One or both tokens not supported on current network");
    }

    const tokenAContract = new Token(
      currentNetwork.chainId,
      tokenAConfig.address,
      tokenAConfig.decimals
    );
    const tokenBContract = new Token(
      currentNetwork.chainId,
      tokenBConfig.address,
      tokenBConfig.decimals
    );

    const poolAddress = Pool.getAddress(tokenAContract, tokenBContract, fee);

    const pool = await Pool.fetchData(
      tokenAContract,
      tokenBContract,
      fee,
      signer.provider
    );

    return pool;
  };

  const getQuote = async (
    inputToken,
    outputToken,
    inputAmount,
    slippageTolerance = 0.5
  ) => {
    if (!currentNetwork) {
      throw new Error("Network not supported or not detected");
    }

    const pool = await getPool(inputToken, outputToken);
    const inputTokenConfig = currentNetwork.tokens[inputToken];

    const inputTokenContract = new Token(
      currentNetwork.chainId,
      inputTokenConfig.address,
      inputTokenConfig.decimals
    );

    const amountIn = CurrencyAmount.fromRawAmount(
      inputTokenContract,
      ethers.utils.parseUnits(inputAmount.toString(), inputTokenConfig.decimals)
    );

    const [quotedAmountOut, poolAfterSwap] = await pool.getOutputAmount(
      amountIn
    );

    const slippagePercent = new Percent(slippageTolerance * 100, 10000);
    const minAmountOut = quotedAmountOut.multiply(
      new Percent(10000 - slippagePercent.numerator, 10000)
    );

    const outputTokenConfig = currentNetwork.tokens[outputToken];
    return {
      quotedAmount: ethers.utils.formatUnits(
        quotedAmountOut.quotient.toString(),
        outputTokenConfig.decimals
      ),
      minimumAmount: ethers.utils.formatUnits(
        minAmountOut.quotient.toString(),
        outputTokenConfig.decimals
      ),
      pool: poolAfterSwap,
    };
  };

  const executeSwap = async (
    inputToken,
    outputToken,
    inputAmount,
    slippageTolerance = 0.5,
    deadline = 20
  ) => {
    if (!signer) {
      throw new Error("Signer not available");
    }

    if (!currentNetwork) {
      throw new Error("Network not supported or not detected");
    }

    const quote = await getQuote(
      inputToken,
      outputToken,
      inputAmount,
      slippageTolerance
    );
    const pool = quote.pool;

    const inputTokenConfig = currentNetwork.tokens[inputToken];
    const outputTokenConfig = currentNetwork.tokens[outputToken];

    const inputTokenContract = new Token(
      currentNetwork.chainId,
      inputTokenConfig.address,
      inputTokenConfig.decimals
    );
    const outputTokenContract = new Token(
      currentNetwork.chainId,
      outputTokenConfig.address,
      outputTokenConfig.decimals
    );

    const amountIn = CurrencyAmount.fromRawAmount(
      inputTokenContract,
      ethers.utils.parseUnits(inputAmount.toString(), inputTokenConfig.decimals)
    );

    const swapOptions = {
      slippageTolerance: new Percent(slippageTolerance * 100, 10000),
      deadline: Math.floor(Date.now() / 1000) + 60 * deadline,
      recipient: await signer.getAddress(),
    };

    const swap = await SwapRouter.swapCallParameters(
      pool,
      amountIn,
      swapOptions
    );

    const tx = await signer.sendTransaction({
      to: currentNetwork.swapRouter,
      data: swap.calldata,
      value: swap.value,
    });

    return tx;
  };

  const approveToken = async (tokenSymbol, amount) => {
    if (!currentNetwork) {
      throw new Error("Network not supported or not detected");
    }

    const tokenConfig = currentNetwork.tokens[tokenSymbol];
    if (!tokenConfig) {
      throw new Error("Token not supported on current network");
    }

    const tokenContract = new ethers.Contract(
      tokenConfig.address,
      ["function approve(address spender, uint256 amount) returns (bool)"],
      signer
    );

    const tx = await tokenContract.approve(
      currentNetwork.swapRouter,
      ethers.utils.parseUnits(amount.toString(), tokenConfig.decimals)
    );

    return tx;
  };

  // Helper function to get available tokens for current network
  const getAvailableTokens = () => {
    if (!currentNetwork) return [];
    return Object.keys(currentNetwork.tokens);
  };

  // Helper function to check if a token pair is supported
  const isTokenPairSupported = (tokenA, tokenB) => {
    if (!currentNetwork) return false;
    return currentNetwork.tokens[tokenA] && currentNetwork.tokens[tokenB];
  };

  return {
    getQuote,
    executeSwap,
    approveToken,
    currentNetwork,
    getAvailableTokens,
    isTokenPairSupported,
  };
};

// Example usage in a React component
export function SwapComponent() {
  const {
    getQuote,
    executeSwap,
    approveToken,
    currentNetwork,
    getAvailableTokens,
    isTokenPairSupported,
  } = useUniswap();

  const [selectedTokenA, setSelectedTokenA] = useState("");
  const [selectedTokenB, setSelectedTokenB] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableTokens = getAvailableTokens();

  const handleSwap = async () => {
    if (!isTokenPairSupported(selectedTokenA, selectedTokenB)) {
      alert("Token pair not supported on current network");
      return;
    }

    try {
      setLoading(true);

      const approveTx = await approveToken(selectedTokenA, amount);
      await approveTx.wait();

      const swapTx = await executeSwap(selectedTokenA, selectedTokenB, amount);
      await swapTx.wait();

      console.log("Swap successful!");
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
    if (!isTokenPairSupported(selectedTokenA, selectedTokenB)) {
      alert("Token pair not supported on current network");
      return;
    }

    const quote = await getQuote(selectedTokenA, selectedTokenB, amount);
    setQuote(quote);
  };

  return (
    <div>
      <p>Current Network: {currentNetwork?.name || "Not Connected"}</p>

      <select
        value={selectedTokenA}
        onChange={(e) => setSelectedTokenA(e.target.value)}
      >
        <option value="">Select Token A</option>
        {availableTokens.map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>

      <select
        value={selectedTokenB}
        onChange={(e) => setSelectedTokenB(e.target.value)}
      >
        <option value="">Select Token B</option>
        {availableTokens.map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <button onClick={fetchQuote}>Get Quote</button>
      {quote && (
        <div>
          <p>Quoted Amount: {quote.quotedAmount}</p>
          <p>Minimum Amount: {quote.minimumAmount}</p>
        </div>
      )}
      <button onClick={handleSwap} disabled={loading}>
        {loading ? "Swapping..." : "Swap"}
      </button>
    </div>
  );
}

export default UniSwap;
