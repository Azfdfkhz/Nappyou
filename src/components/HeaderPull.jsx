import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Lottie from "lottie-react";

import catSleep from "../assets/cat-sleep.json";
import catLaugh from "../assets/cat-laugh.json";
import catLove from "../assets/cat-love.json";

// Warna tema sama seperti Profile & Navbar
const themes = {
  blue: { top: "from-[#1E2F57] to-[#2E4A76]", body: "from-[#4C6EA8] to-[#A8C4E8]" },
  orange: { top: "from-[#C56730] to-[#ECA25B]", body: "from-[#FFB37A] to-[#FFE1B6]" },
  pink: { top: "from-[#B34E7E] to-[#E58BB7]", body: "from-[#F6A9C7] to-[#FDD6E8]" },
  green: { top: "from-[#357C61] to-[#83C5A3]", body: "from-[#A8E3C5] to-[#D4F1CB]" },
  purple: { top: "from-[#6150C2] to-[#A79BFF]", body: "from-[#B6A9FF] to-[#D8D2FF]" },
};

export default function HeaderPull({ onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState(catSleep);
  const [catText, setCatText] = useState("Zzz... 💤");
  const [vibrate, setVibrate] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [activeTheme, setActiveTheme] = useState("blue");
  const y = useMotionValue(0);
  const timeoutRef = useRef(null);

  // Ambil tema aktif dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setActiveTheme(savedTheme);
    }
  }, []);

  // Auto reset tidur
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setAnimation(catSleep);
      setCatText("Zzz... ngantuk anjay");
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const resetToSleep = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAnimation(catSleep);
      setCatText("Zzz... 💤");
      setVibrate(false);
    }, 5000);
  };

  const handleTap = () => {
    setAnimation(catLaugh);
    setCatText("Hihihi 😹");
    setVibrate(false);
    resetToSleep();
  };

  const handleDragCat = () => {
    setAnimation(catLove);
    setCatText("Prrr~ ❤️");
    setVibrate(true);

    const id = Math.random().toString(36);
    setBubbles((prev) => [
      ...prev,
      { id, x: Math.random() * 80 - 40, size: Math.random() * 18 + 10 },
    ]);

    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 1500);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVibrate(false);
      resetToSleep();
    }, 1500);
  };

  const toggleOpen = (value) => {
    setIsOpen(value);
    if (typeof onOpenChange === "function") onOpenChange(value);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 60) toggleOpen(true);
    else if (info.offset.y < -60) toggleOpen(false);
    animate(y, 0, { duration: 0.25, ease: "easeOut" });
  };

  return (
    <div className="flex flex-col items-center w-full mt-6 select-none relative">
      {/* Header atas */}
      <div
        className={`w-[calc(100vw-60px)] max-w-[430px] rounded-t-[28px] flex justify-between items-center px-6 py-3 shadow-md border border-white/20 bg-gradient-to-r ${themes[activeTheme].top}`}
      >
        <div className="w-10 h-10 bg-white/60 rounded-full"></div>
        <span className="text-white font-semibold tracking-wide text-lg">
          Nappyyou
        </span>
      </div>

      {/* Konten Pull */}
      <motion.div
        animate={{
          height: isOpen ? "260px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`overflow-hidden w-[calc(100vw-60px)] max-w-[430px] border-x border-white/20 flex flex-col items-center relative bg-gradient-to-b ${themes[activeTheme].body}`}
      >
        {isOpen && (
          <motion.div
            initial={{ scaleY: 0.95 }}
            animate={{ scaleY: [1, 1.03, 1] }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center py-4 relative"
          >
            <span className="text-sm font-semibold mb-2 text-white/90">
              DongDong
            </span>

            {/* 🐱 Kucing */}
            <motion.div
              animate={
                vibrate
                  ? {
                      rotate: [0, 1.5, -1.5, 1.5, 0],
                      transition: {
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 0.15,
                      },
                    }
                  : { rotate: 0 }
              }
              className="w-[160px] h-[160px] active:scale-95 transition-transform relative"
              onClick={handleTap}
              onTouchStart={handleTap}
              onTouchMove={handleDragCat}
              onMouseMove={handleDragCat}
            >
              <Lottie
                animationData={animation}
                loop={true}
                renderer="canvas"
                style={{ width: "100%", height: "100%", willChange: "transform" }}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid meet",
                  progressiveLoad: true,
                }}
              />

              {/* Bubble love 🤍 */}
              {bubbles.map((b) => (
                <motion.span
                  key={b.id}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: [1, 1, 0],
                    y: [-10, -60 - Math.random() * 30],
                    scale: [1, 1.2],
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute text-pink-400"
                  style={{
                    left: `calc(50% + ${b.x}px)`,
                    bottom: "40px",
                    fontSize: `${b.size}px`,
                  }}
                >
                  🤍
                </motion.span>
              ))}
            </motion.div>

            <motion.span
              key={catText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-white/80 mt-1"
            >
              {catText}
            </motion.span>
          </motion.div>
        )}
      </motion.div>

      {/* Handle tarik */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 180 }}
        onDragEnd={handleDragEnd}
        style={{ y }}
        onClick={() => toggleOpen(!isOpen)}
        animate={{ scaleY: isOpen ? [1, 1.05, 1] : [1, 0.98, 1] }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`relative w-[calc(100vw-60px)] max-w-[430px] text-center text-white py-4 rounded-b-[28px] border border-white/20 shadow-inner cursor-grab active:cursor-grabbing -mt-[1px] bg-gradient-to-r ${themes[activeTheme].top}`}
      >
        {isOpen ? "Tutup" : "Tarik"}
        <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-transparent border-t-white/80"></div>
      </motion.div>
    </div>
  );
}
