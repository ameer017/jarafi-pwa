import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/main-screen");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="bg-[#0F0140] h-screen w-full p-4 flex items-center justify-center">
      <img
        src="/get-started.png"
        alt="Get Started"
        className="w-full max-w-md h-auto object-contain"
      />
    </div>
  );
};

export default GetStarted;
