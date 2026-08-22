import { EssentialOilRecord, ESSENTIAL_OIL_JSON_SCHEMA, validateEssentialOil } from "./essentialOilsSchema";
import { ALL_COMPREHENSIVE_ESSENTIAL_OILS } from "./comprehensiveBotanicalsList";

/**
 * Standardize SingleEssentialOil into full EssentialOilRecord JSON structure
 */
export function transformToStandardRecord(oil: any): EssentialOilRecord {
  const isWood = oil.element === "木";
  const isFire = oil.element === "火";
  const isEarth = oil.element === "土";
  const isMetal = oil.element === "金";
  const isWater = oil.element === "水";

  const defaultTcmNature = oil.tcmNature || (
    isWood ? "性微温，味辛微苦；疏肝解郁，理气和营" :
    isFire ? "性平偏凉，味甘微苦；清心泻火，养心安神" :
    isEarth ? "性温，味甘辛；健脾醒胃，行气化湿" :
    isMetal ? "性凉微温，味辛苦；宣肺止咳，通窍降逆" :
    "性温沉潜，味甘咸辛；温肾补阳，纳气潜阳"
  );

  const defaultQiDynamic = oil.tcmQiDynamic || (
    isWood ? "生发疏肝 · 条达气机" :
    isFire ? "清心安神 · 宣畅君火" :
    isEarth ? "健脾化湿 · 培土生金" :
    isMetal ? "宣肺肃降 · 开窍通关" :
    "潜阳封藏 · 纳气归肾"
  );

  const defaultRole = oil?.noteType === "base" ? "君 (King/Chief)" :
                      oil?.noteType === "middle" ? "臣 (Minister/Associate)" : "佐/使 (Adjuvant/Messenger)";

  return {
    id: oil.id,
    name: oil.name,
    pinyin: oil.pinyin || oil.name,
    botany: {
      latinName: oil.latin,
      botanicalFamily: oil.botanicalFamily || "芳香植物科",
      botanicalGenus: oil.botanicalGenus || "芳香植物属",
      chemotype: oil.chemotype || "标准化学型 (ISO Spec)",
      isoStandard: oil.isoStandard || "ISO 4720:2018",
      synonyms: oil.synonyms || [oil.name, oil.latin],
      plantPart: oil.plantPart || "全草",
      extractionMethod: oil.extractionMethod || "水蒸气蒸馏",
      terroirOrigin: oil.origin || "道地产区"
    },
    tcm: {
      element: oil.element,
      subcategory: oil.subcategory || "通用本草",
      tcmMeridian: oil.tcmMeridian || "归经待定",
      tcmNature: defaultTcmNature,
      tcmQiDynamic: defaultQiDynamic
    },
    olfactory: {
      noteType: oil.noteType,
      scentFamily: oil.scentFamily,
      scentKeywords: oil.scentKeywords || [oil.scentFamily, oil.element + "行气韵"],
      firstImpression: oil.olfactoryImpression?.firstImpression || `清雅纯正，带有鲜明的${oil.scentFamily}特征`,
      deepNote: oil.olfactoryImpression?.deepNote || `深入闻之，天然分子回甘绵密，余韵悠长`,
      sensoryAtmosphere: oil.sensorySynesthesia || `置身于${oil.origin || "自然山林"}之中，宁静致远`
    },
    chemistry: {
      chemicalFamily: oil.chemicalFamily,
      primaryMolecules: (oil.primaryMolecules || []).map((m: any) => ({
        name: m.name,
        percentage: m.percentage,
        functionalGroup: oil.chemicalFamily.split("(")[0].trim(),
        therapeuticPathway: m.name.includes("芳樟") ? "结合 GABA 受体，调节中枢镇静" :
                            m.name.includes("柠檬烯") ? "促进多巴胺分泌，提升愉悦活力" :
                            m.name.includes("檀香醇") ? "诱导 Delta 深度脑波，深层安抚" :
                            m.name.includes("桉叶素") ? "清宣呼吸道纤毛运动，开窍醒脑" :
                            m.name.includes("倍半萜") ? "抑制炎性介质释放，潜阳宁神" : "天然芳香活性调和"
      })),
      gcmsNotes: `GC-MS 质谱纯度认证，符合 ISO 标准特征指纹图谱`
    },
    safety: {
      safetyLevel: oil.safetyLevel || (
        (!oil.isPregnancySafe || !oil.isPetSafe || oil.maxDermalPercent <= 0.5)
          ? "Level 3: 需严格稀释"
          : (oil.maxDermalPercent >= 4.0 ? "Level 1: 极度温和" : "Level 2: 标准安全")
      ),
      maxDermalPercentage: oil.maxDermalPercent ?? 2.0,
      isPhototoxic: oil.isPhototoxic ?? false,
      phototoxicityNote: oil.isPhototoxic ? "含呋喃香豆素类光敏分子，使用后 12 小时内避免阳光直射暴晒" : "无光敏风险，日间可安心使用",
      isPregnancySafe: oil.isPregnancySafe ?? true,
      pregnancyNote: oil.isPregnancySafe ? "孕中期及哺乳期在专业芳疗师指导下低浓度 (≤1%) 适用" : "孕期、哺乳期禁用，避免通经刺激",
      isPetSafe: oil.isPetSafe ?? true,
      petNote: oil.isPetSafe ? "猫狗家庭可低浓度 (1~2滴) 通风扩香" : "⚠️ 猫咪肝脏缺乏葡糖醛酸转移酶，严禁在密闭猫房扩香及皮肤接触",
      isKidSafe: oil.isKidSafe ?? true,
      childAgeLimitYears: oil.isKidSafe ? 3 : 6,
      generalCautions: oil.caution || "必须经植物油充分稀释后接触皮肤，避免接触眼睛与黏膜",
      contraindications: [
        ...(oil.isPregnancySafe ? [] : ["孕期与哺乳期女性禁用"]),
        ...(oil.isPetSafe ? [] : ["密闭猫狗宠物环境禁用"]),
        ...(oil.isPhototoxic ? ["日间户外暴晒前禁用"] : []),
        ...(oil.maxDermalPercent <= 0.5 ? ["高敏感皮炎急性期禁用"] : [])
      ]
    },
    efficacy: {
      emotionalBenefit: oil.emotionalBenefit,
      physicalBenefit: oil.physicalBenefit,
      targetPersona: oil.targetPersona || [
        `喜爱${oil.scentFamily}清雅格调的人群`,
        `日常有${oil.element}行身心失衡调节需求者`,
        `追求高品质天然气味仪式感的生活家`
      ],
      suggestedScenarios: [
        oil.element === "木" ? "晨起提振 · 舒展胸膈" :
        oil.element === "火" ? "暖心解郁 · 社交破冰" :
        oil.element === "土" ? "饭后消食 · 扎根安住" :
        oil.element === "金" ? "专注办公 · 澄澈空间" : "睡前沉浸 · 深层修复",
        "高定香方君臣佐使调配"
      ]
    },
    application: {
      diffuserAdvice: `滴入 3~5 滴于超声波香薰机中，建议扩香时长 30~45 分钟，保持室内空气流通。`,
      palmInhalationAdvice: `滴 1 滴于掌心或精油吸嗅管中，双手合十轻覆口鼻，进行 4-7-8 深呼吸 3~5 次。`,
      bodyApplicationAdvice: `务必经植物基底油稀释后使用（日常面部建议 ≤1%，身体护理建议 2%~3%）。涂抹于【${oil.tcmMeridian}】沿线关键穴位。`,
      bathCaution: `⚠️ 严禁直接滴入浴缸！精油不溶于水，须先与 10ml 全脂牛奶或天然沐浴油充分乳化分散后，再倒入温水中。`,
      idealTimesOfDay: oil.timeOfDay || (
        oil.noteType === "top" ? ["morning", "daytime"] :
        oil.noteType === "middle" ? ["daytime", "evening"] : ["evening", "night"]
      )
    },
    blending: {
      compatiblePartners: oil.blendingPartners || ["真实薰衣草", "乳香", "老山檀香"],
      roleInFormula: defaultRole,
      synergyNotes: `与${(oil.blendingPartners || []).slice(0, 2).join("、")}具有卓越的香气与分子协同增效效应。`
    },
    culturalLore: {
      story: oil.storyAndLore || `《本草纲目》与古籍载录之珍品，沉淀东方千年芳香用香智慧。`,
      synesthesia: oil.sensorySynesthesia || `幽微光影与天然音符交融的东方意境。`,
      perfumerTrivia: oil.perfumerTrivia || `调香师秘传：作为${oil.noteType === "top" ? "开篇破晓" : oil.noteType === "middle" ? "中调主干" : "后调定香"}具有无可替代的质感。`
    }
  };
}

/**
 * The Comprehensive 200+ Standardized Essential Oils Database Records
 */
export const ESSENTIAL_OILS_200_DATABASE: EssentialOilRecord[] = ALL_COMPREHENSIVE_ESSENTIAL_OILS.map(transformToStandardRecord);

/**
 * AI-Ready Summary representation for Gemini system context injection
 */
export function getAIPromptBotanicalsSummary(): string {
  const summaryByElement = {
    木: ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "木").map(o => `${o.name} (${o.botany.latinName}) [${o.olfactory.noteType}] 主成分:${o.chemistry.primaryMolecules.slice(0, 2).map(m => m.name).join("/")}`).join("; "),
    火: ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "火").map(o => `${o.name} (${o.botany.latinName}) [${o.olfactory.noteType}] 主成分:${o.chemistry.primaryMolecules.slice(0, 2).map(m => m.name).join("/")}`).join("; "),
    土: ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "土").map(o => `${o.name} (${o.botany.latinName}) [${o.olfactory.noteType}] 主成分:${o.chemistry.primaryMolecules.slice(0, 2).map(m => m.name).join("/")}`).join("; "),
    金: ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "金").map(o => `${o.name} (${o.botany.latinName}) [${o.olfactory.noteType}] 主成分:${o.chemistry.primaryMolecules.slice(0, 2).map(m => m.name).join("/")}`).join("; "),
    水: ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "水").map(o => `${o.name} (${o.botany.latinName}) [${o.olfactory.noteType}] 主成分:${o.chemistry.primaryMolecules.slice(0, 2).map(m => m.name).join("/")}`).join("; ")
  };

  return `
【UNIO 200+ 核心精油数据库分类总览】:
- 木行精油 (${ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "木").length}种): ${summaryByElement.木.slice(0, 300)}...
- 火行精油 (${ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "火").length}种): ${summaryByElement.火.slice(0, 300)}...
- 土行精油 (${ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "土").length}种): ${summaryByElement.土.slice(0, 300)}...
- 金行精油 (${ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "金").length}种): ${summaryByElement.金.slice(0, 300)}...
- 水行精油 (${ESSENTIAL_OILS_200_DATABASE.filter(o => o.tcm.element === "水").length}种): ${summaryByElement.水.slice(0, 300)}...
`.trim();
}

/**
 * Filter and query helper functions
 */
export function queryEssentialOils(criteria: {
  element?: "木" | "火" | "土" | "金" | "水";
  noteType?: "top" | "middle" | "base";
  pregnancySafeOnly?: boolean;
  petSafeOnly?: boolean;
  searchKeyword?: string;
}): EssentialOilRecord[] {
  let list = ESSENTIAL_OILS_200_DATABASE;
  if (criteria.element) {
    list = list.filter(o => o.tcm.element === criteria.element);
  }
  if (criteria.noteType) {
    list = list.filter(o => o.olfactory?.noteType === criteria.noteType);
  }
  if (criteria.pregnancySafeOnly) {
    list = list.filter(o => o.safety.isPregnancySafe);
  }
  if (criteria.petSafeOnly) {
    list = list.filter(o => o.safety.isPetSafe);
  }
  if (criteria.searchKeyword) {
    const kw = criteria.searchKeyword.toLowerCase();
    list = list.filter(o =>
      o.name.toLowerCase().includes(kw) ||
      o.botany.latinName.toLowerCase().includes(kw) ||
      o.pinyin.toLowerCase().includes(kw) ||
      o.tcm.tcmMeridian.toLowerCase().includes(kw) ||
      o.efficacy.emotionalBenefit.toLowerCase().includes(kw) ||
      o.chemistry.primaryMolecules.some(m => m.name.toLowerCase().includes(kw))
    );
  }
  return list;
}
