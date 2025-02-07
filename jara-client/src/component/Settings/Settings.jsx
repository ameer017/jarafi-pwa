import React from "react";
import {
  LuCreditCard,
  LuSettings2,
  LuWalletMinimal,
  LuArrowUpToLine,
} from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiTokenSwapLine } from "react-icons/ri";

const Settings = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <section className="bg-[#0F0140] h-screen w-full overflow-x-hidden">
      Settings
      <footer className="fixed bottom-0 bg-white p-6 w-full h-[90px] flex items-center justify-evenly border-t-[1px] border-[#B0AFB1]">
        <Link to="/dashboard">
          <LuWalletMinimal
            size={25}
            color={isActive("/dashboard") ? "#0F0140" : "#B0AFB1"}
          />
        </Link>
        <Link to="/p2p">
          <RiTokenSwapLine
            size={25}
            color={isActive("/p2p") ? "#0F0140" : "#B0AFB1"}
          />
        </Link>
        <Link to="/card-display">
          <LuCreditCard
            size={25}
            color={isActive("/card-display") ? "#0F0140" : "#B0AFB1"}
          />
        </Link>
        <Link to="/settings">
          <LuSettings2
            size={25}
            color={isActive("/settings") ? "#0F0140" : "#B0AFB1"}
          />
        </Link>
      </footer>
    </section>
  );
};

export default Settings;
