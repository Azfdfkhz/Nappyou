import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import TaskCard from "./TaskCard";

const NavigationTabs = ({ tasks, setTasks }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = "#4ade80") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000);
  };

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
      showToast("✅ Task berhasil diperbarui", "#60a5fa");
    } else {
      const newTask = {
        id: uuidv4(),
        title: taskTitle,
        dueDate: taskDue || null,
        dueTime: taskTime || null,
        done: false,
      };
      newTasks = [...tasks, newTask];
      showToast("📝 Task berhasil ditambahkan!", "#4ade80");

      // 🔔 Kirim notifikasi ke Android (jika di WebView)
      if (window.Android && window.Android.scheduleNotification && taskDue) {
        const dateTime = taskTime
          ? `${taskDue}T${taskTime}` // gunakan jam user
          : `${taskDue}T07:30`; // fallback default jam 07:30
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

  const toggleDone = (id) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    showToast("🗑️ Task dihapus!", "#f87171");
  };

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

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTaskModal(true)}
        className="mt-4 px-5 py-2 rounded-full bg-[#1b3b4a]/80 border border-[#68a3b5]/40 text-white shadow-md text-sm hover:bg-[#255363]/80 transition-all duration-200"
      >
        + Tambah Task
      </motion.button>

      {showTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1b3b4a] p-6 rounded-xl w-80 text-white flex flex-col gap-3"
          >
            <h3 className="font-semibold text-lg">
              {editTaskId ? "Edit Task" : "Tambah Task"}
            </h3>

            <input
              type="text"
              placeholder="Judul Task"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="px-3 py-2 rounded-md text-white bg-[#2e4a56] outline-none"
            />

            <input
              type="date"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              className="px-3 py-2 rounded-md text-white bg-[#2e4a56] outline-none"
            />

            <input
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="px-3 py-2 rounded-md text-white bg-[#2e4a56] outline-none"
            />

            <div className="flex justify-end gap-2 mt-2">
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
                className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 transition"
              >
                {editTaskId ? "Simpan" : "Tambah"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
};

export default NavigationTabs;
