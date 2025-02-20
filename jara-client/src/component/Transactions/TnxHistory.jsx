import React from "react";
import { format } from "date-fns";

const TnxHistory = ({ isVisible, mockData, tokenTransactions }) => {
  if (!isVisible) return null;

  const renderTransactions = () => {
    const allTransactions = [];

    Object.entries(tokenTransactions).forEach(([tokenName, transactions]) => {
      transactions.forEach((tx) => {
        allTransactions.push({
          ...tx,
          tokenName,
        });
      });
    });

    // console.log(allTransactions)
    return allTransactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((tx, index) => {
        const token = mockData.find((t) => t.token_name === tx.token);
        const isReceived = tx.type === "Payment Received";
        // Convert tx.value to a floating point number with 2 decimals
        const displayValue = parseFloat(tx.value).toFixed(2);

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
                    {format(tx.timestamp, "MMM dd, yyyy HH:mm")}
                  </span>
                  <span className="text-xs text-gray-500 truncate w-32">
                    {isReceived ? `From: ${tx.from}` : `To: ${tx.to}`}
                  </span>
                </div>
              </div>
            </td>
            <td className="p-4 border-b text-right">
              <div className="flex flex-col items-end">
                <span
                  className={`text-sm font-medium ${
                    isReceived ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isReceived ? "+" : "-"}
                  {displayValue} {tx.token}
                </span>
              </div>
            </td>
          </tr>
        );
      });
  };

  return (
    <table className="w-full">
      <tbody>{renderTransactions()}</tbody>
    </table>
  );
};

export default TnxHistory;
