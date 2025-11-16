import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen w-full flex flex-col justify-between items-center text-center px-6 py-10 bg-gradient-to-b from-[#294684] to-[#C1D4E2] overflow-hidden relative"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-0 left-0 right-0 bg-[#223B66] h-[360px] rounded-b-[40px] shadow-md z-0"
      />

      {/* Totol totol */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex gap-2 mt-70 z-10"
      >
        <span className="w-2 h-2 bg-black/70 rounded-full"></span>
        <span className="w-2 h-2 bg-black/40 rounded-full"></span>
        <span className="w-2 h-2 bg-black/40 rounded-full"></span>
      </motion.div>

      {/* kata kata hari ini bosque */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col items-center gap-4 mt-28 z-10"
      >
        <h1 className="text-gray-900 font-bold text-3xl font-[Poppins]">
          Welcome To Nappyyou
        </h1>
        <p className="text-gray-700 font-light text-base max-w-xs leading-relaxed font-[Poppins]">
          Nappyyou merupakan aplikasi pengingat selain untuk tugas dia juga dapat menyimpan apa yang kalian mau seperti catatan. Fitur khususnya memiliki pet.
        </p>
      </motion.div>

      {/* Tombol Continue */}
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/login")}
        className="mt-10 mb-8 px-16 py-3 text-gray-900 font-[Poppins] font-semibold rounded-full backdrop-blur-lg bg-white/40 shadow-md border border-black/10 hover:bg-white/60 transition-all duration-300 z-10"
      >
        Continue
      </motion.button>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="text-gray-800 text-xs font-[Poppins] tracking-widest z-10"
      >
        AZFDFKHZ
      </motion.p>
    </motion.div>
  );
}
