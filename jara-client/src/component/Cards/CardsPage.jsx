import { Plus, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { LuCreditCard, LuSettings2, LuWalletMinimal } from "react-icons/lu";
import { RiTokenSwapLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import { CiBarcode } from "react-icons/ci";
import { FiCreditCard } from "react-icons/fi";

export default function CardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const details = location.state?.details || [];

  useEffect(() => {
    if (details.length === 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate("/request-card");
    }
  }, [countdown, navigate]);

  return (
    <section className="relative">
      <div className="flex justify-center items-center mb-4 bg-[#0F0140] p-4">
        <h1 className="text-2xl font-bold text-white">Cards</h1>
      </div>

      <div className="min-h-screen bg-gray-50 p-6 relative flex flex-col items-center ">
        {details.length === 0 ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              You don&apos;t have a card yet!
            </h2>
            <p className="text-gray-600 mt-2">
              Redirecting you to the request card page in{" "}
              <span className="text-[#0F0140] font-bold">{countdown}</span>{" "}
              seconds...
            </p>
          </div>
        ) : (
          <div className="w-[350px] md:w-[450px] space-y-8 flex flex-col justify-center items-center ">
            <div className="relative aspect-[1.6/1] w-full">
              <div className="absolute inset-0 bg-[url('/JaraFi-icon.png')] bg-cover bg-no-repeat border-[1.2px] border-black rounded-2xl p-6 text-black">
                {details.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col h-full justify-between"
                  >
                    <div className="space-y-10">
                      <div className="flex justify-between items-center w-full">
                        <CiBarcode color="#1F2223" size={40} />

                        <div className="flex flex-col justify-end text-right gap-2">
                          <span className="text-[18px] font-light">
                            {card.name}
                          </span>
                          <span className="text-[14px] font-light">
                            {card.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-mono text-[14px] ">{card.doe}</div>
                      <img
                        src="https://www.mastercard.com.ng/content/dam/mccom/brandcenter/thumbnails/mastercard_circles_92px_2x.png"
                        alt="mastercard logo"
                        className="w-[26px] h-[16px] "
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 items-center justify-center w-full">
              <button
                className="flex flex-col items-center justify-center bg-transparent border-[1.2px] rounded-lg p-4 w-[120px] h-[100px] transition-all hover:bg-gray-100"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={30} className="text-[#0F0140]" />
                <span className="text-sm font-medium text-gray-800">Fund</span>
              </button>
              <button
                className="flex flex-col items-center justify-center bg-transparent border-[1.2px] rounded-lg p-4 w-[120px] h-[100px] transition-all hover:bg-gray-100"
                onClick={() =>
                  navigate("/card-details", { state: { details } })
                }
              >
                <Eye size={30} className="text-[#0F0140]" />
                <span className="text-sm font-medium text-gray-800">
                  Details
                </span>
              </button>
            </div>
            <div className=" justify-start items-start w-full">
              <div className="flex justify-start gap-4">
                <button className="text-[16px] text-[#3D3C3D] font-[Montserrat] ">
                  Activity
                </button>
                <button className="text-[16px] text-[#3D3C3D] font-[Montserrat] ">
                  Subscription
                </button>
              </div>

              <div>
                <div className="flex justify-between my-4">
                  <p className="text-[12px] text-[#8A868A] ">Feb 14</p>
                  <p className="text-[12px] text-[#8A868A] ">See all</p>
                </div>

                <div className="flex justify-between items-center">
                  <FiCreditCard size={14} color="#5D5C5E" />

                  <p className="text-[14px] text-[#3D3C3D]">
                    Card withdrawal(crypto)
                  </p>
                  <p className="text-[14px] text-[#F21B1B]">-100 USD</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <FundCard
            setIsModalOpen={setIsModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <footer className="fixed bottom-0 bg-white py-4 w-full  flex items-center justify-between px-[40px] md:px-[120px] border-t-[1px] border-[#B0AFB1]">
          <Link to="/dashboard">
            <LuWalletMinimal
              size={25}
              color={isActive("/dashboard") ? "#0F0140" : "#B0AFB1"}
            />
          </Link>
          {/* <Link to="/p2p">
                  <RiTokenSwapLine
                    size={25}
                    color={isActive("/p2p") ? "#0F0140" : "#B0AFB1"}
                  />
                </Link> */}
          {/* <Link to="/card-display">
                  <LuCreditCard
                    size={25}
                    color={isActive("/card-display") ? "#0F0140" : "#B0AFB1"}
                  />
                </Link> */}
          <Link to="/settings">
            <LuSettings2
              size={25}
              color={isActive("/settings") ? "#0F0140" : "#B0AFB1"}
            />
          </Link>
        </footer>
      </div>
    </section>
  );
}
