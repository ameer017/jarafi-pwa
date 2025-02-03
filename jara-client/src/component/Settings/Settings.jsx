import React from "react";
import {
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
  LuArrowUpToLine,
} from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { RiTokenSwapLine } from "react-icons/ri";


const Settings = () => {
  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      Settings
      <footer className="fixed bottom-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t-[1px] border-[#B0AFB1]">
        <Link to="/dashboard">
          <LuWalletMinimal size={25} color="#B0AFB1" />
        </Link>
        <Link to="/p2p">
          <RiTokenSwapLine size={25} color="#B0AFB1" />
        </Link>
        <LuCreditCard size={25} color="#B0AFB1" />

        <Link to="/settings">
          <LuSettings2 size={25} color="#B0AFB1" />
        </Link>
      </footer>
    </section>
  );
};

export default Settings;
