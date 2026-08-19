import { SingleEssentialOil, OilBlendingPartnerCombo, OilConstituentDetail } from "../types";

/**
 * UNIO Aroma Botanical Knowledge Standardizer
 * Integrates 4-Layer Taxonomy + 12 Core Question Cards + TCM Five Elements & Qi Dynamics
 * Standards Reference: Kew POWO/WCVP, ISO 4720:2018, Tisserand Institute, Chinese Pharmacopoeia
 */

export function enrichSingleEssentialOil(oil: Partial<SingleEssentialOil> & { id: string; name: string; latin: string }): SingleEssentialOil {
  // If already fully enriched, return directly as SingleEssentialOil
  if (oil.oneSentenceIntro && oil.olfactoryImpression && oil.targetPersona && oil.blendingCombos && oil.isPregnancySafe !== undefined) {
    return oil as SingleEssentialOil;
  }

  // 1. Derive Botanical Taxonomy (Layer 01)
  let botanicalFamily = oil.botanicalFamily || "芳香植物科 (Aromatic Family)";
  let botanicalGenus = oil.botanicalGenus || "芳香植物属";
  let isoStandard = oil.isoStandard || "ISO 4720:2018 Standardized Nomenclature";
  let chemotype = oil.chemotype || "Standard Commercial Chemotype (ISO Spec)";
  let synonyms = oil.synonyms || [oil.latin, `${oil.name}精油`];

  if (oil.latin.includes("Lavandula")) {
    botanicalFamily = "唇形科 (Lamiaceae)";
    botanicalGenus = "薰衣草属 (Lavandula)";
    isoStandard = "ISO 3515 / ISO 4720";
    chemotype = "CT Linalool / Linalyl Acetate (低樟脑高酯型)";
    synonyms = ["Lavandula officinalis Chaix", "Lavandula vera DC."];
  } else if (oil.latin.includes("Citrus")) {
    botanicalFamily = "芸香科 (Rutaceae)";
    botanicalGenus = "柑橘属 (Citrus)";
    isoStandard = "ISO 3520 / ISO 4720";
    chemotype = "CT Limonene (冷压富含单萜烯)";
  } else if (oil.latin.includes("Aquilaria")) {
    botanicalFamily = "瑞香科 (Thymelaeaceae)";
    botanicalGenus = "沉香属 (Aquilaria)";
    isoStandard = "ISO 4720 Non-standardized / Rare Wild Heritage";
    chemotype = "Natural Supercritical CO2 High-Sesquiterpene";
    synonyms = ["沉水香", "白木香", "海南琼脂"];
  } else if (oil.latin.includes("Boswellia")) {
    botanicalFamily = "橄榄科 (Burseraceae)";
    botanicalGenus = "乳香属 (Boswellia)";
    isoStandard = "ISO 4720 Wild-Crafted";
    chemotype = "CT alpha-Pinene / Boswellic Resins";
    synonyms = ["熏陆香", "阿曼至尊绿乳香", "Boswellia carterii"];
  } else if (oil.latin.includes("Santalum")) {
    botanicalFamily = "檀香科 (Santalaceae)";
    botanicalGenus = "檀香属 (Santalum)";
    isoStandard = "ISO 3518 / ISO 4720";
    chemotype = "CT alpha-Santalol (>90% 优质老山心材)";
    synonyms = ["白檀", "真檀", "Santalum album L."];
  } else if (oil.latin.includes("Rosa")) {
    botanicalFamily = "蔷薇科 (Rosaceae)";
    botanicalGenus = "蔷薇属 (Rosa)";
    isoStandard = "ISO 9842 / ISO 4720";
    chemotype = "CT Citronellol / Geraniol (低温纯露伴生水蒸馏)";
    synonyms = ["Rosa damascena Mill.", "大马士革玫瑰", "千叶玫瑰"];
  } else if (oil.latin.includes("Abies") || oil.latin.includes("Pinus") || oil.latin.includes("Cedrus")) {
    botanicalFamily = "松科 (Pinaceae)";
    botanicalGenus = "冷杉属 / 松属 / 雪松属";
    isoStandard = "ISO 4720 High-altitude Conifer";
    chemotype = "CT Bornyl acetate / alpha-Pinene (高山芬多精型)";
  }

  // 2. Derive Scent Keywords & Olfactory Impression (Layer 02)
  const scentKeywords = oil.scentKeywords || deriveScentKeywords(oil);
  const olfactoryImpression = oil.olfactoryImpression || {
    firstImpression: deriveFirstImpression(oil),
    deepNote: deriveDeepNote(oil),
    atmosphere: deriveAtmosphere(oil)
  };

  // 3. Typical GC-MS Ranges (Layer 02)
  const typicalConstituents: OilConstituentDetail[] = oil.typicalConstituents || oil.primaryMolecules.map(m => ({
    name: m.name,
    range: `典型范围 ${m.percentage}`,
    category: oil.chemicalFamily.split("(")[0].trim()
  }));

  // 4. User 12-Questions Card Elements (Layer 03)
  const oneSentenceIntro = oil.oneSentenceIntro || deriveOneSentenceIntro(oil);
  const targetPersona = oil.targetPersona || deriveTargetPersona(oil);
  const usageScenarios = oil.usageScenarios || [
    {
      title: oil.element === "木" ? "舒展身心 · 疏解郁滞" : oil.element === "火" ? "暖心宣畅 · 提振愉悦" : oil.element === "土" ? "扎根定力 · 踏实安心" : oil.element === "金" ? "清心开窍 · 澄澈空间" : "潜阳助眠 · 深层修复",
      desc: oil.emotionalBenefit
    },
    {
      title: "日常高定调香与气味仪式",
      desc: `可作为高定配方中的【${oil.noteType === "top" ? "灵动前调" : oil.noteType === "middle" ? "丰满中调" : "醇厚定香后调"}】，与${oil.blendingPartners.slice(0, 2).join("、")}形成完美共鸣。`
    }
  ];

  const applicationMethods = oil.applicationMethods || {
    diffuser: `滴入 3~5 滴于超声波香薰机或扩香木中，持续营造 20~40 平方米【${oil.scentFamily}】清幽气韵。`,
    inhalation: `滴 1 滴于掌心或精油吸嗅棒中，双手合十轻覆口鼻，进行 4-7-8 深长腹式呼吸 3~5 次。`,
    bodyCare: `务必经植物基底油稀释后使用（建议面部 0.5%~1%，身体 2%~3%）。涂抹于 ${oil.tcmMeridian} 沿线穴位。`,
    bath: `⚠️ 严禁直接滴入浴缸！精油不溶于水，须先与 10ml 全脂牛奶或沐浴油充分乳化分散后，再倒入温水中浸泡。`
  };

  const timeOfDay = oil.timeOfDay || (
    oil.noteType === "top"
      ? (["morning", "daytime"] as const)
      : oil.noteType === "base"
      ? (["evening", "night"] as const)
      : (["daytime", "evening"] as const)
  );

  // Blending combos with 5-star ratings
  const blendingCombos: OilBlendingPartnerCombo[] = oil.blendingCombos || oil.blendingPartners.map((bp, i) => ({
    partnerName: bp,
    rating: i === 0 ? 5 : i === 1 ? 5 : 4,
    synergyReason: `与【${bp}】在五行气机与分子挥发曲线上形成完美互补，${i === 0 ? "显著延长持香深度" : "提升气味立体层次感"}。`
  }));

  // Safety dossier
  const safetyDossier = oil.safetyDossier || {
    dilutionAdvice: `日常面部安全浓度建议 ≤1.0%，身体按摩建议 ≤${Math.min(oil.maxDermalPercent, 3.0)}%，局部特定涂抹 ≤${oil.maxDermalPercent}%。`,
    phototoxicityNote: oil.isPhototoxic
      ? "⚠️ 具有光毒性（含呋喃香豆素类分子）。涂抹皮肤后 12~24 小时内严禁直接暴露于日光或紫外线辐射下。"
      : "🟢 无光毒性，日常室内外白天使用安全无光敏负担。",
    contraindications: [
      oil.isPregnancySafe ? "✅ 孕期在专业芳疗师指导下低浓度（≤0.5%）可用" : "❌ 孕期及哺乳期禁用（具有活血通经或促宫缩倾向）",
      oil.isPetSafe ? "✅ 猫狗家庭在通风良好环境下可低频扩香" : "⚠️ 猫咪家庭慎用（猫体内缺乏葡萄糖醛酸转移酶，代谢酚类/单萜烯较慢）",
      oil.isKidSafe ? "✅ 3岁以上儿童在低浓度（0.25%~0.5%）下安全" : "❌ 婴幼儿慎用或遵专业医嘱"
    ],
    safetyLevel: (!oil.isPregnancySafe || oil.isPhototoxic) ? ("yellow" as const) : ("green" as const)
  };

  // References
  const references = oil.references || [
    `ISO 4720:2018 Essential Oils — Nomenclature Reference`,
    `Royal Botanic Gardens Kew, Plants of the World Online (POWO/WCVP)`,
    `Robert Tisserand & Rodney Young, Essential Oil Safety (2nd Edition)`,
    `国家中医药管理局《中华本草》与《中国药典》芳香本草归经志`
  ];

  // TCM Qi Dynamic (Layer 04)
  const tcmQiDynamic = oil.tcmQiDynamic || (
    oil.element === "木" ? "生发疏肝 · 条达气机" :
    oil.element === "火" ? "清心安神 · 宣畅君火" :
    oil.element === "土" ? "健脾化湿 · 培土生金" :
    oil.element === "金" ? "宣肺肃降 · 开窍通关" :
    "潜阳封藏 · 纳气归肾"
  );

  const tcmNature = oil.tcmNature || (
    oil.element === "木" ? "性微温，味辛微苦；疏肝解郁，理气和营" :
    oil.element === "火" ? "性平偏凉，味甘微苦；清心泻火，养心安神" :
    oil.element === "土" ? "性温，味甘辛；健脾醒胃，行气化湿" :
    oil.element === "金" ? "性凉微温，味辛苦；宣肺止咳，通窍降逆" :
    "性温沉潜，味甘咸辛；温肾补阳，纳气潜阳"
  );

  const safetyLevel = oil.safetyLevel || (
    (!oil.isPregnancySafe || !oil.isPetSafe || (oil.maxDermalPercent !== undefined && oil.maxDermalPercent <= 0.5))
      ? "Level 3: 需严格稀释 (特殊禁忌人群慎用)"
      : (oil.maxDermalPercent !== undefined && oil.maxDermalPercent >= 4.0)
      ? "Level 1: 极度温和 (全家老幼通用)"
      : "Level 2: 标准安全 (遵循常规稀释比例)"
  );

  return {
    id: oil.id || `oil_${Date.now()}`,
    name: oil.name || "芳香本草",
    pinyin: oil.pinyin || oil.name || "Běn Cǎo",
    latin: oil.latin || "Botanical specimen",
    element: oil.element || "木",
    subcategory: oil.subcategory || "通用本草",
    noteType: oil.noteType || "middle",
    scentFamily: oil.scentFamily || "草本香调",
    plantPart: oil.plantPart || "全草",
    extractionMethod: oil.extractionMethod || "水蒸气蒸馏",
    origin: oil.origin || "原产地",
    chemicalFamily: oil.chemicalFamily || "Monoterpenes",
    primaryMolecules: oil.primaryMolecules || [{ name: "芳香活性单体", percentage: "45.0%" }],
    emotionalBenefit: oil.emotionalBenefit || "舒缓情绪，平衡身心",
    physicalBenefit: oil.physicalBenefit || "调理气血，安神定志",
    tcmMeridian: oil.tcmMeridian || "归心、肝、脾、肺、肾经",
    tcmNature,
    safetyLevel,
    maxDermalPercent: oil.maxDermalPercent ?? 2.0,
    isPregnancySafe: oil.isPregnancySafe ?? true,
    isPetSafe: oil.isPetSafe ?? true,
    isKidSafe: oil.isKidSafe ?? true,
    isPhototoxic: oil.isPhototoxic ?? false,
    blendingPartners: oil.blendingPartners || ["真正薰衣草", "乳香", "老山檀香"],
    botanicalFamily,
    botanicalGenus,
    isoStandard,
    chemotype,
    synonyms,
    scentKeywords,
    olfactoryImpression,
    typicalConstituents,
    oneSentenceIntro,
    targetPersona,
    usageScenarios,
    applicationMethods,
    timeOfDay,
    blendingCombos,
    safetyDossier,
    references,
    tcmQiDynamic,
    caution: oil.caution,
    storyAndLore: oil.storyAndLore,
    sensorySynesthesia: oil.sensorySynesthesia,
    perfumerTrivia: oil.perfumerTrivia
  };
}

// Helpers for automatic derivation
function deriveScentKeywords(oil: Partial<SingleEssentialOil>): string[] {
  const list: string[] = [];
  const scentFamily = oil.scentFamily || "";
  if (scentFamily.includes("木")) list.push("🌲 沉静木香");
  if (scentFamily.includes("花")) list.push("🌸 柔润雅花");
  if (scentFamily.includes("柑橘")) list.push("🍊 清冽酸甜");
  if (scentFamily.includes("草")) list.push("🌿 鲜爽草本");
  if (scentFamily.includes("树脂")) list.push("✨ 圣洁树脂");
  if (scentFamily.includes("茶")) list.push("🍵 空灵禅茶");
  if (scentFamily.includes("辛")) list.push("🔥 温阳暖辛");

  if (oil.noteType === "top") list.push("⚡ 瞬息透亮");
  if (oil.noteType === "middle") list.push("💫 丰厚饱满");
  if (oil.noteType === "base") list.push("⏳ 悠远留香");

  return list.length > 0 ? list : ["🌿 自然芬芳", "💧 清澈纯净"];
}

function deriveFirstImpression(oil: Partial<SingleEssentialOil>): string {
  if (oil.noteType === "top") return "轻盈透亮 · 瞬间唤醒嗅觉感官 · 充满阳光活力";
  if (oil.noteType === "middle") return "温润圆融 · 核心花草木韵自然舒展 · 层次分明";
  return "深邃沉静 · 醇厚底蕴徐徐展开 · 具有极强包裹感与安定感";
}

function deriveDeepNote(oil: Partial<SingleEssentialOil>): string {
  const prime = oil.primaryMolecules && oil.primaryMolecules.length > 0
    ? oil.primaryMolecules.slice(0, 2).map(m => m.name).join("与")
    : "天然芳香活性分子";
  return `${oil.scentFamily || "本草"}中交织着${prime}的天然分子回甘，余韵悠长绵密。`;
}

function deriveAtmosphere(oil: Partial<SingleEssentialOil>): string {
  return oil.sensorySynesthesia || `如同漫步于${oil.origin || "自然秘境"}中，在呼吸吐纳间重拾内在清明与宁静。`;
}

function deriveOneSentenceIntro(oil: Partial<SingleEssentialOil>): string {
  return `【${oil.name || "精油"}】源自${oil.origin || "道地产区"}，萃取自优质${oil.plantPart || "本草"}，以${oil.scentFamily || "芳香气韵"}见长。中医归【${oil.tcmMeridian || "脏腑经络"}】，具【${oil.tcmQiDynamic || "调和气机"}】之功。`;
}

function deriveTargetPersona(oil: Partial<SingleEssentialOil>): string[] {
  return [
    `喜欢【${oil.scentFamily || "天然香气"}】清雅香调的人士`,
    `日常感到【${oil.element || "五行"}行】气机失衡、希望寻求身心调和的人`,
    `追求高品质天然生活方式与睡前/办公气味仪式感的人`,
    `调香进阶爱好者，希望寻找优质【${oil.noteType === "top" ? "前调透亮分子" : oil.noteType === "middle" ? "中调主干核心" : "后调持久定香"}】的人`
  ];
}

/**
 * Real-time Safe Dilution Calculator
 * Calculates precise drops and dilution percentage based on application scenario and bottle volume
 */
export interface DilutionCalculationResult {
  scenario: string;
  volumeMl: number;
  recommendedPercent: number;
  recommendedDrops: number;
  carrierOilRecommendation: string;
  safetyCheck: "safe" | "warning" | "exceeded";
  safetyTip: string;
}

export function calculateSafeDilution(
  oil: SingleEssentialOil,
  scenario: "face" | "body" | "spot" | "bath" | "diffuser",
  volumeMl: number = 10,
  carrierOilName: string = "有机金黄荷荷巴油"
): DilutionCalculationResult {
  // 1ml essential oil ≈ 20 drops
  let targetPercent = 1.0;
  let safetyTip = "";

  switch (scenario) {
    case "face":
      targetPercent = 0.5; // 0.5% ~ 1.0%
      safetyTip = "面部肌肤角质层较薄，建议维持 0.5%~1% 低浓度，温和滋养不易敏。";
      break;
    case "body":
      targetPercent = 2.0; // 2% ~ 3%
      safetyTip = "全身或背部按摩涂抹，2% 浓度能兼顾经络行气与深层肌肤吸收。";
      break;
    case "spot":
      targetPercent = Math.min(oil.maxDermalPercent, 5.0);
      safetyTip = `局部痛点或特定穴位点涂，最高不超过 IFRA 限值 ≤${oil.maxDermalPercent}%。`;
      break;
    case "bath":
      targetPercent = 1.0;
      safetyTip = "泡浴务必先加入 10ml 基底油或全脂牛奶中充分乳化后再入水，切勿直滴浴水。";
      break;
    case "diffuser":
      targetPercent = 100;
      safetyTip = "无须稀释，直接取纯精油 3~5 滴加入超声波香薰机或扩香木中。";
      break;
  }

  // Calculate drops: drops = (volumeMl * (targetPercent / 100)) * 20 drops/ml
  const calculatedDrops = scenario === "diffuser"
    ? 4
    : Math.max(1, Math.round((volumeMl * (targetPercent / 100)) * 20));

  const actualPercent = scenario === "diffuser" ? 100 : Number(((calculatedDrops / (volumeMl * 20)) * 100).toFixed(2));

  let safetyCheck: "safe" | "warning" | "exceeded" = "safe";
  if (scenario !== "diffuser" && actualPercent > oil.maxDermalPercent) {
    safetyCheck = "exceeded";
    safetyTip = `⚠️ 计算浓度 (${actualPercent}%) 已超过该精油 IFRA 安全皮肤限值 (≤${oil.maxDermalPercent}%)，请减少滴数！`;
  } else if (scenario !== "diffuser" && actualPercent > 3.0) {
    safetyCheck = "warning";
  }

  return {
    scenario: scenario === "face" ? "面部日常护理" : scenario === "body" ? "身体经络按摩" : scenario === "spot" ? "局部穴位点涂" : scenario === "bath" ? "芳香泡浴乳化" : "空间扩香嗅吸",
    volumeMl,
    recommendedPercent: actualPercent,
    recommendedDrops: calculatedDrops,
    carrierOilRecommendation: carrierOilName,
    safetyCheck,
    safetyTip
  };
}
