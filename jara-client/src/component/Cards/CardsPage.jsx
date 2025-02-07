import { Plus, Eye } from "lucide-react";
import { useState } from "react";
import { LuCreditCard, LuSettings2, LuWalletMinimal } from "react-icons/lu";
import { RiTokenSwapLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import FundCard from "./FundCard";

export default function CardPage() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative">
      <div className="flex justify-center items-center mb-4 bg-[#0F0140] p-4">
        <h1 className="text-2xl font-bold text-white">Cards</h1>
      </div>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[400px] mx-auto space-y-8 flex flex-col justify-center items-center">
          <div className="relative aspect-[1.6/1] w-full">
            <div className="absolute inset-0 bg-black rounded-2xl p-6 text-white">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-10">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-2xl font-light">Jara Card</span>
                    <span className="text-2xl font-light">VISA</span>
                  </div>
                  <div className="font-mono text-lg">4922****7383</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light">$1576.56</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center justify-center w-full">
            <button
              className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 w-[120px] h-[100px] transition-all hover:bg-gray-100"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={30} className="text-[#0F0140]" />
              <span className="text-sm font-medium text-gray-800">Fund</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 w-[120px] h-[100px] transition-all hover:bg-gray-100">
              <Eye size={30} className="text-[#0F0140]" />
              <span className="text-sm font-medium text-gray-800">Details</span>
            </button>
          </div>
        </div>
        {isModalOpen && (
          <FundCard
            setIsModalOpen={setIsModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        <footer className="fixed bottom-0 left-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t border-gray-300">
          <Link to="/dashboard">
            <LuWalletMinimal
              size={25}
              color={isActive("/dashboard") ? "#0F0140" : "#B0AFB1"}
            />
          </Link>
          <Link to="/p2p">
            <RiTokenSwapLine
              size={25}
              color={isActive("/p2p") ? "#0F0140" : "#B0AFB1"}
            />
          </Link>
          <Link to="/card-display">
            <LuCreditCard
              size={25}
              color={isActive("/card-display") ? "#0F0140" : "#B0AFB1"}
            />
          </Link>
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
