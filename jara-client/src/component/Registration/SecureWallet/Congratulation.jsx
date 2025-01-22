import React from "react";
import { useNavigate } from "react-router-dom";

const Congratulation = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 space-y-6 text-center">
        <div className="flex flex-col items-center">
          <img
            src="/sic.png"
            alt="Congratulations"
            className="h-48 w-48 object-contain mb-6"
          />

          <h1 className="text-[28px] font-bold text-[#262526]">
            Congratulations!
          </h1>
          <p className="text-[#262526] text-[16px] mt-2 mb-6">
            You have successfully created your wallet
          </p>

          <button
            className="w-full bg-[#F2E205] hover:bg-yellow-100 py-3 rounded-[10px] text-[#4F4E50] text-[16px] font-semibold transition"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Congratulation;
