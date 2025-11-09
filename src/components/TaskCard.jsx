import React from "react";
import { motion } from "framer-motion";

export default function TaskCard({ tasks = [] }) {
  function getToday() {
    const today = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const d = days[today.getDay()];
    const date = today.toLocaleDateString("id-ID");
    return `${d}/${date}`;
  }

  const selectedDate = getToday();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-gradient-to-b from-[#223C48]/70 to-[#2E4A56]/70 rounded-[16px] p-4 shadow-lg border border-white/10 w-[320px] text-white font-[Poppins] backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-[15px]">Task</h2>
        <div className="bg-[#5B6B77]/40 px-3 py-1 text-[11px] rounded-full shadow-inner border border-white/20">
          {selectedDate}
        </div>
      </div>

      {/* Daftar Tugas */}
      <ul className="space-y-1 text-[13px] min-h-[80px]">
        {tasks.length === 0 ? (
          <li className="text-gray-300/60 italic">Belum ada tugas hari ini</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {task.title}
            </li>
          ))
        )}
      </ul>
    </motion.div>
  );
}
