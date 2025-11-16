import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import HomePage from "./pages/Home";
import LoginScreen from "./pages/LoginScreen";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#235baf]">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
