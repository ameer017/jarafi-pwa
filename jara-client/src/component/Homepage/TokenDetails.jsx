import React from "react";
import {
  LuArrowUpToLine,
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
} from "react-icons/lu";
import { RiTokenSwapLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";

const mockData = [
  {
    id: 1,
    first_name: "1.00 cUSD",
    price: "$1.00",
    icon: "https://images.ctfassets.net/wr0no19kwov9/2Yfw57sF3oz0UuItz3niKq/066d7923f857cdc91b340d9c17bba416/brand-kit-symbol-image-04.png?fm=webp&w=3840&q=70",
  },
];

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
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      <header className="h-[225px] bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <section className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          <section className="mt-4">
            <p className="text-[#F2EDE4] text-[16px] text-center">
              Celo Dollar
            </p>
            <p className="text-[#F2EDE4] text-[30px] text-center">$1.00</p>
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
      </header>

      <main className="h-[575px] md:h-[582px] bg-white overflow-hidden">
        <div className="h-full border">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="flex">
                  <button
                    onClick={() => navigate(`/token-details/${mockData[0].id}`)}
                    className={`p-2 text-[14px] font-medium w-full text-[#464446a9]  ${
                      isActive(`/token-details/${mockData[0].id}`)
                        ? "text-[#0F0140] border-b-2 border-[#0F0140] text-[16px] "
                        : ""
                    }`}
                  >
                    Your balance
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/token-details/${mockData[0].id}/activities`)
                    }
                    className={`p-2 text-[14px] font-medium w-full text-[#464446a9]  ${
                      isActive(`/token-details/${mockData[0].id}/activities`)
                        ? "text-[#0F0140] border-b-2 border-[#0F0140] text-[16px]"
                        : ""
                    }`}
                  >
                    Activity
                  </button>
                </th>
              </tr>
            </thead>
          </table>
          <div className="overflow-y-auto h-full">
            <table className="w-full text-center border-collapse">
              <tbody>
                {mockData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="p-4 text-left flex items-center gap-3">
                      <img
                        src={item.icon}
                        alt={`${item.first_name} token`}
                        className="w-[40px] h-[40px] rounded-full"
                      />
                      <div>
                        <p>CELO</p>
                        <p>Celo Network</p>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {item.first_name} <br /> {item.price}
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
