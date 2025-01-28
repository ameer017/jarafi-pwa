import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExchangeRateModal = ({ onClose, onContinue }) => {
  const message = "We've found the best exchange rate for you. Your trade will be completed at a price within 1% of the estimated or the transaction will be cancelled and funds returned to your wallet.";

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#0F0140] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto sm:h-[550px] p-4 sm:p-8 rounded-lg relative flex flex-col justify-between"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ 
            type: 'tween', 
            duration: 0.5 
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-[#2a2b4e] rounded-full w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="flex-grow flex flex-col justify-center text-center space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Slippage Tolerance</h2>
            <p className="text-white/80 text-sm sm:text-base text-center">{message}</p>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-[#FFE600] text-black font-medium py-2 sm:py-3 rounded-lg hover:bg-[#FFE600]/90 transition-colors text-sm sm:text-base"
          >
            Got it
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExchangeRateModal;