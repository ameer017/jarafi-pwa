import React, { useEffect, useState } from "react";
import { RiTokenSwapLine } from "react-icons/ri";
import { GoEye, GoEyeClosed } from "react-icons/go";
import {
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
  LuArrowUpToLine,
} from "react-icons/lu";
import { BiScan } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  cusdt,
  USDC,
} from "../../constant/otherChains";
import { Contract, ethers, JsonRpcProvider } from "ethers";
import { IoIosLogOut } from "react-icons/io";
import QrReader from "react-qr-scanner";
import capsuleClient from "../../constant/capsuleClient";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [totalBalance, setTotalBalance] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedAddress, setScannedAddress] = useState("");
  const [mockData, setMockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const tokens = [cEUR, cUsd, cREAL, celoToken, commons, cusdt, USDC];

  const handleScan = (data) => {
    if (data) {
      setScannedAddress(data);
      setShowScanner(false);
      console.log("Scanned Wallet Address:", data);
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  const logoutAccount = async () => {
    try {
      await capsuleClient.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchTokenBalances = async (address, tokens) => {
    if (!address) {
      console.error("Address is not provided!");
      setLoading(false);
      return;
    }

    const fetchedData = [];
    const provider = new JsonRpcProvider("https://forno.celo.org");
    let totalBalance = 0;

    try {
      for (let token of tokens) {
        try {
          const contract = new Contract(
            token.address,
            ["function balanceOf(address) view returns (uint256)"],
            provider
          );

          const tokenBalance = await contract.balanceOf(address);
          const formattedBalance = ethers.formatUnits(
            tokenBalance,
            token.decimals
          );

          totalBalance += parseFloat(formattedBalance);

          fetchedData.push({
            id: token.id,
            token_name: token.name,
            symbol: token.nativeCurrency?.symbol || "N/A",
            network: token.network?.name || "Unknown Network",
            balance: ethers.formatUnits(tokenBalance, token.decimals),
            icon:
              token.icon ||
              "https://img.icons8.com/?size=100&id=DEDR1BLPBScO&format=png&color=000000",
          });
        } catch (error) {
          console.error(`Error fetching balance for ${token.name}:`, error);
        }
      }

      setMockData(fetchedData);
      setTotalBalance(totalBalance);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchTokenBalances(address, tokens);
    } else {
      setLoading(false);
    }
  }, [address]);

  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      <p className="text-[12px] text-[#8A868A] text-center px-6 py-2">
        Finish setting up your account for maximum security!
      </p>

      <div className="flex items-center justify-end  gap-2">
        <p className="text-[20px] md:text-[12px] text-[#fff] text-left md:text-right px-2">
          {address ? `${address.slice(0, 10)}...${address.slice(-10)}` : "N/A"}
        </p>

        <button className="mr-2" onClick={logoutAccount}>
          <IoIosLogOut size={25} color="#ffffff" />
        </button>
      </div>

      <header className="h-[225px] bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <section className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          <section className="flex justify-between items-center relative">
            <p className="text-[#F2EDE4] text-[16px]">Wallet Balance</p>
            <div className="flex gap-4">
              <div className="relative">
                <button onClick={() => setShowScanner(!showScanner)}>
                  <BiScan color="#B0AFB1" size={25} />
                </button>

                {showScanner && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                      <h3 className="text-lg font-bold text-gray-700">
                        Scan QR Code
                      </h3>

                      <div className="w-64 h-64 mt-4 flex items-center justify-center border-4 border-gray-300 rounded-lg">
                        <QrReader
                          delay={300}
                          onError={handleError}
                          onScan={handleScan}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>

                      <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
                        onClick={() => setShowScanner(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {scannedAddress && (
                  <p className="text-green-500 text-center mt-2">
                    Scanned Address: {scannedAddress}
                  </p>
                )}
              </div>

              <IoIosNotificationsOutline color="#B0AFB1" size={25} />
            </div>
          </section>

          <section className="mt-4 flex gap-2 items-center justify-between md:justify-normal">
            <motion.p
              className="text-[#F2EDE4] text-[32px] w-[100px]"
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isVisible ? `$ ${totalBalance.toFixed(2)}` : "****"}
            </motion.p>

            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => setIsVisible(!isVisible)}
            >
              <motion.div
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isVisible ? (
                  <GoEye size={25} color="#fff" />
                ) : (
                  <GoEyeClosed size={25} color="#fff" />
                )}
              </motion.div>
            </div>
          </section>

          <section className="flex justify-between mt-4">
            {[
              {
                label: "Send",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                routes: "/send",
              },
              {
                label: "Receive",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                rotate: true,
                routes: "/recieve",
              },
              {
                label: "Swap",
                icon: <RiTokenSwapLine size={25} color="#0F0140" />,
                routes: "/swap",
              },
            ].map(({ label, icon, rotate, routes }, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 text-white text-[14px]"
              >
                <button
                  className={`bg-[#F2E205] rounded-lg h-[60px] w-[60px] flex items-center justify-center cursor-pointer ${
                    rotate ? "rotate-180" : ""
                  }`}
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
            <table className="w-full text-center border-collapse table-fixed">
              <tbody>
                {mockData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td colSpan={2} className="p-0">
                      <Link
                        to={`/token-details/${item.id}`}
                        state={{
                          tokenData: {
                            id: item.id,
                            token_name: item.token_name,
                            symbol: item.symbol,
                            network: item.network,
                            balance: item.balance,
                            icon: item.icon,
                            address: tokens.find((t) => t.id === item.id)
                              ?.address,
                            decimals: tokens.find((t) => t.id === item.id)
                              ?.decimals,
                          },
                        }}
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
                          {parseFloat(item.balance).toFixed(1)}{" "}
                          {item.token_name}
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#464446] text-[16px]">
                Loading token balances...
              </p>
            </div>
          ) : (
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
                            {isVisible ? item.balance : "*******"}
                            {item.token_name}
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

        <Link to="/settings">
          <LuSettings2 size={25} color="#B0AFB1" />
        </Link>
      </footer>
    </section>
  );
};

export default HomePage;
