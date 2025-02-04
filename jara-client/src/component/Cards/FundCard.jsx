import { ChevronLeft, ChevronRight } from "lucide-react"

export default function FundCard({ onBackClick, onAssetClick }) {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center">
                    <button onClick={onBackClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6 px-4">
                    <h1 className="text-2xl font-bold">How would you like to fund your card?</h1>

                    <div className="space-y-4">
                        <button
                            onClick={onAssetClick}
                            className="w-full flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
                                    <div className="text-sm text-gray-500">Pay with wallet balance</div>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>

                        <button
                            onClick={onAssetClick}
                            className="w-full flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
                                    <div className="text-sm text-gray-500">Deposit funds from an external wallet</div>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

