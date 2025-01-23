import React, { useEffect, useState } from "react";
import {
  LuArrowUpToLine,
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
} from "react-icons/lu";
import { RiTokenSwapLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Action Button Component
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

const Activities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const COINMARKETCAP_BASE_URL = import.meta.env
    .VITE_APP_COINMARKETCAP_BASE_URL;
  const API_KEY = import.meta.env.VITE_APP_CMC_API_KEY;
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

  const isActive = (path) => location.pathname === path;

  // Fetch token data from CoinMarketCap
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await axios.get(
          CORS_PROXY + `${COINMARKETCAP_BASE_URL}cryptocurrency/quotes/latest`,
          {
            params: { symbol: "CUSD", convert: "USD" },
            headers: { "X-CMC_PRO_API_KEY": API_KEY },
          }
        );
        const data = response.data?.data?.CUSD;
        setTokenData(data);

        // Mocked price history for demonstration (replace with real historical data endpoint if needed)
        const mockHistory = [
          { day: "Mon", price: data?.quote?.USD?.price + 0.01 },
          { day: "Tue", price: data?.quote?.USD?.price - 0.02 },
          { day: "Wed", price: data?.quote?.USD?.price + 0.03 },
          { day: "Thu", price: data?.quote?.USD?.price - 0.01 },
          { day: "Fri", price: data?.quote?.USD?.price + 0.02 },
          { day: "Sat", price: data?.quote?.USD?.price - 0.01 },
          { day: "Sun", price: data?.quote?.USD?.price + 0.01 },
        ];
        setPriceHistory(mockHistory);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching token activity:", error);
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [COINMARKETCAP_BASE_URL, API_KEY]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0140] text-white">
        Loading token data...
      </div>
    );
  }

  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      {/* Header */}
      <header className="h-[225px] bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <div className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          <div className="mt-4 text-center">
            <p className="text-[#F2EDE4] text-[16px]">{tokenData?.name}</p>
            <p className="text-[#F2EDE4] text-[30px]">
              ${tokenData?.quote?.USD?.price.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between mt-4">
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
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="h-[575px] md:h-[582px] bg-white overflow-hidden">
        <div className="h-full border">
          {/* Tab Navigation */}
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="flex">
                  <button
                    onClick={() => navigate(`/token-details/${tokenData?.id}`)}
                    className={`p-2 text-[14px] font-medium w-full text-[#464446a9] ${
                      isActive(`/token-details/${tokenData?.id}`)
                        ? "text-[#0F0140] border-b-2 border-[#0F0140] text-[16px]"
                        : ""
                    }`}
                  >
                    Your balance
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/token-details/${tokenData?.id}/activities`)
                    }
                    className={`p-2 text-[14px] font-medium w-full text-[#464446a9] ${
                      isActive(`/token-details/${tokenData?.id}/activities`)
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

          {/* Bar Chart Section */}
          <div className="overflow-y-auto h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priceHistory}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="#0F0140" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t-[1px] border-[#B0AFB1]">
        {[LuWalletMinimal, RiTokenSwapLine, LuCreditCard, LuSettings2].map(
          (Icon, index) => (
            <Icon key={index} size={25} color="#B0AFB1" />
          )
        )}
      </footer>
    </section>
  );
};

export default Activities;
