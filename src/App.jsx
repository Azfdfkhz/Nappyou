import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginScreen from "./pages/LoginScreen";
import HomePage from "./pages/Home";

export default function App() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#062f2f]">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </div>
  );
}
