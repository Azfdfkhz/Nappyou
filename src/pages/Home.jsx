import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeaderPull from "../components/HeaderPull";
import NavigationTabs from "../components/NavigationTabs";
import BottomNavbar from "../components/BottomNavbar"; 

// 🔹 Theme Gradients
const themes = {
  blue: "from-[#7EA8D9] to-[#E8F2FF]",
  orange: "from-[#FFC8A2] to-[#FFF5EB]",
  pink: "from-[#F4C2D7] to-[#FDF2F8]",
  green: "from-[#A3D9B1] to-[#F0F9F0]",
  purple: "from-[#C7B3E5] to-[#F5F3FF]"
};

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activeTheme, setActiveTheme] = useState("blue"); // theme state

  // 🔹 Load user info, tasks, and theme from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedPhoto = localStorage.getItem("photoURL");
    const storedTasks = localStorage.getItem("tasks");
    const storedTheme = localStorage.getItem("theme");

    if (!storedName) navigate("/"); 
    else setUsername(storedName);

    if (storedPhoto) setPhoto(storedPhoto);
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedTheme && themes[storedTheme]) setActiveTheme(storedTheme);
  }, [navigate]);

  // 🔹 Save tasks to localStorage with debounce
  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    }, 300);
  };

  const toggleDone = (taskId) => {
    const newTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    saveTasks(newTasks);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("photoURL");
    navigate("/");
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col items-center justify-start 
                  bg-gradient-to-b ${themes[activeTheme]} 
                  font-[Poppins] text-gray-900 p-5 sm:p-8 relative overflow-hidden transition-all duration-500`}
    >
      {/* Header */}
      <div className="w-full max-w-[480px] flex justify-between items-center mt-10 sm:mt-12">
        <p className="text-xl sm:text-2xl font-semibold text-gray-900">
          Welcome, {username}
        </p>

        <div
          onClick={handleLogout}
          title="Logout"
          className="w-14 h-14 rounded-full overflow-hidden bg-white/80 flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-white transition-transform duration-300"
        >
          {photo ? (
            <img
              src={photo}
              alt="User"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-gray-500 font-bold text-3xl">●</span>
          )}
        </div>
      </div>

      {/* Header Pull */}
      <div className="mt-2 w-full flex justify-center px-4">
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <HeaderPull onOpenChange={setIsHeaderOpen} />
        </Suspense>
      </div>

      {/* Konten utama */}
      <AnimatePresence mode="wait">
        {!isHeaderOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-4 w-full max-w-[480px] flex flex-col gap-6 px-4 pb-20"
          >
            <NavigationTabs tasks={tasks} setTasks={setTasks} toggleDone={toggleDone} />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavbar />
    </div>
  );
}
