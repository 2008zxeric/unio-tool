import React, { useState } from "react";
import {
  Sparkles,
  Wind,
  Sliders,
  CalendarHeart,
  FlaskConical,
  CheckCircle2,
  Volume2,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Info,
  Clock,
  Compass
} from "lucide-react";
import { VIBE_DESIRE_LIST, UNIO_APPARATUS_LIST, SINGLE_ESSENTIAL_OILS } from "../data/scentDatabase";
import { VibeDesire, ScentPrescription, ScentApparatus } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface ScentVibeTestViewProps {
  onPrescriptionGenerated: (rx: ScentPrescription) => void;
  onStartBreathwork: (rx: ScentPrescription) => void;
  onGoToBlender: (rx: ScentPrescription) => void;
  onGoToAtelier: (rx: ScentPrescription) => void;
  onGoToTracker: (rx: ScentPrescription) => void;
}

export const ScentVibeTestView: React.FC<ScentVibeTestViewProps> = ({
  onPrescriptionGenerated,
  onStartBreathwork,
  onGoToBlender,
  onGoToAtelier,
  onGoToTracker
}) => {
  const [selectedVibe, setSelectedVibe] = useState<VibeDesire>(VIBE_DESIRE_LIST[0]);
  const [selectedScene, setSelectedScene] = useState<string>("办公工位");
  const [selectedFormat, setSelectedFormat] = useState<string>("app_roller_brass");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedRx, setGeneratedRx] = useState<ScentPrescription | null>(null);

  const scenes = [
    { id: "办公工位", label: "💻 办公与高压创作", sub: "需要清醒专注，防午后倦怠" },
    { id: "卧室睡前", label: "🌙 卧室与睡前助眠", sub: "思绪翻涌难以入眠，卸下紧绷" },
    { id: "茶室冥想", label: "🍵 静心茶室与瑜伽", sub: "切断外界干扰，静坐内观" },
    { id: "差旅出行", label: "🚗 差旅交通与车内", sub: "祛除异味浊气，平稳情绪" },
    { id: "居家客厅", label: "🏡 居家客厅日常", sub: "全屋温馨雅致，营造安心气场" }
  ];

  const handleSelectVibe = (vibe: VibeDesire) => {
    setSelectedVibe(vibe);
    setSelectedFormat(vibe.recommendedApparatus);
    audioEngine.playDropletSound();
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    audioEngine.strikeSingingBowl(528);

    setTimeout(() => {
      // Find matching oils
      const primaryOils = selectedVibe.recommendedNotes.map((name, idx) => {
        const found = SINGLE_ESSENTIAL_OILS.find(o => o.name.includes(name) || name.includes(o.name)) || SINGLE_ESSENTIAL_OILS[idx];
        return found;
      });

      const topOil = primaryOils.find(o => o.noteType === "top") || SINGLE_ESSENTIAL_OILS.find(o => o.id === "oil_bergamot")!;
      const midOil = primaryOils.find(o => o.noteType === "middle") || SINGLE_ESSENTIAL_OILS.find(o => o.id === "oil_lavender")!;
      const baseOil = primaryOils.find(o => o.noteType === "base") || SINGLE_ESSENTIAL_OILS.find(o => o.id === "oil_sandalwood")!;

      const rxCode = `UNIO-${new Date().getFullYear()}-VB${Math.floor(1000 + Math.random() * 9000)}`;

      const newRx: ScentPrescription = {
        id: `rx_vibe_${Date.now()}`,
        rxCode,
        title: `《${selectedVibe.label.split(" · ")[0]}·${selectedScene.slice(0, 2)}方》`,
        poeticSub: `${selectedVibe.sub} · ${selectedVibe.element}行气机调和`,
        concept: `专为当前「${selectedVibe.label}」意向与【${selectedScene}】情境特别生成。${selectedVibe.tcmBenefit}，重塑自主神经稳态。`,
        seasonTerm: "即时意象",
        fiveElement: selectedVibe.element,
        olfactoryPyramid: {
          topNotes: [
            { name: topOil.name, latin: topOil.latin, drops: 4, ratio: "20%", effect: topOil.emotionalBenefit, element: topOil.element }
          ],
          middleNotes: [
            { name: midOil.name, latin: midOil.latin, drops: 8, ratio: "40%", effect: midOil.emotionalBenefit, element: midOil.element }
          ],
          baseNotes: [
            { name: baseOil.name, latin: baseOil.latin, drops: 8, ratio: "40%", effect: baseOil.emotionalBenefit, element: baseOil.element }
          ],
          carrierOil: "有机金黄荷荷巴油 (Golden Jojoba)",
          totalDrops: 20,
          totalVolume: "10ml (3% 舒缓滚珠油)"
        },
        molecularAnalysis: [
          { compound: topOil.primaryMolecules[0]?.name || "芳樟醇", percentage: topOil.primaryMolecules[0]?.percentage || "38%", pathway: "嗅球与边缘系统直达", benefit: "快速打破情绪死锁，平衡自主神经" },
          { compound: baseOil.primaryMolecules[0]?.name || "α-檀香醇", percentage: baseOil.primaryMolecules[0]?.percentage || "45%", pathway: "GABA受体变构调节", benefit: "深层潜阳，延长安全感与专注时长" }
        ],
        aromatherapyAdvice: {
          palmInhalation: "滴 1 滴于掌心，双手合十轻搓 3 次，覆于鼻前深吸 4 秒，屏息 7 秒，慢吐 8 秒。",
          diffuser: "空间扩香滴入 3~5 滴，保持通风。",
          pulsePoint: "轻涂于双侧手腕脉搏处与耳后翳风穴。",
          acupoints: [
            { name: "内关穴", location: "腕横纹上2寸，掌长肌腱与桡侧腕屈肌腱之间", effect: "宽胸理气，宁心安神，缓解心慌胸闷" },
            { name: "太冲穴", location: "足背侧，第1、2跖骨结合部之前凹陷中", effect: "疏肝平肝，清热利湿，化解急躁易怒" }
          ]
        },
        safetyNotes: "纯天然植物精油复配。孕妇或特应性皮炎请遵芳疗师指引。",
        createdAt: new Date().toISOString(),
        isFavorite: true,
        synergyScore: 94
      };

      setGeneratedRx(newRx);
      onPrescriptionGenerated(newRx);
      setIsGenerating(false);
    }, 800);
  };

  const matchingApparatus = UNIO_APPARATUS_LIST.find(a => a.id === selectedFormat) || UNIO_APPARATUS_LIST[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2E20]/10 text-[#1C2E20] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>直觉闻香 · 30秒生成专属配方</span>
        </div>
        <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20]">
          “你现在更想要哪种感觉？”
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          跳过繁琐的理论，让身心的第一直觉选择最渴望的香气能量与搭配器具
        </p>
      </div>

      {/* Step 1: Vibe Desire Grid */}
      <div className="space-y-3">
        <label className="font-serif-sc text-xs font-bold text-[#1C2E20] flex items-center justify-between">
          <span>① 选择当下的心境向往</span>
          <span className="text-stone-400 font-normal">点击切换</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VIBE_DESIRE_LIST.map((vibe) => {
            const isSelected = selectedVibe.id === vibe.id;
            return (
              <div
                key={vibe.id}
                onClick={() => handleSelectVibe(vibe)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#1C2E20] text-[#FAF8F3] border-[#1C2E20] shadow-md scale-[1.01]"
                    : "bg-white/90 text-stone-800 border-[#E2DAD0] hover:border-[#1C2E20]/60 shadow-2xs"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-sc font-bold text-sm tracking-wide">
                      {vibe.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isSelected ? "bg-white/20 text-[#D4AF37]" : "bg-[#F0ECE1] text-stone-600"
                    }`}>
                      五行{vibe.element}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed font-light ${isSelected ? "text-stone-300" : "text-stone-600"}`}>
                    {vibe.sub}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px]">
                  <span className={isSelected ? "text-[#E5DCBE]" : "text-stone-500"}>
                    {vibe.tcmBenefit}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Scene & Context Selection */}
      <div className="space-y-3">
        <label className="font-serif-sc text-xs font-bold text-[#1C2E20]">
          ② 当前处于什么空间场景？
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScene(s.id);
                audioEngine.playDropletSound();
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedScene === s.id
                  ? "bg-[#2E4A34] text-white border-[#2E4A34] shadow-xs"
                  : "bg-white/80 text-stone-700 border-[#E2DAD0] hover:border-stone-400"
              }`}
            >
              <span className="text-xs font-bold block">{s.label}</span>
              <span className={`text-[10px] block line-clamp-1 mt-0.5 ${
                selectedScene === s.id ? "text-stone-300" : "text-stone-400"
              }`}>
                {s.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Recommended Apparatus Card */}
      <div className="bg-[#FAF3EA] border border-[#EBDCC5] p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif-sc font-bold text-xs text-[#5C3818] flex items-center gap-1.5">
            <span>③ 智能推荐搭配器具 (Apparatus Pairing)</span>
          </h4>
          <span className="text-[11px] text-[#A84C2A] font-medium font-mono">
            {matchingApparatus.categoryName}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h5 className="font-serif-sc font-bold text-sm text-[#1C2E20]">{matchingApparatus.name}</h5>
              <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                {matchingApparatus.highlight}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              {matchingApparatus.desc}
            </p>
            <p className="text-[11px] text-stone-400">
              材质：{matchingApparatus.material} · 适用：{matchingApparatus.usageScenario}
            </p>
          </div>

          <div className="flex sm:flex-col gap-1.5 shrink-0 w-full sm:w-auto">
            {UNIO_APPARATUS_LIST.map(a => (
              <button
                key={a.id}
                onClick={() => {
                  setSelectedFormat(a.id);
                  audioEngine.playDropletSound();
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                  selectedFormat === a.id
                    ? "bg-[#1C2E20] text-white border-[#1C2E20] font-bold"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {a.categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1C2E20] text-white font-serif-sc font-bold text-sm shadow-md hover:bg-[#28422E] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span>{isGenerating ? "正在解析草木分子与气机..." : "生成一人一方专属配方与器具组合"}</span>
        </button>
      </div>

      {/* Result Card (When Generated) */}
      {generatedRx && (
        <div className="mt-8 bg-[#FAF8F2] border-2 border-[#C5A880] p-6 rounded-3xl shadow-lg space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DAD0] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#A82A2A]">{generatedRx.rxCode}</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full font-medium">
                  气机协同评分 {generatedRx.synergyScore}
                </span>
              </div>
              <h3 className="font-serif-sc text-2xl font-bold text-[#1C2E20] mt-1">
                {generatedRx.title}
              </h3>
              <p className="text-xs text-stone-600 font-light mt-0.5">
                {generatedRx.poeticSub}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onStartBreathwork(generatedRx)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C2E20] text-white text-xs font-bold shadow-xs hover:bg-[#2B4632]"
              >
                <Wind className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>立即 4-7-8 吸嗅</span>
              </button>

              <button
                onClick={() => onGoToTracker(generatedRx)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-stone-800 text-xs font-medium hover:bg-[#EAE4D5]"
              >
                <CalendarHeart className="w-3.5 h-3.5 text-rose-800" />
                <span>记入日记</span>
              </button>
            </div>
          </div>

          {/* Scent Structure */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#E2DAD0] space-y-1">
              <span className="text-[10px] text-stone-500 font-mono">前调 (Top · 20%)</span>
              <p className="font-serif-sc font-bold text-xs text-[#1C2E20]">
                {generatedRx.olfactoryPyramid.topNotes.map(n => `${n.name} ${n.drops}滴`).join(" + ")}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E2DAD0] space-y-1">
              <span className="text-[10px] text-stone-500 font-mono">中调 (Heart · 40%)</span>
              <p className="font-serif-sc font-bold text-xs text-[#1C2E20]">
                {generatedRx.olfactoryPyramid.middleNotes.map(n => `${n.name} ${n.drops}滴`).join(" + ")}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E2DAD0] space-y-1">
              <span className="text-[10px] text-stone-500 font-mono">后调 (Base · 40%)</span>
              <p className="font-serif-sc font-bold text-xs text-[#1C2E20]">
                {generatedRx.olfactoryPyramid.baseNotes.map(n => `${n.name} ${n.drops}滴`).join(" + ")}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-[#E2DAD0] flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => onGoToBlender(generatedRx)}
              className="flex items-center gap-1.5 text-[#8C7A6B] hover:text-[#1C2E20] font-semibold"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              <span>在调香沙箱中精细微调滴数与容积</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onGoToAtelier(generatedRx)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A82A2A] text-white font-bold hover:bg-[#8F2323] shadow-xs"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>联系 UNIO 调香师打样与原料配送</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
