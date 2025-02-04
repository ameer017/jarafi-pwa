import { Plus, Eye } from "lucide-react"

export default function CardPage({ onFundClick }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[400px] mx-auto space-y-8">
        {/* Card */}
        <div className="relative aspect-[1.6/1] w-full">
          <div className="absolute inset-0 bg-black rounded-2xl p-6 text-white">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-[84px]">
                {/* <div className="flex justify-between items-center w-full">
                  <span className="text-2xl font-light">Jara Card</span>
                </div> */}
                 <div className="flex justify-between items-center w-full">
                  <span className="text-2xl font-light">Jara Card</span>
                  <span className="text-2xl font-light">visa</span>
                  {/* <img src="/visa.svg" alt="VISA" className="h-6" /> */}
                </div>
                <div className="font-mono text-lg">4922****7383</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-light">$1576.56</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onFundClick}
            className="flex flex-col items-center justify-center gap-2 py-4 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Fund</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 py-2 px-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  )
}
