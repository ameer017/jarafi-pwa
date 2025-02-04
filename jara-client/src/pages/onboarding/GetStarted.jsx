import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GetStarted = () => {
  const navigate = useNavigate();
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = () => {
    setTimeout(() => {
      navigate("/main-screen");
    }, 1000);
  };

  return (
    <div className="bg-[#0F0140] h-screen w-full p-4 flex items-center justify-center relative">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1, x: 0, y: 0 }}
        animate={startAnimation ? { opacity: 0, x: -500, y: -500 } : {}}
        transition={{ duration: 6, ease: "easeIn" }}
        onAnimationComplete={handleNavigate}
      >
        <img
          src="/firstpageup.png"
          alt="Background Top Left"
          className="absolute top-40 md:left-[32rem] left-[20rem] w-[100px]"
        />
        <img
          src="/firstpageup.png"
          alt="Background Bottom Right"
          className="absolute bottom-40 md:right-[32rem] right-[20rem] w-[100px]"
        />
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-4 z-10"
        initial={{ opacity: 1, x: 0, y: 0 }}
        animate={startAnimation ? { opacity: 0, x: -500, y: -500 } : {}}
        transition={{ duration: 6, ease: "easeIn" }}
      >
        <img
          src="/jarafi-yellow.png"
          alt="ChatBot"
          className="w-[168px] h-[244px]"
        />
        <h1 className="text-white text-2xl font-semibold mb-4">JARAFI</h1>
      </motion.div>
    </div>
  );
};

export default GetStarted;
