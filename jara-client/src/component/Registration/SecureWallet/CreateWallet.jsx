import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { capsuleClient } from '../../../client.js';
import Notice from "./Notice";

const CreateWallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [recoverySecret, setRecoverySecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);


  useEffect(() => {
    // Check if wallet was created during registration
    const stateWallet = location.state?.wallet;
    const stateRecoverySecret = location.state?.recoverySecret;
    const stateEmail = location.state?.email;

    if (stateWallet && stateRecoverySecret) {
      setWallet(stateWallet);
      setRecoverySecret(stateRecoverySecret);
      
      // Show success toast
      setToast({ message: "Wallet ready to be created!", type: 'success' });
      
      // Automatically open modal
      handleModalOpen();
    } else if (!stateWallet) {
      // Redirect if no wallet info is available
      navigate('/register');
    }
  }, [location.state, navigate]);

  const handleCreateWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If wallet wasn't pre-created during registration, create it now
      if (!wallet) {
        const [newWallet, newRecoverySecret] = await capsuleClient.createWallet();
        setWallet(newWallet);
        setRecoverySecret(newRecoverySecret);
      }

      handleModalOpen();
    } catch (err) {
      setError('Failed to create wallet. Please try again.');
      console.error('Wallet creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverWallet = () => {
    // Placeholder for wallet recovery logic
    navigate('/wallet-recovery');
  };

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4 relative">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <img
            src="/wallet.png"
            alt="Wallet"
            className="w-32 h-32 mb-4 object-contain"
          />

          <div className="text-center space-y-6">
            <h2 className="text-gray-900 text-[20px] font-medium">
              {wallet 
                ? "Wallet Created Successfully" 
                : "Create wallet and encrypt seed phrase in your Google Drive"
              }
            </h2>

            {!wallet && (
              <p className="text-[#F21B1B] text-[14px]">
                Note: If wallet creation fails, close and restart the app.
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="w-full space-y-3">
            {!wallet && (
              <>
                <button
                  className={`w-full bg-[#F2E205] hover:bg-[#F7E353] py-3 px-4 rounded-lg text-gray-900 font-medium ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleCreateWallet}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create wallet'}
                </button>

                <button 
                  className="w-full bg-[#FCFEE8] py-3 px-4 rounded-lg text-gray-900 border-[#F2E205] border-[1.2px] font-medium hover:bg-[#f2e205e7] transition-colors"
                  onClick={handleRecoverWallet}
                >
                  Have an existing wallet? Recover
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <Notice 
          onClose={handleModalClose} 
          wallet={wallet} 
          recoverySecret={recoverySecret} 
        />
      )}
    </div>
  );
};

export default CreateWallet;