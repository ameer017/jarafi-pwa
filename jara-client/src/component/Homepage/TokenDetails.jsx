import React, { useEffect, useState } from "react";
import { RiTokenSwapLine } from "react-icons/ri";
import {
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
  LuArrowUpToLine,
} from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { FaPlus } from "react-icons/fa";
import { Contract, ethers, JsonRpcProvider } from "ethers";
import { useLocation, useParams } from "react-router-dom";

const TokenDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mockData, setMockData] = useState([]);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("balance");
  const [tokenData, setTokenData] = useState(null);
  const { address } = useAccount();
  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    const initializeTokenData = () => {
      if (location.state?.tokenData) {
        setTokenData(location.state.tokenData);
        localStorage.setItem("tokenData", JSON.stringify(location.state.tokenData));
      } else {
        const storedData = localStorage.getItem("tokenData");
        if (storedData) {
          setTokenData(JSON.parse(storedData));
        }
      }
    };

    initializeTokenData();
  }, [location.state]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "activity") {
      navigate(`/token-details/${id}/activities`, {
        state: { tokenData: tokenData }
      });
    } else {
      navigate(`/token-details/${id}`, {
        state: { tokenData: tokenData }
      });
    }
  };

  const fetchTokenBalance = async () => {
    if (!address || !tokenData?.address) {
      setError("Token data not available");
      setIsLoading(false);
      return;
    }

    try {
      const provider = new JsonRpcProvider("https://forno.celo.org");
      const contract = new Contract(
        tokenData.address,
        ["function balanceOf(address) view returns (uint256)"],
        provider
      );

      const balance = await contract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(
        balance,
        tokenData.decimals || 18
      );
      setTokenBalance(formattedBalance);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setError("Failed to fetch token balance");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tokenData) {
      fetchTokenBalance();
    }
  }, [address, tokenData]);

  if (isLoading) {
    return (
      <section className="bg-[#0F0140] h-screen w-full flex items-center justify-center">
        <p className="text-white">Loading token details...</p>
      </section>
    );
  }

  if (error || !tokenData) {
    return (
      <section className="bg-[#0F0140] h-screen w-full flex flex-col items-center justify-center">
        <p className="text-white mb-4">{error || "Token data not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#F2E205] rounded-lg px-4 py-2 text-[#0F0140]"
        >
          Go Back
        </button>
      </section>
    );
  }

    return (
      <div className="overflow-y-auto h-full">
        <table className="w-full text-center border-collapse table-fixed">
          <tbody>
            {mockData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td colSpan={2} className="p-0">
                  <Link
                    to={`/token-details/${item.id}`}
                    className="w-full flex justify-between"
                  >
                    <div className="p-4 text-[#3D3C3D] text-[14px] font-[400] text-left flex gap-1 w-full">
                      <img
                        src={item.icon}
                        className="w-[20px] h-[20px] rounded-full"
                        alt="icon"
                      />
                      {item.token_name}
                    </div>
                    <div className="p-4 text-[#3D3C3D] text-[14px] font-[400] text-right flex gap-1 flex-col w-full">
                      {item.balance} {item.token_name}
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      <div className="flex items-center justify-between px-4 py-2">
      <Link to="/dashboard">
      <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2"
        >
          ← Back
        </button>
      </Link>
      </div>

      <header className="h-[225px] bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <section className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          <section className="flex items-center gap-2">
            <img
              src={tokenData.icon}
              className="w-[24px] h-[24px] rounded-full"
              alt={tokenData.token_name}
            />
            <p className="text-[#F2EDE4] text-[16px]">{tokenData.token_name}</p>
          </section>

          <section className="mt-4">
            <p className="text-[#F2EDE4] text-[30px]">
              ${tokenBalance || tokenData?.quote?.USD?.price?.toFixed(2)}
            </p>
          </section>

          <section className="flex justify-between items-center px-8 mt-12">
            {[
              {
                label: "Buy",
                icon: <FaPlus size={25} color="#0F0140" />,
                routes: "/buy",
              },
              {
                label: "Send",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                routes: "/send",
              },
              {
                label: "Withdraw",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                rotate: true,
                routes: "/withdraw",
              },
            ].map(({ label, icon, routes }, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 text-white text-[14px]"
              >
                <button
                  className="bg-[#F2E205] rounded-lg h-[50px] w-[50px] flex items-center justify-center cursor-pointer"
                  onClick={() => navigate(routes)}
                >
                  {icon}
                </button>
                {label}
              </div>
            ))}
          </section>
        </section>
      </header>

      <main className="h-[575px] md:h-[562px] bg-white overflow-hidden">
        <div className="h-full border">
          <div className="flex border-b">
            <button
              onClick={() => handleTabChange('balance')}
              className={`p-4 text-[14px] w-1/2 ${
                activeTab === 'balance'
                  ? "text-[#0F0140] border-b-2 border-[#0F0140] font-medium"
                  : "text-[#464446] font-normal"
              }`}
            >
              Your Balance
            </button>
            <button
              onClick={() => handleTabChange('activity')}
              className={`p-4 text-[14px] w-1/2 ${
                activeTab === 'activity'
                  ? "text-[#0F0140] border-b-2 border-[#0F0140] font-medium"
                  : "text-[#464446] font-normal"
              }`}
            >
              Activity
            </button>
          </div>

        </div>
      </main>

      <footer className="fixed bottom-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t-[1px] border-[#B0AFB1]">
        <Link to="/dashboard">
          <LuWalletMinimal size={25} color="#B0AFB1" />
        </Link>
        <Link to="/p2p">
          <RiTokenSwapLine size={25} color="#B0AFB1" />
        </Link>
        <LuCreditCard size={25} color="#B0AFB1" />
        <LuSettings2 size={25} color="#B0AFB1" />
      </footer>
    </section>
      </div>
    );
  


};

export default TokenDetails;