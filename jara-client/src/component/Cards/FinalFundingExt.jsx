import React, { useState } from "react";
import { FaInfo } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const FinalFundingExt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.state?.value);
  return (
    <section className=" p-6  w-full h-full flex justify-center">
      <div className="border-2 w-full md:w-[400px] ">
        <div className="flex items-center flex-col gap-2">
          <p>Pay</p>
          {value} USDT
          <p>You get {value}</p>
        </div>
        <p className="bg-yellow-50 p-[3px] my-6 flex gap-5 items-center rounded-lg">
          <FaInfo size={20} /> Send at least {value} USDT to the address below.
          Sending a lower amount might delay your card funding.
        </p>

        <div className="flex flex-col gap-4 p-2">
          <div>
            <p>Pay exactly</p>
            <p>{value} USDT</p>
          </div>
          <div>
            <p> My virtual wallet address</p>
            <p>0xh85j2mndbfjljbfjfjds344n9d</p>
          </div>

          <div>
            <p>Network</p>
            <p>Celo</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalFundingExt;
