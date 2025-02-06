"use client"

import { useState } from "react"
import CardsPage from "./Cards/CardsPage"
import SelectAsset from "./Cards/SelectAssest"
import { FundCard } from "./Cards/FundCard";

export default function Page() {
  const [currentView, setCurrentView] = useState("card");

  return (
    <>
      {currentView === "card" && <CardsPage onFundClick={() => setCurrentView("fund")} />}
      {currentView === "fund" && (
        <FundCard onBackClick={() => setCurrentView("card")} onAssetClick={() => setCurrentView("asset")} />
      )}
      {currentView === "asset" && <SelectAsset onCloseClick={() => setCurrentView("fund")} />}

    </>
  )
}

// import { FundCard } from "../component/Cards/FundCard"

// const CardPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <FundCard />
      
//     </div>
//   )
// }

// export default CardPage


