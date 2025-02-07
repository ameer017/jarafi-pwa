import React, { useState } from 'react';
import SwapAssetsPage from '../Modal/SwapAssetsPage';
import ExchangeRateModal from '../Modal/ExchangeRateModal';
import FeesModal from '../Modal/FeesModal';
import Modal from '../Modal/Modal';
import UniSwap  from '../Modal/UniSwap';
import { useAccount } from 'wagmi';

const Swap = () => {
  const { address } = useAccount();
  const [currentPage, setCurrentPage] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [showExchangeRateModal, setShowExchangeRateModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [swapDetails, setSwapDetails] = useState(null);
  const [selectedChain, setSelectedChain] = useState("Celo");
  // const [tokenIn, setTokenIn] = useState(cUsd);
  // const [tokenOut, setTokenOut] = useState(celoToken);

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

  // const { write: executeSwap } = useContractWrite({
  //   address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //   abi: [
  //     "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)",
  //   ],
  //   functionName: "swapExactTokensForTokens",
  //   args: [
  //     parseUnits(amount, tokenIn.decimals),
  //     swapDetails?.minimumAmountOut.toString(),
  //     [tokenIn.address, tokenOut.address],
  //     address,
  //     Math.floor(Date.now() / 1000) + 60 * 20,
  //   ],
  // });

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
      
        <UniSwap/>
     


      {currentPage === 2 && (
        <SwapAssetsPage
          onExchangeRate={handleExchangeRate}
          amount={amount}
          setAmount={setAmount}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
          // tokenIn={tokenIn}
          // setTokenIn={setTokenIn}
          // tokenOut={tokenOut}
          // setTokenOut={setTokenOut}
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
