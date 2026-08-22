import React, { useState, useRef } from "react";
import {
  Download,
  Printer,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Droplet,
  FlaskConical,
  Wind,
  Flame,
  TreePine,
  Waves,
  Mountain,
  Heart,
  ChevronDown,
  ChevronUp,
  CreditCard,
  CheckCircle2,
  Info,
  Play,
  RotateCcw,
  Volume2
} from "lucide-react";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import { ScentPrescription, NoteItem } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface PrescriptionCardProps {
  prescription: ScentPrescription;
  onToggleFavorite: (id: string) => void;
  onOrderBespoke: (prescription: ScentPrescription) => void;
  onStartBreathworkWithAroma: (prescription: ScentPrescription) => void;
  onGoToBlender?: (prescription: ScentPrescription) => void;
  onLogMood?: (prescription: ScentPrescription) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onToggleFavorite,
  onOrderBespoke,
  onStartBreathworkWithAroma,
  onGoToBlender,
  onLogMood
}) => {
  console.log("Rendering PrescriptionCard with:", prescription);
  if (!prescription) return <div className="p-4 text-red-500">处方数据缺失 (Prescription is undefined)</div>;
  const [activeTab, setActiveTab] = useState<"pyramid" | "molecules" | "rituals" | "lab_blend">("pyramid");
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const slipRef = useRef<HTMLDivElement | null>(null);

  // Blending Simulator State
  const [blendedDrops, setBlendedDrops] = useState<Record<string, number>>({});
  const totalTargetDrops = prescription?.olfactoryPyramid?.totalDrops || 20;

  const currentTotalBlended = Object.values(blendedDrops).reduce<number>((a, b) => a + Number(b), 0);
  const isBlendingComplete = currentTotalBlended >= totalTargetDrops;

  // Add drop in simulator
  const handleAddDrop = (noteName: string, maxDrops: number) => {
    if (!prescription || !prescription.olfactoryPyramid) {
      console.error("PrescriptionCard: prescription or olfactoryPyramid is undefined!", prescription);
      return;
    }
    const current = blendedDrops[noteName] || 0;
    if (current < maxDrops && !isBlendingComplete) {
      setBlendedDrops(prev => ({
        ...prev,
        [noteName]: current + 1
      }));
      audioEngine.playDropletSound();

      if (currentTotalBlended + 1 === totalTargetDrops) {
        audioEngine.strikeSingingBowl(528);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#1C2E20", "#C5A880", "#E8E2D5"]
        });
      }
    }
  };

  const resetBlend = () => {
    setBlendedDrops({});
    audioEngine.playDropletSound();
  };

  // Export Poster as Image
  const exportPoster = async () => {
    if (!slipRef.current) return;
    setIsGeneratingPoster(true);
    try {
      const canvas = await html2canvas(slipRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FAF8F2"
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${prescription.title}_UNIO芳香处方笺.png`;
      link.href = dataUrl;
      link.click();
      audioEngine.strikeSingingBowl(528);
    } catch (e) {
      console.error("Failed to generate poster:", e);
      alert("生成处方海报失败，请直接截图保存。");
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  // Print Prescription
  const printPrescription = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E5DFD1] shadow-2xs no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(prescription.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              prescription.isFavorite
                ? "bg-[#A82A2A]/10 border-[#A82A2A]/30 text-[#A82A2A]"
                : "bg-[#FAF8F3] border-[#DDD5C5] text-stone-700 hover:border-[#1C2E20]"
            }`}
          >
            {prescription.isFavorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{prescription.isFavorite ? "已收藏入档案" : "收藏处方"}</span>
          </button>

          <button
            onClick={() => onStartBreathworkWithAroma(prescription)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#1C2E20] text-white hover:bg-[#28422E] shadow-2xs transition-all"
          >
            <Wind className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>开启掌心吸嗅</span>
          </button>

          {onLogMood && (
            <button
              onClick={() => onLogMood(prescription)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FAF8F3] hover:bg-[#EAE4D5] border border-[#D5CCBA] text-[#1C2E20] transition-all"
              title="记录本次吸嗅后的身心情绪变化"
            >
              <Heart className="w-3.5 h-3.5 text-rose-700" />
              <span className="hidden sm:inline">记入日记</span>
            </button>
          )}

          {onGoToBlender && (
            <button
              onClick={() => onGoToBlender(prescription)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FAF8F3] hover:bg-[#EAE4D5] border border-[#D5CCBA] text-[#1C2E20] transition-all"
              title="在调香沙箱中重新配比与微调滴数"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">微调配方</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportPoster}
            disabled={isGeneratingPoster}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-[#F9F7F2] border border-[#DDD5C5] text-[#2C2824] shadow-2xs transition-all"
            title="导出高清极简中国风处方海报，适于分享相册/朋友圈/小红书"
          >
            <Share2 className="w-3.5 h-3.5 text-[#1C2E20]" />
            <span>{isGeneratingPoster ? "渲染海报中..." : "导出处方海报"}</span>
          </button>

          <button
            onClick={printPrescription}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-[#F9F7F2] border border-[#DDD5C5] text-[#2C2824] shadow-2xs transition-all"
            title="隔空打印 AirPrint / 导出 PDF"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">隔空打印 PDF</span>
          </button>

          <button
            onClick={() => setShowWalletModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#EFECE3] hover:bg-[#E4DFD2] border border-[#D5CCBA] text-[#4A4035] transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#1C2E20]" />
            <span className="hidden sm:inline">Apple 钱包卡片</span>
          </button>

          <button
            onClick={() => onOrderBespoke(prescription)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#A82A2A] text-white hover:bg-[#8F2323] shadow-xs transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>工坊手工打样</span>
          </button>
        </div>
      </div>

      {/* Main Electronic Prescription Slip (电子处方笺) */}
      <div
        ref={slipRef}
        className="prescription-slip bg-[#FAF8F2] rounded-3xl border border-[#D9D1BF] shadow-lg p-6 sm:p-10 relative overflow-hidden text-[#1E1C19]"
        style={{
          backgroundImage: "radial-gradient(#E2DAC8 0.75px, transparent 0.75px)",
          backgroundSize: "20px 20px"
        }}
      >
        {/* Subtle Watermark Stamp */}
        <div className="absolute right-8 top-12 opacity-8 pointer-events-none select-none">
          <div className="w-48 h-48 rounded-full border-4 border-[#A82A2A] flex items-center justify-center rotate-12">
            <span className="font-serif-sc font-extrabold text-2xl text-[#A82A2A] tracking-widest text-center">
              UNIO<br />一人一方
            </span>
          </div>
        </div>

        {/* Top Header of Slip */}
        <div className="border-b border-[#D8CFBC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-black tracking-[0.3em] text-[#8C7A6B]">UNIO BESPOKE RX</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1C2E20] text-[#FAF8F2] font-mono font-bold tracking-wider">
                {prescription.rxCode}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-light">
              开具日期：{new Date(prescription.createdAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-stone-500 block">四时归经 / 五行属性</span>
              <span className="text-xs font-serif-sc font-bold text-[#1C2E20]">
                {prescription.seasonTerm} · {prescription.fiveElement}
              </span>
            </div>
            <div className="seal-stamp w-12 h-12 rounded-sm text-[11px] font-bold text-center leading-tight">
              极境<br />御用
            </div>
          </div>
        </div>

        {/* Prescription Title & Poetic Philosophy */}
        <div className="py-6 sm:py-8 space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="font-serif-sc text-3xl sm:text-4xl font-extrabold text-[#1C2E20] tracking-tight">
              {prescription.title}
            </h1>
            <span className="text-xs sm:text-sm font-serif-sc text-[#8C7A6B] italic font-medium">
              {prescription.poeticSub}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 font-serif-sc leading-relaxed max-w-3xl bg-[#F0ECE1]/60 p-4 rounded-2xl border border-[#DDD5C3]">
            {prescription.concept}
          </p>
        </div>

        {/* Section Navigation inside Prescription Slip */}
        <div className="flex items-center gap-1 border-b border-[#D8CFBC] mb-6 overflow-x-auto no-scrollbar no-print">
          <button
            onClick={() => setActiveTab("pyramid")}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all shrink-0 ${
              activeTab === "pyramid"
                ? "border-[#1C2E20] text-[#1C2E20] font-bold"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            嗅觉金字塔与配比
          </button>
          <button
            onClick={() => setActiveTab("lab_blend")}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "lab_blend"
                ? "border-[#1C2E20] text-[#1C2E20] font-bold"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>模拟滴管调香工坊</span>
            {isBlendingComplete && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
          </button>
          <button
            onClick={() => setActiveTab("molecules")}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all shrink-0 ${
              activeTab === "molecules"
                ? "border-[#1C2E20] text-[#1C2E20] font-bold"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            分子活性与神经机理
          </button>
          <button
            onClick={() => setActiveTab("rituals")}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all shrink-0 ${
              activeTab === "rituals"
                ? "border-[#1C2E20] text-[#1C2E20] font-bold"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            芳疗师仪式与经络穴位
          </button>
        </div>

        {/* Tab 1: Olfactory Pyramid & Drops */}
        {activeTab === "pyramid" && (
          <div className="space-y-6">
            {/* Top Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-serif-sc font-bold text-[#8C7A6B] border-b border-[#E5DFD1] pb-1">
                <span>【前调 · 启承清幽】Top Notes (约占 25~35%)</span>
                <span>行气开窍 · 瞬时芳香传导</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prescription.olfactoryPyramid.topNotes.map((note, i) => (
                  <div key={i} className="bg-white/70 p-3.5 rounded-xl border border-[#E0D7C5] flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">{note.name}</h4>
                      <p className="text-[11px] text-stone-500 italic font-mono">{note.latin}</p>
                      <p className="text-[11px] text-stone-600 mt-1">{note.effect}</p>
                    </div>
                    <div className="text-right pl-3">
                      <span className="font-mono text-base font-extrabold text-[#1C2E20] block">{note.drops} 滴</span>
                      <span className="text-[10px] text-stone-400 font-mono">{note.ratio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-serif-sc font-bold text-[#8C7A6B] border-b border-[#E5DFD1] pb-1">
                <span>【中调 · 核心疗愈】Heart Notes (约占 40~50%)</span>
                <span>平衡身心 · 调节情绪稳态</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prescription.olfactoryPyramid.middleNotes.map((note, i) => (
                  <div key={i} className="bg-white/70 p-3.5 rounded-xl border border-[#E0D7C5] flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">{note?.name || "未知精油"}</h4>
                      <p className="text-[11px] text-stone-500 italic font-mono">{note?.latin}</p>
                      <p className="text-[11px] text-stone-600 mt-1">{note?.effect}</p>
                    </div>
                    <div className="text-right pl-3">
                      <span className="font-mono text-base font-extrabold text-[#1C2E20] block">{note?.drops || 0} 滴</span>
                      <span className="text-[10px] text-stone-400 font-mono">{note?.ratio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Base Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-serif-sc font-bold text-[#8C7A6B] border-b border-[#E5DFD1] pb-1">
                <span>【后调 · 沉香定锚】Base Notes (约占 20~30%)</span>
                <span>深层潜阳 · 延长留香与安全感</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prescription.olfactoryPyramid.baseNotes.map((note, i) => (
                  <div key={i} className="bg-white/70 p-3.5 rounded-xl border border-[#E0D7C5] flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">{note?.name || "未知精油"}</h4>
                      <p className="text-[11px] text-stone-500 italic font-mono">{note?.latin}</p>
                      <p className="text-[11px] text-stone-600 mt-1">{note?.effect}</p>
                    </div>
                    <div className="text-right pl-3">
                      <span className="font-mono text-base font-extrabold text-[#1C2E20] block">{note?.drops || 0} 滴</span>
                      <span className="text-[10px] text-stone-400 font-mono">{note?.ratio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier & Total Specs */}
            <div className="bg-[#EFEAE0] p-4 rounded-2xl border border-[#D5CCBA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-stone-500 block">推荐基底调和油：</span>
                <span className="font-serif-sc font-bold text-[#1C2E20]">{prescription.olfactoryPyramid.carrierOil}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-stone-500 block">总滴数：</span>
                  <span className="font-mono font-bold text-sm text-[#1C2E20]">{prescription.olfactoryPyramid.totalDrops} 滴</span>
                </div>
                <div>
                  <span className="text-stone-500 block">标定容积浓度：</span>
                  <span className="font-mono font-bold text-sm text-[#1C2E20]">{prescription.olfactoryPyramid.totalVolume}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Pipette Blending Simulator (模拟滴管调香) */}
        {activeTab === "lab_blend" && (
          <div className="space-y-6">
            <div className="bg-[#EFEAE0] p-4 rounded-2xl border border-[#D5CCBA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20] flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#C5A880]" />
                  模拟调香工坊 · 亲历滴定仪式
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  点击下方各单方精油滴管，在清脆滴落声中感受香气分子的层层融合
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">调配进度</span>
                  <span className="font-mono font-bold text-sm text-[#1C2E20]">
                    {currentTotalBlended} / {totalTargetDrops} 滴
                  </span>
                </div>
                <button
                  onClick={resetBlend}
                  className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-[#D5CCBA] text-stone-600 transition-all"
                  title="重置调配"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Virtual Apothecary Beaker Visualization */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white/60 p-6 rounded-2xl border border-[#E0D7C5]">
              {/* Glass Bottle Graphic */}
              <div className="w-40 h-56 bg-gradient-to-b from-[#FAF8F3] to-[#EAE4D5] rounded-3xl border-2 border-[#C5A880]/70 p-3 shadow-inner relative flex flex-col justify-end overflow-hidden shrink-0">
                {/* Fluid level animation */}
                <div
                  className="w-full bg-gradient-to-t from-[#B8976C] to-[#E0CFA8] rounded-b-2xl transition-all duration-300 relative shadow-sm"
                  style={{
                    height: `${Math.max(8, (currentTotalBlended / totalTargetDrops) * 85)}%`
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-white/50 animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
                  <span className="font-cinzel text-[10px] tracking-widest text-[#5C4F41]">UNIO 10ML</span>
                  <span className="font-serif-sc text-xs font-bold text-[#1C2E20] mt-1">{prescription.title}</span>
                  {isBlendingComplete && (
                    <span className="text-[10px] mt-2 px-2 py-0.5 bg-[#1C2E20] text-[#FAF8F2] rounded-full font-bold animate-bounce">
                      调配完成 ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Pipette Triggers for all ingredients */}
              <div className="flex-1 space-y-3 w-full">
                {[
                  ...prescription.olfactoryPyramid.topNotes,
                  ...prescription.olfactoryPyramid.middleNotes,
                  ...prescription.olfactoryPyramid.baseNotes
                ].map((note, idx) => {
                  const added = blendedDrops[note.name] || 0;
                  const isDone = added >= note.drops;
                  return (
                    <div key={idx} className="bg-white/80 p-3 rounded-xl border border-[#DDD5C5] flex items-center justify-between">
                      <div>
                        <span className="font-serif-sc font-bold text-xs text-[#1C2E20] block">{note?.name || "未知精油"}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          已滴入 {added} / {note?.drops || 0} 滴
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddDrop(note?.name || "unknown", note?.drops || 0)}
                        disabled={isDone || isBlendingComplete}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isDone
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-[#1C2E20] text-white hover:bg-[#2C4A33] active:scale-95 shadow-2xs"
                        }`}
                      >
                        <Droplet className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{isDone ? "已满" : "滴入 +1"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Molecular Active Profile */}
        {activeTab === "molecules" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>化学族群 & 神经通路靶点</span>
              <span>身心药理学效能</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prescription.molecularAnalysis.map((mol, idx) => (
                <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-[#E0D7C5] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">{mol.compound}</h4>
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-full bg-[#1C2E20]/10 text-[#1C2E20]">
                      {mol.percentage}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-600 font-light">
                      <strong className="text-stone-900 font-medium">传导靶点：</strong>{mol.pathway}
                    </p>
                    <p className="text-emerald-900 font-medium bg-[#EBF5EE] p-2 rounded-xl border border-[#CDE5D4]">
                      {mol.benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Aromatherapy Rituals & Acupoints */}
        {activeTab === "rituals" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/80 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
                <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-indigo-900" />
                  掌心吸嗅法 (4-7-8)
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {prescription.aromatherapyAdvice.palmInhalation}
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
                <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  超声波扩香比例
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {prescription.aromatherapyAdvice.diffuser}
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-[#E0D7C5] space-y-1.5">
                <h4 className="font-serif-sc font-bold text-xs text-[#1C2E20] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-900" />
                  脉搏与耳后点涂
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {prescription.aromatherapyAdvice.pulsePoint}
                </p>
              </div>
            </div>

            {/* TCM Acupoints Map */}
            <div className="bg-white/80 p-5 rounded-2xl border border-[#E0D7C5] space-y-3">
              <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">
                🌿 中医经络穴位点涂调理 (重点推荐)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prescription.aromatherapyAdvice.acupoints.map((pt, idx) => (
                  <div key={idx} className="bg-[#FAF8F3] p-3.5 rounded-xl border border-[#E2DAD0] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif-sc font-bold text-xs text-[#A82A2A]">{pt?.name || "未知穴位"}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#EAE5D8] rounded text-[#4A4035]">穴位经皮吸收</span>
                    </div>
                    <p className="text-xs text-stone-700">
                      <span className="font-semibold text-stone-900">精准定位：</span>{pt.location}
                    </p>
                    <p className="text-xs text-emerald-900 font-medium">
                      <span className="font-semibold">调理机理：</span>{pt.effect}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Safety Disclaimer Footer of Slip */}
        <div className="mt-8 pt-4 border-t border-[#D8CFBC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-500">
          <p>
            <span className="font-semibold text-[#1C2E20]">安全提示：</span>{prescription.safetyNotes}
          </p>
          <p className="font-mono text-stone-400 shrink-0">UNIO ATELIER · 东方高定调香工坊</p>
        </div>
      </div>

      {/* Apple Wallet Pass Preview Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C2E20] text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-[#3A5E42] space-y-6 relative">
            <div className="flex items-center justify-between border-b border-[#2C4832] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs tracking-widest text-[#D4AF37]">APPLE WALLET PASS</span>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-stone-400 hover:text-white text-xs px-2 py-1 bg-white/10 rounded-full"
              >
                关闭
              </button>
            </div>

            {/* Simulated Apple Wallet Pass Card */}
            <div className="bg-gradient-to-br from-[#243B2A] to-[#132016] p-5 rounded-2xl border border-[#446C4E] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase">UNIO Bespoke Scent</span>
                <span className="font-mono text-xs font-bold text-white">{prescription.rxCode}</span>
              </div>
              <div>
                <h3 className="font-serif-sc text-2xl font-bold text-[#FAF8F2]">{prescription.title}</h3>
                <p className="text-xs text-stone-300 font-light mt-0.5">{prescription.poeticSub}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-3">
                <div>
                  <span className="text-[10px] text-stone-400 block">四时节气</span>
                  <span className="font-medium text-white">{prescription.seasonTerm}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">身心属性</span>
                  <span className="font-medium text-white">{prescription.fiveElement}</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[10px] text-stone-400">
                <span>专属于 2008zx@gmail.com</span>
                <span className="text-[#D4AF37]">已同步云端通行证 ✓</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert("处方已成功添加到您的模拟 Apple 钱包 (Apple Wallet Pass)！");
                setShowWalletModal(false);
              }}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1C2E20] rounded-xl font-bold text-xs transition-all shadow-md"
            >
              添加至 Apple 钱包 (Add to Apple Wallet)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
