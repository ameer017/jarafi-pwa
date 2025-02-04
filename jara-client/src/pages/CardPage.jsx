"use client"

import { useState } from "react"
import CardsPage from "../component/Cards/CardsPage"
import FundCard from "../component/Cards/FundCard"
import SelectAsset from "../component/Cards/SelectAssest"

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

