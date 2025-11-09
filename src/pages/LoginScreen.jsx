import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("username", user.displayName || "User");
      localStorage.setItem("photoURL", user.photoURL || "");

      navigate("/Home");
    } catch (error) {
      console.error(error);
      alert("Login gagal, coba lagi!");
    }
  };

return (
  <div className="w-screen h-screen flex flex-col justify-between items-center text-center px-6 py-10 bg-gradient-to-b from-[#174143] to-[#F9B487] overflow-hidden relative font-[Poppins]">
    {/* Title */}
    <h1 className="text-white font-bold text-2xl mt-8">
      Welcome To Nappyyou
    </h1>

    {/* Glass Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 w-72 h-72 flex flex-col items-center justify-center shadow-lg mt-10"
    >
      <div className="w-20 h-20 bg-white/40 rounded-full mb-6 overflow-hidden">
        {localStorage.getItem("photoURL") && (
          <img
            src={localStorage.getItem("photoURL")}
            alt="User"
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </div>

      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-2 bg-white/30 hover:bg-white/40 text-white font-semibold px-6 py-2 rounded-full backdrop-blur-md shadow-md border border-white/20 transition-all"
      >
        <FcGoogle size={20} />
        Login With Google
      </button>
    </motion.div>

    {/* Footer */}
    <p className="text-white/70 text-xs tracking-widest mb-6">
      AZFDFKHZ
    </p>
  </div>
);
}
