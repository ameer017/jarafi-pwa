import React from "react";
import { Zap, ShoppingCart, Lock } from 'lucide-react';





const RequestCard = () => {

  return (
    <div className="bg-[#D0D6FF80] min-h-screen flex flex-col">
     <div>
     <div className="bg-[#0F0140] w-full h-[119px] flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">My Card</h2>
      </div>
   <div className="flex flex-col items-center justify-center">
   <div className="flex flex-col items-center justify-center mt-[80px] gap-10">
      <img
        src="/JaraFiLogin.png"
         alt="Logo"
         className="w-[183px] h-[53px]"
          />
        <h4 className="font-['Merriweather Sans'] font-bold text-[24px] leading-[28.8px] text-center text-[#262526] w-">Spend your money anywhere</h4>
      </div>
      <div>
        <div className="w-[350px] h-[185px] box-border flex flex-col justify-center items-start   p-[30px_50px] gap-5 border border-dashed border-[rgba(112,112,112,0.3)] rounded-[10px] mt-12">
          <h6 className="text-xl  font-semibold">Features for you</h6>
          <div>
            <div className="space-y-2 text-left text-[#6F6B6F] text-[12px] sm:text-sm">
            <div className="flex items-center gap-2">
                <div className="flex justify-center items-center w-[22px] h-[22px] bg-white rounded-[11px] p-[4.05263px]">
                  <Zap size={14} color="#F2E205" />
                </div>
                <p>Fast and affordable funding</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex justify-center items-center w-[22px] h-[22px] bg-white rounded-[11px] p-[4.05263px]">
                  <ShoppingCart size={14} color="#6E53CB" />
                </div>
                <p>Accepted globally, online</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex justify-center items-center w-[22px] h-[22px] bg-white rounded-[11px] p-[4.05263px]">
                  <Lock size={14} color="black" />
                </div>
                <p>Card control for maximum security</p>
              </div>
            </div>
          </div>
        </div>

      <a href="/verify">
      <button className=" w-[350px] h-[55px] flex flex-row justify-center items-center p-[10px] gap-[10px] bg-[#F2E205] rounded-[10px] font-['Montserrat'] font-semibold text-base leading-[120%] text-[#4F4E50] mt-6">
        Request for a card
      </button>
      </a>
   </div>
      </div>
     </div>
    </div>
  );
};

export default RequestCard;
