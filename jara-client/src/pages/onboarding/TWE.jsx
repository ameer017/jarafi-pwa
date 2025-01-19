import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const TWE = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="slide" timeout={500}>
        <div className="bg-[#0F0140] h-screen w-full p-6 flex flex-col items-center justify-center gap-[80px] text-center text-white">
          {/* Background Images */}
          <div className="absolute top-0 left-0">
            <img src="/bg-up.png" alt="Background Top Left" />
          </div>
          <div className="absolute bottom-0 left-0">
            <img src="/bg-down.svg" alt="Background Bottom Left" />
          </div>
          <div className="absolute bottom-0 right-0 rotate-180">
            <img src="/bg-up.png" alt="Background Bottom Right" />
          </div>
          <div className="absolute top-0 right-0 rotate-180">
            <img src="/bg-down.svg" alt="Background Top Right" />
          </div>

          <div className="flex flex-col items-center space-y-6 mt-12">
            <img
              src="/cryptodron.png"
              alt="Trade with ease"
              className=" max-w-md h-auto object-contain"
            />

            <h1 className="text-3xl md:text-4xl font-bold">Trade with Ease</h1>

            <p className="text-lg md:text-xl max-w-lg leading-relaxed">
              Trade your stable coins to fiat currency using our trusted P2P
              agents!
            </p>
          </div>

          {/* Navigation Section */}
          <div className="mb-12 space-y-8 flex flex-col items-center gap-[80px]">
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
                    ? "bg-white text-[#0F0140]"
                    : "border-[#ffffff] text-white"
                }`}
              ></button>
            </div>

            {/* Action Button */}
            <button
              className="bg-[#F2E205] py-3 px-8 text-[#4F4E50] rounded-lg text-lg font-medium shadow-lg w-[280px] md:w-[350px] hover:bg-[#e4d704] transition-transform transform scale-90 hover:scale-100"
              onClick={() => navigate("/sign-up-endpoint")}
            >
              Next
            </button>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default TWE;
