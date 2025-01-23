import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share } from "lucide-react"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

const ReceiveAssets = () => {
  const address = "0xadfib834qefbbwufs5jdkff9w834suwu93";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    toast("Address copied to clipboard!")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wallet Address",
          text:` My Celo wallet address: ${address}`,
        })
      } catch (error) {
        if (error.name !== "AbortError") {
          await navigator.clipboard.writeText(address)
          toast("Address copied to clipboard!")
        }
      }
    } else {
      await navigator.clipboard.writeText(address)
      toast("Address copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0140] flex flex-col items-center justify-center relative font-montserrat">
         
        <h1 className="absolute top-20 text-2xl font-bold text-[#F6F5F6]">
          Receive assets
        </h1>
     
      
      <div className="absolute w-[350px] h-[265px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px] left-1/2 -translate-x-1/2 top-[191px] sm:top-1/2 sm:-translate-y-1/2 sm:mt-[30px] md:mt-[46.5px] bg-white rounded-[10px] sm:rounded-[20px] md:rounded-[30px]">
        
        <div className="absolute w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[190px] md:h-[190px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:-mt-[60px] md:-mt-[62px]">
          <QRCodeSVG
            value={address}
            size={190}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="L"
            className="border border-black w-full h-full"
            includeMargin={false}
          />
        </div>

       
        <div className="absolute w-[350px] h-[137px] sm:w-[400px] md:w-[325px] sm:h-auto left-1/2 -translate-x-1/2 top-[273px] sm:top-auto sm:bottom-[50px] md:bottom-[70px] bg-white sm:bg-transparent border border-[#262526] sm:border-none rounded-[10px] sm:rounded-none">
          <div className="absolute w-[325px] sm:w-[375px] md:w-full h-[113px] sm:h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:static sm:translate-x-0 sm:translate-y-0 flex flex-wrap items-start content-start gap-y-[30px] gap-x-[65px]">
           
            <div className="flex flex-col items-start gap-[10px] w-[192px]">
              <p className="text-[10px] sm:text-[11px] leading-[120%] flex items-center text-[#0F0140]/75 w-full">
                This address can only receive tokens on Celo network.
              </p>
              <p className="text-[12px] sm:text-[13px] leading-[120%] font-medium flex items-center text-[#0F0140]/75 w-full break-all">
                {address}
              </p>
            </div>

           
            <div className="flex gap-1">
              <button
                onClick={handleCopy}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 bg-[#F2E205] rounded flex items-center justify-center hover:bg-[#F2E205]/90"
              >
                <Copy className="w-[15px] h-[15px] sm:w-[16px] sm:h-[16px] md:w-[15px] md:h-[15px] text-[#0F0140]" />
              </button>
              <button
                onClick={handleShare}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 bg-[#F2E205] rounded flex items-center justify-center hover:bg-[#F2E205]/90"
              >
                <Share className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] md:w-[18px] md:h-[18px] text-[#0F0140]" />
              </button>
            </div>

           
            <p className="text-xs sm:text-[13px] md:text-xs font-semibold text-[#0F0140]/50 w-[259px] sm:w-[300px] md:w-[259px] leading-[120%] flex items-center opacity-75">
              This address can only be used to receive compatible tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceiveAssets