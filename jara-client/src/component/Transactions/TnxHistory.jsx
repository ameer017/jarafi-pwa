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



// import React, { useState, useEffect } from 'react';

// const TnxHistory = ({ isVisible, mockData, tokenTransactions }) => {
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'sent', 'received'

//   useEffect(() => {
//     if (tokenTransactions && mockData) {
//       // Create transaction history from token data
//       const processedTransactions = mockData.map(token => {
//         // Get transactions for this specific token
//         const tokenTxs = tokenTransactions[token.token_name] || [];
        
//         return tokenTxs.map(tx => ({
//           id: tx.hash || Date.now() + Math.random(),
//           address: tx.to || tx.from,
//           type: tx.to === token.address ? 'Payment Received' : 'Payment Sent',
//           amount: tx.value,
//           token: token.token_name,
//           tokenAmount: tx.value,
//           time: new Date(tx.timestamp * 1000).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//           }),
//           timestamp: tx.timestamp
//         }));
//       }).flat();

//       // Sort by timestamp (most recent first)
//       const sortedTransactions = processedTransactions.sort((a, b) => b.timestamp - a.timestamp);
      
//       // Apply filter
//       const filtered = selectedFilter === 'all' 
//         ? sortedTransactions 
//         : sortedTransactions.filter(tx => 
//             selectedFilter === 'sent' 
//               ? tx.type === 'Payment Sent' 
//               : tx.type === 'Payment Received'
//           );

//       setFilteredTransactions(filtered);
//     }
//   }, [mockData, tokenTransactions, selectedFilter]);

//   if (!isVisible) return null;

//   return (
//     <div className="w-full h-screen" style={{ overflow: 'scroll', '::-webkit-scrollbar': { display: 'none' } }}>
//       <div className="sticky top-0 bg-white border-b px-4 py-2 z-10">
//         <div className="flex gap-2">
//           {['all', 'sent', 'received'].map((filter) => (
//             <button
//               key={filter}
//               onClick={() => setSelectedFilter(filter)}
//               className={`px-3 py-1 rounded-full text-sm capitalize ${
//                 selectedFilter === filter
//                   ? 'bg-[#F2E205] text-[#0F0140]'
//                   : 'bg-gray-100 text-gray-600'
//               }`}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>
//       </div>

//       <main className="bg-white">
//         {filteredTransactions.length > 0 ? (
//           filteredTransactions.map((tx) => (
//             <div 
//               key={tx.id} 
//               className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <div className="text-[#4B5563] text-sm">
//                     {tx.address}
//                   </div>
//                   <div className="text-gray-500 text-xs">
//                     {tx.type}
//                   </div>
//                   <div className="text-gray-400 text-xs mt-1">
//                     {tx.time}
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className={`text-sm ${
//                     tx.type === 'Payment Sent' ? 'text-red-500' : 'text-green-500'
//                   }`}>
//                     {tx.type === 'Payment Sent' ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
//                   </div>
//                   <div className="text-gray-500 text-xs">
//                     {tx.tokenAmount} {tx.token}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             No transactions found
//           </div>
//         )}
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



import React, { useState } from 'react';

const TnxHistory = ({ isVisible, mockData }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const generateTransactions = () => {
    const currentTime = new Date();
    // Create multiple transactions for each token
    const allTransactions = mockData.flatMap((item, tokenIndex) => {
      // Create two transactions for each token (one sent, one received)
      return [
        // Sent transaction
        {
          id: `${item.id}-sent`,
          address: '0x72ou...7929',
          type: 'Payment Sent',
          amount: parseFloat(item.balance),
          token: item.token_name,
          tokenAmount: parseFloat(item.balance),
          time: new Date(currentTime - tokenIndex * 30 * 60000)
            .toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
        },
        // Received transaction
        {
          id: `${item.id}-received`,
          address: '0x89ou...4523',
          type: 'Payment Received',
          amount: parseFloat(item.balance) * 0.75, // Different amount for variety
          token: item.token_name,
          tokenAmount: parseFloat(item.balance) * 0.75,
          time: new Date(currentTime - (tokenIndex * 30 + 15) * 60000)
            .toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
        }
      ];
    }).sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort by time

    // Filter transactions based on selected filter
    if (selectedFilter === 'Send') {
      return allTransactions.filter(tx => tx.type === 'Payment Sent');
    } else if (selectedFilter === 'Receive') {
      return allTransactions.filter(tx => tx.type === 'Payment Received');
    }
    return allTransactions;
  };

  if (!isVisible || !mockData) return null;

  const transactions = generateTransactions();

  return (
    <div className="w-full h-screen" style={{ overflow: 'scroll', '::-webkit-scrollbar': { display: 'none' } }}>
      {/* Filter Buttons */}
      <div className="sticky top-0 bg-white border-b px-4 py-2 z-10">
        <div className="flex gap-2">
          {['All', 'Send', 'Receive'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedFilter === filter
                  ? 'bg-[#F2E205] text-[#0F0140] font-medium'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <main className="bg-white">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[#4B5563] text-sm">
                    {tx.address}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {tx.type}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {tx.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${
                    tx.type === 'Payment Sent' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {tx.type === 'Payment Sent' ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {tx.tokenAmount.toFixed(2)} {tx.token}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        )}
      </main>
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};

export default TnxHistory;