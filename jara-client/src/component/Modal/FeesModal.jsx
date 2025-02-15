import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeesModal = ({ swapDetails, onClose, onContinue }) => {
  const feeDetails = {
    estimatedNetworkFee: `~ $${swapDetails?.estimatedGasInUSD?.toFixed(3) || '0.00'}`,
    maxNetworkFee: `~ $${(swapDetails?.estimatedGasInUSD * 1.2)?.toFixed(3) || '0.00'}`,
    jarafiFee: `~ $${swapDetails?.jarafiFee?.toFixed(3) || '0.00'}`,
    totalFees: `~ $${swapDetails?.totalFees?.toFixed(3) || '0.00'}`,
    message: 'The network fee is required by the network to process the transaction. The JarafiFee of 0.4% is charged for your use of our product.'
  };

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
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">Network Fees</h2>
            
            <div className="bg-[#1a1b3e] rounded-lg p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-xs sm:text-sm">Estimated Network Fee</span>
                <span className="text-white text-xs sm:text-sm">{feeDetails.estimatedNetworkFee}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-xs sm:text-sm">Max Network Fee</span>
                <span className="text-white text-xs sm:text-sm">{feeDetails.maxNetworkFee}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-xs sm:text-sm">JarafiFee</span>
                <span className="text-white text-xs sm:text-sm">{feeDetails.jarafiFee}</span>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm sm:text-base font-medium">Total Fees</span>
                  <span className="text-white text-sm sm:text-base font-medium">{feeDetails.totalFees}</span>
                </div>
              </div>
            </div>

            <p className="text-white/80 text-center text-xs sm:text-sm">
              {feeDetails.message}
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-[#FFE600] text-black font-medium py-2 sm:py-3 rounded-lg hover:bg-[#FFE600]/90 transition-colors text-sm sm:text-base mt-4 sm:mt-0"
          >
            Confirm Swap
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeesModal;