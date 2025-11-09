import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: localStorage.getItem("username") || "",
    photoURL: localStorage.getItem("photoURL") || "",
  });

  // Definisikan callback global satu kali
  useEffect(() => {
    window.onLoginSuccess = (token) => {
      console.log("Android login token:", token);

      const username = "User";
      const photoURL = "";

      localStorage.setItem("username", username);
      localStorage.setItem("photoURL", photoURL);

      setUser({ username, photoURL });

      // Langsung navigasi tanpa menunggu re-render
      navigate("/home");
    };

    window.onLoginFail = () => {
      alert("Login gagal, coba lagi!");
    };

    // Jika user sudah login sebelumnya
    if (user.username) {
      navigate("/home");
    }
  }, []); // Hanya sekali saat mount

  const handleLogin = () => {
    if (window.Android && window.Android.loginWithGoogle) {
      window.Android.loginWithGoogle();
    } else {
      alert("Login hanya tersedia di aplikasi mobile.");
    }
  };

  return (
    <div>
      <h1>Welcome To Nappyyou</h1>
      <button onClick={handleLogin}>Login With Google</button>
    </div>
  );
}
