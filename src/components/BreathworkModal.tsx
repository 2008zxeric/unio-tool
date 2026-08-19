import React, { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw, X, Sparkles, HeartPulse } from "lucide-react";
import { ScentPrescription } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface BreathworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: ScentPrescription | null;
}

export const BreathworkModal: React.FC<BreathworkModalProps> = ({
  isOpen,
  onClose,
  prescription
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timer, setTimer] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (phase === "inhale") {
              setPhase("hold");
              audioEngine.playDropletSound();
              return 7;
            } else if (phase === "hold") {
              setPhase("exhale");
              audioEngine.playDropletSound();
              return 8;
            } else {
              setPhase("inhale");
              setCycleCount((c) => c + 1);
              audioEngine.strikeSingingBowl(528);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, phase]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    if (!isRunning) {
      audioEngine.strikeSingingBowl(432);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase("inhale");
    setTimer(4);
    setCycleCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#152317] text-[#FAF8F2] rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-[#2D4532] text-center space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <span className="font-cinzel text-xs tracking-widest text-[#D4AF37] block">4-7-8 AROMA BREATHWORK</span>
          <h3 className="font-serif-sc text-2xl font-bold text-[#FAF8F2]">
            掌心吸嗅 · 迷走神经深度重置
          </h3>
          <p className="text-xs text-stone-300 font-light max-w-xs mx-auto">
            将 1-2 滴精油滴于掌心搓热，双手呈杯状罩住口鼻，跟随律动缓慢深呼吸
          </p>
        </div>

        {/* Animated Breathing Circle */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
          {/* Outer Ripple */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-[#D4AF37]/30 transition-all duration-1000 ${
              phase === "inhale"
                ? "scale-110 opacity-80"
                : phase === "hold"
                ? "scale-110 opacity-100 animate-pulse"
                : "scale-75 opacity-40"
            }`}
          ></div>

          {/* Inner Glowing Orb */}
          <div
            className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#2D4834] via-[#1E3324] to-[#122016] border-2 border-[#D4AF37] flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
              phase === "inhale"
                ? "scale-110 shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                : phase === "hold"
                ? "scale-105 shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                : "scale-85 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            }`}
          >
            <span className="font-serif-sc font-bold text-lg text-[#D4AF37] tracking-widest">
              {phase === "inhale" ? "吸气 (闻香)" : phase === "hold" ? "屏息 (沉淀)" : "吐气 (放空)"}
            </span>
            <span className="font-mono text-4xl font-extrabold text-white mt-1">{timer}s</span>
          </div>
        </div>

        {/* Prescription Reference */}
        {prescription && (
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-xs text-stone-300">
            <span className="text-stone-400 block">当前伴随香气：</span>
            <strong className="font-serif-sc text-sm text-[#FAF8F2]">{prescription.title}</strong>
            <span className="text-stone-400 block text-[11px] mt-0.5">{prescription.poeticSub}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition-all"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="px-8 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#1C2E20] font-serif-sc font-bold text-sm transition-all shadow-lg flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>暂停吸嗅</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>开始吸嗅 (第 {cycleCount + 1} 轮)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
