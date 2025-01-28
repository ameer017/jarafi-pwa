import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import {
  LuArrowUpToLine,
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
} from "react-icons/lu";
import { RiTokenSwapLine } from "react-icons/ri";

// const mockData = [
//   {
//     id: 1,
//     first_name: "1.00 cUSD",
//     price: "$1.00",
//     token_name: "Celo Dollar",
//     icon: "https://images.ctfassets.net/wr0no19kwov9/2Yfw57sF3oz0UuItz3niKq/066d7923f857cdc91b340d9c17bba416/brand-kit-symbol-image-04.png?fm=webp&w=3840&q=70",
//   },
//   // Add more tokens if needed
// ];

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

const TokenDetails = () => {
  const { id } = useParams();
  const [tokenDetails, setTokenDetails] = useState(null);

  console.log(id)
  useEffect(() => {
    // Simulate fetching the token details
    // const token = mockData.find((item) => item.id === parseInt(id));
    setTokenDetails();
  }, [id]);

  // if (!tokenDetails) return <p>Loading...</p>;

  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      {/* <header className="h-[225px] bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <section className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          <section className="mt-4">
            <p className="text-[#F2EDE4] text-[16px] text-center">
              {tokenDetails.token_name}
            </p>
            <p className="text-[#F2EDE4] text-[30px] text-center">
              {tokenDetails.price}
            </p>
          </section>
          <section className="flex justify-between mt-4">
            {[
              { label: "Buy", icon: <GoPlus size={25} color="#0F0140" /> },
              {
                label: "Send",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
              },
              {
                label: "Withdraw",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                rotate: true,
              },
            ].map((action, index) => (
              <ActionButton key={index} {...action} />
            ))}
          </section>
        </section>
      </header> */}
    </section>
  );
};

export default TokenDetails;
