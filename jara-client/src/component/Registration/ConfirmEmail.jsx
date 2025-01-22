import React from "react";
import { useNavigate } from "react-router-dom";

const ConfirmEmail = () => {

  const navigate = useNavigate()

  const handleContinue = () => {
    navigate("/create-wallet")
  }

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6">
        <div className="max-w-md mx-auto w-full">
          <div>
            <h1 className="text-xl font-semibold mb-2 text-primary">
              Confirm your email
            </h1>
            <p className="text-sm text-gray-600">
              We sent a code to john***@gmail.com
            </p>
          </div>

          <div className="flex justify-between mt-10">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                className={`w-10 h-14 border text-center text-xl font-semibold rounded-lg
                border-gray-300
              `}
                type="text"
                inputMode="numeric"
                maxLength={1}
                placeholder="-"
              />
            ))}
          </div>

          <div className="mt-auto mb-8">
            <div className="mb-6">
              <div className="flex items-center my-4">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 p-2 text-[#FAFAFA] " />
                  <span className="text-[14px] text-[#6F6B6F] ">
                    I understand that if I lose access to my email, I lose
                    access to my wallet.
                  </span>
                </label>
              </div>

              <button
                className={`w-full bg-[#F2E205] hover:bg-[#F7E353] rounded-lg py-3 font-semibold text-[16px]`}
              onClick={handleContinue}
              >
                Continue
              </button>

              <p className="text-center text-[12px] text-gray-600 mt-4">
                By creating a wallet, you agree to our{" "}
                <a href="#" className="text-red-500">
                  User Agreement
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
