import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPull from "../components/HeaderPull";
import TaskCard from "../components/TaskCard";
import NavigationTabs from "../components/NavigationTabs";

export default function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  // Tasks
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedPhoto = localStorage.getItem("photoURL");
    const storedTasks = localStorage.getItem("tasks");

    if (!storedName) navigate("/");
    else setUsername(storedName);
    if (storedPhoto) setPhoto(storedPhoto);
    if (storedTasks) setTasks(JSON.parse(storedTasks));
  }, [navigate]);

  // Simpan tasks ke state + localStorage
  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // Toggle done
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
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#1a4a4a] via-[#2d5a5a] to-[#d4a574] font-sans text-white p-5 sm:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-[480px] flex justify-between items-center mt-10 sm:mt-12">
        <p className="text-xl sm:text-2xl font-semibold text-white/90">
          Welcome {username}
        </p>

        <div
          onClick={handleLogout}
          title="Logout"
          className="w-14 h-14 rounded-full overflow-hidden bg-white/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300"
        >
          {photo ? (
            <img src={photo} alt="User" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 font-bold text-3xl">●</span>
          )}
        </div>
      </div>

      {/* HeaderPull */}
      <div className="mt-2 w-full flex justify-center px-4">
        <HeaderPull onOpenChange={setIsHeaderOpen} />
      </div>

      {/* Konten muncul hanya saat header tertutup */}
      {!isHeaderOpen && (
        <div className="mt-4 w-full max-w-[480px] flex flex-col gap-4 px-4">
          <TaskCard tasks={tasks} />
          <NavigationTabs tasks={tasks} setTasks={setTasks} />
        </div>
      )}
    </div>
  );
}
