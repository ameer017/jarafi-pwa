import React, { useState } from 'react';

const Send = () => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const availableTokens = [
    { symbol: 'USDT' },
    { symbol: 'ETH' },
    { symbol: 'USDC' }
  ];

  const TokenModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-[#110F24] w-full max-w-md rounded-2xl">
          <div className="p-6 border-b border-[#2D2B54]">
            <h2 className="text-white text-xl font-medium">Select Token</h2>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {availableTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className="w-full bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4 mb-3 text-left hover:bg-[#231f42] transition-colors"
              >
                <span className="text-white">{token.symbol}</span>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-[#2D2B54]">
            <button
              onClick={onClose}
              className="w-full bg-[#FFDE00] rounded-xl py-4 text-black font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const QuickAmountButton = ({ label }) => (
    <button className="flex-1 py-3 bg-[#1A1831] border border-[#2D2B54] rounded-xl hover:bg-[#231f42] transition-colors">
      <span className="text-white text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0F0140] flex items-center justify-center">
      <div className="max-w-xl w-full mx-6">
        <div className="space-y-6">
          {/* Network Selection */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Select network
            </label>
            <button className="w-full text-left text-white bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4">
              Celo
            </button>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Enter wallet address or phone number
            </label>
            <input
              type="text"
              placeholder="+234 702-606-7432"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-4 bg-[#1A1831] border border-[#2D2B54] rounded-xl text-white placeholder-gray-500"
            />
          </div>

          {/* Token Selection */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Token
            </label>
            <button
              onClick={() => setIsTokenModalOpen(true)}
              className="w-full text-left text-white bg-[#1A1831] border border-[#2D2B54] rounded-xl p-4"
            >
              {selectedToken ? selectedToken.symbol : "USDT"}
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-[#1A1831] border border-[#2D2B54] rounded-xl text-white placeholder-gray-500"
            />
            <div className="text-right mt-2">
              <span className="text-gray-400 text-sm">
                Avail bal: 1500
              </span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2">
            {["25%", "50%", "75%", "MAX"].map((label) => (
              <QuickAmountButton key={label} label={label} />
            ))}
          </div>

          {/* Continue Button */}
          <div className="mt-8 mb-6">
            <button className="w-full py-4 rounded-xl bg-[#FFDE00] text-black font-medium">
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSelect={setSelectedToken}
      />
    </div>
  );
};

export default Send;