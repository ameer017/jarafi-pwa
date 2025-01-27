import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { capsuleClient } from '../../client.js';


const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.charAt(0) +
      "*".repeat(username.length - 2) +
      username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  const handleCodeChange = (value, index) => {
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async () => {
    if (!isChecked) return;

    setIsLoading(true);
    try {
      const verificationCode = code.join("");
      const isVerified = await capsuleClient.verifyEmail(verificationCode);

      if (!isVerified) {
        setLocalError("Verification failed. Please try again.");
        return;
      }

      // Create wallet after email verification
      const [wallet, recoverySecret] = await capsuleClient.createWallet();

      // Navigate to create wallet with wallet details
      navigate("/create-wallet", {
        state: { wallet, recoverySecret, email }
      });
    } catch (error) {
      console.error("Verification failed:", error);
      setLocalError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6">
        <div className="max-w-md mx-auto w-full">
          <div>
            <h1 className="text-xl font-semibold mb-2 text-primary">
              Confirm your email
            </h1>
            <p className="text-sm text-gray-600">
              We sent a code to {maskEmail(email)}
            </p>
          </div>

          <div className="flex justify-between mt-10">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`w-10 h-14 border text-center text-xl font-semibold rounded-lg
                    ${localError ? "border-red-500" : "border-gray-300"}
                  `}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(e.target.value, index)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digit && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </div>

          <div className="mt-auto mb-8">
            <div className="mb-6">
              <div className="flex items-center my-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="mr-2 p-2 text-[#FAFAFA]"
                  />
                  <span className="text-[14px] text-[#6F6B6F]">
                    I understand that if I lose access to my email, I lose
                    access to my wallet.
                  </span>
                </label>
              </div>

              <button
                onClick={handleVerification}
                disabled={!isChecked || isLoading}
                className={`w-full bg-[#F2E205] hover:bg-[#F7E353] rounded-lg py-3 font-semibold text-[16px] ${
                  !isChecked || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Verifying..." : "Continue"}
              </button>

              {localError && (
                <p className="text-red-500 text-sm mt-4 text-center">
                  {localError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;