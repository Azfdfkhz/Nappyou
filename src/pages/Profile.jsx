import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import BottomNavbar from "../components/BottomNavbar";

const themes = {
  blue: "from-[#294684] to-[#C1D4E2]",
  orange: "from-[#FF9B6A] to-[#FFE1B6]",
  pink: "from-[#E58BB7] to-[#FDD6E8]",
  green: "from-[#83C5A3] to-[#D4F1CB]",
  purple: "from-[#A79BFF] to-[#D8D2FF]",
};

export default function Profile() {
  const [activeTheme, setActiveTheme] = useState("blue");
  const username = localStorage.getItem("username") || "Username";
  const photo = localStorage.getItem("photoURL") || "";

  // 🔹 Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setActiveTheme(savedTheme);
    }
  }, []);

  // 🔹 Save theme
  const handleThemeChange = (color) => {
    setActiveTheme(color);
    localStorage.setItem("theme", color);
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col items-center justify-start 
                  bg-gradient-to-b ${themes[activeTheme]} 
                  transition-all duration-700 font-[Poppins] p-5 overflow-hidden`}
    >
      {/* 🎨 Theme Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex gap-3 mt-8 bg-white/25 backdrop-blur-xl px-5 py-3 rounded-full border border-white/40 shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
      >
        {Object.keys(themes).map((color) => (
          <motion.button
            key={color}
            onClick={() => handleThemeChange(color)}
            whileTap={{ scale: 0.85 }}
            className={`relative w-8 h-8 rounded-full transition-all duration-300 cursor-pointer 
              ${activeTheme === color ? "scale-110 shadow-[0_0_10px_rgba(255,255,255,0.9)]" : "hover:scale-105"}`}
            style={{
              background: `linear-gradient(to bottom right, ${
                themes[color].match(/#([0-9A-Fa-f]{6})/g)?.join(", ") || "#ccc,#999"
              })`,
              border: activeTheme === color ? "2px solid white" : "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {activeTheme === color && (
              <motion.span
                layoutId="selectedRing"
                className="absolute inset-0 rounded-full border-[3px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.9)]"
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* 👤 Username Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8 w-[90%] max-w-[380px] rounded-2xl bg-white/25 backdrop-blur-lg border border-white/30 shadow-md flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/60 rounded-full overflow-hidden">
            {photo ? (
              <img src={photo} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                👤
              </div>
            )}
          </div>
          <span className="text-gray-900 font-semibold text-sm sm:text-base">
            {username}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-white/40 hover:bg-white/60 p-2 rounded-lg text-gray-700 shadow-sm"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <LogOut size={18} />
        </motion.button>
      </motion.div>

      {/* 🔹 Card List */}
      <div className="mt-6 w-[90%] max-w-[380px] flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="w-full h-12 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 shadow-sm"
          />
        ))}
      </div>
      <BottomNavbar />
    </div>
  );
}
