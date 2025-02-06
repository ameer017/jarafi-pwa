// import { ChevronLeft, ChevronRight } from "lucide-react"

// export default function FundCard({ onBackClick, onAssetClick }) {
//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-md mx-auto space-y-6">
//                 <div className="flex items-center">
//                     <button onClick={onBackClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                         <ChevronLeft className="h-6 w-6" />
//                     </button>
//                 </div>

//                 <div className="space-y-6 px-4">
//                     <h1 className="text-2xl font-bold">How would you like to fund your card?</h1>

//                     <div className="space-y-4">
//                         <button
//                             onClick={onAssetClick}
//                             className="w-full flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//                         >
//                             <div className="flex items-center gap-4">
//                                 <div className="bg-yellow-100 p-2 rounded-full">
//                                     <svg className="h-6 w-6" viewBox="0 0 24 24">
//                                         <path
//                                             fill="currentColor"
//                                             d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <div className="text-left">
//                                     <div className="font-semibold">JaraFi wallet</div>
//                                     <div className="text-sm text-gray-500">Pay with wallet balance</div>
//                                 </div>
//                             </div>
//                             <ChevronRight className="h-5 w-5 text-gray-400" />
//                         </button>

//                         <button
//                             onClick={onAssetClick}
//                             className="w-full flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//                         >
//                             <div className="flex items-center gap-4">
//                                 <div className="bg-yellow-100 p-2 rounded-full">
//                                     <svg className="h-6 w-6" viewBox="0 0 24 24">
//                                         <path
//                                             fill="currentColor"
//                                             d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <div className="text-left">
//                                     <div className="font-semibold">External wallet</div>
//                                     <div className="text-sm text-gray-500">Deposit funds from an external wallet</div>
//                                 </div>
//                             </div>
//                             <ChevronRight className="h-5 w-5 text-gray-400" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }


import { useState } from "react"
import { Plus, Eye, ChevronLeft, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const FundCard = () => {
  const [currentView, setCurrentView] = useState("card")

  const renderCardScreen = () => (
    <div className="space-y-8">
      <div className="relative w-full max-w-[400px] aspect-[1.6/1] mx-auto">
        <div className="absolute inset-0 bg-black rounded-2xl p-6 text-white">
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-[84px]">
              <div className="flex justify-between items-center w-full">
                <span className="text-2xl font-light">Jara Card</span>
                <img src="/visa.svg" alt="VISA" className="h-6" />
              </div>
              <div className="font-mono text-lg">4922****7383</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light">$1576.56</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-[400px] mx-auto">
        <Button variant="outline" className="flex flex-col gap-2 h-auto py-4" onClick={() => setCurrentView("fund")}>
          <Plus className="h-6 w-6" />
          <span>Fund</span>
        </Button>
        <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
          <Eye className="h-6 w-6" />
          <span>Details</span>
        </Button>
      </div>
    </div>
  )

  const renderFundScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView("card")}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="space-y-6 px-4">
        <h1 className="text-2xl font-bold">How would you like to fund your card?</h1>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center p-4 h-auto"
            onClick={() => setCurrentView("asset")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">JaraFi wallet</div>
                <div className="text-sm text-muted-foreground">Pay with wallet balance</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full flex justify-between items-center p-4 h-auto"
            onClick={() => setCurrentView("asset")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">External wallet</div>
                <div className="text-sm text-muted-foreground">Deposit funds from an external wallet</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )

  const renderAssetScreen = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div className="w-8" /> {/* Spacer for centering */}
        <h1 className="text-2xl font-bold">Select asset</h1>
        <Button variant="ghost" size="icon" onClick={() => setCurrentView("fund")}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-4 space-y-6">
        <p className="text-center text-muted-foreground">Fund your card with any of the supported stablecoin</p>

        <div className="space-y-4">
          <Button variant="outline" className="w-full flex justify-between items-center p-4 h-auto">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-2 rounded-full">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="currentColor" className="text-emerald-500" />
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    className="text-xs font-bold"
                  >
                    T
                  </text>
                </svg>
              </div>
              <div className="font-semibold">Tether USDT</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button variant="outline" className="w-full flex justify-between items-center p-4 h-auto">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="currentColor" className="text-blue-500" />
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    className="text-xs font-bold"
                  >
                    $
                  </text>
                </svg>
              </div>
              <div className="font-semibold">USDC</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {currentView === "card" && renderCardScreen()}
        {currentView === "fund" && renderFundScreen()}
        {currentView === "asset" && renderAssetScreen()}
      </div>
    </div>
  )
}

