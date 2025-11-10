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

  // Ambil user dari localStorage tapi delay supaya WebView siap
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPhotoURL = localStorage.getItem("photoURL");

    if (savedUsername) {
      // Delay kecil supaya WebView tidak blank
      setTimeout(() => {
        setUser({ username: savedUsername, photoURL: savedPhotoURL || "" });
        navigate("/home");
      }, 100);
    }

    // Setup callback dari Android
    window.onLoginSuccess = (userData) => {
      console.log("Android login data:", userData);

      localStorage.setItem("username", userData.username);
      localStorage.setItem("photoURL", userData.photoURL);
      localStorage.setItem("firebaseToken", userData.uid);

      setUser({ username: userData.username, photoURL: userData.photoURL });
      navigate("/home");
    };

    window.onLoginFail = () => {
      alert("Login gagal, coba lagi!");
    };

    // Simpan skeleton loading selama minimal 300ms
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
    <div className="w-screen h-screen flex flex-col justify-between items-center text-center px-6 py-10 bg-gradient-to-b from-[#174143] to-[#F9B487] overflow-hidden relative font-[Poppins]">
      {/* Title */}
      <h1 className="text-white font-bold text-2xl mt-8">
        Welcome To Nappyou
      </h1>

      {/* Glass Card / Skeleton */}
      {isLoading ? (
        <div className="glass rounded-2xl p-6 w-72 h-72 flex flex-col items-center justify-center shadow-lg mt-10 animate-pulse">
          <div className="w-20 h-20 bg-white/30 rounded-full mb-6"></div>
          <div className="w-48 h-10 bg-white/30 rounded-full"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6 w-72 h-72 flex flex-col items-center justify-center shadow-lg mt-10"
        >
          <div className="w-20 h-20 bg-white/40 rounded-full mb-6 overflow-hidden">
            {user.photoURL && (
              <img
                src={user.photoURL}
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
      )}

      {/* Footer */}
      <p className="text-white/70 text-xs tracking-widest mb-6">AZFDFKHZ</p>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6cdd231 (Fix react-window build issue)
