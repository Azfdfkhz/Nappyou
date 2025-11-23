import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Info, Volume2 } from "lucide-react";

export default function SoundSettings({ onClose }) {
  const [soundInfo, setSoundInfo] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSoundInfo();
  }, []);

  const getSoundInfo = () => {
    if (window.Android) {
      window.Android.getSoundInfo();
      setSoundInfo("Getting sound info...");
    } else {
      showError("Android interface not available");
    }
  };

  const pickAlarmSound = () => {
    if (window.Android) {
      setIsLoading(true);
      window.Android.pickAlarmSound();
      setSoundInfo("Silakan pilih file audio...");
    } else {
      showError("Android interface not available");
    }
  };

  const resetAlarmSound = () => {
    if (window.Android && confirm("Yakin ingin reset sound ke default?")) {
      window.Android.resetAlarmSound();
      setSoundInfo("Resetting sound to default...");
    }
  };

  const showError = (message) => {
    setSoundInfo(`❌ ${message}`);
    console.error(message);
  };

  useEffect(() => {
    window.onSoundSelected = (soundUri) => {
      setSoundInfo("✅ Sound berhasil dipilih!");
      setIsLoading(false);
      setTimeout(() => getSoundInfo(), 1000);
    };

    window.onSoundReset = () => {
      setSoundInfo("✅ Sound direset ke default");
      setIsLoading(false);
    };

    window.onSoundInfo = (info) => {
      setSoundInfo(info);
      setIsLoading(false);
    };

    return () => {
      delete window.onSoundSelected;
      delete window.onSoundReset;
      delete window.onSoundInfo;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white/90 dark:bg-neutral-900 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <Volume2 size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Sound Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-5 bg-gray-100 dark:bg-neutral-800 px-3 py-3 rounded-xl">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
          ) : soundInfo.includes("✅") ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : soundInfo.includes("❌") ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Info className="w-5 h-5 text-blue-500" />
          )}
          <p
            className={`text-sm font-medium ${
              soundInfo.includes("✅")
                ? "text-green-600"
                : soundInfo.includes("❌")
                ? "text-red-600"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {soundInfo}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={pickAlarmSound}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200"
          >
            🎵 Pilih Sound Alarm
          </button>

          <button
            onClick={resetAlarmSound}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200"
          >
            🔄 Reset ke Default
          </button>

          <button
            onClick={getSoundInfo}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200"
          >
            ℹ️ Get Sound Info
          </button>
        </div>

        {/* Tips */}
        <div className="mt-5 text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-start">
          <Info size={14} className="mt-[2px] text-blue-400" />
          <p>
            Tips: Pilih file audio (MP3, WAV, dll) dari penyimpanan untuk digunakan sebagai suara alarm.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}