import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Lottie from "lottie-react";

import catSleep from "../assets/cat-sleep.json";
import catLaugh from "../assets/cat-laugh.json";
import catLove from "../assets/cat-love.json";

export default function HeaderPull({ onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState(catSleep);
  const [catText, setCatText] = useState("Zzz... 💤");
  const [lastAction, setLastAction] = useState(Date.now());
  const y = useMotionValue(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAnimation(catSleep);
      setCatText("Zzz... ngantuk anjay");
    }, 5000);

    return () => clearTimeout(timeoutRef.current);
  }, [lastAction]);

  const handleTap = () => {
    setAnimation(catLaugh);
    setCatText("Hihihi");
    setLastAction(Date.now());
  };

  const handleDragCat = () => {
    setAnimation(catLove);
    setCatText("Prr");
    setLastAction(Date.now());
  };

  const toggleOpen = (value) => {
    setIsOpen(value);
    if (typeof onOpenChange === "function") onOpenChange(value);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 60) toggleOpen(true);
    else if (info.offset.y < -60) toggleOpen(false);

    animate(y, 0, { type: "spring", stiffness: 300, damping: 25 });
  };

  const handleDrag = () => {
    // optional: bisa pakai onPull jika mau animasi fade saat drag
  };

  return (
    <div className="flex flex-col items-center w-full mt-6">
      {/* Header */}
      <div className="w-[calc(100vw-60px)] max-w-[430px] bg-[#4A6E6E] rounded-t-[28px] flex justify-between items-center px-6 py-3 shadow-md border border-white/20">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <span className="text-white text-[16px] font-semibold tracking-wide">Nappyou</span>
      </div>

      {/* Konten Pull */}
      <motion.div
        animate={{
          height: isOpen ? "260px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="overflow-hidden w-[calc(100vw-60px)] max-w-[430px] bg-[#133C3C] border-x border-white/20 flex flex-col items-center"
      >
        {isOpen && (
          <motion.div
            initial={{ scaleY: 0.95 }}
            animate={{ scaleY: [1, 1.05, 1] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center py-4"
          >
            <span className="text-sm font-semibold mb-2 text-white">DongDong</span>

            <div
              className="w-[160px] h-[160px] active:scale-95 transition-transform"
              onClick={handleTap}
              onTouchMove={handleDragCat}
            >
              <Lottie animationData={animation} loop={true} />
            </div>

            <motion.span
              key={catText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-gray-300 mt-1"
            >
              {catText}
            </motion.span>
          </motion.div>
        )}
      </motion.div>

      {/* Drag Handle */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 180 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        onClick={() => toggleOpen(!isOpen)}
        animate={{
          scaleY: isOpen ? [1, 1.05, 1] : [1, 0.97, 1],
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative w-[calc(100vw-60px)] max-w-[430px] bg-[#133C3C] text-center text-white py-4 rounded-b-[28px] border border-white/20 shadow-inner cursor-grab active:cursor-grabbing -mt-[1px]"
      >
        {isOpen ? "Tutup" : "Tarik"}
        <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-transparent border-t-gray-300"></div>
      </motion.div>
    </div>
  );
}
