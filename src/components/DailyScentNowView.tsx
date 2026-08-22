import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Sun,
  Moon,
  CloudSun,
  Sunset,
  Wind,
  CalendarHeart,
  FlaskConical,
  Volume2,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Shield,
  ChevronRight,
  Flame,
  TreePine,
  Waves,
  Mountain,
  Zap,
  Leaf,
  Heart
} from "lucide-react";
import {
  SOLAR_TERMS_DETAILED_CALENDAR,
  UNIO_APPARATUS_LIST,
  CURATED_PRESCRIPTIONS
} from "../data/scentDatabase";
import { ScentPrescription, SolarTermDetail } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface DailyScentNowViewProps {
  onStartBreathwork: (rx: ScentPrescription) => void;
  onOpenSoundscape: () => void;
  onGoToTracker: (rx: ScentPrescription, timeSlot: string) => void;
  onGoToBlender: (rx: ScentPrescription) => void;
  onGoToAtelier: (rx: ScentPrescription) => void;
  onNavigateTab: (tab: string) => void;
}

export const DailyScentNowView: React.FC<DailyScentNowViewProps> = ({
  onStartBreathwork,
  onOpenSoundscape,
  onGoToTracker,
  onGoToBlender,
  onGoToAtelier,
  onNavigateTab
}) => {
  const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());
  const [mainMode, setMainMode] = useState<"routine" | "solar_terms">("routine");
  const [selectedSlotOverride, setSelectedSlotOverride] = useState<"morning" | "noon" | "dusk" | "night" | null>(null);

  // 24 Solar terms state (defaults to 处暑 / index 13)
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<string>("all");
  const [selectedSolarTerm, setSelectedSolarTerm] = useState<SolarTermDetail>(
    SOLAR_TERMS_DETAILED_CALENDAR[13] || SOLAR_TERMS_DETAILED_CALENDAR[0]
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Determine current slot
  const currentSlot = selectedSlotOverride || (
    currentHour >= 5 && currentHour < 11
      ? "morning"
      : currentHour >= 11 && currentHour < 16
      ? "noon"
      : currentHour >= 16 && currentHour < 20
      ? "dusk"
      : "night"
  );

  const slotData = {
    morning: {
      timeRange: "06:00 ~ 09:30",
      slotName: "清晨 · 唤醒升阳",
      icon: Sun,
      title: "《元·水 · 晨曦醒神笺》",
      desc: "清风出袖，晨光初照。以卡拉布里亚无光敏佛手柑与安吉白茶宣肺通气，唤醒一整天的敏锐专注。",
      prescription: CURATED_PRESCRIPTIONS[1] || CURATED_PRESCRIPTIONS[0],
      apparatus: UNIO_APPARATUS_LIST[0],
      tcmGuide: "宜辰时 (7:00~9:00) 胃经当令，点涂膻中穴与佩戴香佩，振奋清阳之气。",
      cardTexture: "from-[#FBF8F2] via-[#F6F0E4] to-[#EFE7D8]"
    },
    noon: {
      timeRange: "11:30 ~ 14:30",
      slotName: "午后 · 止语防倦",
      icon: CloudSun,
      title: "《止语雾 · 疏肝解郁笺》",
      desc: "日正中天，心火易亢。以西伯利亚冷杉与英国高地洋甘菊抚平工作琐碎引起的烦闷与肩颈紧绷。",
      prescription: CURATED_PRESCRIPTIONS[2] || CURATED_PRESCRIPTIONS[0],
      apparatus: UNIO_APPARATUS_LIST[1],
      tcmGuide: "宜未时 (13:00~15:00) 小肠经当令，滚珠点按太阳穴与风池穴，快速为大脑降温充能。",
      cardTexture: "from-[#F5FAF6] via-[#EBF3ED] to-[#DFEDE2]"
    },
    dusk: {
      timeRange: "17:00 ~ 19:30",
      slotName: "黄昏 · 归家卸甲",
      icon: Sunset,
      title: "《暮山听松 · 卸压切换笺》",
      desc: "夕阳西下，切换生活场域。以阿曼皇家绿乳香与迈索尔老山檀香重构空间结界，将工作压力留在门外。",
      prescription: CURATED_PRESCRIPTIONS[0],
      apparatus: UNIO_APPARATUS_LIST[2],
      tcmGuide: "宜酉时 (17:00~19:00) 肾经当令，室内超声波冷雾扩香，滋阴潜阳，抚平浮躁气血。",
      cardTexture: "from-[#FAF6FC] via-[#F2EAF6] to-[#E9DEEF]"
    },
    night: {
      timeRange: "21:00 ~ 23:30",
      slotName: "子夜 · 月华入梦",
      icon: Moon,
      title: "《月华油 · 沉香安神笺》",
      desc: "万籁俱寂，阳气归阴。以海南沉香、高地真薰衣草与海地岩兰草交泰心肾，阻断焦虑反刍，自然进入深睡。",
      prescription: CURATED_PRESCRIPTIONS[2] || CURATED_PRESCRIPTIONS[0],
      apparatus: UNIO_APPARATUS_LIST[4],
      tcmGuide: "宜亥时 (21:00~23:00) 三焦经当令，掌心搓热点滴精油扣于鼻前吸嗅，引阳入阴。",
      cardTexture: "from-[#F4F7FB] via-[#E9EFF7] to-[#DFE8F3]"
    }
  };

  const activeSlot = slotData[currentSlot] || slotData["morning"];

  const filteredSolarTerms = SOLAR_TERMS_DETAILED_CALENDAR.filter(term => {
    if (selectedSeasonFilter === "all") return true;
    return term.season === selectedSeasonFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-20 md:pb-10">
      {/* Hallmark Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DEC9] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#8C7A6B]">UNIO DAILY RHYTHM</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C2E20] text-[#D4AF37] font-serif-sc font-medium flex items-center gap-1 shadow-2xs">
              <Compass className="w-3 h-3 text-[#D4AF37]" />
              二十四节气 · 处暑 (金行)
            </span>
          </div>
          <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20] tracking-tight mt-1">
            今日香气 · 循时与节气流转
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-0.5">
            东方天人相应。随十二时辰经络当令与二十四节气物候，定制身心芳香调和笺。
          </p>
        </div>

        {/* Hallmark Artisanal Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#EBE5D6] p-1 rounded-2xl border border-[#D4AF37]/30 text-xs self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => {
              setMainMode("routine");
              audioEngine.playDropletSound();
            }}
            className={`px-3.5 py-2 rounded-xl font-serif-sc font-bold transition-all flex items-center gap-1.5 ${
              mainMode === "routine"
                ? "bg-[#1C2E20] text-[#FAF8F3] shadow-xs border border-[#D4AF37]/40"
                : "text-stone-700 hover:text-stone-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>十二时辰 · 循时用香</span>
          </button>

          <button
            onClick={() => {
              setMainMode("solar_terms");
              audioEngine.playDropletSound();
            }}
            className={`px-3.5 py-2 rounded-xl font-serif-sc font-bold transition-all flex items-center gap-1.5 ${
              mainMode === "solar_terms"
                ? "bg-[#1C2E20] text-[#FAF8F3] shadow-xs border border-[#D4AF37]/40"
                : "text-stone-700 hover:text-stone-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>二十四节气 · 芳香流转</span>
          </button>
        </div>
      </div>

      {/* ================= MODE 1: 十二时辰循时用香 (Daily Rhythm) ================= */}
      {mainMode === "routine" && (
        <div className="space-y-6">
          {/* Mobile Horizontal Snap-Scroll / Desktop 4 Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {(["morning", "noon", "dusk", "night"] as const).map((slotKey) => {
              const item = slotData[slotKey];
              const IconComponent = item.icon;
              const isCurrent = currentSlot === slotKey;

              return (
                <button
                  key={slotKey}
                  onClick={() => {
                    setSelectedSlotOverride(slotKey);
                    audioEngine.playDropletSound();
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2.5 ${
                    isCurrent
                      ? "bg-[#1C2E20] text-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40 scale-102"
                      : "bg-[#FAF7F0] text-stone-700 border-[#E2DBC9] hover:border-[#D4AF37]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono opacity-80">{item.timeRange}</span>
                    <IconComponent className={`w-4 h-4 ${isCurrent ? "text-[#D4AF37]" : "text-stone-400"}`} />
                  </div>
                  <div>
                    <h4 className="font-serif-sc font-bold text-sm sm:text-base leading-tight">{item.slotName}</h4>
                    <p className={`text-[11px] truncate mt-1 ${isCurrent ? "text-stone-300" : "text-stone-500"}`}>
                      {item.title}
                    </p>
                  </div>
                  {isCurrent && (
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-[#D4AF37] font-serif-sc font-bold">
                      <span>● 当前推荐时段</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping"></span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Hallmark Keepsake Card: Recommended Formulation + Paired Physical Apparatus */}
          <div className={`hallmark-card hallmark-foil-frame p-5 sm:p-8 bg-gradient-to-br ${activeSlot.cardTexture} border border-[#D4AF37]/40 shadow-md space-y-6`}>
            {/* Top Row: Title, Verse, Action Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#D4AF37]/25 pb-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full bg-[#1C2E20] text-[#D4AF37] text-xs font-serif-sc font-bold shadow-2xs">
                    {activeSlot.slotName}
                  </span>
                  <span className="text-xs text-stone-600 font-mono">
                    推荐用香时辰：{activeSlot.timeRange}
                  </span>
                </div>
                <h3 className="font-serif-sc text-2xl sm:text-4xl font-bold text-[#1C2E20] tracking-tight">
                  {activeSlot.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-800 font-light max-w-2xl leading-relaxed">
                  {activeSlot.desc}
                </p>
              </div>

              {/* Quick Tactile Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onStartBreathwork(activeSlot.prescription)}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-[#1C2E20] hover:bg-[#28422E] text-white font-serif-sc font-bold text-xs sm:text-sm shadow-md border border-[#D4AF37]/40 transition-all flex items-center justify-center gap-2"
                >
                  <Wind className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                  <span>4-7-8 节律吸嗅</span>
                </button>
                <button
                  onClick={onOpenSoundscape}
                  className="px-4 py-3 rounded-2xl bg-white/90 hover:bg-white text-stone-800 font-serif-sc font-bold text-xs sm:text-sm border border-[#DCD5C4] transition-all flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-emerald-800" />
                  <span>432Hz 颂钵</span>
                </button>
              </div>
            </div>

            {/* Middle Section: Scent Formula Card & Paired Physical Apparatus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Formula & Key Molecules */}
              <div className="bg-[#FAF7F0]/90 p-5 rounded-2xl border border-[#E0D7C5] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-2">
                  <h4 className="font-serif-sc font-bold text-xs sm:text-sm text-[#1C2E20] flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-[#8C7A6B]" />
                    <span>时令核心精油复配组合</span>
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#EAE5D9] text-[#4A4035] font-mono">
                    {activeSlot.prescription.olfactoryPyramid.carrierOil}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="text-stone-500 font-medium block mb-1 text-[11px]">香气金字塔成分与比例：</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...activeSlot.prescription.olfactoryPyramid.topNotes,
                        ...activeSlot.prescription.olfactoryPyramid.middleNotes,
                        ...activeSlot.prescription.olfactoryPyramid.baseNotes
                      ].map((n, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-white text-stone-800 border border-[#E0D7C5] text-xs shadow-2xs font-serif-sc">
                          {n?.name || "未知"} · {n?.ratio}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs pt-1.5">
                    <span className="text-stone-500 font-medium block mb-1 text-[11px]">关键药理活性分子：</span>
                    <div className="space-y-1">
                      {activeSlot.prescription.molecularAnalysis.map((m, mi) => (
                        <div key={mi} className="text-stone-700 bg-white/70 p-2 rounded-xl border border-[#E8DFC8] text-[11px]">
                          <strong className="text-stone-900">{m.compound} ({m.percentage})</strong>：{m.benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#EAE3D5] text-xs">
                  <button
                    onClick={() => onGoToBlender(activeSlot.prescription)}
                    className="text-[#1C2E20] font-serif-sc font-bold hover:underline flex items-center gap-1"
                  >
                    <span>在沙箱中微调此配方</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onGoToTracker(activeSlot.prescription, activeSlot.slotName)}
                    className="text-[#941B1B] font-serif-sc font-bold hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>记入今日日记</span>
                  </button>
                </div>
              </div>

              {/* Paired Physical Apparatus Card */}
              <div className="bg-[#FAF7F0]/90 p-5 rounded-2xl border border-[#E0D7C5] space-y-3.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-2">
                    <h4 className="font-serif-sc font-bold text-xs sm:text-sm text-[#1C2E20] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>最佳实体物理器具搭配</span>
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C2E20] text-[#D4AF37] font-serif-sc font-bold">
                      {activeSlot.apparatus.categoryName}
                    </span>
                  </div>

                  <h5 className="font-serif-sc font-bold text-base sm:text-lg text-[#1C2E20]">
                    {activeSlot.apparatus?.name || "未知器具"}
                  </h5>
                  <p className="text-xs text-stone-600 font-mono">
                    材质工艺：{activeSlot.apparatus.material}
                  </p>
                  <p className="text-xs text-stone-700 leading-relaxed font-light mt-1">
                    {activeSlot.apparatus.desc}
                  </p>

                  <div className="p-3 bg-white/80 rounded-xl border border-[#E2D8C7] text-xs text-stone-800 mt-2 shadow-2xs">
                    <strong className="text-emerald-900 block mb-0.5 font-serif-sc font-bold">循时经络导引：</strong>
                    {activeSlot.tcmGuide}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onGoToAtelier(activeSlot.prescription)}
                    className="w-full py-2.5 bg-white hover:bg-[#1C2E20] hover:text-white text-stone-800 font-serif-sc font-bold text-xs rounded-xl border border-[#D5CCBA] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>工坊专属刻字打样与手工调配</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 2: 二十四节气芳香流转 (24 Solar Terms Seasonal Flow) ================= */}
      {mainMode === "solar_terms" && (
        <div className="space-y-6">
          {/* Season Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-stone-500 font-serif-sc font-bold shrink-0 mr-1">四季气机：</span>
            {[
              { id: "all", label: "全部 24 节气" },
              { id: "春", label: "春 · 木 (肝胆生发)" },
              { id: "夏", label: "夏 · 火 (心经繁茂)" },
              { id: "长夏", label: "长夏 · 土 (脾胃化湿)" },
              { id: "秋", label: "秋 · 金 (肺金肃降)" },
              { id: "冬", label: "冬 · 水 (肾水封藏)" }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSeasonFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl border font-serif-sc transition-all shrink-0 ${
                  selectedSeasonFilter === s.id
                    ? "bg-[#1C2E20] text-white border-[#1C2E20] font-bold shadow-2xs"
                    : "bg-white text-stone-700 border-[#DDD5C5] hover:bg-stone-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* 24 Terms Hallmark Deckled Grid / Mobile Touch Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {filteredSolarTerms.map(term => {
              const isSelected = selectedSolarTerm.id === term.id;
              return (
                <button
                  key={term.id}
                  onClick={() => {
                    setSelectedSolarTerm(term);
                    audioEngine.playDropletSound();
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between space-y-1.5 ${
                    isSelected
                      ? "bg-[#1C2E20] text-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40 scale-102"
                      : "bg-[#FAF7F0] text-stone-800 border-[#E2DBC9] hover:border-[#D4AF37]/50"
                  }`}
                >
                  <span className={`text-[10px] font-serif-sc font-bold px-1.5 py-0.2 rounded-full mx-auto ${
                    term.element === "木" ? "bg-emerald-100 text-emerald-900" :
                    term.element === "火" ? "bg-rose-100 text-rose-900" :
                    term.element === "土" ? "bg-amber-100 text-amber-900" :
                    term.element === "金" ? "bg-slate-100 text-slate-900" : "bg-indigo-100 text-indigo-900"
                  }`}>
                    {term.season} · {term.element}
                  </span>
                  <h4 className="font-serif-sc font-bold text-sm sm:text-base">{term.name}</h4>
                  <span className="text-[9px] text-stone-500 line-clamp-1 font-mono">{term.dateRange}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Solar Term Hallmark Keepsake Slip */}
          <div className="hallmark-card hallmark-foil-frame p-5 sm:p-8 bg-[#FAF7F0] border border-[#D4AF37]/40 shadow-md space-y-6 relative overflow-hidden">
            {/* Wax Seal Stamp Watermark */}
            <div className="absolute right-4 top-4 w-16 h-16 rounded-full hallmark-wax-seal opacity-20 flex items-center justify-center text-sm font-serif-sc font-bold pointer-events-none select-none">
              {selectedSolarTerm.element}行
            </div>

            {/* Header */}
            <div className="border-b border-[#E5DEC9] pb-4 space-y-2 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C2E20] text-[#D4AF37] font-serif-sc font-bold">
                    {selectedSolarTerm.season}季 · {selectedSolarTerm.element}行
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    节气公历流转：{selectedSolarTerm.dateRange}
                  </span>
                </div>
                <span className="text-xs font-serif-sc italic text-[#8C7A6B]">
                  「{selectedSolarTerm.poeticVerse}」
                </span>
              </div>

              <h3 className="font-serif-sc text-2xl sm:text-4xl font-bold text-[#1C2E20]">
                {selectedSolarTerm?.name || "未知节气"} · 芳香调和经络笺
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-light">
                <strong>三候物候：</strong>{selectedSolarTerm.phenology}
              </p>
            </div>

            {/* Grid 1: Climate Feature & TCM Principle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-1">
                <span className="text-stone-400 block font-medium">天地气候气机特征：</span>
                <p className="text-stone-800 leading-relaxed font-serif-sc">{selectedSolarTerm.climateFeature}</p>
                <span className="text-[#941B1B] block pt-1 font-medium">
                  <strong>易受累脏腑经络：</strong>{selectedSolarTerm.vulnerableOrgan}
                </span>
              </div>

              <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-1">
                <span className="text-stone-400 block font-medium">节气循时用香法则：</span>
                <p className="text-emerald-900 leading-relaxed font-bold font-serif-sc">{selectedSolarTerm.wellnessPrinciple}</p>
                <span className="text-stone-600 block pt-1">
                  <strong>核心推荐香气：</strong>{selectedSolarTerm.recommendedAroma}
                </span>
              </div>
            </div>

            {/* Grid 2: Recommended Oils & Acupoint Ritual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Recommended Oils */}
              <div className="bg-white/90 p-5 rounded-2xl border border-[#E0D7C5] space-y-3">
                <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20] flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>节气精选道地本草精油</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedSolarTerm.recommendedOils.map((oilName, oi) => (
                    <div key={oi} className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9]">
                      <span className="font-serif-sc font-bold text-stone-800">{oilName}</span>
                      <button
                        onClick={() => onNavigateTab("botanical")}
                        className="text-[11px] text-[#8C7A6B] hover:text-[#1C2E20] flex items-center gap-0.5"
                      >
                        <span>查阅百科</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500">
                  推荐适配器具：<strong>{selectedSolarTerm.recommendedApparatus}</strong>
                </p>
              </div>

              {/* Acupoint Ritual */}
              <div className="bg-white/90 p-5 rounded-2xl border border-[#E0D7C5] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                    <span>节气穴位经络点涂仪式 (Acupoint Ritual)</span>
                  </h4>
                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E5DEC9] space-y-1">
                    <div className="flex items-center justify-between font-serif-sc font-bold text-stone-900">
                      <span>{selectedSolarTerm.acupointRitual?.name || "未知穴位"}</span>
                      <span className="text-[10px] text-[#8C7A6B] font-normal">{selectedSolarTerm.acupointRitual.location}</span>
                    </div>
                    <p className="text-emerald-900 text-[11px]">
                      功效：{selectedSolarTerm.acupointRitual.effect}
                    </p>
                    <p className="text-stone-700 text-[11px] pt-1 border-t border-[#EAE3D5]">
                      <strong>操作步骤：</strong>{selectedSolarTerm.acupointRitual.guide}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onStartBreathwork(slotData.morning.prescription)}
                    className="flex-1 py-2.5 bg-[#1C2E20] hover:bg-[#2A4730] text-white font-serif-sc font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 border border-[#D4AF37]/30"
                  >
                    <Wind className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>以此节气气机吸嗅</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab("blender")}
                    className="px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-800 font-serif-sc font-bold text-xs rounded-xl border border-[#D5CCBA] transition-all"
                  >
                    载入沙箱
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
