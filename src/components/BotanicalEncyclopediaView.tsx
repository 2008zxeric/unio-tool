import React, { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  Leaf,
  Layers,
  Heart,
  Flame,
  Clock,
  Check,
  CheckCircle2,
  ChevronRight,
  Brain,
  RefreshCw,
  Dices,
  BookOpen,
  Compass,
  Copy,
  ShieldCheck,
  FlaskConical,
  X,
  TreePine,
  Sun,
  Mountain,
  Waves,
  Feather,
  Plus,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Info
} from "lucide-react";
import {
  ESSENTIAL_OILS_DATABASE,
  CARRIER_OILS_DATABASE,
  CURATED_PRESCRIPTIONS
} from "../data/scentDatabase";
import { generateLiveBotanicalDossier } from "../data/globalBotanicals";
import { SingleEssentialOil, CarrierOilInfo, ScentPrescription } from "../types";
import { audioEngine } from "../utils/audioEngine";
import { OilKnowledgeCard } from "./OilKnowledgeCard";
import { searchBotanicals } from "../utils/pinyinSearch";

interface BotanicalEncyclopediaViewProps {
  prescriptions?: ScentPrescription[];
  onSelectOilForBlender?: (oil: SingleEssentialOil) => void;
  onAddToCurrentBlend?: (oil: SingleEssentialOil) => void;
  onSelectCarrierForBlender?: (carrier: CarrierOilInfo) => void;
  onGoToBlender: () => void;
  onBlendWithPrescription?: (prescription: ScentPrescription, addedOil: SingleEssentialOil) => void;
}

const FIVE_ELEMENTS_META = {
  all: {
    title: "万物生生 · 全谱本草",
    slogan: "涵盖全球380+种纯正单方精油与全品类芳香产品，依循五行生克与植物学标准建档",
    organs: "五脏六腑 · 阴阳和合",
    accentBg: "bg-stone-900 text-stone-100",
    accentBorder: "border-stone-300",
    icon: Compass
  },
  木: {
    title: "木德生发 · 条达舒畅",
    slogan: "如春回大地，万物萌发；疏肝解郁，破除心灵窒碍，唤醒向上生机",
    organs: "归肝、胆经 | 筋脉目窍",
    accentBg: "bg-emerald-950 text-emerald-100",
    accentBorder: "border-emerald-700/40",
    icon: TreePine
  },
  火: {
    title: "火德宣畅 · 宁神喜乐",
    slogan: "如夏日煦阳，温养百脉；宣通心气，化解冰冷孤寂，激发爱与创造激情",
    organs: "归心、小肠、心包经 | 血脉神志",
    accentBg: "bg-rose-950 text-rose-100",
    accentBorder: "border-rose-700/40",
    icon: Flame
  },
  土: {
    title: "土德扎根 · 健脾运湿",
    slogan: "如肥沃厚土，承载万物；健脾化湿，平抑过度思虑，赋予大地般的深层安全感",
    organs: "归脾、胃经 | 肌肉四肢",
    accentBg: "bg-amber-950 text-amber-100",
    accentBorder: "border-amber-700/40",
    icon: Mountain
  },
  金: {
    title: "金德宣肃 · 开窍通透",
    slogan: "如秋水长空，清明澄澈；宣肺利咽，通达九窍，涤荡污浊，重获纯净觉知",
    organs: "归肺、大肠经 | 皮肤毛窍",
    accentBg: "bg-slate-900 text-slate-100",
    accentBorder: "border-slate-600/40",
    icon: Feather
  },
  水: {
    title: "水德封藏 · 滋阴潜阳",
    slogan: "如深潭静水，虚极静笃；滋养肾精，收摄元气，归于生命至深处之宁静",
    organs: "归肾、膀胱经 | 骨髓脑府",
    accentBg: "bg-indigo-950 text-indigo-100",
    accentBorder: "border-indigo-700/40",
    icon: Waves
  }
};

const SCENT_FAMILIES = [
  { id: "all", label: "全部香调" },
  { id: "木质香调", label: "🌲 东方木质" },
  { id: "清冽柑橘", label: "🍊 清润柑橘" },
  { id: "古典花香", label: "🌹 典雅花香" },
  { id: "草本根茎", label: "🌿 草本根茎" },
  { id: "东方树脂", label: "🔥 灵性树脂" },
  { id: "清雅茶香", label: "🍵 清雅茶香" }
];

const NOTE_TYPES = [
  { id: "all", label: "全部香阶" },
  { id: "top", label: "前调 (唤醒行气)" },
  { id: "middle", label: "中调 (和合平衡)" },
  { id: "base", label: "后调 (沉潜定香)" }
];

const SAFETY_TAGS = [
  { id: "all", label: "全部安全属性" },
  { id: "pregnancy", label: "🤰 孕期备孕可用" },
  { id: "pet", label: "🐾 猫狗宠物友好" },
  { id: "kid", label: "👶 儿童温和安全" },
  { id: "photosafe", label: "☀️ 无光敏白天可用" }
];

const QUICK_HOT_SEARCHES = [
  { label: "🌲 檀香 (Sandalwood)", query: "檀香" },
  { label: "🌿 薰衣草 (Lavender)", query: "薰衣草" },
  { label: "🪵 沉香 (Oud/Agarwood)", query: "沉香" },
  { label: "🍋 柠檬 (Lemon)", query: "柠檬" },
  { label: "🌹 玫瑰 (Rose)", query: "玫瑰" },
  { label: "🍊 佛手柑 (Bergamot)", query: "佛手柑" },
  { label: "🍃 茶树 (Tea Tree)", query: "茶树" },
  { label: "🧪 柠檬烯 (Limonene)", query: "limonene" }
];

export const BotanicalEncyclopediaView: React.FC<BotanicalEncyclopediaViewProps> = ({
  prescriptions = CURATED_PRESCRIPTIONS,
  onGoToBlender,
  onAddToCurrentBlend,
  onSelectOilForBlender,
  onSelectCarrierForBlender,
  onBlendWithPrescription
}) => {
  const [activeTab, setActiveTab] = useState<"essential" | "carrier">("essential");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState<"all" | "金" | "木" | "水" | "火" | "土">("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedScentFamily, setSelectedScentFamily] = useState<string>("all");
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [selectedSafetyTag, setSelectedSafetyTag] = useState<string>("all");
  const [selectedOilDetail, setSelectedOilDetail] = useState<SingleEssentialOil | null>(null);
  const [toastNotice, setToastNotice] = useState<{ oilName: string; element: string } | null>(null);

  // View Style Toggle: "user" (🌿 12个核心问题易读模式) vs "pro" (🔬 科研植物学与GC-MS模式)
  const [cardDisplayLayer, setCardDisplayLayer] = useState<"user" | "pro">("user");

  const [customBotanicals, setCustomBotanicals] = useState<SingleEssentialOil[]>([]);
  const [isGeneratingCustomOil, setIsGeneratingCustomOil] = useState(false);

  const handleAddToBlendWithToast = (oil: SingleEssentialOil) => {
    if (onAddToCurrentBlend) {
      onAddToCurrentBlend(oil);
    } else if (onSelectOilForBlender) {
      onSelectOilForBlender(oil);
    }
    setToastNotice({ oilName: oil.name, element: oil.element });
    setTimeout(() => {
      setToastNotice(prev => (prev?.oilName === oil.name ? null : prev));
    }, 3800);
  };

  // Combine database with user-explored custom botanicals
  const allEssentialOils = useMemo(() => {
    const map = new Map<string, SingleEssentialOil>();
    ESSENTIAL_OILS_DATABASE.forEach(o => map.set(o.id, o));
    customBotanicals.forEach(o => map.set(o.id, o));
    return Array.from(map.values());
  }, [customBotanicals]);

  // Five Elements Oil Counts
  const elementCounts = useMemo(() => {
    const counts = { all: allEssentialOils.length, 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
    allEssentialOils.forEach(oil => {
      if (oil.element in counts) {
        counts[oil.element as "金" | "木" | "水" | "火" | "土"]++;
      }
    });
    return counts;
  }, [allEssentialOils]);

  // Subcategory Counts for currently selected Element
  const subcategoryStats = useMemo(() => {
    const subMap = new Map<string, number>();
    const currentPool = selectedElement === "all"
      ? allEssentialOils
      : allEssentialOils.filter(oil => oil.element === selectedElement);

    currentPool.forEach(oil => {
      const sub = oil.subcategory || "通用本草";
      subMap.set(sub, (subMap.get(sub) || 0) + 1);
    });

    return Array.from(subMap.entries()).map(([sub, count]) => ({
      name: sub,
      count
    })).sort((a, b) => b.count - a.count);
  }, [allEssentialOils, selectedElement]);

  // Filtered Oils List with Multi-Dimensional Search
  const filteredOils = useMemo(() => {
    // 1. Filter by structured dimensions
    const categoryFiltered = allEssentialOils.filter(oil => {
      if (selectedElement !== "all" && oil.element !== selectedElement) return false;
      if (selectedSubcategory !== "all" && oil.subcategory !== selectedSubcategory) return false;
      if (selectedScentFamily !== "all" && oil.scentFamily !== selectedScentFamily) return false;
      if (selectedNote !== "all" && oil.noteType !== selectedNote) return false;

      if (selectedSafetyTag === "pregnancy" && !oil.isPregnancySafe) return false;
      if (selectedSafetyTag === "pet" && !oil.isPetSafe) return false;
      if (selectedSafetyTag === "kid" && !oil.isKidSafe) return false;
      if (selectedSafetyTag === "photosafe" && oil.isPhototoxic) return false;

      return true;
    });

    // 2. Filter by search query
    if (!searchQuery.trim()) {
      return categoryFiltered;
    }

    return searchBotanicals(categoryFiltered, searchQuery);
  }, [allEssentialOils, searchQuery, selectedElement, selectedSubcategory, selectedScentFamily, selectedNote, selectedSafetyTag]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedElement("all");
    setSelectedSubcategory("all");
    setSelectedScentFamily("all");
    setSelectedNote("all");
    setSelectedSafetyTag("all");
    audioEngine.playDropletSound();
  };

  const isAnyFilterActive =
    searchQuery !== "" ||
    selectedElement !== "all" ||
    selectedSubcategory !== "all" ||
    selectedScentFamily !== "all" ||
    selectedNote !== "all" ||
    selectedSafetyTag !== "all";

  // Lucky Draw
  const handleLuckyDrawBotanical = () => {
    const pool = filteredOils.length > 0 ? filteredOils : allEssentialOils;
    const randomOil = pool[Math.floor(Math.random() * pool.length)];
    if (randomOil) {
      setSelectedOilDetail(randomOil);
      audioEngine.strikeSingingBowl(528);
    }
  };

  // AI On-Demand Botanical Discovery
  const handleExploreCustomBotanical = (plantName: string) => {
    if (!plantName.trim()) return;
    setIsGeneratingCustomOil(true);
    audioEngine.strikeSingingBowl(528);

    try {
      const newDossier = generateLiveBotanicalDossier(plantName.trim());
      setCustomBotanicals(prev => [newDossier, ...prev.filter(p => p.id !== newDossier.id)]);
      setSelectedOilDetail(newDossier);
    } finally {
      setIsGeneratingCustomOil(false);
    }
  };

  const currentMeta = FIVE_ELEMENTS_META[selectedElement];

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-3 sm:px-6 animate-in fade-in duration-300 relative">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#1C2E20] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#D4AF37]/50 flex items-center gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="text-xs">
              <div className="font-serif-sc font-bold text-sm text-[#D4AF37]">
                已将【{toastNotice.oilName}】添加至当前调香池
              </div>
              <p className="text-stone-300 text-[11px] mt-0.5">
                已自动注入配方沙箱 · {toastNotice.element}行气机
              </p>
            </div>
            <button
              onClick={() => {
                setToastNotice(null);
                onGoToBlender();
              }}
              className="ml-2 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#1C2E20] font-serif-sc font-bold text-xs transition-all shadow-xs shrink-0 flex items-center gap-1"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>前往调香沙箱</span>
            </button>
            <button
              onClick={() => setToastNotice(null)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Banner & Search Hub */}
      <div className="bg-[#FAF8F3] border border-[#E0D7C5] p-5 sm:p-7 rounded-3xl shadow-xs relative overflow-hidden hallmark-paper">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-cinzel text-xs font-bold tracking-widest text-[#8C7A6B]">
                UNIO BOTANICAL ENCYCLOPEDIA
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1C2E20] text-[#D4AF37] font-serif-sc font-medium">
                收录 {allEssentialOils.length} 款权威单方本草及全品类芳香产品
              </span>
            </div>
            <h1 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20]">
              五行本草精油百科
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-serif-sc leading-relaxed">
              融汇 <strong>金木水火土五行气机</strong>、<strong>植物学拉丁命名</strong> 与 <strong>GC-MS 分子药理</strong>，以清晰结构解答功效、用法与安全禁忌
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLuckyDrawBotanical}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#1C2E20] hover:text-[#D4AF37] text-stone-800 border border-[#D5CCBA] text-xs font-serif-sc font-bold transition-all shadow-2xs flex items-center gap-2 group"
            >
              <Dices className="w-4 h-4 text-[#D4AF37] group-hover:rotate-180 transition-transform duration-500" />
              <span>今日灵感探寻</span>
            </button>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索精油（输入中文「檀香」、拼音「tanxiang / tx」、英文「sandalwood」、拉丁学名或分子「limonene」）..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-[#D5CCA8] text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-[#1C2E20] placeholder:text-stone-400 font-sans shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searchQuery.trim() && (
              <button
                onClick={() => handleExploreCustomBotanical(searchQuery)}
                disabled={isGeneratingCustomOil}
                className="px-4 py-3 rounded-2xl bg-[#1C2E20] hover:bg-[#2A4730] text-white text-xs font-serif-sc font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                {isGeneratingCustomOil ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    <span>正在深度建档...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>AI 深度建档「{searchQuery}」</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
            <span className="text-stone-400 font-serif-sc text-[11px]">快捷热搜：</span>
            {QUICK_HOT_SEARCHES.map(chip => (
              <button
                key={chip.query}
                onClick={() => {
                  setSearchQuery(chip.query);
                  audioEngine.playDropletSound();
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-sans transition-all border ${
                  searchQuery === chip.query
                    ? "bg-[#1C2E20] text-[#D4AF37] border-[#1C2E20] font-bold"
                    : "bg-white/80 hover:bg-[#1C2E20] hover:text-white text-stone-600 border-[#DCD5C4]"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Structured Filter Control Center */}
      <div className="bg-white rounded-3xl border border-[#E2DBC8] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Row 1: Primary Category Tabs & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFEBE0] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("essential")}
              className={`px-4 py-2 rounded-xl font-serif-sc font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === "essential"
                  ? "bg-[#1C2E20] text-white shadow-2xs"
                  : "bg-[#FAF7F0] text-stone-600 hover:text-stone-900 border border-[#E0D7C5]"
              }`}
            >
              <Leaf className="w-4 h-4 text-[#D4AF37]" />
              <span>五行单方精油 ({allEssentialOils.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("carrier")}
              className={`px-4 py-2 rounded-xl font-serif-sc font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === "carrier"
                  ? "bg-[#1C2E20] text-white shadow-2xs"
                  : "bg-[#FAF7F0] text-stone-600 hover:text-stone-900 border border-[#E0D7C5]"
              }`}
            >
              <Layers className="w-4 h-4 text-[#C5A880]" />
              <span>基底与浸泡油 ({CARRIER_OILS_DATABASE.length})</span>
            </button>
          </div>

          {/* Reading Mode Switcher */}
          {activeTab === "essential" && (
            <div className="flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-xl border border-[#E0D7C5] text-xs self-start sm:self-auto">
              <button
                onClick={() => {
                  setCardDisplayLayer("user");
                  audioEngine.playDropletSound();
                }}
                className={`px-3 py-1.5 rounded-lg font-serif-sc font-bold transition-all flex items-center gap-1.5 ${
                  cardDisplayLayer === "user"
                    ? "bg-[#1C2E20] text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-300" />
                <span>🌿 12项核心问答模式</span>
              </button>

              <button
                onClick={() => {
                  setCardDisplayLayer("pro");
                  audioEngine.playDropletSound();
                }}
                className={`px-3 py-1.5 rounded-lg font-serif-sc font-bold transition-all flex items-center gap-1.5 ${
                  cardDisplayLayer === "pro"
                    ? "bg-[#1C2E20] text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
                <span>🔬 科研GC-MS模式</span>
              </button>
            </div>
          )}
        </div>

        {/* Row 2: Five Elements Selector Bar (金、木、水、火、土) */}
        {activeTab === "essential" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif-sc font-bold text-stone-500 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" /> 五行气机分类：
              </span>
              {isAnyFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#941B1B] hover:underline flex items-center gap-1 font-serif-sc font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置全部筛选</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { id: "all", label: "全部五行", count: elementCounts.all, symbol: "☯", desc: "全谱本草" },
                { id: "金", label: "金 (宣肃)", count: elementCounts.金, symbol: "⚔️", desc: "宣肺利气 · 通达清透" },
                { id: "木", label: "木 (生发)", count: elementCounts.木, symbol: "🌲", desc: "疏肝解郁 · 生机条达" },
                { id: "水", label: "水 (封藏)", count: elementCounts.水, symbol: "💧", desc: "滋阴潜阳 · 虚极静笃" },
                { id: "火", label: "火 (宣畅)", count: elementCounts.火, symbol: "🔥", desc: "心脑温阳 · 喜乐通明" },
                { id: "土", label: "土 (扎根)", count: elementCounts.土, symbol: "⛰️", desc: "健脾运湿 · 踏实厚载" }
              ].map(item => {
                const isSelected = selectedElement === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedElement(item.id as any);
                      setSelectedSubcategory("all");
                      audioEngine.playDropletSound();
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#1C2E20] text-white border-[#1C2E20] shadow-md ring-2 ring-[#D4AF37]/50"
                        : "bg-[#FAF7F0] hover:bg-white text-stone-800 border-[#E2DBC8]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{item.symbol}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? "bg-[#D4AF37] text-[#1C2E20]" : "bg-stone-200 text-stone-700"
                      }`}>
                        {item.count}
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <h4 className={`font-serif-sc font-bold text-xs sm:text-sm ${
                        isSelected ? "text-[#D4AF37]" : "text-stone-900"
                      }`}>
                        {item.label}
                      </h4>
                      <p className={`text-[10px] truncate ${
                        isSelected ? "text-stone-300" : "text-stone-500"
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subcategories under current Element */}
            {selectedElement !== "all" && subcategoryStats.length > 0 && (
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-serif-sc text-stone-400 shrink-0">子类细分：</span>
                <button
                  onClick={() => setSelectedSubcategory("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif-sc transition-all ${
                    selectedSubcategory === "all"
                      ? "bg-[#1C2E20] text-[#D4AF37] font-bold"
                      : "bg-[#FAF7F0] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  全部 ({subcategoryStats.reduce((a, b) => a + b.count, 0)})
                </button>
                {subcategoryStats.map(sub => (
                  <button
                    key={sub.name}
                    onClick={() => setSelectedSubcategory(sub.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-serif-sc transition-all ${
                      selectedSubcategory === sub.name
                        ? "bg-[#1C2E20] text-[#D4AF37] font-bold"
                        : "bg-[#FAF7F0] text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {sub.name} ({sub.count})
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Row 3: Multi-Dimensional Filter Dropdowns & Pills */}
        {activeTab === "essential" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EFEBE0] text-xs font-serif-sc">
            {/* Scent Family */}
            <div className="space-y-1">
              <label className="text-[11px] text-stone-500 font-bold block">嗅觉香调家族</label>
              <select
                value={selectedScentFamily}
                onChange={e => setSelectedScentFamily(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#DDD5C2] text-xs text-stone-800 focus:outline-hidden"
              >
                {SCENT_FAMILIES.map(sf => (
                  <option key={sf.id} value={sf.id}>{sf.label}</option>
                ))}
              </select>
            </div>

            {/* Note Type */}
            <div className="space-y-1">
              <label className="text-[11px] text-stone-500 font-bold block">挥发阶梯 (前/中/后调)</label>
              <select
                value={selectedNote}
                onChange={e => setSelectedNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#DDD5C2] text-xs text-stone-800 focus:outline-hidden"
              >
                {NOTE_TYPES.map(nt => (
                  <option key={nt.id} value={nt.id}>{nt.label}</option>
                ))}
              </select>
            </div>

            {/* Safety Tag */}
            <div className="space-y-1">
              <label className="text-[11px] text-stone-500 font-bold block">特殊安全与人群禁忌</label>
              <select
                value={selectedSafetyTag}
                onChange={e => setSelectedSafetyTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#DDD5C2] text-xs text-stone-800 focus:outline-hidden"
              >
                {SAFETY_TAGS.map(st => (
                  <option key={st.id} value={st.id}>{st.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 3. Essential Oils Grid List */}
      {activeTab === "essential" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-serif-sc text-stone-500 px-1">
            <span>找到符合条件的精油：<strong>{filteredOils.length}</strong> 款</span>
            {searchQuery && (
              <span>搜索关键词：<span className="text-[#1C2E20] font-bold">"{searchQuery}"</span></span>
            )}
          </div>

          {filteredOils.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E2DBC8] p-12 text-center space-y-4 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F0] text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-sc font-bold text-base text-[#1C2E20]">未匹配到符合条件的精油</h3>
                <p className="text-xs text-stone-500 font-serif-sc mt-1">
                  您可以尝试更换搜索词，或点击下方按钮让 AI 调香师为您深度建档
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-serif-sc text-stone-700"
                >
                  重置所有筛选
                </button>
                {searchQuery.trim() && (
                  <button
                    onClick={() => handleExploreCustomBotanical(searchQuery)}
                    className="px-4 py-2 rounded-xl bg-[#1C2E20] text-[#D4AF37] text-xs font-serif-sc font-bold shadow-xs"
                  >
                    AI 深度建档「{searchQuery}」
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredOils.map(oil => (
                <OilKnowledgeCard
                  key={oil.id}
                  oil={oil}
                  variant="preview"
                  activeDisplayLayer={cardDisplayLayer}
                  onOpenDetail={setSelectedOilDetail}
                  onAddToCurrentBlend={handleAddToBlendWithToast}
                  onSelectForBlender={onSelectOilForBlender}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Carrier Oils Grid List */}
      {activeTab === "carrier" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CARRIER_OILS_DATABASE.map(carrier => (
            <div
              key={carrier.id}
              className="bg-white rounded-3xl border border-[#E2DBC8] p-5 shadow-2xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif-sc font-bold text-base text-[#1C2E20]">{carrier.name}</h3>
                  <p className="text-xs text-stone-400 font-mono italic">{carrier.latin}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF4E6] text-[#8C7A6B] font-bold border border-[#D5CCA8]">
                  {carrier.texture}
                </span>
              </div>

              <p className="text-xs text-stone-600 font-serif-sc leading-relaxed">
                {carrier.bestFor}
              </p>

              <div className="pt-2 border-t border-[#EFEBE0] flex items-center justify-between text-[11px] text-stone-500 font-serif-sc">
                <span>保质期: {carrier.shelfLife}</span>
                <span>渗透度: {carrier.absorptionRate}</span>
              </div>

              <button
                onClick={() => {
                  if (onSelectCarrierForBlender) {
                    onSelectCarrierForBlender(carrier);
                  }
                  onGoToBlender();
                }}
                className="w-full mt-2 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#1C2E20] hover:text-[#D4AF37] text-stone-800 border border-[#DDD5C2] text-xs font-serif-sc font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>选定为配方基底油</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. Detailed Knowledge Modal */}
      {selectedOilDetail && (
        <OilKnowledgeCard
          oil={selectedOilDetail}
          variant="expanded"
          isModal={true}
          activeDisplayLayer={cardDisplayLayer}
          onToggleDisplayLayer={setCardDisplayLayer}
          onCloseModal={() => setSelectedOilDetail(null)}
          onAddToCurrentBlend={handleAddToBlendWithToast}
          onSelectForBlender={onSelectOilForBlender}
        />
      )}
    </div>
  );
};
