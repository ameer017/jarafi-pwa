import React, { useState } from "react";
import { ChevronRight, X } from "lucide-react";

// FundWithBalance Component
const FundWithBalance = ({ onClose, onAssetSelected }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full h-full">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-semibold">Fund with Wallet Balance</h2>
      <p className="mt-4 text-sm text-gray-600">
        Here you can fund your account using the available balance in your
        wallet.
      </p>
    </div>
  );
};

// FundWithExternal Component
const FundWithExternal = ({ onClose, onAssetSelected }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full h-full">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-semibold">Fund with External Wallet</h2>
      <p className="mt-4 text-sm text-gray-600">
        Here you can fund your account from an external wallet by transferring
        funds.
      </p>
    </div>
  );
};

export { FundWithBalance, FundWithExternal };
