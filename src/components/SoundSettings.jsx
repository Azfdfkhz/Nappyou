import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Info, Volume2, Play, Square, RotateCcw, VolumeX } from "lucide-react";

export default function SoundSettings({ onClose }) {
  const [soundInfo, setSoundInfo] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCustom, setHasCustom] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    initializeSoundSettings();
  }, []);

  const initializeSoundSettings = () => {
    console.log("🔍 Initializing sound settings...");
    
    // Test Android connection
    if (window.Android) {
      console.log("✅ Android interface tersedia");
      console.log("Available methods:", Object.keys(window.Android));
      
      // Load initial sound info
      getSoundInfo();
      
      // Check if has custom sound
      checkCustomSound();
    } else {
      console.log("❌ Android interface tidak tersedia");
      setSoundInfo("❌ Hanya tersedia di Android app");
    }
  };

  const getSoundInfo = () => {
    if (window.Android && window.Android.getSoundInfo) {
      console.log("📢 Requesting sound info...");
      window.Android.getSoundInfo();
    } else {
      setSoundInfo("❌ Fungsi Android.getSoundInfo tidak tersedia");
    }
  };

  const checkCustomSound = () => {
    if (window.Android && window.Android.hasCustomSound) {
      const hasCustomSound = window.Android.hasCustomSound();
      console.log("🎵 Has custom sound:", hasCustomSound);
      setHasCustom(hasCustomSound);
    }
  };

  const pickAlarmSound = () => {
    if (window.Android && window.Android.pickAlarmSound) {
      console.log("🎵 Opening sound picker...");
      setIsLoading(true);
      setSoundInfo("Membuka file manager...");
      window.Android.pickAlarmSound();
    } else {
      setSoundInfo("❌ Tidak bisa membuka file manager");
    }
  };

  const resetAlarmSound = () => {
    if (window.Android && window.Android.resetAlarmSound) {
      if (confirm("Yakin ingin reset sound ke default?")) {
        console.log("🔄 Resetting sound to default...");
        setIsLoading(true);
        setSoundInfo("Mereset sound...");
        window.Android.resetAlarmSound();
        stopPreview();
      }
    } else {
      setSoundInfo("❌ Tidak bisa reset sound");
    }
  };

  const previewSound = () => {
    if (window.Android && window.Android.testCustomSound) {
      console.log("🔊 Testing custom sound...");
      setIsPlaying(true);
      window.Android.testCustomSound();
      
      // Auto stop setelah 3 detik
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } else if (window.Android && window.Android.showNotification) {
      // Fallback ke notifikasi biasa
      window.Android.showNotification("Preview Sound", "Menggunakan: " + soundInfo);
    } else {
      setSoundInfo("❌ Tidak bisa test sound");
    }
  };

  const testAlarmSound = () => {
    if (window.Android && window.Android.testAlarmSound) {
      console.log("🚨 Testing alarm sound...");
      setIsPlaying(true);
      window.Android.testAlarmSound();
      
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    } else {
      setSoundInfo("❌ Tidak bisa test alarm");
    }
  };

  const stopPreview = () => {
    if (window.Android && window.Android.stopAlarm) {
      window.Android.stopAlarm();
    }
    setIsPlaying(false);
  };

  // Setup Android callbacks
  useEffect(() => {
    window.onSoundSelected = (soundUri) => {
      console.log("🎵 Sound selected callback:", soundUri);
      setSoundInfo("✅ Sound custom berhasil dipilih!");
      setIsLoading(false);
      setHasCustom(true);
      
      // Auto refresh info
      setTimeout(() => {
        getSoundInfo();
        checkCustomSound();
      }, 1000);
    };

    window.onSoundReset = () => {
      console.log("🔄 Sound reset callback");
      setSoundInfo("✅ Sound direset ke default");
      setIsLoading(false);
      setHasCustom(false);
      stopPreview();
    };

    window.onSoundInfo = (info) => {
      console.log("📢 Sound info callback:", info);
      setSoundInfo(info);
      setIsLoading(false);
      setHasCustom(info.includes("Custom"));
    };

    window.onSoundError = (error) => {
      console.log("❌ Sound error callback:", error);
      setSoundInfo("❌ " + error);
      setIsLoading(false);
    };

    return () => {
      delete window.onSoundSelected;
      delete window.onSoundReset;
      delete window.onSoundInfo;
      delete window.onSoundError;
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
        className="bg-white/95 dark:bg-neutral-900/95 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/30 backdrop-blur-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
              <Volume2 size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Sound Alarm
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        {/* Status Card */}
        <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-700 px-4 py-4 rounded-xl border border-gray-200 dark:border-neutral-600">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : soundInfo.includes("✅") ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : soundInfo.includes("❌") ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Info className="w-5 h-5 text-blue-500" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                soundInfo.includes("✅")
                  ? "text-green-600 dark:text-green-400"
                  : soundInfo.includes("❌")
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {soundInfo}
            </p>
            {hasCustom && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Sound custom aktif
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {/* Pilih Sound */}
          <button
            onClick={pickAlarmSound}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Volume2 size={18} />
            )}
            🎵 Pilih Sound Custom
          </button>

          {/* Preview Sound */}
          <button
            onClick={previewSound}
            disabled={isLoading || !hasCustom}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isPlaying ? (
              <Square size={18} />
            ) : (
              <Play size={18} />
            )}
            {isPlaying ? "🛑 Stop Preview" : "🔊 Preview Sound"}
          </button>

          {/* Test Alarm */}
          <button
            onClick={testAlarmSound}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isPlaying ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Volume2 size={18} />
            )}
            {isPlaying ? "🔊 Testing..." : "🚨 Test Alarm Service"}
          </button>

          {/* Reset Sound */}
          <button
            onClick={resetAlarmSound}
            disabled={isLoading || !hasCustom}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <RotateCcw size={18} />
            🔄 Reset ke Default
          </button>
        </div>

        {/* Info Section */}
        <div className="space-y-3 border-t border-gray-200 dark:border-neutral-700 pt-4">
          <div className="flex gap-3 items-start">
            <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Pilih file audio</strong> (MP3, WAV) dari penyimpanan perangkat untuk sound alarm custom
            </p>
          </div>
          
          <div className="flex gap-3 items-start">
            <Info size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Sound akan berbunyi keras</strong> saat alarm/reminder muncul, bahkan saat app ditutup
            </p>
          </div>

          <div className="flex gap-3 items-start">
            <Info size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Test dengan alarm service</strong> untuk mendengar sound dalam kondisi real
            </p>
          </div>
        </div>

        {/* Debug Info (Hanya di development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 font-mono">
              <strong>Debug Info:</strong><br />
              • Android: {window.Android ? "✅ Tersedia" : "❌ Tidak tersedia"}<br />
              • Custom Sound: {hasCustom ? "✅ Ya" : "❌ Tidak"}<br />
              • Status: {soundInfo}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
