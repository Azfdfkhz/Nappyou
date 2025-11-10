import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

const NavigationTabs = ({ tasks, setTasks }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);

  // Tambah atau edit task
  const addOrEditTask = () => {
    if (!taskTitle) return;

    let newTasks;
    if (editTaskId) {
      newTasks = tasks.map((task) =>
        task.id === editTaskId
          ? { ...task, title: taskTitle, dueDate: taskDue || null, notified: false }
          : task
      );
    } else {
      const newTask = {
        id: uuidv4(),
        title: taskTitle,
        dueDate: taskDue || null,
        done: false,
        notified: false,
      };
      newTasks = [...tasks, newTask];
    }

    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTaskTitle("");
    setTaskDue("");
    setEditTaskId(null);
    setShowTaskModal(false);
  };

  // Edit task
  const editTask = (task) => {
    setTaskTitle(task.title);
    setTaskDue(task.dueDate || "");
    setEditTaskId(task.id);
    setShowTaskModal(true);
  };

  // Delete task
  const deleteTask = (taskId) => {
    const newTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // Fungsi untuk memanggil notif
  const notifyTask = (task) => {
    // Android
    if (window.Android && window.Android.showNotification) {
      window.Android.showNotification(task.title, task.description || "");
    } else if ("Notification" in window) {
      // Browser fallback
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(task.title, { body: task.description || "" });
          }
        });
      } else {
        new Notification(task.title, { body: task.description || "" });
      }
    }
  };

  // Check setiap 10 detik task yang due
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let updated = false;

      const newTasks = tasks.map((task) => {
        if (
          task.dueDate &&
          !task.notified &&
          new Date(task.dueDate) <= now &&
          !task.done
        ) {
          notifyTask(task);
          updated = true;
          return { ...task, notified: true }; // tandai sudah dikirim notif
        }
        return task;
      });

      if (updated) {
        setTasks(newTasks);
        localStorage.setItem("tasks", JSON.stringify(newTasks));
      }
    }, 10000); // cek setiap 10 detik

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Button Tambah Task */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTaskModal(true)}
        className="px-4 sm:px-6 py-2 rounded-xl text-center min-w-[90px] sm:min-w-[100px]
          backdrop-blur-md bg-gradient-to-b from-[#3d7b91]/70 to-[#1b3b4a]/70
          border border-[#68a3b5]/40 text-slate-100 shadow-md
          hover:from-[#4c8aa2]/70 hover:to-[#234a5b]/70 transition-all text-sm sm:text-base"
      >
        {editTaskId ? "Edit Task" : "+ Task"}
      </motion.button>

      {/* Modal tambah/edit task */}
      {showTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1b3b4a] p-6 rounded-xl w-80 text-white flex flex-col gap-3"
          >
            <h3 className="font-semibold text-lg">{editTaskId ? "Edit Task" : "Tambah Task"}</h3>
            <input
              type="text"
              placeholder="Judul Task"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="px-3 py-2 rounded-md text-white w-full"
            />
            <input
              type="datetime-local"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              className="px-3 py-2 rounded-md text-white w-full"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditTaskId(null);
                  setTaskTitle("");
                  setTaskDue("");
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

      {/* List Task */}
      <div className="mt-2 flex flex-col gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-[#2e4a56]/70 p-2 rounded-md text-sm"
          >
            <span className={task.done ? "line-through text-gray-400" : ""}>
              {task.title} {task.dueDate ? `(${task.dueDate})` : ""}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => editTask(task)}
                className="px-2 py-1 text-xs bg-blue-500 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-2 py-1 text-xs bg-red-500 rounded hover:bg-red-600 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
