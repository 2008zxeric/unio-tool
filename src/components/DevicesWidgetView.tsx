import React, { useState } from "react";
import {
  Watch,
  Smartphone,
  Sparkles,
  HeartPulse,
  Wind,
  Moon,
  Clock,
  CheckCircle2,
  Share2,
  QrCode,
  Layers,
  Zap,
  Code
} from "lucide-react";
import { ScentPrescription } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface DevicesWidgetViewProps {
  currentPrescription: ScentPrescription | null;
}

export const DevicesWidgetView: React.FC<DevicesWidgetViewProps> = ({
  currentPrescription
}) => {
  const [activeDeviceTab, setActiveDeviceTab] = useState<"watch" | "widgets" | "native_expo">("watch");
  const [simulatedHr, setSimulatedHr] = useState(72);
  const [isWatchBreathing, setIsWatchBreathing] = useState(false);

  const rx = currentPrescription || {
    title: "《暮山听松》",
    poeticSub: "冷杉与老山檀香 · 降心火而宁神志",
    rxCode: "UNIO-2026-RX8092",
    seasonTerm: "处暑"
  };

  const triggerWatchCrown = () => {
    setIsWatchBreathing(true);
    audioEngine.strikeSingingBowl(528);
    setTimeout(() => {
      setIsWatchBreathing(false);
      setSimulatedHr(65);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2DDCF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold tracking-widest text-[#8C7A6B]">UNIO WEARABLES & WIDGETS</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1C2E20] text-white font-medium">穿戴设备与小组件生态</span>
          </div>
          <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20] tracking-tight mt-1">
            Apple Watch 与 iOS/Android 桌面小组件联动
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
            实时监测心率与交感张力，在手腕上随时开启 4-7-8 芳香吸嗅仪式，抬手即现今日节气香气
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#EAE5D9] p-1 rounded-xl border border-[#D8D0C0] text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveDeviceTab("watch")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeDeviceTab === "watch" ? "bg-[#1C2E20] text-white font-bold shadow-xs" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            Apple Watch 联动
          </button>
          <button
            onClick={() => setActiveDeviceTab("widgets")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeDeviceTab === "widgets" ? "bg-[#1C2E20] text-white font-bold shadow-xs" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            iOS 桌面 & 锁屏组件
          </button>
          <button
            onClick={() => setActiveDeviceTab("native_expo")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeDeviceTab === "native_expo" ? "bg-[#1C2E20] text-white font-bold shadow-xs" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            React Native / Expo 架构
          </button>
        </div>
      </div>

      {activeDeviceTab === "watch" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Simulated Apple Watch Ultra Case */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#2B302C] to-[#1A1D1B] rounded-3xl border border-[#444D46] shadow-2xl text-white">
            <div className="w-64 h-80 rounded-[44px] bg-[#0C0F0D] border-4 border-[#8E978F] p-3 shadow-inner relative flex flex-col justify-between overflow-hidden">
              {/* Top Digital Crown Simulator indicator */}
              <div className="absolute right-0 top-16 w-1.5 h-10 bg-[#D4AF37] rounded-l-md"></div>

              {/* Watch Screen Content */}
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 px-1 pt-1">
                <span>09:41</span>
                <span className="text-[#D4AF37] flex items-center gap-1 font-bold">
                  <HeartPulse className="w-3 h-3 text-rose-500 animate-pulse" />
                  {simulatedHr} bpm
                </span>
              </div>

              {/* Main Complication Card */}
              <div className="bg-[#1C2B1E] p-3.5 rounded-2xl border border-[#344F39] text-center space-y-1.5">
                <span className="text-[9px] font-cinzel tracking-widest text-[#D4AF37] block">UNIO AROMA</span>
                <h4 className="font-serif-sc text-base font-bold text-[#FAF8F2]">{rx.title}</h4>
                <p className="text-[10px] text-stone-300 line-clamp-1">{rx.poeticSub}</p>
                <div className="pt-1 flex items-center justify-center gap-1 text-[9px] text-emerald-400">
                  <span>节气：{rx.seasonTerm}</span>
                  <span>· 宜掌心吸嗅</span>
                </div>
              </div>

              {/* Action Button on Watch */}
              <button
                onClick={triggerWatchCrown}
                className={`w-full py-2.5 rounded-xl font-serif-sc font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  isWatchBreathing
                    ? "bg-[#D4AF37] text-[#1C2E20] animate-pulse"
                    : "bg-[#28422E] hover:bg-[#34583C] text-white border border-[#45704E]"
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>{isWatchBreathing ? "腕部触觉律动吸嗅中..." : "轻触开始 4-7-8 呼吸"}</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 mt-4 text-center">
              支持 Apple Watch Series 4+ 与 Ultra (WatchOS 10+ 独立表盘组件)
            </p>
          </div>

          {/* Watch Feature Points */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-4">
              <h3 className="font-serif-sc text-lg font-bold text-[#1C2E20] flex items-center gap-2">
                <Watch className="w-5 h-5 text-[#1C2E20]" />
                手腕上的芳香疗愈中枢 (Watch Companion)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#FAF8F3] rounded-2xl border border-[#E2DAD0] space-y-1">
                  <h4 className="font-serif-sc font-bold text-stone-900 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-700" />
                    HRV 心率变异性预警
                  </h4>
                  <p className="text-stone-600 leading-relaxed font-light">
                    当检测到心率突升或压力指数超过 75 时，手表自动轻微震动，提醒滴入处方精油进行深呼吸。
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF8F3] rounded-2xl border border-[#E2DAD0] space-y-1">
                  <h4 className="font-serif-sc font-bold text-stone-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#C5A880]" />
                    Taptic Engine 触觉引导
                  </h4>
                  <p className="text-stone-600 leading-relaxed font-light">
                    无需注视屏幕，跟随手腕不同的振动脉冲节奏，完成吸气 (4s)、屏息 (7s)、吐气 (8s) 循环。
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF8F3] rounded-2xl border border-[#E2DAD0] space-y-1">
                  <h4 className="font-serif-sc font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-900" />
                    四时节气随身表盘
                  </h4>
                  <p className="text-stone-600 leading-relaxed font-light">
                    表盘小组件实时展示当日节气与对应归经草木，随抬腕一触即达。
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF8F3] rounded-2xl border border-[#E2DAD0] space-y-1">
                  <h4 className="font-serif-sc font-bold text-stone-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-900" />
                    离线处方存储
                  </h4>
                  <p className="text-stone-600 leading-relaxed font-light">
                    脱离 iPhone 独立运行，飞行模式或禅修静室中依旧完整可用。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDeviceTab === "widgets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Small Widget */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-600">小尺寸锁屏/桌面组件 (2x2)</span>
              <div className="w-44 h-44 bg-[#1C2E20] text-white p-4 rounded-3xl border border-[#2E4A34] shadow-lg flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-[9px] text-[#D4AF37]">UNIO SCENT</span>
                  <span className="text-[10px] px-1.5 bg-white/10 rounded">处暑</span>
                </div>
                <div>
                  <h4 className="font-serif-sc font-bold text-sm text-[#FAF8F2]">{rx.title}</h4>
                  <p className="text-[10px] text-stone-300 line-clamp-1">冷杉老山檀香</p>
                </div>
                <div className="flex items-center justify-between text-[9px] text-stone-400 border-t border-white/10 pt-1.5">
                  <span>宜：掌心吸嗅</span>
                  <span className="text-[#D4AF37]">432Hz</span>
                </div>
              </div>
            </div>

            {/* Medium Widget */}
            <div className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold text-stone-600">中尺寸桌面与实时活动 (Live Activity 4x2)</span>
              <div className="h-44 bg-gradient-to-r from-[#1C2E20] via-[#243B2A] to-[#162419] text-white p-5 rounded-3xl border border-[#2E4A34] shadow-lg flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#1C2E20] flex items-center justify-center font-bold text-xs">
                      方
                    </div>
                    <span className="font-serif-sc font-bold text-sm text-[#FAF8F2]">一人一方 · 身心实时调理</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#D4AF37] font-mono">
                    {rx.rxCode}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-1">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-stone-400 block">今日处方</span>
                    <span className="font-serif-sc font-bold text-[#FAF8F2]">{rx.title}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-stone-400 block">身心情绪</span>
                    <span className="font-medium text-emerald-300">降心火宁神</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-stone-400 block">疗愈频段</span>
                    <span className="font-medium text-[#D4AF37]">432Hz 宇宙声景</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-white/10 pt-2">
                  <span>轻触直接开启 5 分钟沉浸式芳香吸嗅</span>
                  <span className="text-emerald-400">副交感神经已就绪 ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDeviceTab === "native_expo" && (
        <div className="bg-white/80 p-6 sm:p-8 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#1C2E20]" />
            <h3 className="font-serif-sc text-lg font-bold text-[#1C2E20]">
              React Native / Expo 移动端与原生桥接架构
            </h3>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            本项目基于 Vite/React 构建极速 Web 全功能应用，同时底层 API 与数据结构（`src/types.ts` 与 `server.ts`）已完全按照 React Native / Expo 原生标准对齐。
          </p>

          <div className="bg-[#1C2E20] text-stone-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto space-y-2 border border-[#314E37]">
            <p className="text-[#D4AF37]">// Expo & WatchConnectivity 原生桥接模块</p>
            <p className="text-stone-300">import &#123; sendMessage, updateApplicationContext &#125; from &apos;react-native-watch-connectivity&apos;;</p>
            <p className="text-stone-300">import * as Haptics from &apos;expo-haptics&apos;;</p>
            <p className="text-stone-300">import AppleHealthKit from &apos;react-native-health&apos;;</p>
            <br />
            <p className="text-stone-400">// 同步最新处方至 Apple Watch</p>
            <p className="text-emerald-400">
              export async function syncPrescriptionToWatch(rx: ScentPrescription) &#123;<br />
              &nbsp;&nbsp;await updateApplicationContext(&#123; rxCode: rx.rxCode, title: rx.title, season: rx.seasonTerm &#125;);<br />
              &nbsp;&nbsp;await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);<br />
              &#125;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
