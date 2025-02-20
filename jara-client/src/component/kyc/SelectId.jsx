
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const Verify = () => {
  const [selectedOption, setSelectedOption] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const options = ["Enter National ID number", "ID Card", "Passport", "Driver's license"]

  return (
    <div className="bg-[#F6F5F6] min-h-screen flex flex-col">
      <div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-start gap-[15px] w-[347px] h-[58px] ml-5 mt-[143px]">
            <h1 className="w-[235px] h-[29px] font-['Merriweather_Sans'] font-normal text-[24px] sm:text-[26px] leading-[120%] text-[#141414]">
            Select ID to verify
            </h1>
            <p className="w-[218px] h-[14px] font-['Montserrat'] font-normal text-[12px] sm:text-[14px] leading-[120%] text-[#6F6B6F]">
            You’ll be required to take a clear picture of the ID
            </p>
          </div>

          <div className="relative w-[347px] mt-12">
            <div
              className="w-full h-[65px] bg-white rounded-[10px] flex flex-row justify-between items-center p-5 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex flex-row items-center gap-[15px]">
                <span className=" font-semibold text-base text-[#6F6B6F] w-[213px] text-left">
                  {selectedOption || "ID Type"}
                </span>
              </div>
              <div className="flex justify-center items-center w-[25px] h-[25px] bg-[#F4F4F4] border-2 border-[#BDBDBD] rounded-[12.5px]">
                <ChevronDown className="w-4 h-4 text-[#BDBDBD]" />
              </div>
            </div>
            {isOpen && (
              <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-[10px] overflow-hidden shadow-md z-10">
                <div
                  className="flex flex-row justify-between items-start p-5 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedOption(options[0])
                    setIsOpen(false)
                  }}
                >
                  <span className=" font-semibold text-base text-[#6F6B6F] w-[213px] text-left">
                    {options[0]}
                  </span>
                  <div className="w-[25px] h-[25px] rounded-full border-2 border-[#BDBDBD] flex items-center justify-center">
                    {selectedOption === options[0] && <div className="w-[10px] h-[10px] bg-[#BDBDBD] rounded-full" />}
                  </div>
                </div>
                <div className="px-5 py-2">
                  <div className="w-full h-[1px] bg-gray-200 relative">
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500 text-sm">
                      OR
                    </span>
                  </div>
                </div>
                {options.slice(1).map((option) => (
                  <div
                    key={option}
                    className="flex flex-row justify-between items-start p-5 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedOption(option)
                      setIsOpen(false)
                    }}
                  >
                    <span className=" font-semibold text-base text-[#6F6B6F] w-[213px] text-left">
                      {option}
                    </span>
                    <div className="w-[25px] h-[25px] rounded-full border-2 border-[#BDBDBD] flex items-center justify-center">
                      {selectedOption === option && <div className="w-[10px] h-[10px] bg-[#BDBDBD] rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className={`w-[350px] h-[55px] flex flex-row justify-center items-center p-[10px] gap-[10px] bg-[#F2E205] rounded-[10px] font-semibold text-base leading-[120%] text-[#4F4E50] mt-[300px] opacity-[0.5] ${
    selectedOption ? "opacity-100" : "opacity-50"
  }`}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Verify

