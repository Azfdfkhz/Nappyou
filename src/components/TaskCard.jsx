import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TaskCard = ({ tasks = [], toggleDone, editTask, deleteTask }) => {
  const [todayStr, setTodayStr] = useState(getTodayStr());

  // Dapatkan tanggal hari ini format YYYY-MM-DD
  function getTodayStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  // Update tanggal setiap 1 menit (untuk rolling over ke hari baru)
  useEffect(() => {
    const interval = setInterval(() => setTodayStr(getTodayStr()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter task yang due hari ini
  const tasksToday = tasks.filter((task) => task.dueDate?.startsWith(todayStr));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-gradient-to-b from-[#223C48]/70 to-[#2E4A56]/70 rounded-[16px] p-4 shadow-lg border border-white/10 w-[320px] text-white font-[Poppins] backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-[15px]">Task Hari Ini</h2>
        <div className="bg-[#5B6B77]/40 px-3 py-1 text-[11px] rounded-full shadow-inner border border-white/20">
          {todayStr}
        </div>
      </div>

      {/* List Task */}
      <ul className="space-y-1 text-[13px] min-h-[80px]">
        {tasksToday.length === 0 ? (
          <li className="text-gray-300/60 italic">Belum ada tugas hari ini</li>
        ) : (
          tasksToday.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between gap-2 p-1 rounded cursor-pointer ${
                task.done ? "line-through text-gray-400" : ""
              } hover:bg-white/10`}
            >
              <div
                className="flex items-center gap-2 flex-1"
                onClick={() => toggleDone(task.id)}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    task.done ? "bg-gray-400" : "bg-white"
                  }`}
                ></span>
                {task.title}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => editTask(task)}
                  className="text-xs bg-blue-500 px-2 py-0.5 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-xs bg-red-500 px-2 py-0.5 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </motion.div>
  );
};

export default TaskCard;
