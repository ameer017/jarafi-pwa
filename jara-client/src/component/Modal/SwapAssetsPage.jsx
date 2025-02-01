import React, { useState, useRef, useEffect } from "react";
import { ethers, JsonRpcProvider } from "ethers";
import { Token, CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { Route as UniswapRoute, Trade } from "@uniswap/v3-sdk";
import { Pool } from "@uniswap/v3-sdk";
import { getStorageAt } from "@wagmi/core";
import { useConfig } from "wagmi";

import { getPoolState } from "../../constant/uniswapUtils";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  cusdt,
} from "../../constant/otherChains";

const CELO_CHAIN_ID = 42220;
const tokens = [cEUR, cUsd, cREAL, celoToken, commons, cusdt];
const provider = new JsonRpcProvider("https://forno.celo.org");

const IMPLEMENTATION_SLOT =
  "0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC";

const useOutsideClick = (callback) => {
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);
  return ref;
};

async function getImplementationAddress(proxyAddress, config) {
  try {
    console.log("Config:", config);
    const rawImplAddress = await getStorageAt(config, {
      address: proxyAddress,
      slot: IMPLEMENTATION_SLOT,
    });
    console.log(
      "Raw Implementation Address:",
      `0x${rawImplAddress.slice(-40)}`
    );

    return `0x${rawImplAddress.slice(-40)}`;
  } catch (error) {
    console.error(`Failed to fetch implementation for ${proxyAddress}:`, error);
    return null;
  }
}

const getExchangeRate = async (
  tokenIn,
  tokenOut,
  amountIn,
  provider,
  config
) => {
  // const tokenInImplAddress = await getImplementationAddress(tokenIn.address, config);
  // const tokenOutImplAddress = await getImplementationAddress(tokenOut.address, config);

  if (!tokenIn.address || !tokenIn.address) {
    throw new Error("Failed to fetch implementation addresses for tokens");
  }
  try {
    const fromToken = new Token(
      CELO_CHAIN_ID,
      tokenIn.address,
      tokenIn.decimals,
      tokenIn.symbol
    );
    const toToken = new Token(
      CELO_CHAIN_ID,
      tokenOut.address,
      tokenOut.decimals,
      tokenOut.symbol
    );

    console.log("From Token (Implementation):", fromToken);
    console.log("To Token (Implementation):", toToken);

    const poolState = await getPoolState(fromToken, toToken, provider);
    if (!poolState) {
      throw new Error("Pool not found");
    }

    const pool = new Pool(
      fromToken,
      toToken,
      poolState.fee,
      poolState.sqrtPriceX96,
      poolState.liquidity,
      poolState.tick
    );

    console.log("Pool Inputs:", {
      tokenA: fromToken,
      tokenB: toToken,
      fee: poolState.fee,
      sqrtPriceX96: poolState.sqrtPriceX96,
      liquidity: poolState.liquidity,
      tick: poolState.tick,
    });    console.log("sqrtPriceX96:", poolState.sqrtPriceX96, "Type:", typeof poolState.sqrtPriceX96);

    const amountInCurrency = CurrencyAmount.fromRawAmount(
      fromToken,
      ethers.parseUnits(amountIn.toString(), fromToken.decimals).toString()
    );

    const trade = await Trade.fromRoute(
      new Route([pool], fromToken, toToken),
      amountInCurrency,
      TradeType.EXACT_INPUT
    );

    console.log("Trade:", trade);

    // Get the output amount
    const amountOut = trade.outputAmount.toFixed();

    return amountOut;
  } catch (error) {
    console.error("Error in getExchangeRate:", error);
    throw error;
  }
};

const TokenSelector = ({
  selectedToken,
  onTokenChange,
  isOpen,
  setIsOpen,
  dropdownRef,
}) => (
  <div className="relative" ref={dropdownRef}>
    <button
      className="flex items-center space-x-1 sm:space-x-2 bg-[#2a2b4e] rounded-lg px-2 py-1 sm:px-3 sm:py-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-teal-400" />
      <span className="text-white text-xs sm:text-sm">
        {selectedToken?.name}
      </span>
      <svg
        className="w-3 h-3 sm:w-4 sm:h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    {isOpen && (
      <div className="absolute top-full left-0 mt-2 w-auto bg-[#2a2b4e] rounded-lg p-4 sm:p-3 z-10 shadow-lg border-2">
        {tokens.map((token) => (
          <button
            key={token.id}
            className="flex items-center space-x-2 w-full py-1 sm:py-2 hover:bg-[#3a3b4e] rounded-lg"
            onClick={() => {
              onTokenChange(token);
              setIsOpen(false);
            }}
          >
            <img
              src={token.icon}
              className="w-4 h-4 rounded-full bg-teal-400"
            />
            <span className="text-white text-xs sm:text-sm">{token.name}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

const SwapAssetsPage = ({
  amount,
  setAmount,
  selectedChain,
  setSelectedChain,
  tokenIn,
  setTokenIn,
  tokenOut,
  setTokenOut,
  onExchangeRate,
}) => {
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

  const fromDropdownRef = useOutsideClick(() => setIsFromDropdownOpen(false));
  const toDropdownRef = useOutsideClick(() => setIsToDropdownOpen(false));
  const [tokenFromAmount, setTokenFromAmount] = useState("");
  const [tokenToAmount, setTokenToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const slippage = "0.3%";

  const config = useConfig(); // Use the hook inside the component

  const handleTokenFromChange = (token) => {
    setTokenIn(token);
    if (tokenOut) {
      fetchExchangeRate(token, tokenOut, tokenFromAmount, provider);
    }
  };

  const handleTokenToChange = (token) => {
    setTokenOut(token);
    if (tokenIn) {
      fetchExchangeRate(tokenIn, token, tokenFromAmount, provider);
    }
  };

  const fetchExchangeRate = async (tokenIn, tokenOut, amountIn, provider) => {
    try {
      const rate = await getExchangeRate(
        tokenIn,
        tokenOut,
        amountIn,
        provider,
        config
      );
      setExchangeRate(rate);
      const equivalentAmount = ethers.formatUnits(rate, tokenOut.decimals);
      setTokenToAmount(equivalentAmount);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  return (
    <div className="flex bg-[#0F0140] min-h-screen justify-center items-center px-4 sm:px-6 md:px-8">
      <div className="bg-[#fff] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 md:p-8 rounded-lg">
        <div className="space-y-7 sm:space-y-4">
          <div className="bg-[#1a1b3e] rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={tokenFromAmount}
                onChange={(e) => setTokenFromAmount(e.target.value)}
                className="bg-transparent text-white text-base sm:text-lg md:text-xl focus:outline-none w-full"
                min="0"
                placeholder="From"
              />
              <TokenSelector
                selectedToken={tokenIn}
                onTokenChange={handleTokenFromChange}
                isOpen={isFromDropdownOpen}
                setIsOpen={setIsFromDropdownOpen}
                dropdownRef={fromDropdownRef}
              />
            </div>
          </div>

          <div className="bg-[#1a1b3e] rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={tokenToAmount}
                onChange={(e) => setTokenToAmount(e.target.value)}
                className="bg-transparent text-white text-base sm:text-lg md:text-xl focus:outline-none w-full"
                min="0"
                placeholder="To"
                disabled
              />
              <TokenSelector
                selectedToken={tokenOut}
                onTokenChange={handleTokenToChange}
                isOpen={isToDropdownOpen}
                setIsOpen={setIsToDropdownOpen}
                dropdownRef={toDropdownRef}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1b3e] rounded-lg py-3 sm:p-10 my-9">
          <div className="flex justify-between items-center">
            <span className="text-white text-base sm:text-lg md:text-xl">
              {exchangeRate || "Select tokens to see rate"}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">{slippage}</span>
          </div>
        </div>

        <button
          onClick={onExchangeRate}
          className="w-full bg-[#FFE600] text-black font-medium py-2 sm:py-3 rounded-lg mt-4 sm:mt-8 hover:bg-[#FFE600]/90 transition-colors text-sm sm:text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SwapAssetsPage;
