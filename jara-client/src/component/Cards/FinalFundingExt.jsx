import React, { useState } from "react";
import { FaInfo } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const FinalFundingExt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.state?.value || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/card-display");
    }, 1500);
  };

  return (
    <section className="p-6 w-full h-screen flex justify-center items-center">
      <div className="w-full md:w-[400px] md:shadow-md p-4 rounded-lg bg-white">
        <div className="flex flex-col items-center gap-2">
          <p>Pay</p>
          <p className="text-lg font-semibold">{value} USDT</p>
          <p>You get {value} USDT</p>
        </div>

        <p className="bg-yellow-50 p-[3px] my-6 flex gap-5 items-center rounded-lg">
          <FaInfo size={20} /> Send at least {value} USDT to the address below.
          Sending a lower amount might delay your card funding.
        </p>

        <div className="flex flex-col gap-4 p-2 text-sm">
          <div>
            <p className="font-medium">Pay exactly</p>
            <p className="text-lg font-semibold">{value} USDT</p>
          </div>
          <div>
            <p className="font-medium">My virtual wallet address</p>
            <p className="text-gray-700 select-all">
              0xh85j2mndbfjljbfjfjds344n9d
            </p>
          </div>
          <div>
            <p className="font-medium">Network</p>
            <p className="text-gray-700">Celo</p>
          </div>

          <button
            onClick={handleNavigation}
            className={`bg-purple-600 rounded-lg p-3 text-white text-lg font-semibold w-full hover:bg-purple-700 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Moving on... 👋" : `Payment of ${value} USDT made`}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalFundingExt;
