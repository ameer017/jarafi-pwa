"use client";

import React, { useState, useRef, useEffect } from "react";

// Custom hook to handle clicks outside of the dropdown
const useOutsideClick = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

const SwapAssetsPage = ({ onExchangeRate }) => {
  const [selectedTokenFrom, setSelectedTokenFrom] = useState("USDT");
  const [selectedTokenTo, setSelectedTokenTo] = useState("cUSD");
  const [tokenFromAmount, setTokenFromAmount] = useState("0.00");
  const [tokenToAmount, setTokenToAmount] = useState("0.00");
  const [exchangeRate, setExchangeRate] = useState("1 USDT = 0.9997 cUSD");
  const [slippage, setSlippage] = useState("-0.03%");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

  const fromDropdownRef = useOutsideClick(() => setIsFromDropdownOpen(false));
  const toDropdownRef = useOutsideClick(() => setIsToDropdownOpen(false));

  const handleTokenFromChange = (token) => {
    setSelectedTokenFrom(token);
    setExchangeRate(`1 ${token} = 0.9997 ${selectedTokenTo}`);
    setIsFromDropdownOpen(false);
  };

  const handleTokenToChange = (token) => {
    setSelectedTokenTo(token);
    setExchangeRate(`1 ${selectedTokenFrom} = 0.9997 ${token}`);
    setIsToDropdownOpen(false);
  };

  const handleSwap = () => {
    onExchangeRate();
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
        <span className="text-white text-xs sm:text-sm">{selectedToken}</span>
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
        <div className="absolute top-full left-0 mt-2 w-full bg-[#2a2b4e] rounded-lg p-2 sm:p-3 z-10 shadow-lg">
          {["USDT", "cUSD", "cEUR"].map((token) => (
            <button
              key={token}
              className="flex items-center space-x-2 w-full py-1 sm:py-2 hover:bg-[#3a3b4e] rounded-lg"
              onClick={() => onTokenChange(token)}
            >
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-teal-400" />
              <span className="text-white text-xs sm:text-sm">{token}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex bg-[#0F0140] min-h-screen justify-center items-center px-4 sm:px-6 md:px-8">
      <div className="bg-[#fff] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 md:p-8 rounded-lg">
        {/* <div > */}
          {/* Token From */}
          <div className="space-y-7 sm:space-y-4">
          <div className="bg-[#1a1b3e] rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={tokenFromAmount}
                onChange={(e) => setTokenFromAmount(e.target.value)}
                className="bg-transparent text-white text-base sm:text-lg md:text-xl focus:outline-none w-full"
              />
              <TokenSelector
                selectedToken={selectedTokenFrom}
                onTokenChange={handleTokenFromChange}
                isOpen={isFromDropdownOpen}
                setIsOpen={setIsFromDropdownOpen}
                dropdownRef={fromDropdownRef}
              />
            </div>
          </div>

          {/* Token To */}
          <div className="bg-[#1a1b3e] rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={tokenToAmount}
                onChange={(e) => setTokenToAmount(e.target.value)}
                className="bg-transparent text-white text-base sm:text-lg md:text-xl focus:outline-none w-full"
              />
              <TokenSelector
                selectedToken={selectedTokenTo}
                onTokenChange={handleTokenToChange}
                isOpen={isToDropdownOpen}
                setIsOpen={setIsToDropdownOpen}
                dropdownRef={toDropdownRef}
              />
            </div>
          </div>
          </div>
          

          {/* Exchange Rate Display */}
          <div className="bg-[#1a1b3e] rounded-lg py-3 sm:p-10 my-9">
            <div className="flex justify-between items-center">
              <span className="text-white text-base sm:text-lg md:text-xl">
                {exchangeRate}
              </span>
              <span className="text-gray-400 text-xs sm:text-sm">
                {slippage}
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="w-full bg-[#FFE600] text-black font-medium py-2 sm:py-3 rounded-lg mt-4 sm:mt-8 hover:bg-[#FFE600]/90 transition-colors text-sm sm:text-base"
          >
            Swap
          </button>
        </div>
      </div>
    // </div>
  );
};

export default SwapAssetsPage;
