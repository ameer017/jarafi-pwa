import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignUpEndpoint = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      className="bg-[#F2E205] h-screen w-full p-6 flex flex-col items-center justify-center gap-[80px] text-center text-[#0F0140] relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <img
        src="/wp.svg"
        alt="Background Top Left"
        className="absolute top-0 right-0  md:hidden "
      />
      <img
        src="/wpii.svg"
        alt="Background Top Left"
        className="absolute bottom-0 right-0  md:hidden "
      />
      <img
        src="/vite.svg"
        alt="Background Top Left"
        className="absolute top-0 left-0 w-36 md:w-48 lg:w-64 hidden md:block"
      />
      <img
        src="/bg-down.svg"
        alt="Background Bottom Left"
        className="absolute bottom-10 left-0 w-28 md:w-40 lg:w-56 hidden md:block"
      />
      <img
        src="/bgEight.png"
        alt="Background Center Right"
        className="absolute top-52 right-16 w-40 md:w-56 lg:w-72 hidden md:block"
      />
      <img
        src="/bgTen.png"
        alt="Background Top Right"
        className="absolute top-0 right-0 w-36 md:w-48 lg:w-64 hidden md:block"
      />
      <img
        src="/bgTen.png"
        alt="Background Bottom Right Rotated"
        className="absolute md:-bottom-9 md:right-10 -bottom-6 right-6 w-36 md:w-48 lg:w-64 rotate-90 hidden md:block"
      />
      <div className="flex flex-col items-center space-y-6 mt-12">
        <img
          src="/WIS.png"
          alt="Wallet Info System"
          className="max-w-md h-auto object-contain"
        />

        <h1 className="text-3xl md:text-4xl font-bold p-2 w-2/3">
          Wallet Address = Phone Number
        </h1>

        <p className="text-lg md:text-xl max-w-lg leading-relaxed p-2 w-2/3">
          Send and receive stable coins using your mobile number as your wallet
          address.
        </p>
      </div>

      <div className="mb-12 space-y-8 flex flex-col items-center gap-[40px]">
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
                : "border-[#0F0140] text-[#0F0140] "
            }`}
          ></button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            className="bg-[#0F0140] py-3 px-8 text-[#F6F5F6] text-[16px] rounded-lg text-lg font-medium shadow-lg w-[280px] md:w-[350px] hover:bg-[#0f0140b8] transition-transform transform"
            onClick={() => navigate("/sign-up-user")}
          >
            Sign Up
          </button>
          <button
            className="bg-[#FCFEE8] py-3 px-8 text-[#4F4E50] text-[16px] border-[1px] border-[#F2E205] rounded-lg text-lg font-medium shadow-lg w-[280px] md:w-[350px] hover:bg-[#0F0140] hover:text-[#fff] transition-colors duration-300 delay-300 transform"
            onClick={() => navigate("/login")}
          >
            Already have one? Log in
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SignUpEndpoint;
