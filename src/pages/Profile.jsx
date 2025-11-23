import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Volume2, Music, Bell, Settings } from "lucide-react";
import BottomNavbar from "../components/BottomNavbar";
import SoundSettings from "../components/SoundSettings"; 

const themes = {
  blue: "from-[#294684] to-[#C1D4E2]",
  orange: "from-[#FF9B6A] to-[#FFE1B6]",
  pink: "from-[#E58BB7] to-[#FDD6E8]",
  green: "from-[#83C5A3] to-[#D4F1CB]",
  purple: "from-[#A79BFF] to-[#D8D2FF]",
};

export default function Profile() {
  const [activeTheme, setActiveTheme] = useState("blue");
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [soundInfo, setSoundInfo] = useState("Default Sound");
  const username = localStorage.getItem("username") || "Username";
  const photo = localStorage.getItem("photoURL") || "";

  // 🔹 Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setActiveTheme(savedTheme);
    }
    loadSoundInfo();
  }, []);

  // 🔹 Load sound info
  const loadSoundInfo = () => {
    if (window.Android) {
      window.Android.getSoundInfo();
    }
  };

  // 🔹 Setup Android callbacks
  useEffect(() => {
    // Sound info callback
    window.onSoundInfo = (info) => {
      setSoundInfo(info);
    };

    // Sound selected callback
    window.onSoundSelected = (soundUri) => {
      console.log("Sound selected:", soundUri);
      // Reload sound info setelah dipilih
      setTimeout(() => {
        loadSoundInfo();
      }, 1000);
    };

    // Sound reset callback
    window.onSoundReset = () => {
      setSoundInfo("Default Sound");
    };

    // Cleanup
    return () => {
      delete window.onSoundInfo;
      delete window.onSoundSelected;
      delete window.onSoundReset;
    };
  }, []);

  // 🔹 Save theme
  const handleThemeChange = (color) => {
    setActiveTheme(color);
    localStorage.setItem("theme", color);
  };

  // 🔹 Open sound settings
  const openSoundSettings = () => {
    setShowSoundSettings(true);
  };

  // 🔹 Card items data
  const cardItems = [
    {
      id: 1,
      icon: <Volume2 size={20} className="text-blue-600" />,
      title: "Sound Settings",
      description: soundInfo,
      action: openSoundSettings,
      color: "from-blue-100 to-blue-200",
      borderColor: "border-blue-200"
    },
    {
      id: 2,
      icon: <Bell size={20} className="text-green-600" />,
      title: "Notification",
      description: "Manage your notifications",
      action: () => console.log("Notification settings"),
      color: "from-green-100 to-green-200",
      borderColor: "border-green-200"
    },
    {
      id: 3,
      icon: <Settings size={20} className="text-purple-600" />,
      title: "App Settings",
      description: "General app preferences",
      action: () => console.log("App settings"),
      color: "from-purple-100 to-purple-200",
      borderColor: "border-purple-200"
    },
    {
      id: 4,
      icon: <Music size={20} className="text-orange-600" />,
      title: "Alarm Preferences",
      description: "Customize alarm behavior",
      action: () => console.log("Alarm preferences"),
      color: "from-orange-100 to-orange-200",
      borderColor: "border-orange-200"
    }
  ];

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
        {cardItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className={`w-full p-4 rounded-2xl bg-gradient-to-r ${item.color} backdrop-blur-md border ${item.borderColor} shadow-sm cursor-pointer hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/80 rounded-lg">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-semibold text-sm">
                    {item.title}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {item.description}
                  </span>
                </div>
              </div>
              <div className="text-gray-400 text-xs">
                {item.id === 1 && (
                  <div className={`px-2 py-1 rounded-full ${
                    soundInfo.includes("Custom") 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {soundInfo.includes("Custom") ? "Custom" : "Default"}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sound Settings Modal */}
      {showSoundSettings && (
        <SoundSettings onClose={() => setShowSoundSettings(false)} />
      )}

      <BottomNavbar />
    </div>
  );
}
