import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    photoURL: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPhotoURL = localStorage.getItem("photoURL");

    if (savedUsername) {
      setTimeout(() => {
        setUser({ username: savedUsername, photoURL: savedPhotoURL || "" });
        navigate("/home");
      }, 100);
    }

    window.onLoginSuccess = (userData) => {
      localStorage.setItem("username", userData.username);
      localStorage.setItem("photoURL", userData.photoURL);
      localStorage.setItem("firebaseToken", userData.uid);

      setUser({ username: userData.username, photoURL: userData.photoURL });
      navigate("/home");
    };

    window.onLoginFail = () => alert("Login gagal, coba lagi!");

    const loadingTimer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(loadingTimer);
  }, [navigate]);

  const handleLogin = () => {
    if (window.Android && window.Android.loginWithGoogle) {
      window.Android.loginWithGoogle();
    } else {
      alert("Login hanya tersedia di aplikasi mobile.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-between items-center text-center px-6 py-10 bg-gradient-to-b from-[#294684] to-[#C1D4E2] overflow-hidden relative font-[Poppins]">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-2 px-10 py-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-md"
      >
        <h1 className="text-gray-900 font-bold text-2xl tracking-wide">
          Welcome To Nappyyou
        </h1>
      </motion.div>

      {/* Glass Card / Skeleton */}
      {isLoading ? (
        <div className="rounded-2xl p-6 w-72 h-72 flex flex-col items-center justify-center shadow-md mt-10 bg-white/30 backdrop-blur-md animate-pulse">
          <div className="w-20 h-20 bg-white/50 rounded-full mb-6"></div>
          <div className="w-48 h-8 bg-white/50 rounded-full"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-2xl p-6 w-72 h-72 flex flex-col items-center justify-center shadow-md mt-10 bg-white/50 backdrop-blur-lg"
        >
          <div className="w-20 h-20 bg-white/70 rounded-full mb-6 overflow-hidden shadow-sm">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No Photo
              </div>
            )}
          </div>

          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-gray-800 font-semibold px-6 py-2 rounded-full shadow-sm border border-gray-200 transition-all duration-300 ease-out active:scale-95"
          >
            <FcGoogle size={20} />
            Login With Google
          </button>
        </motion.div>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-gray-700 text-xs tracking-widest mb-6"
      >
        AZFDFKHZ
      </motion.p>
    </div>
  );
}
