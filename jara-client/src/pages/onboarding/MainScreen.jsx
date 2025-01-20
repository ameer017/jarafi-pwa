import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const MainScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="slide" timeout={500}>
        <div className="bg-[#0F0140] h-screen w-full p-6 flex flex-col items-center justify-center gap-[80px] relative">
          <img
            src="/bg-up.png"
            alt="Background Top Left"
            className="absolute top-0 left-0 w-36 md:w-48 lg:w-64"
          />
          <img
            src="/bg-down.svg"
            alt="Background Bottom Left"
            className="absolute bottom-0 left-0 w-28 md:w-40 lg:w-56"
          />

          <img
            src="/bg-up.png"
            alt="Background Bottom Right"
            className="absolute bottom-0 right-0 rotate-180 w-36 md:w-48 lg:w-64"
          />
          <img
            src="/bg-down.svg"
            alt="Background Top Right"
            className="absolute top-0 right-0 rotate-180 w-36 md:w-48 lg:w-64"
          />

          <div className="flex flex-col items-center text-center text-white space-y-6 mt-12">
            <img
              src="/jarafi-yellow.png"
              alt="Jarafi Logo"
              className="w-32 md:w-40 lg:w-48"
            />
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug max-w-lg">
              Keep all your stable coins in one place
            </p>
            <p className="text-[14px] font-bold leading-snug max-w-lg">
              Send, receive, and exchange stable coins seamlessly!
            </p>
          </div>

          <div className="mb-12 space-y-4 flex flex-col items-center gap-[80px]">
            <div className="flex space-x-4">
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
                    ? "bg-white text-[#0F0140]"
                    : "border-[#ffffff] text-white"
                }`}
              ></button>
            </div>

            <button
              className="bg-[#F2E205] duration-300 py-3 px-8 text-[#4F4E50] max-w-sm rounded-lg text-lg font-medium shadow-lg w-[350px] hover:bg-[#e4d704] transition-transform transform scale-90 hover:scale-100"
              onClick={() => navigate("/trade-with-ease")}
            >
              Get Started
            </button>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default MainScreen;
