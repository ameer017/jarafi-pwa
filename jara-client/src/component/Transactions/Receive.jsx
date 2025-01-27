import { QRCodeSVG } from "qrcode.react";
import { Copy, Share } from "lucide-react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

const ReceiveAssets = () => {
  const {address} = useAccount();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    toast("Address copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wallet Address",
          text: ` ${address}`,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          await navigator.clipboard.writeText(address);
          toast("Address copied to clipboard!");
        }
      }
    } else {
      await navigator.clipboard.writeText(address);
      toast("Address copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0140] flex flex-col items-center justify-center font-montserrat text-[#F6F5F6]">
      <h1 className="text-2xl font-bold mb-[40px] ">Receive Assets</h1>

      <div className="bg-white rounded-[20px] w-[90%] max-w-[600px] h-[516px] p-[40px] flex flex-col items-center shadow-md space-y-6">
        {/* QR Code Section */}
        <div className="flex items-center justify-center w-[190px] h-[190px] mt-[40px] ">
          <QRCodeSVG
            value={address}
            size={190}
            bgColor="#FFFFFF"
            fgColor="#000000"
            className=" rounded-lg"
          />
        </div>

        <div className="w-full flex flex-col items-center space-y-4 ">
          <div className="flex gap-6 items-center mt-6">
            <div className="w-[192px] ">
              <p className="text-[10px] sm:text-[10px] text-[#0F0140] ">
                This address can only receive tokens on the Celo network.
              </p>
              <p className="text-[12px] font-[500] mt-2 text-gray-700 break-all">
                {address}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopy}
                className="w-[32px] h-[32px] bg-[#F2E205] rounded flex items-center justify-center hover:bg-[#F2E205]/90"
              >
                <Copy className="text-[#0F0140] w-[15px] h-[15px]" />
              </button>
              <button
                onClick={handleShare}
                className="w-[32px] h-[32px] bg-[#F2E205] rounded flex items-center justify-center hover:bg-[#F2E205]/90"
              >
                <Share className="text-[#0F0140] w-[15px] h-[15px]" />
              </button>
            </div>
          </div>
        </div>

        <p className="w-[293px] text-[12px] text-[#0F014080] ">
          This address can only be used to receive compatible tokens.
        </p>
      </div>
    </div>
  );
};

export default ReceiveAssets;
