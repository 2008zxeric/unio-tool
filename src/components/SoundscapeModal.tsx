import React, { useState, useEffect } from "react";
import { Sparkles, Volume2, VolumeX, Moon, Wind, Waves, Play, Pause, Clock, X, Bell } from "lucide-react";
import { audioEngine } from "../utils/audioEngine";

interface SoundscapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

const SOUNDSCAPES = [
  { id: "432hz_drone", name: "432Hz 宇宙治愈谐振", desc: "舒缓自主神经系统，诱导慢波 Alpha/Theta 脑波", freq: 432, color: "from-emerald-950 to-slate-950" },
  { id: "528hz_miracle", name: "528Hz DNA 修复共振", desc: "平抑皮质醇过载，提升深层专注与细胞自愈", freq: 528, color: "from-amber-950 to-stone-950" },
  { id: "bamboo_wind", name: "终南山古刹竹林风", desc: "自然白噪音，阻断大脑反刍思维与焦虑情绪", freq: 396, color: "from-teal-950 to-neutral-950" },
  { id: "night_pine_rain", name: "夜雨滴落松针古阶", desc: "深度助眠与松弛，营造禅意雨夜庇护所", freq: 216, color: "from-indigo-950 to-slate-950" }
];

export const SoundscapeModal: React.FC<SoundscapeModalProps> = ({
  isOpen,
  onClose,
  isAudioPlaying,
  onToggleAudio
}) => {
  const [selectedTrack, setSelectedTrack] = useState(SOUNDSCAPES[0]);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(15);

  if (!isOpen) return null;

  const handleStrikeBowl = () => {
    audioEngine.strikeSingingBowl(selectedTrack.freq);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#18281B] text-[#FAF8F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#2D4532] space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C4833] pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <h3 className="font-serif-sc text-lg font-bold text-[#FAF8F2]">432Hz 脑波声景与极境白噪音</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Soundscape Card */}
        <div className="bg-gradient-to-br from-[#233B28] to-[#121F14] p-5 rounded-2xl border border-[#3A5D40] shadow-inner space-y-4 text-center">
          <div>
            <span className="text-[10px] font-cinzel tracking-[0.2em] text-[#D4AF37] uppercase">Acoustic Therapy</span>
            <h4 className="font-serif-sc text-2xl font-bold text-[#FAF8F2] mt-1">{selectedTrack.name}</h4>
            <p className="text-xs text-stone-300 font-light mt-1 max-w-sm mx-auto">{selectedTrack.desc}</p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleStrikeBowl}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-[#FAF8F2] border border-white/15 transition-all flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>敲击西藏颂钵 ({selectedTrack.freq}Hz)</span>
            </button>

            <button
              onClick={onToggleAudio}
              className={`p-3.5 rounded-full shadow-lg transition-all active:scale-95 ${
                isAudioPlaying ? "bg-[#D4AF37] text-[#1C2E20]" : "bg-white text-[#1C2E20]"
              }`}
            >
              {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Soundscape List */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-300 block">选择声景与频率：</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SOUNDSCAPES.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrack(track);
                  if (isAudioPlaying) {
                    audioEngine.strikeSingingBowl(track.freq);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTrack.id === track.id
                    ? "bg-[#28422E] border-[#D4AF37] text-white"
                    : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif-sc font-bold text-xs">{track.name}</span>
                  <span className="text-[10px] font-mono text-[#D4AF37]">{track.freq}Hz</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Timer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2C4833] text-xs text-stone-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>定时自动停止：</span>
          </div>
          <div className="flex gap-1.5">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setTimerMinutes(mins)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  timerMinutes === mins ? "bg-[#D4AF37] text-[#1C2E20] font-bold" : "bg-white/10 text-stone-300 hover:bg-white/20"
                }`}
              >
                {mins}分
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
