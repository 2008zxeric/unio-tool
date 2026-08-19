export interface NoteItem {
  name: string;
  latin: string;
  drops: number;
  ml?: number;
  ratio: string;
  effect: string;
  element?: "木" | "火" | "土" | "金" | "水";
}

export interface OlfactoryPyramid {
  topNotes: NoteItem[];
  middleNotes: NoteItem[];
  baseNotes: NoteItem[];
  carrierOil: string;
  totalDrops: number;
  totalVolume: string;
}

export interface MolecularCompound {
  compound: string;
  percentage: string;
  pathway: string;
  benefit: string;
}

export interface AcupointItem {
  name: string;
  location: string;
  effect: string;
}

export interface AromatherapyAdvice {
  palmInhalation: string;
  diffuser: string;
  pulsePoint: string;
  acupoints: AcupointItem[];
}

export interface ScentPrescription {
  id: string;
  rxCode: string;
  title: string;
  poeticSub: string;
  concept: string;
  seasonTerm: string;
  fiveElement: string;
  olfactoryPyramid: OlfactoryPyramid;
  molecularAnalysis: MolecularCompound[];
  aromatherapyAdvice: AromatherapyAdvice;
  safetyNotes: string;
  createdAt: string;
  isFavorite?: boolean;
  userEngraving?: string;
  synergyScore?: number;
}

export interface UserProfile {
  gender: "female" | "male" | "other" | "unspecified";
  ageRange: "18-25" | "26-35" | "36-45" | "46-60" | "60+";
  healthConditions: string[]; // e.g. ["易偏头痛", "哮喘/气道敏感", "易失眠多梦", "高血压", "敏感肌/屏障受损", "经期痛经/不顺", "备孕/孕期", "哺乳期", "家有猫狗宠物", "胃寒湿困", "体虚易感"]
  sensitivities: string[]; // e.g. ["光敏性", "不耐受浓烈香气"]
  favoriteFamilies: string[]; // e.g. ["东方木质", "清雅茶香", "温润草本", "清润柑橘", "典雅花香", "灵性树脂"]
  userNote?: string;
  isProfileSet?: boolean;
}

export interface ConsultationFormState {
  scene: string;
  mindBodyState: string;
  constitution: string;
  sleepQuality: string;
  airwaySensitivity: string;
  preferences: string[];
  contraindications: string[];
  dynamicAnswers: Record<string, string>;
  userNote: string;
  userProfile?: UserProfile;
  faceScanData?: {
    detectedMood: string;
    energyLevel: string;
    complexionAnalysis: string;
    suggestedElements: string[];
    recommendedNotes: string[];
  } | null;
}

export interface MoodCheckin {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  timeSlot: "morning" | "noon" | "night" | "moment";
  preScore: number; // 1-5
  postScore: number; // 1-5
  rxId: string;
  rxTitle: string;
  ritualType: "palm" | "diffuser" | "pulse" | "bath" | "meditation";
  notes: string;
  heartRateBefore?: number;
  heartRateAfter?: number;
  soundscapeUsed?: string;
  solarTerm?: string;
}

export interface BespokeOrder {
  id: string;
  rxId: string;
  rxTitle: string;
  rxCode: string;
  bottleSize: "10ml" | "30ml" | "50ml";
  productType: "roller_oil" | "pure_elixir" | "fine_edp" | "ritual_candle";
  engravingText: string;
  recipientName: string;
  sealColor: "cinnabar" | "matte_gold" | "pine_green";
  woodenBoxGiftSet: boolean;
  sampleKitRefills: boolean;
  status: "formulating" | "maturing" | "engraving" | "shipped" | "delivered";
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  totalPrice: number;
}

export type ChemicalFamily = 
  | "Esters (酯类 - 深度安抚)"
  | "Esters (酯类 - 抗痉挛/极度平抚)"
  | "Monoterpenols (单萜醇 - 温和强心/抗敏)"
  | "Monoterpenols (单萜醇 - 清爽抑菌/疏风散热)"
  | "Sesquiterpenes (倍半萜 - 镇静抗炎/潜阳)"
  | "Sesquiterpenols (倍半萜醇 - 扎根固摄/镇痛)"
  | "Oxides (氧化物 - 宣肺开窍/通气)"
  | "Oxides (氧化物 - 强力宣通呼吸/抗病毒)"
  | "Monoterpenes (单萜烯 - 活化气机/抗菌)"
  | "Monoterpenes (单萜烯 - 提神激活/行气)"
  | "Ketones (酮类 - 促细胞再生/活化)"
  | "Aldehydes (醛类 - 镇定降压)"
  | "Aldehydes (醛类 - 强烈温通/抗微生物)"
  | "Phenols (酚类 - 极强温阳/防腐)"
  | "Lactones (内酯类 - 强效活血通经/温补)"
  | string;

export interface OilBlendingPartnerCombo {
  partnerName: string;
  rating: number; // 1 to 5 stars
  synergyReason: string;
}

export interface OilConstituentDetail {
  name: string;
  range: string; // e.g. "35% - 48%" or "典型值 42%"
  category: string; // e.g. "单萜醇", "酯类", "氧化物"
}

export interface SingleEssentialOil {
  id: string;
  name: string;
  pinyin: string;
  latin: string;
  element: "木" | "火" | "土" | "金" | "水";
  subcategory?: string; // e.g. "东方珍木", "西方针叶", "清幽白花", "温润红花", "清冽柑橘", "芳香草本", "深邃树脂", "泥土根茎", "温阳辛香", "禅意茶香"
  noteType: "top" | "middle" | "base";
  scentFamily: "木质香调" | "东方树脂" | "古典花香" | "清冽柑橘" | "草本根茎" | "禅意茶香" | "辛香温热" | string;
  plantPart: "心材" | "树脂" | "花朵" | "叶片/针叶" | "果皮" | "根茎" | "种子" | string;
  extractionMethod: string;
  origin: string;
  chemicalFamily: ChemicalFamily;
  primaryMolecules: { name: string; percentage: string }[];
  emotionalBenefit: string;
  physicalBenefit: string;
  tcmMeridian: string; // 归经
  maxDermalPercent: number; // IFRA safe dermal max %
  isPhototoxic?: boolean;
  isPregnancySafe: boolean;
  isPetSafe: boolean;
  isKidSafe: boolean;
  safetyLevel?: "Level 1: 极度温和" | "Level 2: 标准安全" | "Level 3: 需严格稀释" | "Level 4: 禁忌限制" | string;
  tcmNature?: string; // 性味归经 (如：性微温，味辛甘；归脾、胃、肺经)
  blendingPartners: string[]; // compatible oils
  caution?: string;
  storyAndLore?: string; // 植物逸事与文化历史典故
  sensorySynesthesia?: string; // 气味通感联觉 (颜色/音符/光影/意境)
  perfumerTrivia?: string; // 调香师秘藏冷知识与调配彩蛋

  // Layer 01: 植物学权威数据库 (Kew / WCVP / ISO 4720 标准)
  botanicalFamily?: string; // 科 (如：唇形科 Lamiaceae, 橄榄科 Burseraceae)
  botanicalGenus?: string; // 属 (如：薰衣草属 Lavandula)
  synonyms?: string[]; // 植物学异名 (WCVP 同义名)
  chemotype?: string; // 化学型 CT (如：CT Linalool, CT Cineole, CT Verbenone)
  isoStandard?: string; // ISO 4720 命名标准

  // Layer 02: 香气画像与多维标签
  scentKeywords?: string[]; // 香气关键词 (如：🌿草本, 🌸柔和花香, 🫧清洁感, 🌳微木质)
  olfactoryImpression?: {
    firstImpression: string; // 第一感觉 (如：清新·柔和·干净)
    deepNote: string; // 深入闻 (如：花香中带有草本与轻微木质气息)
    atmosphere: string; // 整体气质意境 (如：像夏夜刚刚进入安静状态的花园)
  };
  typicalConstituents?: OilConstituentDetail[]; // GC-MS 典型组成区间 (非死板绝对值)

  // Layer 03: 用户 12 核心问题卡片 (User 12-Questions Knowledge Card)
  oneSentenceIntro?: string; // ① 它是什么？(50~80字核心解释)
  targetPersona?: string[]; // ⑦ 适合什么样的人？(Checklist)
  usageScenarios?: { title: string; desc: string }[]; // ③ 常见使用场景
  applicationMethods?: {
    diffuser?: string; // 扩香建议
    inhalation?: string; // 吸嗅建议
    bodyCare?: string; // 身体护理稀释建议
    bath?: string; // 沐浴分散乳化建议 (严禁未乳化直接滴水)
  };
  timeOfDay?: ("morning" | "daytime" | "evening" | "night")[]; // ⑥ 适合使用时刻
  blendingCombos?: OilBlendingPartnerCombo[]; // ⑧ 香气搭配伙伴与星级指数
  safetyDossier?: {
    dilutionAdvice: string; // 稀释规范
    phototoxicityNote?: string; // 光敏性与日晒防护
    contraindications: string[]; // 禁忌清单
    safetyLevel: "green" | "yellow" | "red"; // 安全级别
  };
  references?: string[]; // ⑫ 权威文献与数据库出处 (Kew, ISO 4720, Tisserand Institute, PubMed)

  // Layer 04: 中医五行与气机升降
  tcmQiDynamic?: string; // 气机升降 (升发条达/肃降降火/运脾化湿/潜阳封藏/宣通温经)
}

export interface SolarTermDetail {
  id: string;
  name: string;
  season: "春" | "夏" | "长夏" | "秋" | "冬";
  element: "木" | "火" | "土" | "金" | "水";
  dateRange: string;
  phenology: string; // 三候
  climateFeature: string; // 气候气机特征
  vulnerableOrgan: string; // 易受累脏腑
  wellnessPrinciple: string; // 养生用香法则
  recommendedAroma: string; // 核心香气
  recommendedOils: string[]; // 推荐精油组合
  recommendedApparatus: string; // 推荐适配器具
  acupointRitual: {
    name: string;
    location: string;
    effect: string;
    guide: string;
  };
  poeticVerse: string; // 古风诗词意境
}

export interface CarrierOilInfo {
  id: string;
  name: string;
  latin: string;
  texture: "轻盈清爽" | "柔润适中" | "深层滋养" | "极高亲肤" | string;
  absorptionRate: "极速渗透" | "中速吸收" | "长效锁水" | string;
  shelfLife: string;
  bestFor: string;
  tcmProperty: string;
}

export interface BlendIngredient {
  oilId: string;
  oil: SingleEssentialOil;
  drops: number;
}

export interface SoundTrack {
  id: string;
  title: string;
  subtitle: string;
  frequency: "432Hz" | "528Hz" | "174Hz" | "639Hz";
  scene: "助眠释压" | "冥想通经" | "专注沉浸" | "晨起行气";
  element: "木" | "火" | "土" | "金" | "水";
  audioPattern: "drone_432" | "singing_bowl" | "pine_rain" | "zen_stream";
  durationSeconds: number;
}

export interface ScentApparatus {
  id: string;
  name: string;
  category: "wearable" | "roller" | "diffuser" | "car_accessory" | "palm_elixir" | "palm_tool" | string;
  categoryName: string;
  material: string;
  usageScenario: string;
  desc: string;
  highlight: string;
}

export interface VibeDesire {
  id: string;
  label: string;
  sub: string;
  element: "木" | "火" | "土" | "金" | "水";
  recommendedNotes: string[];
  recommendedApparatus: string;
  color: string;
  tcmBenefit: string;
}

export interface UserCustomFormula {
  id: string;
  name: string;
  description: string;
  dilutionPercent: number;
  totalVolumeMl: number;
  totalDrops: number;
  carrierOilId: string;
  carrierOilName: string;
  oils: {
    oilId: string;
    oilName: string;
    drops: number;
    ratio: string;
    noteType: "top" | "middle" | "base";
  }[];
  createdAt: string;
  synergyScore: number;
  isSafe: boolean;
  notes?: string;
}
