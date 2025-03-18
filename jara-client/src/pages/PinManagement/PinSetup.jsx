import { useState } from "react";
import { setPIN } from "../../constant/usePinStore";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const PinSetup = () => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { address } = useAccount();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    try {
      await setPIN(address, pin);
      setSuccess(true);
      setError("");
      setPin("");
      setConfirmPin("");
      navigate("/dashboard");
    } catch (error) {
      setError("Error saving PIN");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0140] flex items-center justify-center p-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 text-white"
      >
        <FaArrowLeftLong size={25} />
      </button>
      <div className=" p-6 rounded-lg shadow-md text-white">
        <h2 className="text-lg font-bold mb-4 text-center">
          Set Your Transaction PIN
        </h2>
        {address && (
          <p className="text-sm  text-center my-6">Wallet: {address}</p>
        )}

        <input
          type="password"
          maxLength="4"
          className="w-full p-2 border rounded mb-2 text-center bg-transparent  outline-none "
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <input
          type="password"
          maxLength="4"
          className="w-full p-2 border rounded mb-2 text-center bg-transparent my-4 outline-none  "
          placeholder="Confirm PIN"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">
            PIN set successfully!
          </p>
        )}

        <button
          className="w-full bg-[#F2E205] text-[#0F0140] py-2 mt-3 rounded"
          onClick={handleConfirm}
        >
          Set PIN
        </button>
      </div>
    </div>
  );
};

export default PinSetup;
