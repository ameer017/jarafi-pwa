import React, { useState } from "react";
import { useContractWrite, useAccount } from "wagmi";
import { Trade, Token, Fetcher, Route, TradeType } from "@ubeswap/sdk";
import SwapAssetsPage from "../Modal/SwapAssetsPage";
import ExchangeRateModal from "../Modal/ExchangeRateModal";
import FeesModal from "../Modal/FeesModal";
import Modal from "../Modal/Modal";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  cusdt,
} from "../../constant/otherChains";
import { parseUnits } from "viem";
const Swap = () => {
  const { address } = useAccount();
  const [currentPage, setCurrentPage] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [showExchangeRateModal, setShowExchangeRateModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [swapDetails, setSwapDetails] = useState(null);
  const [selectedChain, setSelectedChain] = useState("Celo");
  const [tokenIn, setTokenIn] = useState(cUsd);
  const [tokenOut, setTokenOut] = useState(celoToken);

  const handleExchangeRate = async () => {
    try {
      if (selectedChain === "Celo") {
        const tokenInObj = new Token(42220, tokenIn.address, tokenIn.decimals);
        const tokenOutObj = new Token(
          42220,
          tokenOut.address,
          tokenOut.decimals
        );
        const pair = await Fetcher.fetchPairData(tokenInObj, tokenOutObj);
        const route = new Route([pair], tokenInObj);
        const trade = new Trade(
          route,
          parseUnits(amount, tokenIn.decimals),
          TradeType.EXACT_INPUT
        );
        setSwapDetails(trade);
      } else {
        // const lifi = new LiFi();
        // const quote = await lifi.getQuote({
        //   fromChain: "Celo",
        //   toChain: selectedChain,
        //   fromToken: tokenIn.address,
        //   toToken: otherChains[selectedChain].address,
        //   amount: ethers.utils.parseUnits(amount, tokenIn.decimals).toString(),
        //   fromAddress: address,
        // });
        // setSwapDetails(quote);
      }
      setCurrentPage(3);
      setShowExchangeRateModal(true);
    } catch (error) {
      console.error("Error fetching swap details:", error);
    }
  };

  const { write: executeSwap } = useContractWrite({
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    abi: [
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)",
    ],
    functionName: "swapExactTokensForTokens",
    args: [
      parseUnits(amount, tokenIn.decimals),
      swapDetails?.minimumAmountOut.toString(),
      [tokenIn.address, tokenOut.address],
      address,
      Math.floor(Date.now() / 1000) + 60 * 20,
    ],
  });

  const handleSwap = async () => {
    if (selectedChain === "Celo") {
      executeSwap?.();
    } else {
      // const lifi = new LiFi();
      // await lifi.swap(swapDetails);
    }
    setShowFeesModal(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowExchangeRateModal(false);
    setShowFeesModal(false);
  };

  return (
    <div>
      {currentPage === 2 && (
        <SwapAssetsPage
          onExchangeRate={handleExchangeRate}
          amount={amount}
          setAmount={setAmount}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
          tokenIn={tokenIn}
          setTokenIn={setTokenIn}
          tokenOut={tokenOut}
          setTokenOut={setTokenOut}
        />
      )}
      {currentPage === 3 && (
        <ExchangeRateModal
          swapDetails={swapDetails}
          onClose={handleCloseModal}
          onContinue={() => {
            setShowExchangeRateModal(false);
            setShowFeesModal(true);
          }}
        />
      )}
      {currentPage === 4 && (
        <FeesModal onClose={handleCloseModal} onContinue={handleSwap} />
      )}
      {showModal && <Modal onClose={handleCloseModal} />}
    </div>
  );
};

export default Swap;
