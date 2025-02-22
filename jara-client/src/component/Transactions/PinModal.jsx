import { useState } from "react";

const PinModal = ({ onConfirm, onClose }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    setError("");
    onConfirm(pin);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Enter Your PIN</h2>

        <input
          type="password"
          maxLength="4"
          className="w-full p-2 border rounded mb-2 text-center"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          className="w-full bg-blue-500 text-white py-2 mt-3 rounded"
          onClick={handleConfirm}
        >
          Confirm
        </button>
        <button
          className="w-full bg-gray-300 text-black py-2 mt-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PinModal;
