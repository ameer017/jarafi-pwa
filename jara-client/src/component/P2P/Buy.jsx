// import React, { useState } from "react"
// import { ArrowLeft, User2 } from "lucide-react"
// import MainPage from "./MainPage"

// const Buy = () => {
//   const [showForm, setShowForm] = useState(false)
//   const [amount, setAmount] = useState("")

//   if (showForm) {
//     return (
//       <div className="fixed inset-0 bg-[#0F0140] p-4">
//         <div className="flex items-center mb-6">
//           <button onClick={() => setShowForm(false)} className="absolute left-4">
//             <ArrowLeft className="text-white" />
//           </button>
//           <h2 className="text-xl text-white w-full text-center">Buy USDT</h2>
//         </div>

//         <div className="bg-white rounded-[32px] p-6 max-w-md mx-auto mt-8">
//           <div className="space-y-1 mb-8">
//             <div className="flex items-center gap-1 justify-center">
//               <span className="text-gray-500">Price</span>
//               <span className="text-[#1FE600]">₦1,670 NGN</span>
//             </div>
//             <div className="text-gray-500 text-center text-sm">Payment Method: Bank Transfer</div>
//             <div className="text-gray-500 text-center text-sm">Payment Duration: 30mins</div>
//           </div>

//           <div className="text-right text-sm mb-2">Avail Bal: 1000USDT</div>

//           <div className="relative mb-4">
//             <input
//               type="text"
//               placeholder="Please enter amount"
//               className="w-full px-4 py-3 border rounded-lg outline-none text-sm"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm">
//               <span className="text-gray-400">NGN</span>
//               <span className="text-[#FFE600] cursor-pointer">All</span>
//             </div>
//           </div>

//           <div className="flex justify-between text-sm mb-6">
//             <span className="text-gray-500">I will receive</span>
//             <span className="text-gray-500">USDT</span>
//           </div>

//           <button className="w-full bg-[#FFE600] text-black py-3 rounded-lg font-medium">Continue</button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-2 px-4 py-4">
//       {Array(6)
//         .fill(null)
//         .map((_, i) => (
//           <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
//             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//               <User2 size={20} className="text-gray-400" />
//             </div>
//             <div className="flex-1">
//               <div>DLT Trader</div>
//               <div className="text-xs text-gray-400">90% Completion</div>
//               <div>₦1,650.00</div>
//             </div>
//             <button onClick={() => setShowForm(true)} className="bg-[#FFE600] text-black px-6 py-2 rounded-lg text-sm">
//               Buy
//             </button>
//           </div>
//         ))}
//     </div>
//   )
// }

// export default Buy
import React, { useState } from "react"
import { ArrowLeft, User2 } from "lucide-react"

const Buy = () => {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState("")

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-[#0F0140] p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => setShowForm(false)} className="absolute left-4">
            <ArrowLeft className="text-white" />
          </button>
          <h2 className="text-xl text-white w-full text-center">Buy USDT</h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 max-w-md mx-auto mt-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-1 justify-center">
              <span className="text-gray-500">Price</span>
              <span className="text-[#1FE600]">₦1,670 NGN</span>
            </div>
            <div className="text-gray-500 text-center text-sm">Payment Method: Bank Transfer</div>
            <div className="text-gray-500 text-center text-sm">Payment Duration: 30mins</div>
          </div>

          <div className="text-right text-sm mb-2">Avail Bal: 1000USDT</div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Please enter amount"
              className="w-full px-4 py-3 border rounded-lg outline-none text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm">
              <span className="text-gray-400">NGN</span>
              <span className="text-[#FFE600] cursor-pointer">All</span>
            </div>
          </div>

          <div className="flex justify-between text-sm mb-6">
            <span className="text-gray-500">I will receive</span>
            <span className="text-gray-500">USDT</span>
          </div>

          <button className="w-full bg-[#FFE600] text-black py-3 rounded-lg font-medium">Continue</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 px-4 py-4">
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User2 size={20} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <div>DLT Trader</div>
              <div className="text-xs text-gray-400">90% Completion</div>
              <div>₦1,650.00</div>
            </div>
            <button onClick={() => setShowForm(true)} className="bg-[#FFE600] text-black px-6 py-2 rounded-lg text-sm">
              Buy
            </button>
          </div>
        ))}
    </div>
  )
}

export default Buy

