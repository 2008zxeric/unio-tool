import React, { useState, useMemo } from "react";
import {
  FlaskConical,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  Droplet,
  Sliders,
  Scale,
  Activity,
  Bookmark,
  Share2,
  Flame,
  TreePine,
  Waves,
  Mountain,
  Sun,
  Crown
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  ESSENTIAL_OILS_DATABASE,
  CARRIER_OILS_DATABASE
} from "../data/scentDatabase";
import { SingleEssentialOil, CarrierOilInfo, ScentPrescription, BlendIngredient } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface OilBlenderViewProps {
  onSavePrescription: (rx: ScentPrescription) => void;
  onGoToAtelier: (rx: ScentPrescription) => void;
  ingredients?: BlendIngredient[];
  onIngredientsChange?: (ingredients: BlendIngredient[]) => void;
}

const DILUTION_PRESETS = [
  { rate: 0.5, label: "0.5% 极低敏面部", desc: "敏感肌面部日常护理、眼周点涂" },
  { rate: 1.0, label: "1.0% 每日身心滋养", desc: "全身经络按摩、儿童及老年人安全护理" },
  { rate: 2.0, label: "2.0% 情绪与慢病舒缓", desc: "日常减压、冥想通经、轻度失眠调理" },
  { rate: 3.0, label: "3.0% 极境芳香滚珠", desc: "标准脉搏油、局部穴位强效舒缓 (推荐)" },
  { rate: 5.0, label: "5.0% 情绪急救与定点", desc: "突发心慌焦虑、剧烈偏头痛定点冷敷" },
  { rate: 15.0, label: "15.0% 沙龙淡香精 (EDP)", desc: "植物酒精底，高定东方沙龙香水" }
];

const VOLUME_OPTIONS = [
  { val: 5, label: "5 ml (体验便携瓶)" },
  { val: 10, label: "10 ml (标准滚珠瓶)" },
  { val: 15, label: "15 ml (中号精油瓶)" },
  { val: 30, label: "30 ml (经典沙龙香水瓶)" },
  { val: 50, label: "50 ml (大容量香薰瓶)" },
  { val: 100, label: "100 ml (全身按摩基础油)" }
];

export const OilBlenderView: React.FC<OilBlenderViewProps> = ({
  onSavePrescription,
  onGoToAtelier,
  ingredients: externalIngredients,
  onIngredientsChange
}) => {
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierOilInfo>(CARRIER_OILS_DATABASE[0]);
  const [volumeMl, setVolumeMl] = useState<number>(10);
  const [dilutionRate, setDilutionRate] = useState<number>(3.0);
  const [blendTitle, setBlendTitle] = useState<string>("《松雪煎茶》");
  const [blendSub, setBlendSub] = useState<string>("冷杉与白茶 · 灵台清明与深度定神");

  // Selected ingredients in the blend
  const [localIngredients, setLocalIngredients] = useState<BlendIngredient[]>(() => {
    const defaultIds = ["oil_fir", "oil_white_tea", "oil_sandalwood"];
    const initialOils = defaultIds
      .map(id => ESSENTIAL_OILS_DATABASE.find(o => o.id === id))
      .filter(o => o !== undefined) as SingleEssentialOil[];
    
    return initialOils.map(o => ({ oilId: o.id, oil: o, drops: 2 }));
  });

  const ingredients = externalIngredients !== undefined ? externalIngredients : localIngredients;
  const setIngredients = (updater: BlendIngredient[] | ((prev: BlendIngredient[]) => BlendIngredient[])) => {
    const next = typeof updater === "function" ? updater(ingredients) : updater;
    if (onIngredientsChange) {
      onIngredientsChange(next);
    } else {
      setLocalIngredients(next);
    }
  };

  const [selectedOilToAdd, setSelectedOilToAdd] = useState<string>(ESSENTIAL_OILS_DATABASE[0].id);

  // Dilution math (Standard international aromatherapist standard: 20 drops = 1 ml)
  const theoreticalTotalDrops = Math.max(1, Math.round((volumeMl * 20 * (dilutionRate / 100))));
  
  // Note breakdown
  console.log("Ingredients:", ingredients);
  const safeIngredients = useMemo(() => ingredients.filter(i => i.oil), [ingredients]);
  const actualCurrentDrops = useMemo(() => safeIngredients.reduce((acc, curr) => acc + curr.drops, 0), [safeIngredients]);
  const topDrops = safeIngredients.filter(i => i.oil?.noteType === "top").reduce((a, b) => a + b.drops, 0);
  const midDrops = safeIngredients.filter(i => i.oil?.noteType === "middle").reduce((a, b) => a + b.drops, 0);
  const baseDrops = safeIngredients.filter(i => i.oil?.noteType === "base").reduce((a, b) => a + b.drops, 0);
  const topPercent = actualCurrentDrops > 0 ? Math.round((topDrops / actualCurrentDrops) * 100) : 0;
  const midPercent = actualCurrentDrops > 0 ? Math.round((midDrops / actualCurrentDrops) * 100) : 0;
  const basePercent = actualCurrentDrops > 0 ? Math.round((baseDrops / actualCurrentDrops) * 100) : 0;

  // Synergy calculation algorithm based on note ratio + chemical compatibility
  const synergyScore = useMemo(() => {
    if (safeIngredients.length === 0) return 0;
    let score = 75;
    // Reward balanced pyramid: Top (20-35%), Mid (35-55%), Base (15-35%)
    if (topPercent >= 20 && topPercent <= 35) score += 8;
    if (midPercent >= 35 && midPercent <= 55) score += 10;
    if (basePercent >= 15 && basePercent <= 35) score += 7;

    // Check chemical family diversity
    const chemicalFamilies = new Set(safeIngredients.map(i => i.oil.chemicalFamily));
    score += Math.min(chemicalFamilies.size * 2, 6);

    // Bound to 60-99
    return Math.min(99, Math.max(60, score));
  }, [safeIngredients, topPercent, midPercent, basePercent]);

  // Safety warnings
  const safetyWarnings = useMemo(() => {
    const warnings: string[] = [];
    const actualPercent = (actualCurrentDrops / (volumeMl * 20)) * 100;

    if (actualPercent > 10 && !selectedCarrier.id.includes("alcohol")) {
      warnings.push(`当前稀释度为 ${actualPercent.toFixed(1)}%，超过常规涂抹油安全界限 (5%)，建议稀释后使用。`);
    }

    safeIngredients.forEach(item => {
      const singleOilPercent = (item.drops / (volumeMl * 20)) * 100;
      if (singleOilPercent > item.oil.maxDermalPercent) {
        warnings.push(`【${item.oil.name}】浓度 (${singleOilPercent.toFixed(1)}%) 超过 IFRA 建议最高涂抹安全限值 (${item.oil.maxDermalPercent}%)。`);
      }
      if (!item.oil.isPregnancySafe) {
        warnings.push(`【${item.oil.name}】含有促通经或活血成分，孕期与备孕女性不建议使用。`);
      }
      if (!item.oil.isPetSafe) {
        warnings.push(`【${item.oil.name}】针叶或酚类挥发分子对猫咪/犬类肝肾代谢有负担，宠物家庭建议低浓度扩香。`);
      }
    });

    return warnings;
  }, [safeIngredients, actualCurrentDrops, volumeMl, selectedCarrier]);

  // Add Oil to Blend
  const handleAddOil = () => {
    const oilObj = ESSENTIAL_OILS_DATABASE.find(o => o.id === selectedOilToAdd);
    if (!oilObj) return;

    if (ingredients.some(i => i.oilId === oilObj.id)) {
      // Increase drops
      setIngredients(prev =>
        prev.map(item => item.oilId === oilObj.id ? { ...item, drops: item.drops + 1 } : item)
      );
    } else {
      if (ingredients.length >= 6) {
        alert("为保证香气纯净与五行平衡，单个配方建议精简在 6 款单方精油以内。");
        return;
      }
      setIngredients(prev => [...prev, { oilId: oilObj.id, oil: oilObj, drops: 1 }]);
    }
    audioEngine.playDropletSound();
  };

  // Adjust drops
  const handleUpdateDrops = (oilId: string, delta: number) => {
    setIngredients(prev =>
      prev
        .map(item => {
          if (item.oilId === oilId) {
            const nextDrops = item.drops + delta;
            return nextDrops > 0 ? { ...item, drops: nextDrops } : null;
          }
          return item;
        })
        .filter(Boolean) as BlendIngredient[]
    );
    audioEngine.playDropletSound();
  };

  // Remove Oil
  const handleRemoveOil = (oilId: string) => {
    setIngredients(prev => prev.filter(i => i.oilId !== oilId));
    audioEngine.playDropletSound();
  };

  // Auto-Balance to Theoretical Target Drops
  const handleAutoBalance = () => {
    if (ingredients.length === 0) return;
    const target = theoreticalTotalDrops;
    const count = ingredients.length;
    const baseDropPerOil = Math.floor(target / count);
    let remainder = target % count;

    setIngredients(prev =>
      prev.map((item, idx) => ({
        ...item,
        drops: baseDropPerOil + (idx < remainder ? 1 : 0)
      }))
    );
    audioEngine.strikeSingingBowl(528);
  };

  // Save current blend as Scent Prescription
  const handleSaveAsPrescription = () => {
    const topNotes = safeIngredients
      .filter(i => i.oil?.noteType === "top")
      .map(i => ({
        name: i.oil?.name,
        latin: i.oil?.latin,
        drops: i.drops,
        ratio: `${Math.round((i.drops / actualCurrentDrops) * 100)}%`,
        effect: i.oil?.emotionalBenefit,
        element: i.oil?.element
      }));

    const middleNotes = safeIngredients
      .filter(i => i.oil?.noteType === "middle")
      .map(i => ({
        name: i.oil?.name,
        latin: i.oil?.latin,
        drops: i.drops,
        ratio: `${Math.round((i.drops / actualCurrentDrops) * 100)}%`,
        effect: i.oil?.emotionalBenefit,
        element: i.oil?.element
      }));

    const baseNotes = safeIngredients
      .filter(i => i.oil?.noteType === "base")
      .map(i => ({
        name: i.oil?.name,
        latin: i.oil?.latin,
        drops: i.drops,
        ratio: `${Math.round((i.drops / actualCurrentDrops) * 100)}%`,
        effect: i.oil?.emotionalBenefit,
        element: i.oil?.element
      }));

    const newRx: ScentPrescription = {
      id: "rx_custom_" + Date.now(),
      rxCode: "UNIO-DIY-" + Math.floor(1000 + Math.random() * 9000),
      title: blendTitle || "《自调极境方》",
      poeticSub: blendSub || "专属芳香配比 · 身心气机调和",
      concept: `由用户在 UNIO 调香沙箱中自主配比：以 ${selectedCarrier.name} 为基底，严选 ${ingredients.map(i => i.oil.name).join("、")}。整体协同度达到 ${synergyScore} 分。`,
      seasonTerm: "处暑",
      fiveElement: "五行调和",
      synergyScore,
      olfactoryPyramid: {
        topNotes,
        middleNotes,
        baseNotes,
        carrierOil: selectedCarrier.name,
        totalDrops: actualCurrentDrops,
        totalVolume: `${volumeMl}ml (${((actualCurrentDrops / (volumeMl * 20)) * 100).toFixed(1)}% 浓度)`
      },
      molecularAnalysis: ingredients.slice(0, 3).map(i => ({
        compound: i.oil.primaryMolecules[0]?.name || i.oil.chemicalFamily,
        percentage: `${Math.round((i.drops / actualCurrentDrops) * 100)}% 配比`,
        pathway: i.oil.tcmMeridian,
        benefit: i.oil.physicalBenefit
      })),
      aromatherapyAdvice: {
        palmInhalation: "滴 1~2 滴于掌心搓热，双手呈杯状做 4-7-8 深呼吸。",
        diffuser: `超声波扩香机滴入 4-6 滴，适于 ${volumeMl >= 30 ? "客厅或大空间" : "书房及案头"} 净化。`,
        pulsePoint: "点涂于手腕内侧神门穴、耳后翳风穴及颈部脉搏处。",
        acupoints: [
          { name: "膻中穴 (任脉)", location: "胸部正中平两乳头连线中点", effect: "宽胸理气，解心郁" },
          { name: "涌泉穴 (足少阴肾经)", location: "足底前三分之一凹陷处", effect: "引火归元，滋阴安神" }
        ]
      },
      safetyNotes: safetyWarnings.length > 0 ? safetyWarnings.join("；") : "配方符合标准芳疗安全限值。",
      createdAt: new Date().toISOString(),
      isFavorite: true
    };

    onSavePrescription(newRx);
    audioEngine.strikeSingingBowl(528);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1C2E20", "#C5A880", "#EAE4D5"]
    });
    alert(`恭喜！您的专属配方《${newRx.title}》已成功保存至「我的处方档案」，可随时导出海报或前往工坊打样！`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2DDCF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold tracking-widest text-[#8C7A6B]">UNIO BLENDER LAB</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1C2E20] text-white font-medium">精准调香与稀释计算器</span>
          </div>
          <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20] tracking-tight mt-1">
            自由调香沙箱 · 嗅觉金字塔协同计算
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
            基于 Robert Tisserand 国际芳疗安全限值与东方五行配伍智慧，实时测算前中后调黄金配比与 IFRA 皮肤安全浓度
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoBalance}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 border border-[#D5CCBA] text-xs font-semibold text-stone-800 shadow-2xs transition-all"
            title="根据设定的目标容量与稀释度，自动平摊滴数"
          >
            <Scale className="w-3.5 h-3.5 text-[#1C2E20]" />
            <span>智能一键配平 ({theoreticalTotalDrops} 滴)</span>
          </button>

          <button
            onClick={handleSaveAsPrescription}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1C2E20] hover:bg-[#2A4730] text-white text-xs font-serif-sc font-bold shadow-md transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>保存为我的处方笺</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Formulation Ingredients (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Base Carrier & Volume & Dilution Presets */}
          <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-5">
            <h3 className="font-serif-sc text-base font-bold text-[#1C2E20] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#1C2E20]" />
              1. 设定基底油、容积与安全稀释度
            </h3>

            {/* Carrier Oil Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">选择植物基底调和油</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CARRIER_OILS_DATABASE.map(carrier => (
                  <button
                    key={carrier.id}
                    onClick={() => setSelectedCarrier(carrier)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedCarrier.id === carrier.id
                        ? "bg-[#1C2E20] text-white border-[#1C2E20] shadow-2xs"
                        : "bg-[#FAF8F3] text-stone-800 border-[#E2DAD0] hover:border-[#C5A880]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif-sc font-bold text-xs">{carrier.name}</span>
                      <span className={`text-[10px] ${selectedCarrier.id === carrier.id ? "text-[#D4AF37]" : "text-stone-500"}`}>
                        {carrier.texture}
                      </span>
                    </div>
                    <p className={`text-[10px] mt-1 line-clamp-1 ${selectedCarrier.id === carrier.id ? "text-stone-300" : "text-stone-500"}`}>
                      {carrier.bestFor}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Volume & Dilution Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">目标瓶内容量 (ml)</label>
                <select
                  value={volumeMl}
                  onChange={(e) => setVolumeMl(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-xs text-stone-800 font-bold"
                >
                  {VOLUME_OPTIONS.map(v => (
                    <option key={v.val} value={v.val}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  目标安全稀释度：<span className="font-mono text-[#1C2E20] font-bold">{dilutionRate}%</span>
                </label>
                <select
                  value={dilutionRate}
                  onChange={(e) => setDilutionRate(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-xs text-stone-800 font-bold"
                >
                  {DILUTION_PRESETS.map(d => (
                    <option key={d.rate} value={d.rate}>{d.label} ({d.desc})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Math Indicator Bar */}
            <div className="bg-[#EFEAE0] p-4 rounded-2xl border border-[#D5CCBA] flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">科学理论推荐精油总滴数：</span>
                <span className="font-mono font-extrabold text-base text-[#1C2E20]">{theoreticalTotalDrops} 滴</span>
                <span className="text-stone-500 text-[10px] ml-1.5">
                  (约 {(theoreticalTotalDrops / 20).toFixed(2)} ml + {(volumeMl - (theoreticalTotalDrops / 20)).toFixed(2)} ml 基底油)
                </span>
              </div>
              <div className="text-right">
                <span className="text-stone-500 block text-[11px]">当前实际已添加：</span>
                <span className={`font-mono font-extrabold text-base ${actualCurrentDrops === theoreticalTotalDrops ? "text-emerald-800" : "text-[#A82A2A]"}`}>
                  {actualCurrentDrops} 滴
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Recipe Oils Builder */}
          <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-serif-sc text-base font-bold text-[#1C2E20] flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#1C2E20]" />
                2. 选定单方精油与滴数配比 ({ingredients.length} 款)
              </h3>

              {/* Add Oil Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedOilToAdd}
                  onChange={(e) => setSelectedOilToAdd(e.target.value)}
                  className="p-2 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-xs text-stone-800 outline-none"
                >
                  {ESSENTIAL_OILS_DATABASE.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.noteType === "top" ? "[前调] " : o.noteType === "middle" ? "[中调] " : "[后调] "}
                      {o.name} ({o.element} - {o.scentFamily})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddOil}
                  className="flex items-center gap-1 px-3 py-2 bg-[#1C2E20] text-white rounded-xl text-xs font-semibold hover:bg-[#2C4833] transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>添加</span>
                </button>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="space-y-2.5">
              {ingredients.map((item) => {
                const ratioPct = actualCurrentDrops > 0 ? Math.round((item.drops / actualCurrentDrops) * 100) : 0;
                return (
                  <div
                    key={item.oilId}
                    className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E2DAD0] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-serif-sc font-bold text-[10px] ${
                        item.oil?.noteType === "top"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : item.oil?.noteType === "middle"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-stone-200 text-stone-800 border border-stone-400"
                      }`}>
                        {item.oil?.noteType === "top" ? "前" : item.oil?.noteType === "middle" ? "中" : "后"}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif-sc font-bold text-sm text-[#1C2E20]">{item.oil.name}</span>
                          <span className="text-[10px] text-stone-500 italic font-mono">{item.oil.latin}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{item.oil.emotionalBenefit}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono text-stone-500 font-bold">{ratioPct}%</span>
                      <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-[#D5CCBA]">
                        <button
                          onClick={() => handleUpdateDrops(item.oilId, -1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-sm w-7 text-center text-[#1C2E20]">
                          {item.drops}
                        </span>
                        <button
                          onClick={() => handleUpdateDrops(item.oilId, 1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveOil(item.oilId)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="移除此单方精油"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {ingredients.length === 0 && (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-xs text-stone-500">
                  配方暂无单方精油，请在上方选择精油并点击「添加」
                </div>
              )}
            </div>

            {/* Custom Recipe Title & Philosophy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#ECE7DA]">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">配方命名 (如《松雪煎茶》)</label>
                <input
                  type="text"
                  value={blendTitle}
                  onChange={(e) => setBlendTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-xs font-serif-sc font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">香气主旨与意境</label>
                <input
                  type="text"
                  value={blendSub}
                  onChange={(e) => setBlendSub(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Pyramid Balance & Chemistry & Safety Guard (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scent Harmony & Synergy Score Card */}
          <div className="bg-gradient-to-br from-[#1C2E20] to-[#122016] text-white p-6 rounded-3xl border border-[#2E4A34] shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span className="font-serif-sc font-bold text-sm text-[#FAF8F2]">香气协同度与气机评分</span>
              </div>
              <span className="font-mono text-3xl font-black text-[#D4AF37]">{synergyScore}</span>
            </div>

            {/* Olfactory Pyramid Balance Gauge */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span>前调 (Top)</span>
                <span className="font-mono font-bold">{topPercent}% <span className="text-[10px] text-stone-400 font-normal">(黄金区间 20~35%)</span></span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${topPercent}%` }}></div>
              </div>

              <div className="flex items-center justify-between text-stone-300 pt-1">
                <span>中调 (Heart)</span>
                <span className="font-mono font-bold">{midPercent}% <span className="text-[10px] text-stone-400 font-normal">(黄金区间 35~55%)</span></span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${midPercent}%` }}></div>
              </div>

              <div className="flex items-center justify-between text-stone-300 pt-1">
                <span>后调 (Base)</span>
                <span className="font-mono font-bold">{basePercent}% <span className="text-[10px] text-stone-400 font-normal">(黄金区间 15~35%)</span></span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-stone-300 rounded-full transition-all" style={{ width: `${basePercent}%` }}></div>
              </div>
            </div>

            <p className="text-[11px] text-stone-300 leading-relaxed font-light border-t border-white/10 pt-2">
              {topPercent === 0
                ? "💡 提示：缺少前调清香开窍植物，建议添加佛手柑、苦橙叶或冷杉以点亮香气前奏。"
                : basePercent === 0
                ? "💡 提示：缺少后调沉稳木质或树脂，留香时间可能较短，建议加入檀香、沉香或岩兰草定锚。"
                : "✨ 配方金字塔结构匀称，前中后调层次丰满，留香与通经效能卓越。"}
            </p>
          </div>

          {/* IFRA & Tisserand Safety Guard */}
          <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-sc text-sm font-bold text-[#1C2E20] flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-800" />
                IFRA 国际标准皮肤安全风控
              </h3>
              {safetyWarnings.length === 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  安全合格
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {safetyWarnings.length} 项安全提醒
                </span>
              )}
            </div>

            {safetyWarnings.length === 0 ? (
              <p className="text-xs text-stone-600 font-light">
                当前精油单体及总体配比均处于严格的安全稀释阈值以内，可安心用于面部点涂及日常脉搏点吸嗅。
              </p>
            ) : (
              <div className="space-y-1.5">
                {safetyWarnings.map((warn, wi) => (
                  <div key={wi} className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chemical Functional Group Profile */}
          <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-3">
            <h3 className="font-serif-sc text-sm font-bold text-[#1C2E20] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1C2E20]" />
              配方主要分子官能团
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set(ingredients.map(i => i.oil.chemicalFamily))).map((fam, fi) => (
                <span key={fi} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF8F3] text-stone-800 border border-[#DDD5C5]">
                  {fam}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
