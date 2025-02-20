import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ 
  onClose, 
  swapDetails, 
  tokenFrom, 
  tokenTo, 
  amount, 
  status,
  transactionHash 
}) => {
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#0F0140] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto sm:h-[550px] p-4 sm:p-8 rounded-lg relative flex flex-col justify-center items-center text-center"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ 
            type: 'tween', 
            duration: 0.5 
          }}
        >
          {/* Congratulations Content */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#FFE600]">
              {status === "Swap completed successfully!" ? "Congratulations!" : "Transaction Status"}
            </h2>
            
            <p className="text-white text-sm sm:text-xl">
              {status || "Your swap has been successfully completed. The assets have been transferred to your wallet."}
            </p>

            <div className="bg-[#1a1b3e] rounded-lg p-4 sm:p-6 space-y-3">
              <p className="text-white text-sm sm:text-base font-medium">Transaction Details</p>
              
              <div className="space-y-2">
                {/* Amount Sent */}
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-xs sm:text-sm">You Sent</span>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={tokenFrom?.icon} 
                      alt={tokenFrom?.symbol} 
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                    />
                    <span className="text-white text-xs sm:text-sm">
                      {amount} {tokenFrom?.nativeCurrency.symbol}
                    </span>
                  </div>
                </div>

                {/* Amount Received */}
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-xs sm:text-sm">You Received</span>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={tokenTo?.icon} 
                      alt={tokenTo?.symbol} 
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                    />
                    <span className="text-white text-xs sm:text-sm">
                      {swapDetails?.expectedOutput} {tokenTo?.nativeCurrency.symbol}
                    </span>
                  </div>
                </div>

                {/* Exchange Rate */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-white/80 text-xs sm:text-sm">
                    Rate: {swapDetails?.formattedPrice}
                  </span>
                </div>

                {/* Transaction Hash */}
                {transactionHash && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-white/80 text-xs sm:text-sm break-all">
                      Tx: {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-[#2a2b4e] rounded-full w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* View Transaction Button */}
          {transactionHash && (
            <a
              href={`https://celoscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-[#FFE600] text-sm hover:underline"
            >
              View on Explorer
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;