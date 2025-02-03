import React, { useState } from 'react';
import SwapAssetsPage from '../Modal/SwapAssetsPage';
import ExchangeRateModal from '../Modal/ExchangeRateModal';
import FeesModal from '../Modal/FeesModal';
import Modal from '../Modal/Modal';
import UniSwap  from '../Modal/UniSwap';

const Swap = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [showExchangeRateModal, setShowExchangeRateModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);

  const handleExchangeRate = () => {
    setCurrentPage(3);
    setShowExchangeRateModal(true);
  };

  const handleFees = () => {
    setCurrentPage(4);
    setShowFeesModal(true);
  };

  const handleShowCongratulationsModal = () => {
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
        <SwapAssetsPage onExchangeRate={handleExchangeRate} />
      )}
      {currentPage === 3 && (
        <ExchangeRateModal
          onClose={handleCloseModal}
          onContinue={() => {
            setShowExchangeRateModal(false);
            handleFees();
          }}
        />
      )}
      {currentPage === 4 && (
        <FeesModal
          onClose={handleCloseModal}
          onContinue={() => {
            setShowFeesModal(false);
            handleShowCongratulationsModal();
          }}
        />
      )}

      {showModal && <Modal onClose={handleCloseModal} />}
    </div>
  );
};

export default Swap;

