import { ChevronRight, X } from "lucide-react"

export default function SelectAsset({ onCloseClick }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center px-4">
          <div className="w-8" /> {/* Spacer for centering */}
          <h1 className="text-2xl font-bold">Select asset</h1>
          <button onClick={onCloseClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 space-y-6">
          <p className="text-center text-gray-500">Fund your card with any of the supported stablecoin</p>

          <div className="space-y-4">
            <button className="w-full flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
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
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            <button className="w-full flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
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
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

