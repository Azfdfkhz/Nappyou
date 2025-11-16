import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import TaskCard from "./TaskCard";

// Warna tema diambil dari Profile
const themeColors = {
  blue: { base: "#1b3b4a", accent: "#4ade80" },
  orange: { base: "#C56730", accent: "#f59e0b" },
  pink: { base: "#B34E7E", accent: "#E58BB7" },
  green: { base: "#357C61", accent: "#83C5A3" },
  purple: { base: "#6150C2", accent: "#A79BFF" },
};

export default function NavigationTabs({ tasks, setTasks }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTheme, setActiveTheme] = useState("blue");

  // Ambil tema aktif dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themeColors[savedTheme]) {
      setActiveTheme(savedTheme);
    }
  }, []);

  const colors = themeColors[activeTheme] || themeColors.blue;

  // ✨ Toast Notif
  const showToast = (msg, color = colors.accent) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000);
  };

  // ✅ Tambah / Edit Task
  const addOrEditTask = () => {
    if (!taskTitle) return;

    let newTasks;
    if (editTaskId) {
      newTasks = tasks.map((task) =>
        task.id === editTaskId
          ? {
              ...task,
              title: taskTitle,
              dueDate: taskDue || null,
              dueTime: taskTime || null,
            }
          : task
      );
      showToast("✅ Task berhasil diperbarui", colors.accent);
    } else {
      const newTask = {
        id: uuidv4(),
        title: taskTitle,
        dueDate: taskDue || null,
        dueTime: taskTime || null,
        done: false,
      };
      newTasks = [...tasks, newTask];
      showToast("📝 Task berhasil ditambahkan!", colors.accent);

      // 🔔 Kirim ke Android jika ada tanggal
      if (window.Android && window.Android.scheduleNotification && taskDue) {
        const dateTime = taskTime
          ? `${taskDue}T${taskTime}`
          : `${taskDue}T07:30`;
        window.Android.scheduleNotification(taskTitle, dateTime);
      }
    }

    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTaskTitle("");
    setTaskDue("");
    setTaskTime("");
    setEditTaskId(null);
    setShowTaskModal(false);
  };

  // ✅ Toggle done
  const toggleDone = (id) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // ✅ Delete
  const deleteTask = (id) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    showToast("🗑️ Task dihapus!", "#f87171");
  };

  // ✅ Edit
  const editTask = (task) => {
    setTaskTitle(task.title);
    setTaskDue(task.dueDate || "");
    setTaskTime(task.dueTime || "");
    setEditTaskId(task.id);
    setShowTaskModal(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 relative w-full">
      <TaskCard
        tasks={tasks}
        toggleDone={toggleDone}
        editTask={editTask}
        deleteTask={deleteTask}
      />

      {/* Tombol Tambah */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTaskModal(true)}
        className="mt-4 px-5 py-2 rounded-full text-white shadow-md text-sm transition-all duration-300"
        style={{
          background: `${colors.base}cc`,
          border: `1px solid ${colors.accent}66`,
        }}
      >
        + Tambah Task
      </motion.button>

      {/* Modal Input Task */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="p-6 rounded-xl w-80 flex flex-col gap-3"
              style={{
                background: `linear-gradient(160deg, ${colors.base}, ${colors.accent}88)`,
                color: "#fff",
              }}
            >
              <h3 className="font-semibold text-lg text-center mb-2">
                {editTaskId ? "Edit Task" : "Tambah Task"}
              </h3>

              <input
                type="text"
                placeholder="Judul Task"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="px-3 py-2 rounded-md text-white bg-white/20 outline-none placeholder:text-white/60"
              />

              <input
                type="date"
                value={taskDue}
                onChange={(e) => setTaskDue(e.target.value)}
                className="px-3 py-2 rounded-md text-white bg-white/20 outline-none"
              />

              <input
                type="time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                className="px-3 py-2 rounded-md text-white bg-white/20 outline-none"
              />

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditTaskId(null);
                    setTaskTitle("");
                    setTaskDue("");
                    setTaskTime("");
                  }}
                  className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition"
                >
                  Batal
                </button>

                <button
                  onClick={addOrEditTask}
                  className="px-3 py-1 rounded-md"
                  style={{
                    backgroundColor: colors.accent,
                  }}
                >
                  {editTaskId ? "Simpan" : "Tambah"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-lg text-white font-medium shadow-lg"
            style={{
              background: toast.color,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
