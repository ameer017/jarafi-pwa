import React from "react";
import { Link } from "react-router-dom";

const Verify = () => {
  return (
    <div className="bg-[#D0D6FF80] min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#0F0140] w-full p-4 flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">My Card</h2>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center  flex-grow">
        <div className="flex flex-col items-center justify-center mt-[120px] gap-10">
          <img src="/verify.png" alt="Verification Icon" className="h-[122px] w-[122px]" />
          <h4 className="font-['Merriweather Sans'] font-bold text-2xl text-center text-[#262526]">
            Now, let's verify your photo ID
          </h4>
        </div>

        <p className="w-[228px] sm:w-[300px] mt-12 text-center text-sm sm:text-base text-[#6F6B6F] font-normal font-['Montserrat']">
          This will establish your identity and prevent someone else from claiming your account.
        </p>

        {/* Continue Button */}
        <Link
          to="/getVerified"
          className="w-full md:w-[350px] flex justify-center items-center px-4 py-3 bg-[#F2E205] rounded-lg font-semibold text-base text-[#4F4E50] mt-6"
        >
          Continue
        </Link>
      </main>
    </div>
  );
};

export default Verify;
