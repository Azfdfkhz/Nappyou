import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Image, User } from "lucide-react";
import { motion } from "framer-motion";

// 🔹 Warna tema dari Profile
const themeColors = {
  blue: { glow: "rgba(59,130,246,0.6)", base: "#3883faff" },
  orange: { glow: "rgba(255,152,80,0.6)", base: "#fc832cff" },
  pink: { glow: "rgba(229,139,183,0.6)", base: "#ee8bbbff" },
  green: { glow: "rgba(131,197,163,0.6)", base: "#6ae7a6ff" },
  purple: { glow: "rgba(167,155,255,0.6)", base: "#A79BFF" },
};

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTheme, setActiveTheme] = useState("blue");
  const [bottomOffset, setBottomOffset] = useState(60); // default 60px

  // 🔹 Ambil tema aktif dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themeColors[savedTheme]) {
      setActiveTheme(savedTheme);
    }
  }, []);

  // 🔹 Update bottom offset responsif saat ukuran layar berubah
  useEffect(() => {
    const updateOffset = () => {
      const screenHeight = window.innerHeight;

      // semakin kecil layar, semakin tinggi navbar agar tidak terlalu bawah
      if (screenHeight < 700) setBottomOffset(80);
      else if (screenHeight < 900) setBottomOffset(70);
      else setBottomOffset(60);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  const { glow, base } = themeColors[activeTheme];

  const items = [
    { id: "home", icon: <Home size={20} strokeWidth={2} />, path: "/home" },
    { id: "gallery", icon: <Image size={20} strokeWidth={2} />, path: "/gallery" },
    { id: "profile", icon: <User size={20} strokeWidth={2} />, path: "/profile" },
  ];

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-1/2 -translate-x-1/2 z-50 flex justify-around items-center
                 backdrop-blur-2xl bg-white/15 border border-white/25 shadow-[0_8px_32px_rgba(31,38,135,0.25)]"
      style={{
        width: "270px",
        height: "52px",
        borderRadius: "40px",
        bottom: `${bottomOffset}px`, // responsive offset
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.button
            key={item.id}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              isActive
                ? "text-white"
                : "text-gray-800 hover:text-gray-900 hover:bg-white/15"
            }`}
            style={{
              background: isActive
                ? `linear-gradient(145deg, ${base}33, ${glow}44)`
                : "transparent",
              boxShadow: isActive
                ? `0 0 12px ${glow}, 0 0 3px ${base}, inset 0 1px 1px rgba(255,255,255,0.2)`
                : "none",
            }}
          >
            {item.icon}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
