import React, { useState } from "react"
import Buy from "./Buy"
import Sell from "./Sell"
import { Bell, Wallet, Users2, LayoutGrid, Settings, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { LuCreditCard, LuSettings2, LuWalletMinimal } from "react-icons/lu"
import { RiTokenSwapLine } from "react-icons/ri"

const MainPage = () => {
  const [activeTab, setActiveTab] = useState("buy")
  const [selectedToken, setSelectedToken] = useState("USDT")
  const [selectedCurrency, setSelectedCurrency] = useState("NGN")
  const [showTokens, setShowTokens] = useState(false)
  const [showAmounts, setShowAmounts] = useState(false)
  const [showCurrencies, setShowCurrencies] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("All")

  const tokens = ["USDT", "BTC", "ETH", "BNB"]
  const amounts = ["All", "100-1000", "1000-5000", "5000-10000", "10000+"]
  const currencies = ["NGN", "USD", "EUR", "GBP"]

  return (
    <div className="min-h-screen bg-white text-black pb-20">
      {/* Header */}
      <div className="bg-[#0F0140] p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex items-center gap-2">
            <span className="text-white text-xl">P2P</span>
            <span className="text-xl">⚡</span>
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowCurrencies(!showCurrencies)} className="flex items-center gap-2 text-white">
                {selectedCurrency} <ChevronDown size={16} />
              </button>
              {showCurrencies && (
                <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg py-2 w-32 z-10">
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => {
                        setSelectedCurrency(currency)
                        setShowCurrencies(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Buttons and Bell */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === "buy" ? "bg-[#0F0140] text-white" : "bg-[#E7E6E7] text-black hover:bg-[#E7E6E7]/90"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === "sell" ? "bg-[#0F0140] text-white" : "bg-[#E7E6E7] text-black hover:bg-[#E7E6E7]/90"
            }`}
          >
            Sell
          </button>
        </div>
        <Bell size={20} className="text-black cursor-pointer" />
      </div>

      {/* Filters */}
      <div className="px-4 py-2 flex items-center gap-4 border-b">
        <div className="relative">
          <button onClick={() => setShowTokens(!showTokens)} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            {selectedToken}
            <ChevronDown size={16} />
          </button>
          {showTokens && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-2 w-32 z-10">
              {tokens.map((token) => (
                <button
                  key={token}
                  onClick={() => {
                    setSelectedToken(token)
                    setShowTokens(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {token}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setShowAmounts(!showAmounts)} className="flex items-center gap-2 text-gray-500">
            Amount <ChevronDown size={16} />
          </button>
          {showAmounts && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-2 w-48 z-10">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setShowAmounts(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {amount}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeTab === "buy" ? <Buy /> : <Sell />}

      <footer className="fixed bottom-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t-[1px] border-[#B0AFB1]">
        <Link to="/dashboard">

          <LuWalletMinimal size={25} color="#B0AFB1" />
        </Link>
        <Link to="/p2p" >

          <RiTokenSwapLine size={25} color="#B0AFB1" />
        </Link>
        <LuCreditCard size={25} color="#B0AFB1" />
        <LuSettings2 size={25} color="#B0AFB1" />
      </footer>
    </div>
  )
}

export default MainPage

