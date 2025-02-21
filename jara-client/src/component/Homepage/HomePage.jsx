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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  usdt,
  USDC,
} from "../../constant/otherChains";
import { Contract, ethers, JsonRpcProvider } from "ethers";
import { IoIosLogOut } from "react-icons/io";
import QrReader from "react-qr-scanner";
import para from "../../constant/paraClient";
import { motion } from "framer-motion";
import TnxHistory from "../Transactions/TnxHistory";

const HomePage = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [totalBalance, setTotalBalance] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedAddress, setScannedAddress] = useState("");
  const [mockData, setMockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showTnxHistory, setShowTnxHistory] = useState(false);
  const [tokenTransactions, setTokenTransactions] = useState([]);

  const tokens = [cEUR, cUsd, cREAL, celoToken, commons, usdt, USDC];

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!address || address === "N/A") {
      window.location.reload();
    }
  }, [address]);

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
      await para.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchTransactionHistory = async (address, tokens) => {
    if (!address) return;

    const apiKey = import.meta.env.VITE_APP_CELOSCAN_API;
    const url = `https://api.celoscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // console.log(data);
      if (data.status !== "1") {
        console.error("Failed to fetch transactions:", data.message);
        return;
      }

      const transactions = data.result.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        timestamp: parseInt(tx.timeStamp) * 1000,
        tokenSymbol: tx.tokenSymbol || "CELO",
        transactionType:
          tx.from.toLowerCase() === address.toLowerCase() ? "Sent" : "Received",
      }));

      // console.log(transactions)

      const tokenSymbols = tokens.map((token) => token.symbol);

      // console.log(tokenSymbols);

      const filteredTransactions = transactions.filter((tx) =>
        tokenSymbols.some((symbol) => symbol.toLowerCase() === tx.tokenSymbol.toLowerCase())
      );
      

      console.log(filteredTransactions);
      setTokenTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  const updateTokenTransactions = (newTx) => {
    setTokenTransactions((prev) => [
      {
        hash: newTx.hash,
        from: newTx.from.toLowerCase(),
        to: newTx.to.toLowerCase(),
        value: newTx.value,
        timestamp: newTx.timestamp || Date.now(),
        tokenSymbol: newTx.tokenSymbol,
        transactionType: newTx.transactionType,
      },
      ...prev,
    ]);
  };

  //ends

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

  //update

  const handleTransaction = (type, route) => {
    navigate(route);

    const mockTx = {
      hash: `0x${Math.random().toString(16).slice(2)}`,
      from: type === "Payment Sent" ? address : "external_address",
      to: type === "Payment Sent" ? "recipient_address" : address,
      value: (Math.random() * 100).toFixed(2),
      token: mockData[0]?.token_name || "USDC",
      type: type,
      timestamp: Date.now(),
    };
    updateTokenTransactions(mockTx);
  };

  useEffect(() => {
    if (mockData.length > 0 && !Object.keys(tokenTransactions).length) {
      const initialTransactions = mockData.reduce((acc, token) => {
        acc[token.token_name] = [
          {
            hash: `0x${Math.random().toString(16).slice(2)}`,
            from: "initial_address",
            to: address,
            value: (Math.random() * 100).toFixed(2),
            token: token.token_name,
            type: "Payment Received",
            timestamp: Date.now() - 3600000,
          },
        ];
        return acc;
      }, {});
      setTokenTransactions(initialTransactions);
    }
  }, [mockData]);

  useEffect(() => {
    if (address) {
      setLoading(true);
      Promise.all([
        fetchTokenBalances(address, tokens),
        fetchTransactionHistory(address, tokens),
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0140]">
        <p className="text-white text-[20px]">Loading ...</p>
      </div>
    );
  }

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

      <header className="h-auto bg-[#1D143E] my-4 md:my-10 flex items-center justify-center">
        <section className="flex flex-col justify-between w-full max-w-[1024px] px-4 md:p-6">
          {/* Wallet Balance and Icons Section */}
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

              <div>
                <IoIosNotificationsOutline
                  color="#B0AFB1"
                  size={25}
                  onClick={() => setShowTnxHistory(!showTnxHistory)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </section>

          <section className="mt-4 flex gap-4 items-center justify-start  ">
            <motion.p
              className="text-[#F2EDE4] text-[32px] w-[110px] "
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isVisible ? `$ ${totalBalance.toFixed(1)}` : "****"}
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

          {/* Send, Receive, Swap Buttons Section */}
          <section className="flex justify-between mt-4">
            {[
              {
                label: "Send",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                routes: "/send",
                onClick: () => handleTransaction("Payment Sent", "/send"),
              },
              {
                label: "Receive",
                icon: <LuArrowUpToLine size={25} color="#0F0140" />,
                rotate: true,
                routes: "/recieve",
                onClick: () =>
                  handleTransaction("Payment Received", "/recieve"),
              },
              {
                label: "Swap",
                icon: <RiTokenSwapLine size={25} color="#0F0140" />,
                routes: "/swap",
                onClick: () => handleTransaction("Swap", "/swap"),
              },
            ].map(({ label, icon, rotate, routes, onClick }, index) => (
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
          <table className="w-full text-center border-collapse ">
            <thead>
              <tr>
                {showTnxHistory ? (
                  <th
                    className="p-4 border-b text-[#464446] text-[14px] text-left font-[400]"
                    colSpan={2}
                  >
                    History
                  </th>
                ) : (
                  <>
                    <th className="p-4 border-b text-[#464446] text-[14px] font-[400]">
                      Token
                    </th>
                    <th className="p-4 border-b text-[#464446] text-[14px] font-[400]">
                      Available
                    </th>
                  </>
                )}
              </tr>
            </thead>
          </table>

          <div className="overflow-y-auto h-full">
            {showTnxHistory ? (
              <TnxHistory
                isVisible={showTnxHistory}
                mockData={mockData}
                tokenTransactions={tokenTransactions}
                tokens={tokens}
              />
            ) : (
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
                            {isVisible
                              ? `${parseFloat(item.balance).toFixed(1)}`
                              : "**"}{" "}
                            &nbsp;
                            {item.token_name}
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t-[1px] border-[#B0AFB1]">
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
    </section>
  );
};

export default HomePage;
