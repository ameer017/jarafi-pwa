import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
} from "react-icons/lu";
import { RiTokenSwapLine } from "react-icons/ri";


const ActionButton = ({ label, icon, rotate }) => (
  <div className="flex flex-col items-center gap-2 text-white text-[14px]">
    <button
      className={`bg-[#F2E205] rounded-lg h-[60px] w-[60px] flex items-center justify-center cursor-pointer ${
        rotate ? "rotate-180" : ""
      }`}
    >
      {icon}
    </button>
    {label}
  </div>
);

const TokenDetails = ({ tokens }) => {
  const { id } = useParams();
  const [tokenDetails, setTokenDetails] = useState(null);

  useEffect(() => {
    const token = tokens.find((item) => item.id === parseInt(id));
    setTokenDetails(token);
    console.log(tokenDetails)
  }, [id, tokens]);

  if (!tokenDetails) return <p className="text-white">Loading...</p>;

  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
   <header className="h-[225px] bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <section className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          <section className="mt-4">
            <p className="text-[#F2EDE4] text-[16px]">{tokenDetails.name}</p>
            <p className="text-[#F2EDE4] text-[32px]">
              Balance:  {tokenDetails.nativeCurrency.symbol}
            </p>
          </section>
        </section>
      </header>

      <main className="bg-white flex flex-col items-center p-6">
        <img
          src={tokenDetails.icon}
          alt={tokenDetails.name}
          className="w-20 h-20 mb-4"
        />
        <p className="text-gray-800 text-lg">{tokenDetails.name}</p>
        <p className="text-gray-600 text-md">Network: {tokenDetails.network.name}</p>
        <p className="text-gray-600 text-md">
          Symbol: {tokenDetails.nativeCurrency.symbol || "N/A"}
        </p>
      </main>

      <footer className="fixed bottom-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t-[1px] border-[#B0AFB1]">
        <LuWalletMinimal size={25} color="#B0AFB1" />
        <RiTokenSwapLine size={25} color="#B0AFB1" />
        <LuCreditCard size={25} color="#B0AFB1" />
        <LuSettings2 size={25} color="#B0AFB1" />
      </footer>
    </section>
  );
};

export default TokenDetails;
