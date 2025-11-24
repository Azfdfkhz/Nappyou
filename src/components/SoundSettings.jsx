import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Info, Volume2, Play, Square, RotateCcw } from "lucide-react";

export default function SoundSettings({ onClose }) {
  const [soundInfo, setSoundInfo] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    getSoundInfo();
    testAndroidConnection();
  }, []);

  const testAndroidConnection = () => {
    console.log("🔍 Testing Android connection...");
    if (window.Android) {
      console.log("✅ Android interface tersedia");
    } else {
      console.log("❌ Android interface tidak tersedia");
      setSoundInfo("❌ Android interface tidak tersedia");
    }
  };

  const getSoundInfo = () => {
    if (window.Android && window.Android.getSoundInfo) {
      window.Android.getSoundInfo();
      setSoundInfo("Mengambil info sound...");
    } else {
      setSoundInfo("❌ Fungsi Android tidak tersedia");
    }
  };

  const pickAlarmSound = () => {
    if (window.Android && window.Android.pickAlarmSound) {
      setIsLoading(true);
      window.Android.pickAlarmSound();
      setSoundInfo("Membuka file manager...");
    } else {
      setSoundInfo("❌ Tidak bisa membuka file manager");
    }
  };

  const resetAlarmSound = () => {
    if (window.Android && window.Android.resetAlarmSound) {
      if (confirm("Yakin ingin reset sound ke default?")) {
        window.Android.resetAlarmSound();
        setSoundInfo("Mereset sound...");
        stopPreview();
      }
    } else {
      setSoundInfo("❌ Tidak bisa reset sound");
    }
  };

  const previewSound = () => {
    if (window.Android && window.Android.getSelectedSound) {
      // Untuk preview, kita buat notifikasi test
      if (window.Android.showNotification) {
        window.Android.showNotification("Preview Sound", "Ini preview sound alarm Anda 🔊");
      }
    } else {
      // Fallback: test notifikasi biasa
      if (window.Android && window.Android.testNotification) {
        window.Android.testNotification();
      }
    }
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const hasCustomSound = () => {
    if (window.Android && window.Android.hasCustomSound) {
      return window.Android.hasCustomSound();
    }
    return false;
  };

  // Setup Android callbacks
  useEffect(() => {
    window.onSoundSelected = (soundUri) => {
      console.log("🎵 Sound selected:", soundUri);
      setSoundInfo("✅ Sound custom berhasil dipilih!");
      setIsLoading(false);
      
      // Auto refresh info setelah 1 detik
      setTimeout(() => {
        if (window.Android && window.Android.getSoundInfo) {
          window.Android.getSoundInfo();
        }
      }, 1000);
    };

    window.onSoundReset = () => {
      setSoundInfo("✅ Sound direset ke default");
      setIsLoading(false);
      stopPreview();
    };

    window.onSoundInfo = (info) => {
      console.log("📢 Sound info:", info);
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
              Sound Alarm
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Status Card */}
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

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={pickAlarmSound}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Volume2 size={18} />
            )}
            🎵 Pilih Sound Custom
          </button>

          <button
            onClick={previewSound}
            disabled={isLoading || !hasCustomSound()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Play size={18} />
            🔊 Preview Sound
          </button>

          <button
            onClick={resetAlarmSound}
            disabled={isLoading || !hasCustomSound()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            🔄 Reset ke Default
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-5 space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-start">
            <Info size={14} className="mt-[2px] text-blue-400 flex-shrink-0" />
            <p>Pilih file audio (MP3, WAV) dari penyimpanan perangkat untuk sound alarm custom</p>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-start">
            <Info size={14} className="mt-[2px] text-green-400 flex-shrink-0" />
            <p>Sound akan berbunyi keras saat alarm/reminder muncul</p>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-start">
            <Info size={14} className="mt-[2px] text-purple-400 flex-shrink-0" />
            <p>Test dengan membuat reminder baru untuk mendengar sound-nya</p>
          </div>
        </div>

        {/* Debug Info (Hanya di development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Debug:</strong> Android interface {window.Android ? "✅ Tersedia" : "❌ Tidak tersedia"}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
