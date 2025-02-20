import React, { useState } from 'react';
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const TnxHistory = ({ mockData, tokenTransactions, isVisible }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  if (!isVisible) return null;

  const formatValue = (value, decimals = 18) => {
    if (!value || !decimals) return '0.000';
    
    // Convert from wei to token amount
    const divisor = Math.pow(10, Number(decimals));
    const convertedValue = Number(value) / divisor;
    
    return isNaN(convertedValue) ? '0.000' : convertedValue.toFixed(3);
  };

  const TransactionIcon = ({ type }) => (
    type === 'Sent' || type === 'Payment Sent'
      ? <CircleArrowUp className="w-4 h-4 text-red-500" />
      : <CircleArrowDown className="w-4 h-4 text-green-500" />
  );

  const groupTransactionsByDate = () => {
    const grouped = {};
    
    if (!Array.isArray(tokenTransactions)) return grouped;

    tokenTransactions.forEach(tx => {
      const date = new Date(tx.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(tx);
    });

    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="w-full flex flex-col">

      <div className="overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date} className="border-b border-gray-100">
            <div className="px-4 py-2 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-500">{date}</h3>
            </div>

            {transactions.map((tx, index) => (
              <div 
                key={`${date}-${index}`}
                className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTransaction(tx)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="text-gray-700 text-sm font-medium flex items-center gap-2">
                      {mockData.find(item => item.token_name === tx.tokenSymbol)?.icon && (
                        <img
                          src={mockData.find(item => item.token_name === tx.tokenSymbol)?.icon}
                          className="w-[20px] h-[20px] rounded-full"
                          alt={tx.tokenSymbol}
                        />
                      )}
                      {tx.tokenSymbol}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <TransactionIcon type={tx.transactionType} />
                      <span>{tx.transactionType}</span>
                    </div>
                    
                    <div className="text-gray-400 text-xs">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={
                      `text-sm font-medium ${tx.transactionType.includes('Sent') ? 'text-red-500' : 'text-green-500'}`
                    }>
                      {tx.transactionType.includes('Sent') ? '-' : '+'}
                      {formatValue(tx.value, tx.tokenDecimal)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {tx.tokenSymbol}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {Object.keys(groupedTransactions).length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No transactions found
          </div>
        )}
      </div>

      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-y-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );

}
export default TnxHistory;
