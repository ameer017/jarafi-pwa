import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SignUpEndpoint = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to determine if a button is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-[#F2E205] h-screen w-full p-6 flex flex-col items-center justify-between text-center text-[#0F0140]">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-6 mt-12">
        <img
          src="/WIS.png"
          alt="Wallet Info System"
          className=" max-w-md h-auto object-contain"
        />

        <h1 className="text-3xl md:text-4xl font-bold p-2 w-2/3">
          Wallet Address = Phone Number
        </h1>

        <p className="text-lg md:text-xl max-w-lg leading-relaxed p-2 w-2/3">
          Send and receive stable coins using your mobile number as your wallet
          address.
        </p>
      </div>

      <div className="mb-12 space-y-8 flex flex-col items-center">
        <div className="flex space-x-4">
          {/* Navigation Buttons */}
          <button
            onClick={() => navigate("/main-screen")}
            className={`border-[1.2px] p-[1.8px] rounded-lg text-md font-medium shadow hover:bg-gray-200 duration-300 ${
              isActive("/main-screen")
                ? "bg-white text-[#0F0140]"
                : "border-[#ffffff] text-white"
            }`}
          ></button>

          <button
            onClick={() => navigate("/trade-with-ease")}
            className={`border-[1.2px] p-[1.8px] rounded-lg text-md font-medium shadow hover:bg-gray-200 duration-300 ${
              isActive("/trade-with-ease")
                ? "bg-white text-[#0F0140]"
                : "border-[#ffffff] text-white"
            }`}
          ></button>

          <button
            onClick={() => navigate("/sign-up-endpoint")}
            className={`border-[1.2px] p-[1.8px] rounded-lg text-md font-medium shadow hover:bg-gray-200 duration-300 ${
              isActive("/sign-up-endpoint")
                ? "bg-[#0F0140] text-[#0F0140]"
                : "border-[#ffffff] text-white"
            }`}
          ></button>
        </div>

        {/* Action Button */}

        <div className="flex flex-col items-center space-y-4">
          <button
            className="bg-[#0F0140] py-3 px-8 text-[#F6F5F6] text-[16px] rounded-lg text-lg font-medium shadow-lg w-[280px] md:w-[350px] hover:bg-[#0f0140b8] transition-transform transform scale-90 hover:scale-100"
            onClick={() => navigate("/sign-up-endpoint")}
          >
            Sign Up
          </button>
          <button
            className="bg-[#FCFEE8] py-3 px-8 text-[#4F4E50] text-[16px] border-[1px] border-[#F2E205] rounded-lg text-lg font-medium shadow-lg w-[280px] md:w-[350px] hover:bg-[#0F0140] hover:text-[#fcf338] transition-transform transform scale-90 hover:scale-100"
            onClick={() => navigate("/sign-up-endpoint")}
          >
            Already have one? Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpEndpoint;
