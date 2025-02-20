import React from "react";
import { LuCreditCard, LuSettings2, LuWalletMinimal } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { RiTokenSwapLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";

const Settings = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const settings = [
    { id: 1, name: "Transaction History", link: "#" },
    { id: 2, name: "Card", link: "#" },
    { id: 3, name: "Edit Profile", link: "#" },
    { id: 4, name: "Enable Face ID/Fingerprint", link: "#" },
    { id: 5, name: "Recovery", link: "#" },
    { id: 6, name: "Backup/Exports", link: "#" },
    { id: 7, name: "Language", link: "#" },
  ];

  return (
    <section className="bg-[#0F0140] h-screen w-full flex justify-center px-4">
      <div className="flex flex-col w-full max-w-[400px] pt-6">
        <h1 className="text-white text-2xl sm:text-3xl font-medium text-center">
          Settings
        </h1>

        <div className="flex flex-col mt-8 space-y-5 w-full">
          {settings.map((setting) => (
            <Link
              key={setting.id}
              to={setting.link}
              className="flex justify-between items-center py-3 px-4 border-b-[1px] border-[#B0AFB1] hover:bg-[#2B1070] transition"
            >
              <p className="text-white text-[16px] sm:text-[18px]">
                {setting.name}
              </p>
              <IoIosArrowForward size={20} color="#FFF" />
            </Link>
          ))}
        </div>
      </div>

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
