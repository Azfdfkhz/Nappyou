import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BottomNavbar from "../components/BottomNavbar";

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeTheme, setActiveTheme] = useState("blue");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setActiveTheme(savedTheme);

    const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
    setGalleryImages(savedImages);
  }, []);

  const gradients = {
    blue: "from-[#294684] to-[#C1D4E2]",
    orange: "from-[#FF9B6A] to-[#FFE1B6]",
    pink: "from-[#E58BB7] to-[#FDD6E8]",
    green: "from-[#83C5A3] to-[#D4F1CB]",
    purple: "from-[#A79BFF] to-[#D8D2FF]",
  };

  return (
    <div
      className={`w-screen min-h-screen flex flex-col items-center bg-gradient-to-b ${gradients[activeTheme]} pb-28 overflow-y-auto font-[Poppins]`}
    >
      {/* 🔹 Gallery Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-10 w-full max-w-[400px] px-4 grid grid-cols-2 gap-3"
      >
        {galleryImages.length > 0 ? (
          galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className={`${i % 3 === 0 ? "col-span-2 aspect-video" : "aspect-[9/16]"} bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/40 shadow-md`}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={img}
                alt={`Gallery ${i}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center text-white/80 mt-20">
            Belum ada gambar, tambahkan lewat Profile ✨
          </div>
        )}
      </motion.div>

      <BottomNavbar />
    </div>
  );
}
