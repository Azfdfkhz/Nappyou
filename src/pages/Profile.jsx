import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Volume2, Music, Bell, Settings, Images, Plus, Heart } from "lucide-react";
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
  const [galleryImages, setGalleryImages] = useState([]);
  const username = localStorage.getItem("username") || "Username";
  const photo = localStorage.getItem("photoURL") || "";

  // 🔹 Load theme, sound info, dan gallery images dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setActiveTheme(savedTheme);
    }
    
    const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
    setGalleryImages(savedImages);
    
    loadSoundInfo();
    
    // Setup listener untuk menerima gambar dari Android
    if (window.Android) {
      window.onImageSelected = (imageUri) => {
        if (imageUri) {
          addImageToGallery(imageUri);
        }
      };
    }
  }, []);

  // 🔹 Load sound info
  const loadSoundInfo = () => {
    if (window.Android) {
      window.Android.getSoundInfo();
    }
  };

  // 🔹 Setup Android callbacks
  useEffect(() => {
    window.onSoundInfo = (info) => {
      setSoundInfo(info);
    };

    window.onSoundSelected = (soundUri) => {
      console.log("Sound selected:", soundUri);
      setTimeout(() => {
        loadSoundInfo();
      }, 1000);
    };

    window.onSoundReset = () => {
      setSoundInfo("Default Sound");
    };

    return () => {
      delete window.onSoundInfo;
      delete window.onSoundSelected;
      delete window.onSoundReset;
      delete window.onImageSelected;
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

  // 🔹 Add image to gallery dari URI yang diberikan
  const addImageToGallery = (imageUri = null) => {
    if (imageUri) {
      // Jika ada URI yang diberikan (dari Android)
      const updatedImages = [...galleryImages, imageUri];
      setGalleryImages(updatedImages);
      localStorage.setItem("galleryImages", JSON.stringify(updatedImages));
    } else {
      // Buka image picker Android
      if (window.Android && window.Android.openImagePicker) {
        window.Android.openImagePicker();
      } else {
        // Fallback untuk development (buka input file)
        openFilePicker();
      }
    }
  };

  // 🔹 Fallback file picker untuk development
  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageDataUrl = event.target.result;
          const updatedImages = [...galleryImages, imageDataUrl];
          setGalleryImages(updatedImages);
          localStorage.setItem("galleryImages", JSON.stringify(updatedImages));
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  // 🔹 Remove image from gallery
  const removeImageFromGallery = (index) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
    localStorage.setItem("galleryImages", JSON.stringify(updatedImages));
  };

  // 🔹 Card items data
  const cardItems = [
    {
      id: 1,
      icon: <Images size={20} className="text-pink-600" />,
      title: "Tambah ke Gallery",
      description: `${galleryImages.length} gambar tersimpan`,
      action: addImageToGallery,
      color: "from-pink-100 to-pink-200",
      borderColor: "border-pink-200",
      badge: "➕"
    },
    {
      id: 2,
      icon: <Volume2 size={20} className="text-blue-600" />,
      title: "Sound Settings",
      description: soundInfo,
      action: openSoundSettings,
      color: "from-blue-100 to-blue-200",
      borderColor: "border-blue-200",
      badge: soundInfo.includes("Custom") ? "🎵 Custom" : "🔊 Default"
    },
    {
      id: 3,
      icon: <Bell size={20} className="text-green-600" />,
      title: "Notification",
      description: "Manage your notifications",
      action: () => console.log("Notification settings"),
      color: "from-green-100 to-green-200",
      borderColor: "border-green-200"
    },
    {
      id: 4,
      icon: <Settings size={20} className="text-purple-600" />,
      title: "App Settings",
      description: "General app preferences",
      action: () => console.log("App settings"),
      color: "from-purple-100 to-purple-200",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div
      className={`w-screen h-screen flex flex-col items-center justify-start 
                  bg-gradient-to-b ${themes[activeTheme]} 
                  transition-all duration-700 font-[Poppins] p-5 overflow-y-auto`}
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
                {item.badge && (
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    item.id === 1 
                      ? "bg-pink-100 text-pink-700" 
                      : item.id === 2 && soundInfo.includes("Custom")
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.badge}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔹 Preview Gallery Images */}
      {galleryImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 w-[90%] max-w-[380px]"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-900 font-semibold text-sm">
              Gallery Saya ({galleryImages.length} gambar)
            </h3>
            <span className="text-xs text-gray-600">Tap untuk hapus</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {galleryImages.slice(0, 6).map((image, index) => (
              <motion.div
                key={index}
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-white/40 shadow-sm"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeImageFromGallery(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
            {galleryImages.length > 6 && (
              <div className="w-full h-20 bg-white/30 rounded-lg flex items-center justify-center text-gray-600 text-xs">
                +{galleryImages.length - 6} lebih
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 🔹 Empty State untuk Gallery */}
      {galleryImages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 w-[90%] max-w-[380px] text-center"
        >
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40">
            <Images size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-gray-700 font-semibold text-sm mb-2">
              Gallery Kosong
            </h3>
            <p className="text-gray-600 text-xs mb-4">
              Tambahkan gambar pertama Anda dengan menekan "Tambah ke Gallery"
            </p>
          </div>
        </motion.div>
      )}

      {/* Sound Settings Modal */}
      {showSoundSettings && (
        <SoundSettings onClose={() => setShowSoundSettings(false)} />
      )}

      <BottomNavbar />
    </div>
  );
}