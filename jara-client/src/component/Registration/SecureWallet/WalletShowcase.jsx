import React, { useEffect, useState } from "react";
import {
  IoCopyOutline,
  IoShieldCheckmarkOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const WalletShowcase = () => {
  // const [walletAddress] = useState("0xh85j2...4n9d");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState("");
  const [recoverySecret, setRecoverySecret] = useState("");

  useEffect(() => {
    const { wallet, recoverySecret: recoverySecret } = location.state || {};
    console.log(wallet);
    if (wallet) {
      setWalletAddress(wallet);
    }
    if (recoverySecret) {
      setRecoverySecret(recoverySecret);
    }
  }, [location.state]);
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    navigate("/congrats", {
      state: {
        wallet: walletAddress,
        recoverySecret,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8  space-y-6">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <img
            src="/wallet.png"
            alt="Wallet"
            className="h-48 w-48 object-contain"
          />

          <h1 className="text-[24px] font-bold text-center mt-16 mb-6 text-[#0F0140]">
            Here&apos;s your wallet!
          </h1>

          <div className="flex justify-between items-center bg-[#E3D7C5] rounded-[10px] w-full px-4 py-2 mb-4">
            <div className="h-5 w-5 bg-gray-400 rounded-full" />
            <div className="text-center flex-1 mx-2">
              <p className="text-gray-600 text-xs mb-1">Your wallet address</p>
              <p className="font-mono text-sm">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`
                  : ""}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center"
              aria-label="Copy wallet address"
            >
              <IoCopyOutline
                size={24}
                className={`text-black transition-transform ${
                  copied ? "text-green-500 scale-110" : ""
                }`}
              />
            </button>
          </div>

          {copied && (
            <p className="text-green-500 text-sm font-semibold mt-2">
              Wallet address copied!
            </p>
          )}

          <div className="w-full space-y-5 mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-yellow-50 h-9 w-9 flex justify-center items-center rounded-full border border-yellow-200">
                <IoShieldCheckmarkOutline size={18} />
              </div>
              <p className="text-[12px] text-[#6F6B6F] ">
                Address above acts like an account number for receiving funds
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-yellow-50 h-9 w-9 flex justify-center items-center rounded-full border border-yellow-200">
                <IoWalletOutline size={18} />
              </div>
              <p className="text-[12px] text-[#6F6B6F] ">
                It's a non-custodial wallet, which means you have total control
                over your funds.
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-[#F2E205] hover:bg-yellow-200 py-3 rounded-[10px] text-gray-700 text-sm font-semibold"
          >
            Continue
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            By creating a wallet, you agree to our{" "}
            <span className="text-red-600">User Agreement</span> and{" "}
            <span className="text-red-600">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletShowcase;
