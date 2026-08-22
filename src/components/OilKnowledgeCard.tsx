import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  FlaskConical,
  X,
  Leaf,
  Layers,
  Heart,
  Flame,
  Sun,
  Moon,
  Clock,
  Zap,
  Check,
  CheckCircle2,
  Copy,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Info,
  Palette,
  Lightbulb,
  Globe2,
  Compass,
  Star,
  CheckSquare,
  Droplet,
  FileText,
  Volume2,
  ShieldCheck,
  ShieldAlert,
  Share2,
  Plus
} from "lucide-react";
import { SingleEssentialOil, CarrierOilInfo } from "../types";
import { calculateSafeDilution, DilutionCalculationResult } from "../utils/botanicalStandardizer";
import { CARRIER_OILS_DATABASE } from "../data/scentDatabase";
import { audioEngine } from "../utils/audioEngine";

export interface OilKnowledgeCardProps {
  oil: SingleEssentialOil;
  variant?: "preview" | "expanded" | "compact";
  isModal?: boolean;
  onOpenDetail?: (oil: SingleEssentialOil) => void;
  onCloseModal?: () => void;
  onSelectForBlender?: (oil: SingleEssentialOil) => void;
  onAddToCurrentBlend?: (oil: SingleEssentialOil) => void;
  activeDisplayLayer?: "user" | "pro";
  onToggleDisplayLayer?: (layer: "user" | "pro") => void;
}

export const OilKnowledgeCard: React.FC<OilKnowledgeCardProps> = ({
  oil,
  variant = "preview",
  isModal = false,
  onOpenDetail,
  onCloseModal,
  onSelectForBlender,
  onAddToCurrentBlend,
  activeDisplayLayer = "user",
  onToggleDisplayLayer
}) => {
  // Local display mode for inside the card/modal: "user" (🌿 12个核心问题易读层) vs "pro" (🔬 植物学与GC-MS专业数据层)
  const [internalLayer, setInternalLayer] = useState<"user" | "pro">(activeDisplayLayer);
  const currentLayer = onToggleDisplayLayer ? activeDisplayLayer : internalLayer;

  // Active question filter in 12-question accordion / tabs if needed
  const [expandedSection, setExpandedSection] = useState<string | null>("intro");

  // In-card Dilution Calculator state
  const [calcScenario, setCalcScenario] = useState<"face" | "body" | "spot" | "bath" | "diffuser">("face");
  const [calcVolumeMl, setCalcVolumeMl] = useState<number>(10);
  const [calcCarrierOil, setCalcCarrierOil] = useState<string>("有机金黄荷荷巴油");
  const [copiedSafety, setCopiedSafety] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const dilutionResult: DilutionCalculationResult = calculateSafeDilution(
    oil,
    calcScenario,
    calcVolumeMl,
    calcCarrierOil
  );

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playDropletSound();
  };

  const handleAddToBlend = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onAddToCurrentBlend) {
      onAddToCurrentBlend(oil);
    } else if (onSelectForBlender) {
      onSelectForBlender(oil);
    }
    audioEngine.strikeSingingBowl(528);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2400);
  };

  const handleLayerSwitch = (layer: "user" | "pro") => {
    if (onToggleDisplayLayer) {
      onToggleDisplayLayer(layer);
    } else {
      setInternalLayer(layer);
    }
    audioEngine.playDropletSound();
  };

  const handleCopyCardSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `【UNIO 精油百科档案 · ${oil.name}】\n` +
      `🌿 拉丁学名：${oil.latin}\n` +
      `🌟 五行归经：${oil.element}行 · ${oil.tcmMeridian} (${oil.tcmQiDynamic || "气机调和"})\n` +
      `👃 香气印象：${oil.olfactoryImpression?.firstImpression || oil.emotionalBenefit}\n` +
      `🛡️ 安全规范：日常面部 ≤1%，身体 ≤2%，局部最高 ≤${oil.maxDermalPercent}%\n` +
      `🤝 推荐搭配：${oil.blendingPartners.slice(0, 4).join("、")}`;
    navigator.clipboard.writeText(text);
    setCopiedSafety(true);
    setTimeout(() => setCopiedSafety(false), 2000);
  };

  // Element Color Styling helper
  const elementStyles = {
    木: {
      tag: "bg-emerald-100 text-emerald-900 border-emerald-300",
      accent: "text-emerald-800",
      pill: "bg-emerald-900 text-emerald-100",
      border: "border-emerald-200"
    },
    火: {
      tag: "bg-rose-100 text-rose-900 border-rose-300",
      accent: "text-rose-800",
      pill: "bg-rose-900 text-rose-100",
      border: "border-rose-200"
    },
    土: {
      tag: "bg-amber-100 text-amber-900 border-amber-300",
      accent: "text-amber-800",
      pill: "bg-amber-900 text-amber-100",
      border: "border-amber-200"
    },
    金: {
      tag: "bg-slate-100 text-slate-900 border-slate-300",
      accent: "text-slate-800",
      pill: "bg-slate-900 text-slate-100",
      border: "border-slate-200"
    },
    水: {
      tag: "bg-indigo-100 text-indigo-900 border-indigo-300",
      accent: "text-indigo-800",
      pill: "bg-indigo-900 text-indigo-100",
      border: "border-indigo-200"
    }
  }[oil.element] || {
    tag: "bg-stone-100 text-stone-900 border-stone-300",
    accent: "text-stone-800",
    pill: "bg-stone-900 text-stone-100",
    border: "border-stone-200"
  };

  // =========================================================================
  // VIEW 1: PREVIEW / GRID CARD (Hallmark Artisanal Deckled Frame)
  // =========================================================================
  if (variant === "preview") {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenDetail) {
            onOpenDetail(oil);
          }
          audioEngine.playDropletSound();
        }}
        className="bg-white/95 p-4 sm:p-5 rounded-3xl border border-[#E0D7C5] shadow-xs hover:shadow-md hover:border-[#1C2E20]/50 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden hallmark-paper hallmark-foil-frame"
      >
        {/* Top Meta Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Seal Stamp */}
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-serif-sc font-bold text-[10px] border shadow-2xs ${elementStyles.tag}`}>
                {oil.element}
              </span>
              <span className="font-serif-sc font-bold text-base text-[#1C2E20] group-hover:text-[#A82A2A] transition-colors">
                {oil.name}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {oil.subcategory && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAE5D9] text-[#4A4035] font-serif-sc">
                  {oil.subcategory}
                </span>
              )}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                {oil?.noteType === "top" ? "前调" : oil?.noteType === "middle" ? "中调" : "后调"}
              </span>
            </div>
          </div>

          {/* Latin & Botanical Family */}
          <div>
            <p className="text-[11px] text-stone-500 font-mono italic">{oil.latin}</p>
            {oil.botanicalFamily && (
              <p className="text-[10px] text-stone-400 font-serif-sc">{oil.botanicalFamily}</p>
            )}
          </div>

          {/* Scent Keywords / Tags */}
          {oil.scentKeywords && oil.scentKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {oil.scentKeywords.slice(0, 3).map((kw, kwi) => (
                <span key={kwi} className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FAF8F3] text-stone-700 border border-[#E8E1D5]">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Dual Layer Switching in Card Preview */}
          {currentLayer === "user" ? (
            /* 🌿 User Readable Layer (Q1 ~ Q3 Focus) */
            <div className="space-y-1.5 text-xs text-stone-700 font-light leading-relaxed">
              {oil.olfactoryImpression ? (
                <p className="line-clamp-2">
                  <strong className="text-stone-900 font-normal">👃 香气印象：</strong>
                  {oil.olfactoryImpression.firstImpression}
                </p>
              ) : (
                <p className="line-clamp-2">{oil.emotionalBenefit}</p>
              )}
            </div>
          ) : (
            /* 🔬 Pro Data Layer (GC-MS & Chemistry Focus) */
            <div className="space-y-1 bg-[#FAF8F3] p-2 rounded-xl border border-[#EAE3D5] text-[11px]">
              <span className="text-stone-500 block font-medium font-serif-sc">
                GC-MS 特征分子 ({oil.chemicalFamily?.split("(")[0]}):
              </span>
              <div className="flex flex-wrap gap-1">
                {oil.primaryMolecules.slice(0, 3).map((m, mi) => (
                  <span key={mi} className="text-[10px] font-mono text-stone-700">
                    {m.name} ({m.percentage})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Metadata */}
        <div className="pt-2.5 mt-2 border-t border-[#F0EBE0] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-500">归经：{oil.tcmMeridian}</span>
            <span className="text-[#A82A2A] font-semibold font-mono">限值：≤{oil.maxDermalPercent}%</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1 text-[10px]">
              {oil.isPregnancySafe ? (
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">孕可</span>
              ) : (
                <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">孕禁</span>
              )}
              {oil.isPetSafe && (
                <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">宠友</span>
              )}
              {oil.isPhototoxic && (
                <span className="text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">光敏</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToBlend}
                className={`text-[11px] font-serif-sc font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                  addedFeedback
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-[#1C2E20]/5 hover:bg-[#1C2E20] text-[#1C2E20] hover:text-white border-[#1C2E20]/20"
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-3 h-3 text-[#D4AF37]" />
                    <span>已加入配方</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 text-[#D4AF37]" />
                    <span>加至配方</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-[#1C2E20] font-serif-sc font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                12个核心问答 <ChevronRight className="w-3 h-3 text-[#C5A880]" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL EXPANDED / MODAL 12-QUESTIONS DEEP-DIVE (Hallmark Master Card)
  // =========================================================================
  return (
    <div className={`hallmark-paper hallmark-foil-frame space-y-5 ${isModal ? "p-1 sm:p-2 max-h-[85vh] overflow-y-auto" : "p-5 sm:p-7 rounded-3xl bg-[#FAF8F3] border border-[#D8D0BE]"}`}>
      {/* Header Banner */}
      <div className="border-b border-[#E0D7C5] pb-4 space-y-2 relative">
        {isModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="absolute right-0 top-0 p-1.5 text-stone-400 hover:text-stone-800 bg-white/80 rounded-full border border-stone-200 shadow-2xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-cinzel text-xs font-bold text-[#8C7A6B]">UNIO BOTANICAL KNOWLEDGE CARD</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-serif-sc font-bold border ${elementStyles.tag}`}>
            {oil.element}行 · {oil.subcategory || oil.scentFamily}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAE5D9] text-[#4A4035] font-mono">
            {oil?.noteType === "top" ? "前调" : oil?.noteType === "middle" ? "中调" : "后调"}
          </span>
          {oil.isoStandard && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-mono">
              {oil.isoStandard}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20]">
              {oil.name}
            </h2>
            <p className="text-xs text-stone-500 font-mono italic mt-0.5">
              {oil.latin} {oil.botanicalFamily && `(${oil.botanicalFamily})`} · 道地产地：{oil.origin}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {/* Direct Header Add to Blend Action Button */}
            <button
              onClick={handleAddToBlend}
              className={`px-3.5 py-2 rounded-xl text-xs font-serif-sc font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                addedFeedback
                  ? "bg-emerald-700 text-white shadow-md scale-105"
                  : "bg-[#1C2E20] hover:bg-[#2A4730] text-[#FAF8F3] border border-[#3E5C44]"
              }`}
            >
              {addedFeedback ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>已加入调香配方池 (+2滴)</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>添加至当前配方</span>
                </>
              )}
            </button>

            <button
              onClick={handlePlaySound}
              title="聆听此精油的芳香振动"
              className="p-2 rounded-xl bg-white/80 hover:bg-[#1C2E20] hover:text-[#D4AF37] text-stone-600 border border-[#D5CCBA] transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyCardSummary}
              title="复制百科卡片概要"
              className="p-2 rounded-xl bg-white/80 hover:bg-[#1C2E20] hover:text-white text-stone-600 border border-[#D5CCBA] transition-colors"
            >
              {copiedSafety ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Layer Switcher Tabs: 🌿 用户易读层 (12个核心问题) vs 🔬 专业数据层 (植物学/GC-MS) */}
      <div className="flex items-center gap-1 bg-[#EFECE3] p-1 rounded-2xl border border-[#DCD5C4] text-xs">
        <button
          onClick={() => handleLayerSwitch("user")}
          className={`flex-1 py-2 rounded-xl font-serif-sc font-bold transition-all flex items-center justify-center gap-1.5 ${
            currentLayer === "user"
              ? "bg-[#1C2E20] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-300" />
          <span>🌿 用户易读层 (12 个核心问题卡片)</span>
        </button>

        <button
          onClick={() => handleLayerSwitch("pro")}
          className={`flex-1 py-2 rounded-xl font-serif-sc font-bold transition-all flex items-center justify-center gap-1.5 ${
            currentLayer === "pro"
              ? "bg-[#1C2E20] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
          <span>🔬 专业数据层 (Kew / ISO / GC-MS)</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* LAYER A: 🌿 USER-READABLE LAYER (12 CORE QUESTIONS COMPLETE SYSTEM) */}
      {/* =================================================================== */}
      {currentLayer === "user" ? (
        <div className="space-y-4 text-xs">
          {/* ① 它是什么？ */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
              <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">1</span>
              <span>它是什么？(一句话精要)</span>
            </div>
            <p className="text-stone-700 leading-relaxed font-light pl-5">
              {oil.oneSentenceIntro || oil.emotionalBenefit}
            </p>
          </div>

          {/* ② 闻起来怎么样？(👃 香气印象) */}
          <div className="bg-[#FAF6EC] p-4 rounded-2xl border border-[#E8DFC8] space-y-2">
            <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
              <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">2</span>
              <span>👃 闻起来怎么样？(第一感觉 · 深入闻 · 整体气质氛围)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-5">
              <div className="bg-white/80 p-2.5 rounded-xl border border-[#E2DAD0]">
                <span className="text-stone-400 block text-[10px]">第一印象</span>
                <span className="font-medium text-stone-800">{oil.olfactoryImpression?.firstImpression || "清澈纯净 · 自然芬芳"}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-[#E2DAD0]">
                <span className="text-stone-400 block text-[10px]">深入细闻</span>
                <span className="font-medium text-stone-800">{oil.olfactoryImpression?.deepNote || oil.scentFamily}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-[#E2DAD0]">
                <span className="text-stone-400 block text-[10px]">整体气质氛围</span>
                <span className="font-medium text-stone-800">{oil.olfactoryImpression?.atmosphere || oil.sensorySynesthesia || "如临自然山川"}</span>
              </div>
            </div>
          </div>

          {/* ③ 用户通常为什么选它？(🌿 常见使用场景) */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-2">
            <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
              <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">3</span>
              <span>🌿 常见使用场景 (身心安抚与环境气味仪式)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE3D5]">
                <strong className="text-stone-900 block mb-0.5">身心安抚：</strong>
                <span className="text-stone-700">{oil.emotionalBenefit}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE3D5]">
                <strong className="text-stone-900 block mb-0.5">经络理气：</strong>
                <span className="text-stone-700">{oil.physicalBenefit}</span>
              </div>
            </div>
          </div>

          {/* ④ 怎么使用？(✨ 扩香/吸嗅/身体护理/沐浴分散乳化) */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-2">
            <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
              <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">4</span>
              <span>✨ 怎么使用？(扩香 · 吸嗅 · 身体护理 · 沐浴乳化)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE3D5]">
                <strong className="text-stone-900 block mb-0.5">💨 空间扩香：</strong>
                <span className="text-stone-700">{oil.applicationMethods?.diffuser || "滴入 3~5 滴于超声波香薰机或扩香木中。"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE3D5]">
                <strong className="text-stone-900 block mb-0.5">🫁 掌心/棒吸嗅：</strong>
                <span className="text-stone-700">{oil.applicationMethods?.inhalation || "滴 1 滴于掌心或吸嗅棒中，双手轻覆口鼻深呼吸 3~5 次。"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE3D5]">
                <strong className="text-stone-900 block mb-0.5">💆 身体经络护理：</strong>
                <span className="text-stone-700">{oil.applicationMethods?.bodyCare || `经基底油稀释至安全浓度后，点涂于 ${oil.tcmMeridian}。`}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE3D5]">
                <strong className="text-stone-900 block mb-0.5">🛁 芳香泡浴规范：</strong>
                <span className="text-stone-700">{oil.applicationMethods?.bath || "⚠️ 严禁直接滴入浴水！须先与 10ml 全脂牛奶或沐浴油充分乳化分散。"}</span>
              </div>
            </div>
          </div>

          {/* ⑤ 怎么稀释？(💧 内置交互式安全稀释测算器) */}
          <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-[#D5CCBA] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
                <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">5</span>
                <span>💧 怎么稀释？(智能安全稀释算量仪)</span>
              </div>
              <span className="text-[10px] font-mono text-stone-500">IFRA 限值 ≤{oil.maxDermalPercent}%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5">
              {/* Scenario choices */}
              <div className="space-y-1.5">
                <span className="text-stone-500 block text-[11px]">选择使用场景：</span>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { id: "face", label: "面部日常 (0.5%~1%)" },
                    { id: "body", label: "身体经络 (2%~3%)" },
                    { id: "spot", label: `局部特定 (≤${oil.maxDermalPercent}%)` },
                    { id: "diffuser", label: "空间纯精油扩香" }
                  ].map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => setCalcScenario(sc.id as any)}
                      className={`p-1.5 rounded-lg text-left text-[11px] font-serif-sc transition-all ${
                        calcScenario === sc.id
                          ? "bg-[#1C2E20] text-white font-bold"
                          : "bg-white text-stone-700 border border-[#E2DAD0]"
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider & Output */}
              {calcScenario !== "diffuser" ? (
                <div className="bg-white p-3 rounded-xl border border-[#E0D7C5] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-600">成品容量：<strong>{calcVolumeMl} ml</strong></span>
                    <span className="font-bold text-[#1C2E20]">
                      推荐：<span className="text-sm font-mono font-black text-[#A82A2A]">{dilutionResult.recommendedDrops}</span> 滴精油
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={calcVolumeMl}
                    onChange={e => setCalcVolumeMl(Number(e.target.value))}
                    className="w-full accent-[#1C2E20]"
                  />
                  <p className="text-[10px] text-stone-500 line-clamp-1">{dilutionResult.safetyTip}</p>
                </div>
              ) : (
                <div className="bg-white p-3 rounded-xl border border-[#E0D7C5] flex items-center justify-center text-center">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#1C2E20]">纯精油 3 ~ 5 滴</span>
                    <p className="text-[10px] text-stone-500">直接滴入香薰机中，无需基底油</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ⑥ 适合什么时候？ & ⑦ 适合什么样的人？ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ⑥ 适合时刻 */}
            <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
                <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">6</span>
                <span>🕐 适合什么时候？</span>
              </div>
              <div className="flex flex-wrap gap-1 pl-5">
                {oil.timeOfDay?.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-[#FAF8F3] rounded-md border border-[#E2DAD0] text-stone-700 font-medium">
                    {t === "morning" ? "🌅 晨起醒脑" : t === "daytime" ? "☀️ 白天专注" : t === "evening" ? "🌆 傍晚切换" : "🌙 睡前静笃"}
                  </span>
                ))}
              </div>
            </div>

            {/* ⑦ 适合什么样的人？ */}
            <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
                <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">7</span>
                <span>💭 适合什么样的人？(Checklist)</span>
              </div>
              <div className="space-y-1 pl-5">
                {oil.targetPersona?.map((p, pi) => (
                  <div key={pi} className="flex items-center gap-1.5 text-stone-700">
                    <CheckSquare className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ⑧ 它和谁搭配？(🤝 香气搭配伙伴与星级指数) */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
                <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">8</span>
                <span>🤝 和谁搭配？(香气搭配伙伴与星级指数)</span>
              </div>
              <span className="text-stone-400 font-mono text-[10px]">Tisserand Synergy Index</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
              {oil.blendingCombos ? (
                oil.blendingCombos.map((combo, ci) => (
                  <div key={ci} className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#EAE3D5] space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-serif-sc font-bold text-stone-900">{combo.partnerName}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: combo.rating }).map((_, si) => (
                          <Star key={si} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 font-light">{combo.synergyReason}</p>
                  </div>
                ))
              ) : (
                oil.blendingPartners.map((bp, bpi) => (
                  <div key={bpi} className="bg-[#FAF8F3] p-2 rounded-lg border border-[#EAE3D5] text-stone-800">
                    {bp}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ⑨ 气味家族标签 & ⑩ 主要化学组成 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ⑨ 气味家族 */}
            <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
                <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">9</span>
                <span>🌸 气味家族与多维标签</span>
              </div>
              <div className="flex flex-wrap gap-1 pl-5">
                <span className="px-2 py-0.5 bg-[#EAE5D9] text-[#4A4035] rounded-md font-serif-sc">{oil.scentFamily}</span>
                {oil.scentKeywords?.map((kw, kwi) => (
                  <span key={kwi} className="px-2 py-0.5 bg-[#FAF8F3] text-stone-700 rounded-md border border-[#E2DAD0]">{kw}</span>
                ))}
              </div>
            </div>

            {/* ⑩ 主要化学组成 */}
            <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
                <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">10</span>
                <span>🧪 主要化学组成 (典型区间)</span>
              </div>
              <div className="space-y-1 pl-5">
                {oil.primaryMolecules.slice(0, 3).map((mol, mi) => (
                  <div key={mi} className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-700">{mol.name}</span>
                    <span className="font-mono font-bold text-stone-900">{mol.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ⑪ 安全使用红黄绿灯 (⚠️ Tisserand 安全标准) */}
          <div className="bg-[#FAF6EC] p-4 rounded-2xl border border-[#E5D7B5] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-900 font-serif-sc font-bold">
                <span className="w-4 h-4 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px] font-mono">11</span>
                <span>⚠️ 安全使用红黄绿灯 (Tisserand 安全指引)</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                oil.safetyDossier?.safetyLevel === "green"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}>
                {oil.safetyDossier?.safetyLevel === "green" ? "🟢 宽泛安全本草" : "🟡 注意稀释/光敏"}
              </span>
            </div>

            <div className="space-y-1 pl-5 text-stone-700">
              <p><strong className="text-stone-900">稀释规范：</strong>{oil.safetyDossier?.dilutionAdvice || `日常面部 ≤1%，身体 ≤2%，局部 ≤${oil.maxDermalPercent}%`}</p>
              <p><strong className="text-stone-900">光毒性日晒评估：</strong>{oil.safetyDossier?.phototoxicityNote || (oil.isPhototoxic ? "具有光毒性，涂抹后避免日光照射" : "无光敏性")}</p>
              <div className="space-y-0.5 pt-1">
                <strong className="text-stone-900 block">人群禁忌清单：</strong>
                {oil.safetyDossier?.contraindications.map((ci, cii) => (
                  <div key={cii} className="text-[11px] text-stone-600">{ci}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ⑫ 权威文献出处 */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
            <span className="font-bold text-stone-700 block">📚 12. 权威文献与标准出处：</span>
            <ul className="list-disc list-inside space-y-0.5 pl-2">
              {(oil.references || [
                "ISO 4720:2018 Essential Oils — Nomenclature Reference",
                "Royal Botanic Gardens Kew, Plants of the World Online (POWO/WCVP)",
                "Robert Tisserand & Rodney Young, Essential Oil Safety (2nd Edition)",
                "国家中医药管理局《中华本草》与《中国药典》芳香本草归经志"
              ]).map((rf, rfi) => (
                <li key={rfi} className="font-mono text-[10px]">{rf}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* LAYER B: 🔬 PROFESSIONAL DATA LAYER (KEW / ISO 4720 / GC-MS / TCM)  */
        /* =================================================================== */
        <div className="space-y-4 text-xs">
          {/* Layer 01 Botanical Taxonomy */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E0D7C5] space-y-3">
            <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-800" />
              <span>Layer 01 植物分类学标准 (Kew POWO / WCVP / ISO 4720)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E0D7C5]">
                <span className="text-stone-400 block text-[10px]">植物科 (Family)</span>
                <span className="font-semibold text-stone-800">{oil.botanicalFamily || "芳香植物科"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E0D7C5]">
                <span className="text-stone-400 block text-[10px]">植物属 (Genus)</span>
                <span className="font-semibold text-stone-800">{oil.botanicalGenus || "芳香植物属"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E0D7C5]">
                <span className="text-stone-400 block text-[10px]">化学型 (Chemotype CT)</span>
                <span className="font-mono text-stone-800 text-[11px] line-clamp-1">{oil.chemotype || "Standard CT"}</span>
              </div>
              <div className="bg-[#FAF8F3] p-2.5 rounded-xl border border-[#E0D7C5]">
                <span className="text-stone-400 block text-[10px]">标准命名规范</span>
                <span className="font-mono text-stone-800 text-[11px]">{oil.isoStandard || "ISO 4720:2018"}</span>
              </div>
            </div>

            {oil.synonyms && oil.synonyms.length > 0 && (
              <div className="text-[11px] text-stone-600 pt-1">
                <span className="text-stone-400 font-medium">植物学接受名与异名 (Synonyms)：</span>
                <span className="font-mono italic">{oil.synonyms.join("、")}</span>
              </div>
            )}
          </div>

          {/* Extraction & Origin Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white/80 p-3 rounded-xl border border-[#E0D7C5]">
              <span className="text-stone-400 block text-[10px]">道地产区</span>
              <span className="font-semibold text-stone-800 line-clamp-1">{oil.origin}</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-[#E0D7C5]">
              <span className="text-stone-400 block text-[10px]">萃取部位</span>
              <span className="font-semibold text-stone-800">{oil.plantPart}</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-[#E0D7C5]">
              <span className="text-stone-400 block text-[10px]">萃取工艺</span>
              <span className="font-semibold text-stone-800">{oil.extractionMethod}</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-[#E0D7C5]">
              <span className="text-stone-400 block text-[10px]">IFRA 皮肤涂抹限值</span>
              <span className="font-mono font-bold text-[#A82A2A]">≤{oil.maxDermalPercent}%</span>
            </div>
          </div>

          {/* GC-MS Gas Chromatography Molecular Analysis */}
          <div className="bg-white/80 p-4 rounded-2xl border border-[#E0D7C5] space-y-3">
            <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] flex items-center justify-between">
              <span>GC-MS 气相色谱主要特征分子 ({oil.chemicalFamily})</span>
              <span className="text-stone-400 font-mono font-normal">典型含量区间</span>
            </h4>
            <div className="space-y-2">
              {oil.primaryMolecules.map((mol, mi) => (
                <div key={mi} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800">{mol.name}</span>
                    <span className="font-mono font-bold text-[#1C2E20]">{mol.percentage}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EAE5D8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1C2E20] rounded-full"
                      style={{ width: mol.percentage }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 04 TCM Qi Dynamics */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E2DAD0] space-y-2">
            <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#A82A2A]" />
              <span>Layer 04 中医五行归经与气机升降 (TCM Qi Dynamics)</span>
            </h4>
            <p className="text-stone-700 leading-relaxed font-serif-sc">
              五行归属于【<strong>{oil.element}行</strong>】，入【<strong>{oil.tcmMeridian}</strong>】。
              气机动态特征为【<strong>{oil.tcmQiDynamic || "生发条达 · 疏泄调畅"}</strong>】。
              {oil.physicalBenefit}
            </p>
          </div>

          {/* Lore & Synesthesia */}
          {oil.storyAndLore && (
            <div className="bg-[#FAF6EC] p-4 rounded-2xl border border-[#E8DFC8] space-y-1.5">
              <h5 className="font-serif-sc font-bold text-xs text-[#1C2E20] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#8C7A6B]" />
                <span>本草典故与文化历史逸事</span>
              </h5>
              <p className="text-xs text-stone-800 leading-relaxed font-serif-sc font-light">
                {oil.storyAndLore}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E0D7C5] flex items-center justify-between gap-3 flex-wrap">
        <div className="text-[11px] text-stone-500 font-serif-sc">
          UNIO Standard Botanical Knowledge Protocol V1.0
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAddToBlend}
            className={`px-4 py-2.5 rounded-xl font-serif-sc font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
              addedFeedback
                ? "bg-emerald-700 text-white shadow-md scale-105"
                : "bg-[#1C2E20] hover:bg-[#2A4730] text-[#FAF8F3] border border-[#3E5C44]"
            }`}
          >
            {addedFeedback ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>已加入调香配方池 (+2滴)</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>添加至当前配方 (+2滴)</span>
              </>
            )}
          </button>

          {onSelectForBlender && (
            <button
              onClick={() => {
                onSelectForBlender(oil);
                audioEngine.playDropletSound();
              }}
              className="px-4 py-2.5 bg-white hover:bg-[#FAF8F3] text-stone-800 border border-[#D5CCBA] font-serif-sc font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>前往调香沙箱</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
