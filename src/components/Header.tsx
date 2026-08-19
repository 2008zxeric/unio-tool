import React, { useState } from "react";
import {
  Sparkles,
  Sun,
  BookOpen,
  Sliders,
  Compass,
  CalendarHeart,
  FlaskConical,
  Volume2,
  VolumeX,
  Leaf,
  Menu,
  X,
  Layers,
  Award,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { SOLAR_TERMS_CALENDAR } from "../data/scentDatabase";
import { audioEngine } from "../utils/audioEngine";

export type NavTab = 
  | "daily"        // ① 今日香气 (含24节气)
  | "botanical"    // ② 精油百科
  | "blender"      // ③ 我的配方
  | "vibe_test"    // ④ 闻香测试
  | "tracker"      // ⑤ 我的香气日记
  | "consultation" // 深度问诊 / 五行面容
  | "prescriptions"// 处方档案 (Keepsake Cards)
  | "atelier"      // 专属工坊打样
  | "devices";     // 穿戴组件

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenSoundscapeModal: () => void;
  onOpenWatchModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAudioPlaying,
  onToggleAudio,
  onOpenSoundscapeModal,
  onOpenWatchModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentSolarTerm = SOLAR_TERMS_CALENDAR[13]; // 处暑

  // 5 Core Mobile Hallmark Card Entries
  const coreTabs: { id: NavTab; label: string; subLabel: string; icon: any; badge?: string }[] = [
    { id: "consultation", label: "一人一方", subLabel: "AI对话·定制", icon: Sparkles, badge: "AI" },
    { id: "daily", label: "今日香气", subLabel: "循时·节气", icon: Sun },
    { id: "botanical", label: "精油百科", subLabel: "五行·百草", icon: Leaf },
    { id: "blender", label: "我的配方", subLabel: "沙箱·滴数", icon: Sliders },
    { id: "prescriptions", label: "处方档案", subLabel: "高定·手帐", icon: BookOpen }
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    audioEngine.playDropletSound();
  };

  return (
    <>
      {/* Top Header - Hallmark Deckled Cotton Paper Bar */}
      <header className="w-full bg-[#FAF7F0]/95 border-b border-[#E5DEC9] sticky top-0 z-40 backdrop-blur-md transition-all shadow-2xs">
        {/* Subtle Top Gold Filigree Trim */}
        <div className="h-0.75 w-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/60 to-[#D4AF37]/20"></div>

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          {/* Logo & Brand - Hallmark Gold-Embossed Keepsake Monogram */}
          <div
            onClick={() => handleTabClick("consultation")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1C2E20] to-[#122015] flex items-center justify-center text-[#E5DCBE] shadow-xs border border-[#D4AF37]/40 relative group-hover:scale-105 transition-transform">
              <span className="font-serif-sc font-bold text-lg tracking-widest text-[#E5DCBE]">方</span>
              {/* Wax Seal Dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 hallmark-wax-seal flex items-center justify-center text-[7px] font-bold">
                印
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-[10px] font-bold tracking-[0.25em] text-[#8C7A6B]">UNIO</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#1C2E20]/8 text-[#1C2E20] font-medium border border-[#D4AF37]/30">
                  一人一方
                </span>
              </div>
              <h1 className="font-serif-sc text-sm sm:text-base font-bold text-[#1C2E20] tracking-wide">
                高定身心芳香笺
              </h1>
            </div>
          </div>

          {/* Right Info & Audio Pill & More Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Current Solar Term Hallmark Tag */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#FAF4E6] px-3 py-1 rounded-full border border-[#D4AF37]/40 text-xs text-[#5C5042] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#941B1B]"></span>
              <span className="font-serif-sc font-bold text-[#1C2E20]">{currentSolarTerm.name} (金行)</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-600 truncate max-w-[80px] font-serif-sc">{currentSolarTerm.aroma}</span>
            </div>

            {/* Desktop Atelier Link */}
            <button
              onClick={() => handleTabClick("atelier")}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-serif-sc font-bold transition-all ${
                activeTab === "atelier"
                  ? "bg-[#1C2E20] text-[#FAF8F3] border-[#1C2E20] shadow-xs"
                  : "bg-white/80 hover:bg-white border-[#DCD5C4] text-[#4A4035]"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>工坊打样</span>
            </button>

            {/* 432Hz Soundscape Pill */}
            <div className="flex items-center bg-[#1C2E20] text-[#E8E2D5] rounded-full p-0.5 pl-2.5 pr-1 border border-[#D4AF37]/30 shadow-xs gap-1.5">
              <button
                onClick={onOpenSoundscapeModal}
                className="flex items-center gap-1 text-[11px] text-[#EAE4D5] hover:text-[#D4AF37] transition-colors"
                title="打开东方声景冥想台"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                <span className="font-medium font-serif-sc hidden sm:inline">432Hz 颂钵</span>
              </button>
              <button
                onClick={onToggleAudio}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isAudioPlaying
                    ? "bg-[#D4AF37] text-[#1C2E20] shadow-2xs scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
                title={isAudioPlaying ? "暂停背景声景" : "开启432Hz背景声景"}
              >
                {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Mobile Hamburger / Secondary Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/80 border border-[#DCD5C4] text-stone-700 hover:text-stone-900 transition-colors"
              title="更多功能"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Desktop 5 Core Navigation Row */}
        <nav className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between border-t border-[#EAE3D2] py-1">
          <div className="flex items-center gap-1.5">
            {coreTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif-sc transition-all ${
                    isActive
                      ? "bg-[#1C2E20] text-[#FAF8F3] font-bold shadow-xs border border-[#1C2E20]"
                      : "text-[#594E42] hover:bg-[#EBE5D6] hover:text-[#1C2E20]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D4AF37]" : "text-stone-500"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${isActive ? "bg-[#D4AF37] text-[#1C2E20]" : "bg-[#1C2E20]/10 text-[#1C2E20]"}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTabClick("vibe_test")}
              className={`text-xs px-3 py-1.5 rounded-xl font-serif-sc transition-all ${
                activeTab === "vibe_test" ? "bg-[#1C2E20] text-white font-bold" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              闻香直觉测验
            </button>
            <button
              onClick={() => handleTabClick("tracker")}
              className={`text-xs px-3 py-1.5 rounded-xl font-serif-sc transition-all ${
                activeTab === "tracker" ? "bg-[#1C2E20] text-white font-bold" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              香气身心日记
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Slide-out for Secondary Sections */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end md:hidden animate-in fade-in duration-200">
          <div className="bg-[#FAF7F0] rounded-t-3xl p-5 border-t border-[#D4AF37]/40 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2DBC9] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#941B1B]"></span>
                <h3 className="font-serif-sc font-bold text-base text-[#1C2E20]">全案芳香服务导航</h3>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 bg-white border border-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                onClick={() => handleTabClick("prescriptions")}
                className="p-3.5 rounded-2xl bg-white border border-[#E0D7C5] text-left space-y-1 hover:border-[#D4AF37]"
              >
                <div className="font-serif-sc font-bold text-[#1C2E20] flex items-center justify-between">
                  <span>处方卡片夹</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <p className="text-[11px] text-stone-500">已定制的芳香处方收藏笺</p>
              </button>

              <button
                onClick={() => handleTabClick("consultation")}
                className="p-3.5 rounded-2xl bg-white border border-[#E0D7C5] text-left space-y-1 hover:border-[#D4AF37]"
              >
                <div className="font-serif-sc font-bold text-[#1C2E20] flex items-center justify-between">
                  <span>五行面容识神</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <p className="text-[11px] text-stone-500">AI 镜头气色望诊与舌象</p>
              </button>

              <button
                onClick={() => handleTabClick("atelier")}
                className="p-3.5 rounded-2xl bg-white border border-[#E0D7C5] text-left space-y-1 hover:border-[#D4AF37]"
              >
                <div className="font-serif-sc font-bold text-[#1C2E20] flex items-center justify-between">
                  <span>工坊手工打样</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <p className="text-[11px] text-stone-500">私人订制刻字与檀木礼盒</p>
              </button>

              <button
                onClick={() => {
                  onOpenSoundscapeModal();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#1C2E20] text-white border border-[#2F4A34] text-left space-y-1"
              >
                <div className="font-serif-sc font-bold text-[#D4AF37] flex items-center justify-between">
                  <span>432Hz 颂钵声景</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-stone-300">自然疗愈频率与白噪音</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hallmark Artisanal Mobile Bottom Capsule Navigation Bar */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-[#FAF7F0]/95 backdrop-blur-lg border border-[#D4AF37]/40 py-1.5 px-2 rounded-2xl shadow-xl flex items-center justify-around">
        {coreTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all relative ${
                isActive
                  ? "text-[#1C2E20] font-bold scale-105"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#1C2E20] text-[#D4AF37] shadow-sm border border-[#D4AF37]/30"
                    : "text-stone-500 bg-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-0.5 font-serif-sc leading-none ${isActive ? "text-[#1C2E20] font-bold" : "text-stone-500"}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#941B1B] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
