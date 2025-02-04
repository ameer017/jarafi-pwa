import React, { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { parseUnits } from "viem";
import { Token } from "@uniswap/sdk-core";
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json";
import { abi as SwapRouterABI } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import SwapAssetsPage from "../Modal/SwapAssetsPage";
import ExchangeRateModal from "../Modal/ExchangeRateModal";
import FeesModal from "../Modal/FeesModal";
import Modal from "../Modal/Modal";
import { cUsd, celoToken } from "../../constant/otherChains";
import { Contract } from "ethers";

// Uniswap Contracts on Celo
const QUOTER_CONTRACT = "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8";
const SWAP_ROUTER_CONTRACT = "0x5615CDAb10dc425a742d643d949a7F474C01abc4";

const Swap = () => {
  const { address } = useAccount();
  const [currentPage, setCurrentPage] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [showExchangeRateModal, setShowExchangeRateModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [swapDetails, setSwapDetails] = useState(null);
  const [tokenIn, setTokenIn] = useState(cUsd);
  const [tokenOut, setTokenOut] = useState(celoToken);

  const handleExchangeRate = async () => {
    try {
      const tokenInObj = new Token(42220, tokenIn.address, tokenIn.decimals);
      const tokenOutObj = new Token(42220, tokenOut.address, tokenOut.decimals);

      console.log(tokenInObj);
      console.log(tokenOutObj);
      const amountIn = parseUnits(amount, tokenIn.decimals).toString();

      const quoterContract = new Contract(QUOTER_CONTRACT, QuoterABI, provider);
      const amountOut = await quoterContract.callStatic.quoteExactInputSingle(
        tokenIn.address,
        tokenOut.address,
        3000,
        amountIn,
        0
      );

      setSwapDetails({ amountOut });
      setCurrentPage(3);
      setShowExchangeRateModal(true);
    } catch (error) {
      console.error("Error fetching Uniswap exchange rate:", error);
    }
  };

  const { write: executeSwap } = useContractWrite({
    address: SWAP_ROUTER_CONTRACT,
    abi: SwapRouterABI,
    functionName: "exactInputSingle",
    args: [
      {
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        fee: 3000,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        amountIn: parseUnits(amount, tokenIn.decimals),
        amountOutMinimum: swapDetails?.amountOut.toString() || "0",
        sqrtPriceLimitX96: 0,
      },
    ],
  });

  const handleSwap = async () => {
    executeSwap?.();
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
