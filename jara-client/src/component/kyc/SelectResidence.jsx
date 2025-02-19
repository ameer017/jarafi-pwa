import { ChevronDown } from "lucide-react";
import { useState } from "react";

const SelectResidence = () => {
  const [isOpen, setIsOpen] = useState(false);
  const countries = [
    {
      name: "Nigeria",
      flag: "ngn flag.png",
    },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  return (
    <div className="bg-[#F6F5F6] min-h-screen flex flex-col">
      <div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-start gap-[15px] w-[347px] h-[58px] ml-5 mt-[143px]">
            <h1 className="w-[235px] h-[29px] font-['Merriweather_Sans'] font-normal text-[24px] sm:text-[26px] leading-[120%] text-[#141414]">
              Country of residence
            </h1>
            <p className="w-[218px] h-[14px] font-['Montserrat'] font-normal text-[12px] sm:text-[14px] leading-[120%] text-[#6F6B6F]">
              Where do you live most of the time?
            </p>
          </div>

          <div>
            <div className="relative w-[347px] mx-auto mt-[50px]">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row justify-between items-center p-5 gap-[10px] h-[70px] bg-white rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-row items-center gap-[15px]">
                  <div className="w-[30px] h-[30px] rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedCountry.flag}
                      alt={`${selectedCountry.name} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-['Montserrat'] font-semibold text-[16px] leading-[120%] text-[#6F6B6F]">
                    {selectedCountry.name}
                  </span>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-black transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                  strokeWidth={2}
                />
              </div>

              {isOpen && (
                <div className="absolute w-full mt-2 bg-white rounded-[10px] shadow-lg py-2 z-10">
                  {countries.map((country) => (
                    <div
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-[15px] px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-[30px] h-[30px] rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                        <img
                          src={country.flag}
                          alt={`${country.name} flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-['Montserrat'] font-semibold text-[16px] leading-[120%] text-[#6F6B6F]">
                        {country.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <a href="/selectId">
              <button className=" w-[350px] h-[55px] flex flex-row justify-center items-center p-[10px] gap-[10px] bg-[#F2E205] rounded-[10px]  font-semibold text-base leading-[120%] text-[#4F4E50] mt-[180px]">
                Continue
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectResidence;
