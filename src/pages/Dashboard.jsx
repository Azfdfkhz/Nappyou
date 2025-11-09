import React, { useState, useEffect } from "react";
import NavigationTabs from "./NavigationTabs";
import TaskCard from "./TaskCard";

export default function Dashboard() {
  // Ambil data tasks dari localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // Simpan tasks ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Tambah task baru
  const handleAddTask = () => {
    const newTask = prompt("Masukkan nama tugas baru:");
    if (newTask) {
      setTasks([...tasks, { title: newTask }]);
    }
  };

  // Placeholder fungsi tambah catatan
  const handleAddNote = () => {
    alert("Fitur catatan masih dalam pengembangan 😄");
  };

  // Fitur pengingat sederhana
  const handleSetReminder = () => {
    const taskName = prompt("Tugas apa yang ingin diingatkan?");
    const time = prompt("Ingin diingatkan jam berapa? (contoh: 08:30)");
    if (taskName && time) {
      alert(`Pengingat diset untuk "${taskName}" pada jam ${time}.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#132530] to-[#1f3a48] text-white font-[Poppins] flex flex-col items-center py-10 px-4">
      {/* Navigation Bar */}
      <div className="w-full max-w-[400px] backdrop-blur-xl bg-white/10 p-4 rounded-2xl shadow-lg border border-white/20">
        <NavigationTabs
          onAddNote={handleAddNote}
          onAddTask={handleAddTask}
          onSetReminder={handleSetReminder}
        />
      </div>

      {/* TaskCard */}
      <div className="mt-8">
        <TaskCard tasks={tasks} />
      </div>
    </div>
  );
}
