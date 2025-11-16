import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

// Warna tema dari Profile
const themeColors = {
  blue: { base: "#3B82F6", glass: "rgba(59,130,246,0.15)" },
  orange: { base: "#FF9850", glass: "rgba(255,152,80,0.15)" },
  pink: { base: "#E58BB7", glass: "rgba(229,139,183,0.15)" },
  green: { base: "#83C5A3", glass: "rgba(131,197,163,0.15)" },
  purple: { base: "#A79BFF", glass: "rgba(167,155,255,0.15)" },
};

const TaskCard = ({ tasks = [], toggleDone, editTask, deleteTask }) => {
  const [todayStr, setTodayStr] = useState(getTodayStr());
  const [activeTheme, setActiveTheme] = useState("blue");

  // Ambil tema dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themeColors[savedTheme]) {
      setActiveTheme(savedTheme);
    }
  }, []);

  const colors = themeColors[activeTheme] || themeColors.blue;

  function getTodayStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  useEffect(() => {
    const interval = setInterval(() => setTodayStr(getTodayStr()), 60000);
    return () => clearInterval(interval);
  }, []);

  const tasksToday = tasks.filter((task) => task.dueDate?.startsWith(todayStr));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-[18px] p-4 w-[320px] text-white font-[Poppins] backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
      style={{
        background: `linear-gradient(160deg, ${colors.glass}, rgba(0,0,0,0.3))`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-[15px] tracking-wide">
          Task Hari Ini
        </h2>
        <div
          className="px-3 py-1 text-[11px] rounded-full shadow-inner border border-white/20"
          style={{
            background: `${colors.glass}`,
            color: "#fff",
          }}
        >
          {todayStr}
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-1 text-[13px] min-h-[80px]">
        {tasksToday.length === 0 ? (
          <li className="text-gray-300/60 italic text-center">
            Belum ada tugas hari ini
          </li>
        ) : (
          tasksToday.map((task) => (
            <motion.li
              key={task.id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer transition-all ${
                task.done
                  ? "line-through text-gray-400"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              {/* Task Content */}
              <div
                className="flex items-center gap-2 flex-1"
                onClick={() => toggleDone(task.id)}
              >
                <motion.span
                  layoutId={`dot-${task.id}`}
                  className={`w-2.5 h-2.5 rounded-full ${
                    task.done
                      ? "bg-gray-400"
                      : "shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  }`}
                  style={{
                    backgroundColor: task.done ? "#666" : colors.base,
                  }}
                ></motion.span>
                <span className="truncate">{task.title}</span>
              </div>

              {/* Icons */}
              <div className="flex gap-2 items-center">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    editTask(task);
                  }}
                  whileTap={{ scale: 0.9 }}
                  title="Edit Task"
                  className="p-1 rounded-full hover:bg-white/10 transition-all"
                  style={{ color: colors.base }}
                >
                  <Edit2 size={15} />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  whileTap={{ scale: 0.9 }}
                  title="Hapus Task"
                  className="p-1 rounded-full hover:bg-white/10 text-red-400 transition-all"
                >
                  <Trash2 size={15} />
                </motion.button>
              </div>
            </motion.li>
          ))
        )}
      </ul>
    </motion.div>
  );
};

export default TaskCard;
