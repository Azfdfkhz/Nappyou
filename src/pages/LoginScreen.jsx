import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Callback dari Android WebView
    window.onLoginSuccess = (token) => {
      console.log("Android login token:", token);

      const username = "User"; // bisa disesuaikan
      const photoURL = "";

      localStorage.setItem("username", username);
      localStorage.setItem("photoURL", photoURL);
      localStorage.setItem("firebaseToken", token);

      navigate("/home"); // redirect langsung
    };

    window.onLoginFail = () => {
      alert("Login gagal, coba lagi!");
    };

    // Jika user sudah login sebelumnya
    const username = localStorage.getItem("username");
    if (username) navigate("/home");
  }, [navigate]);

  const handleLogin = () => {
    if (window.Android && window.Android.loginWithGoogle) {
      window.Android.loginWithGoogle();
    } else {
      alert("Login hanya tersedia di aplikasi mobile.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome To Nappyyou</h1>
      <button onClick={handleLogin}>Login With Google</button>
    </div>
  );
}
