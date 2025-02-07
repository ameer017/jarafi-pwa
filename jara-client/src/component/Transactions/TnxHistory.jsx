// import React, { useState } from 'react';

// const TnxHistory = ({ isVisible }) => {
//   const [transactions] = useState([
//     {
//       id: 1,
//       address: '0x72ou...7929',
//       type: 'Payment Sent',
//       amount: -200.00,
//       token: 'USDC',
//       tokenAmount: 200,
//       time: '12:00 PM'
//     },
//     {
//       id: 2,
//       address: '0x72ou...6375',
//       type: 'Payment Received',
//       amount: 1200.00,
//       token: 'USDT',
//       tokenAmount: 1200,
//       time: '1:30 PM'
//     },
//     {
//       id: 3,
//       address: '0x89ou...4523',
//       type: 'Payment Sent',
//       amount: -50.00,
//       token: 'USDC',
//       tokenAmount: 50,
//       time: '2:45 PM'
//     }
//   ]);

//   if (!isVisible) return null;

//   return (
//     <div className="w-full h-screen" style={{ overflow: 'scroll', '::-webkit-scrollbar': { display: 'none' } }}>
//       <main className="bg-white">
//         {transactions.map((tx) => (
//           <div 
//             key={tx.id} 
//             className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <div className="text-[#4B5563] text-sm">
//                   {tx.address}
//                 </div>
//                 <div className="text-gray-500 text-xs">
//                   {tx.type}
//                 </div>
//                 <div className="text-gray-400 text-xs mt-1">
//                   {tx.time}
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className={`text-sm ${
//                   tx.amount < 0 ? 'text-red-500' : 'text-green-500'
//                 }`}>
//                   {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
//                 </div>
//                 <div className="text-gray-500 text-xs">
//                   {tx.tokenAmount} {tx.token}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </main>
//       <style>
//         {`
//           ::-webkit-scrollbar {
//             display: none;
//           }
//           * {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default TnxHistory;




import React from 'react';
import { format } from 'date-fns';

const TnxHistory = ({ isVisible, mockData, tokenTransactions }) => {
  if (!isVisible) return null;

  const renderTransactions = () => {
    const allTransactions = [];
    
    Object.entries(tokenTransactions).forEach(([tokenName, transactions]) => {
      transactions.forEach(tx => {
        allTransactions.push({
          ...tx,
          tokenName
        });
      });
    });

    return allTransactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((tx, index) => {
        const token = mockData.find(t => t.token_name === tx.token);
        const isReceived = tx.type === 'Payment Received';
        
        return (
          <tr key={`${index}`} className="hover:bg-gray-50">
            <td className="p-4 border-b">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <img 
                    src={token?.icon} 
                    alt={tx.token}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {tx.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(tx.timestamp, 'MMM dd, yyyy HH:mm')}
                  </span>
                  <span className="text-xs text-gray-500 truncate w-32">
                    {isReceived ? `From: ${tx.from}` : `To: ${tx.to}`}
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4 border-b text-right">
              <div className="flex flex-col items-end">
                <span className={`text-sm font-medium ${isReceived ? 'text-green-600' : 'text-red-600'}`}>
                  {isReceived ? '+' : '-'}{tx.value} {tx.token}
                </span>
                {/* <span className="text-xs text-gray-500 truncate max-w-[150px]">
                  Hash: {tx.hash}
                </span> */}
              </div>
            </td>
          </tr>
        );
      });
  };

  return (
    <table className="w-full">
      <tbody>
        {renderTransactions()}
      </tbody>
    </table>
  );
};

export default TnxHistory;


