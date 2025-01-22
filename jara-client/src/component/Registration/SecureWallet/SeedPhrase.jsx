import React from 'react';
import { IoCopyOutline } from "react-icons/io5";
import { MdOutlineInfo } from "react-icons/md";

const SeedPhrase = () => {
  return (
    <div className="min-h-screen bg-white p-5">
      <div className="max-w-md mx-auto">
        <h1 className="text-lg text-blue-600 text-center font-semibold">
          Your new SEED phrase is ready!
        </h1>
        
        <div className="flex flex-col items-center my-6">
          <div className="w-[309px] border border-gray-500 rounded-[10px] p-4">
            <p className="mb-2 text-xs text-gray-800">
              Generated SEED phrase
            </p>
            <p className="text-sm text-gray-800">
              Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem Vorem
            </p>
            <div className="h-8 w-8 bg-yellow-100 flex justify-center items-center p-1 mt-2 ml-auto">
              <IoCopyOutline size={15} className="text-black" />
            </div>
          </div>

          <div className="mt-8 mb-4 flex items-center space-x-2 self-start w-[243px]">
            <MdOutlineInfo size={24} className="text-gray-500" />
            <p className="text-gray-500">Don't lose this phrase!</p>
          </div>

          <div className="w-[309px] border border-gray-500 rounded-[10px] p-4">
            <p className="text-xs mb-1">
              Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et Korem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </p>
            <p className="text-xs mb-1">
              Nunc vulputate libero et velit interdum, ac aliquet odio
              mattis.Korem ipsum dolor sit amet, consectetur adipiscing elit.
              Korem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        <button className="w-full bg-yellow-100 py-3 rounded-[10px] text-gray-700 text-sm font-semibold mb-2">
          Back up on email
        </button>

        <button className="w-full bg-gray-100 py-3 rounded-[10px] text-gray-700 text-sm font-semibold border border-yellow-100">
          Skip
        </button>
      </div>
    </div>
  );
};

export default SeedPhrase;