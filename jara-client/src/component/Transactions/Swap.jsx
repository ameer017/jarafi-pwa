import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import SwapAssetsPage from '../Modal/SwapAssetsPage';
import ExchangeRateModal from '../Modal/ExchangeRateModal';
import FeesModal from '../Modal/FeesModal';
import Modal from '../Modal/Modal';
import { useSwapSystem } from '../hooks/useSwapSystem';
import { cUsd, celoToken } from "../../constant/otherChains";

const Swap = () => {
  const { address } = useAccount();
  const { getQuote, executeSwap, availableTokens } = useSwapSystem();
  
  const [currentPage, setCurrentPage] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [showExchangeRateModal, setShowExchangeRateModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [swapDetails, setSwapDetails] = useState(null);
  const [selectedChain, setSelectedChain] = useState("Celo");
  const [tokenFrom, setTokenFrom] = useState(cUsd);
  const [tokenTo, setTokenTo] = useState(celoToken);
  const [swapStatus, setSwapStatus] = useState("");

  const handleExchangeRate = async () => {
    try {
      if (!amount || !tokenFrom || !tokenTo) {
        toast.error("Please select tokens and enter amount");
        return;
      }

      const quote = await getQuote(tokenFrom, tokenTo, amount, address);
      setSwapDetails(quote);
      setCurrentPage(3);
      setShowExchangeRateModal(true);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      toast.error(error.message || "Failed to get exchange rate");
    }
  };

  const handleSwap = async () => {
    try {
      setSwapStatus("Processing swap...");
      const result = await executeSwap(tokenFrom, tokenTo, amount, para, address);
      setShowFeesModal(false);
      setShowModal(true);
      setSwapStatus("Swap completed successfully!");
      toast.success("Swap completed successfully!");
    } catch (error) {
      console.error("Swap failed:", error);
      setSwapStatus("Swap failed: " + error.message);
      toast.error(error.message || "Swap failed");
    }
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
          tokenFrom={tokenFrom}
          setTokenFrom={setTokenFrom}
          tokenTo={tokenTo}
          setTokenTo={setTokenTo}
          availableTokens={availableTokens}
        />
      )}
      {currentPage === 3 && (
        <ExchangeRateModal
          swapDetails={swapDetails}
          tokenFrom={tokenFrom}
          tokenTo={tokenTo}
          amount={amount}
          onClose={handleCloseModal}
          onContinue={() => {
            setShowExchangeRateModal(false);
            setShowFeesModal(true);
            setCurrentPage(4);
          }}
        />
      )}
      {currentPage === 4 && (
        <FeesModal 
          swapDetails={swapDetails}
          onClose={handleCloseModal}
          onContinue={handleSwap}
        />
      )}
      {showModal && (
        <Modal 
          onClose={handleCloseModal}
          swapDetails={swapDetails}
          tokenFrom={tokenFrom}
          tokenTo={tokenTo}
          amount={amount}
          status={swapStatus}
        />
      )}
    </div>
  );
};

export default Swap;