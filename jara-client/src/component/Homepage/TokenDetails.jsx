import React from "react";
import { LuArrowUpToLine, LuCreditCard, LuSettings2, LuWalletMinimal } from "react-icons/lu";
import { RiTokenSwapLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";

const mockData = [
  {
    id: 1,
    first_name: "100.00 USDT",
    price: "$100.00",
    icon: "https://images.ctfassets.net/wr0no19kwov9/2Yfw57sF3oz0UuItz3niKq/066d7923f857cdc91b340d9c17bba416/brand-kit-symbol-image-04.png?fm=webp&w=3840&q=70",
  },
  
];
const TokenDetails = () => {
  const { id } = useParams();
  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      <header className="h-[225px] bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <section className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          <section className="mt-4">
            <p className="text-[#F2EDE4] text-[16px] text-center ">
              Celo Dollar
            </p>
            <p className="text-[#F2EDE4] text-[30px] text-center ">$1.00</p>
          </section>

          <section className="flex justify-between mt-4">
            {[
              {
                label: "Buy",
                icon: <GoPlus size={25} color="#0F0140" />,
              },
              {
                label: "Send",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
              },
              {
                label: "Withdraw",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                rotate: true,
              },
            ].map(({ label, icon, rotate }, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 text-white text-[14px]"
              >
                <button
                  className={`bg-[#F2E205] rounded-lg h-[60px] w-[60px] flex items-center justify-center cursor-pointer ${
                    rotate ? "rotate-180" : ""
                  }`}
                >
                  {icon}
                </button>
                {label}
              </div>
            ))}
          </section>
        </section>
      </header>


      <main className="h-[575px] md:h-[582px] bg-white overflow-hidden">
        <div className="h-full border">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b text-[#464446] text-[14px] font-[400]">
                  Token
                </th>
                <th className="p-4 border-b text-[#464446] text-[14px] font-[400]">
                  Available
                </th>
              </tr>
            </thead>
          </table>
          <div className="overflow-y-auto h-full">
            <table className="w-full text-center border-collapse">
              <tbody>
                {mockData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                   
                      <td className="p-4 text-[#3D3C3D] text-[14px] font-[400] text-left flex gap-1">
                        <img src={item.icon} className="w-[20px] h-[20px] " /> USDT
                      </td>
                      <td className="p-4 text-[#3D3C3D] text-[14px] font-[400] text-right flex gap-1 flex-col ">
                        {item.first_name} <br/>
                        {item.price}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
