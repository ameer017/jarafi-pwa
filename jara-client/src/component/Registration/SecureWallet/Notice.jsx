import React from "react";
import { useNavigate } from "react-router-dom";

const Notice = ({ onClose }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
      onClose();
      navigate("/wallet-showcase", { state: { wallet } });
    };


  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 min-h-screen p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 space-y-6 text-center">
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-[22px] font-bold text-[#F21B1B]">Notice!</h1>

          <p className="text-[16px] text-[#262526] ">
            Your seed phrase will automatically be backed up to
            john****@gmail.com. Check your Google Drive to preview.
          </p>

          <button
            onClick={handleContinue}
            className="w-full bg-[#F2E205] hover:bg-yellow-200 py-3 rounded-[10px] text-gray-700 text-sm font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
};

export default Notice;
