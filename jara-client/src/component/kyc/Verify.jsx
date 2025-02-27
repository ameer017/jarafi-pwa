import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/get-verified");
    }, 1500);
  };
  return (
    <section className="bg-[#D0D6FF80] min-h-screen flex flex-col justify-center items-center">
      <header className="bg-[#0F0140] w-full p-4 flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">My Card</h2>
      </header>

      <main className="flex flex-col items-center flex-grow w-auto md:w-[400px] ">
        <div className="flex flex-col items-center justify-center mt-[120px] gap-10">
          <img
            src="/verify.png"
            alt="Verification Icon"
            className="h-[122px] w-[122px]"
          />
          <h4 className="font-['Merriweather Sans'] font-bold text-[24px] text-center text-[#262526]">
            Now, let's verify your photo ID
          </h4>
        </div>

        <p className="w-[228px] sm:w-[300px] mt-12 text-center text-[17px] text-[#6F6B6F] font-normal font-['Montserrat']">
          This will establish your identity, and prevent someone else from
          claiming your account.
        </p>

        <button
          onClick={handleClick}
          className="w-full md:w-[350px] flex justify-center items-center px-4 py-3 bg-[#F2E205] rounded-lg font-['Montserrat'] font-semibold text-base text-[#4F4E50] mt-6"
          disabled={loading}
        >
          {loading ? "Loading... Please wait!" : "Continue"}
        </button>
      </main>
    </section>
  );
};

export default Verify;
