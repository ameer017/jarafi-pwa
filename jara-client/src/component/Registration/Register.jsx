import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { capsuleClient } from '../../client.js';


const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const loggedIn = await capsuleClient.isFullyLoggedIn();
        if (loggedIn) {
          navigate('/create-wallet');
        }
      } catch (error) {
        console.error("Login check failed:", error);
      }
    };

    checkExistingLogin();
  }, [navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);

    try {
      const isExistingUser = await capsuleClient.checkIfUserExists(email);

      if (isExistingUser) {
        // Existing user flow
        const webAuthUrlForLogin = await capsuleClient.initiateUserLogin(email, false, "email");
        const popupWindow = window.open(webAuthUrlForLogin, "loginPopup", "popup=true");
        
        const { needsWallet } = await capsuleClient.waitForLoginAndSetup(popupWindow);
        
        if (needsWallet) {
          // Create wallet if needed
          const [wallet, recoverySecret] = await capsuleClient.createWallet();
          navigate('/create-wallet', { state: { wallet, recoverySecret, email } });
        } else {
          navigate('/create-wallet');
        }
      } else {
        // New user flow: initiate email verification
        await capsuleClient.createUser(email);
        navigate('/confirm-email', { state: { email } });
      }
    } catch (error) {
      setLocalError(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLocalError(null);

    try {
      const webAuthUrlForLogin = await capsuleClient.initiateUserLogin(null, true, "google");
      const popupWindow = window.open(webAuthUrlForLogin, "loginPopup", "popup=true");
      
      const { needsWallet } = await capsuleClient.waitForLoginAndSetup(popupWindow);
      
      if (needsWallet) {
        // Create wallet if needed
        const [wallet, recoverySecret] = await capsuleClient.createWallet();
        navigate('/create-wallet', { state: { wallet, recoverySecret } });
      } else {
        navigate('/create-wallet');
      }
    } catch (error) {
      setLocalError(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <h2 className="text-[24px] font-semibold text-gray-900">Sign in</h2>
          <p className="text-sm text-gray-600 mt-1">Hi, what's your email?</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F7E353]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-[#4F4E50] bg-[#F2E205] hover:bg-[#F7E353] focus:outline-none ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-[#FFFEF7] text-sm font-medium text-gray-700 hover:bg-[#FFFEF0] focus:outline-none ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
          ) : (
            "Continue with Google"
          )}
        </button>

        {localError && (
          <div className="text-red-500 text-sm text-center mt-2">
            {localError}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;