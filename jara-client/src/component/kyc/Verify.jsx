import React from "react";




const Verify = () => {
  return (
    <div className="bg-[#D0D6FF80] min-h-screen flex flex-col">
     <div>
     <div className="bg-[#0F0140] w-full h-[119px] flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">My Card</h2>
      </div>
   <div className="flex flex-col items-center justify-center">
   <div className="flex flex-col items-center justify-center mt-[120px] gap-10">
      <img
        src="/verify.png"
         alt="Logo"
         className="h-[122px] w-[122px]"
          />
        <h4 className="font-['Merriweather Sans'] font-bold text-[24px] leading-[28.8px] text-center text-[#262526] w-">Now, lets verify your photo ID</h4>
      </div>
      <div>
      <div className="w-[228px] sm:w-[300px] h-[42px] mx-auto mt-12 text-center text-[12px] sm:text-[14px] leading-[120%] text-[#6F6B6F] font-normal font-['Montserrat']">
  <p>This will establish your identity, and prevents someone else from claiming your account</p>
</div>

      <a href="/getVerified">
      <button className=" w-[350px] h-[55px] flex flex-row justify-center items-center p-[10px] gap-[10px] bg-[#F2E205] rounded-[10px]  font-semibold text-base leading-[120%] text-[#4F4E50] mt-6">
        Continue
      </button>
      </a>
   </div>
      </div>
     </div>
    </div>
  );
};

export default Verify;
