import React from "react";
import {
  Sparkles,
  Compass,
  BookOpen,
  CalendarHeart,
  FlaskConical,
  Watch,
  HeartHandshake,
  Wind,
  Leaf,
  Sliders,
  ChevronRight,
  ArrowUpRight,
  Shield,
  Activity,
  Flame,
  Droplet,
  Volume2
} from "lucide-react";
import { ScentPrescription, MoodCheckin } from "../types";
import { SOLAR_TERMS_CALENDAR } from "../data/scentDatabase";
import { audioEngine } from "../utils/audioEngine";

interface HomeDashboardViewProps {
  onNavigate: (tab: "home" | "consultation" | "prescriptions" | "blender" | "botanical" | "tracker" | "atelier" | "devices") => void;
  currentPrescription: ScentPrescription | null;
  onStartBreathwork: (rx: ScentPrescription) => void;
  onOpenSoundscape: () => void;
  latestCheckin?: MoodCheckin;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  onNavigate,
  currentPrescription,
  onStartBreathwork,
  onOpenSoundscape,
  latestCheckin
}) => {
  const currentSolarTerm = SOLAR_TERMS_CALENDAR[13]; // 处暑

  const handleQuickEmergencyCalm = () => {
    audioEngine.strikeSingingBowl(528);
    if (currentPrescription) {
      onStartBreathwork(currentPrescription);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Daily Zen & Solar Term Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1C2E20] via-[#243B2A] to-[#122016] text-[#FAF8F3] rounded-3xl p-6 sm:p-8 shadow-md border border-[#2E4A34]">
        {/* Subtle decorative ring */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border border-white/5 pointer-events-none"></div>
        <div className="absolute right-12 -top-12 w-32 h-32 rounded-full border border-[#D4AF37]/10 pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span className="font-serif-sc text-xs tracking-widest text-[#E5DCBE]">今日四时节气 · {currentSolarTerm.name}</span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 font-mono">
              五行属{currentSolarTerm.element}
            </span>
          </div>

          <div>
            <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {currentSolarTerm.aroma}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light mt-1.5 leading-relaxed max-w-xl">
              {currentSolarTerm.desc}。顺应天时，以自然草木之精微香气调和脏腑气血。
            </p>
          </div>

          {/* Quick Actions Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {currentPrescription && (
              <button
                onClick={() => {
                  audioEngine.playDropletSound();
                  onStartBreathwork(currentPrescription);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#C29F2F] text-[#1C2E20] font-serif-sc font-bold text-xs shadow-sm transition-all"
              >
                <Wind className="w-4 h-4" />
                <span>4-7-8 掌心吸嗅</span>
              </button>
            )}

            <button
              onClick={() => {
                audioEngine.playDropletSound();
                onOpenSoundscape();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-serif-sc text-xs border border-white/15 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>432Hz 脑波声景</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main High-Priority Action Cards (2 Columns on Mobile/Tablet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Entrance A: AI Consultation */}
        <div
          onClick={() => {
            audioEngine.playDropletSound();
            onNavigate("consultation");
          }}
          className="bg-white/90 p-5 rounded-3xl border border-[#E0D7C5] shadow-2xs hover:border-[#C5A880] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF5EE] text-[#1C2E20] flex items-center justify-center border border-[#CBE5D2]">
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif-sc font-bold text-base text-[#1C2E20]">AI 身心五行问诊</h3>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#1C2E20] transition-colors" />
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              3分钟辨证体质气虚、焦虑心火或气郁，支持拍照识面容神态，生成专属处方笺。
            </p>
          </div>
          <span className="text-[11px] text-[#8C7A6B] font-semibold flex items-center gap-1 mt-4 pt-3 border-t border-[#F0EBE0]">
            开始测评定制 <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Entrance B: Scent Prescription Archive */}
        <div
          onClick={() => {
            audioEngine.playDropletSound();
            onNavigate("prescriptions");
          }}
          className="bg-white/90 p-5 rounded-3xl border border-[#E0D7C5] shadow-2xs hover:border-[#C5A880] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#F6F2EA] text-[#8C7A6B] flex items-center justify-center border border-[#E2DAD0]">
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif-sc font-bold text-base text-[#1C2E20]">我的处方档案笺</h3>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#1C2E20] transition-colors" />
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              查阅已生成的东方极境处方、嗅觉金字塔、滴管调香模拟器与宣纸海报导出。
            </p>
          </div>
          <span className="text-[11px] text-[#8C7A6B] font-semibold flex items-center gap-1 mt-4 pt-3 border-t border-[#F0EBE0]">
            查看处方档案 <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 3. Emergency SOS Banner (1-Tap Anxiety Rescue) */}
      <div className="bg-[#FAF3EA] border border-[#EBDCC5] p-4 sm:p-5 rounded-3xl flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#A82A2A] text-white flex items-center justify-center shrink-0 shadow-xs">
            <HeartHandshake className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-serif-sc font-bold text-sm text-[#5C2323]">即时情绪急救与心神定锚</h4>
            <p className="text-xs text-stone-600 font-light mt-0.5">
              突发焦虑、心慌胸闷或失眠？立即开启 4-7-8 呼吸引导与 528Hz 颂钵平抑心率。
            </p>
          </div>
        </div>

        <button
          onClick={handleQuickEmergencyCalm}
          className="px-4 py-2.5 bg-[#A82A2A] hover:bg-[#8C2323] text-white font-serif-sc font-bold text-xs rounded-xl shadow-xs shrink-0 transition-all"
        >
          立即开始
        </button>
      </div>

      {/* 4. Secondary Atelier & Lab Tools Grid (4 Clean Mini-Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-sc text-sm font-bold text-[#1C2E20] flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-[#1C2E20]" />
            调香工坊与专业工具
          </h3>
          <span className="text-xs text-stone-500 font-light">一键直达专业芳疗功能</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Tool 1: Oil Blender */}
          <div
            onClick={() => {
              audioEngine.playDropletSound();
              onNavigate("blender");
            }}
            className="bg-white/80 p-4 rounded-2xl border border-[#E2DAD0] hover:border-[#1C2E20] cursor-pointer transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <Sliders className="w-4 h-4" />
            </div>
            <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] group-hover:text-amber-900 transition-colors">
              调香稀释计算器
            </h4>
            <p className="text-[11px] text-stone-500 line-clamp-2">
              滴数换算与前中后调黄金配比测算
            </p>
          </div>

          {/* Tool 2: Botanical Encyclopedia */}
          <div
            onClick={() => {
              audioEngine.playDropletSound();
              onNavigate("botanical");
            }}
            className="bg-white/80 p-4 rounded-2xl border border-[#E2DAD0] hover:border-[#1C2E20] cursor-pointer transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Leaf className="w-4 h-4" />
            </div>
            <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] group-hover:text-emerald-900 transition-colors">
              草本与GC-MS百科
            </h4>
            <p className="text-[11px] text-stone-500 line-clamp-2">
              200+ 芳香植物与挥发分子数据库
            </p>
          </div>

          {/* Tool 3: Bespoke Atelier Lab */}
          <div
            onClick={() => {
              audioEngine.playDropletSound();
              onNavigate("atelier");
            }}
            className="bg-white/80 p-4 rounded-2xl border border-[#E2DAD0] hover:border-[#1C2E20] cursor-pointer transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center border border-stone-300">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] group-hover:text-stone-900 transition-colors">
              专属工坊打样
            </h4>
            <p className="text-[11px] text-stone-500 line-clamp-2">
              瓶身刻字、手工避光醇化与冷链
            </p>
          </div>

          {/* Tool 4: Watch & Widgets */}
          <div
            onClick={() => {
              audioEngine.playDropletSound();
              onNavigate("devices");
            }}
            className="bg-white/80 p-4 rounded-2xl border border-[#E2DAD0] hover:border-[#1C2E20] cursor-pointer transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-200">
              <Watch className="w-4 h-4" />
            </div>
            <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] group-hover:text-indigo-900 transition-colors">
              Apple Watch 穿戴
            </h4>
            <p className="text-[11px] text-stone-500 line-clamp-2">
              实时 HRV 预警与锁屏小组件
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
