import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

const NavigationTabs = ({ tasks = [], setTasks = () => {} }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");

  const addTask = () => {
    if (!taskTitle) return;
    const newTask = {
      id: uuidv4(),
      title: taskTitle,
      dueDate: taskDue || null,
      done: false,
      notified: false,
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTaskTitle("");
    setTaskDue("");
    setShowTaskModal(false);
  };

  const notifyTask = (task) => {
    if (window.Android && window.Android.showNotification) {
      window.Android.showNotification(task.title, task.description || "");
    }

    else if ("Notification" in window) {
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
          return { ...task, notified: true };
        }
        return task;
      });

      if (updated) {
        setTasks(newTasks);
        localStorage.setItem("tasks", JSON.stringify(newTasks));
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="flex justify-center items-center flex-wrap gap-3 sm:gap-6 w-full">
      {/* + Task */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTaskModal(true)}
        className="px-4 sm:px-6 py-2 rounded-xl text-center min-w-[90px] sm:min-w-[100px]
          backdrop-blur-md bg-gradient-to-b from-[#3d7b91]/70 to-[#1b3b4a]/70
          border border-[#68a3b5]/40 text-slate-100 shadow-md
          hover:from-[#4c8aa2]/70 hover:to-[#234a5b]/70 transition-all text-sm sm:text-base"
      >
        + Task
      </motion.button>

      {/* Modal tambah task */}
      {showTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1b3b4a] p-6 rounded-xl w-80 text-white flex flex-col gap-3"
          >
            <h3 className="font-semibold text-lg">Tambah Task</h3>
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
                onClick={() => setShowTaskModal(false)}
                className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition"
              >
                Batal
              </button>
              <button
                onClick={addTask}
                className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 transition"
              >
                Tambah
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NavigationTabs;
