import {
  ScentPrescription,
  SingleEssentialOil,
  SoundTrack,
  CarrierOilInfo,
  ScentApparatus,
  VibeDesire,
  SolarTermDetail
} from "../types";
import { EXPANDED_CARRIER_OILS, EXPANDED_ESSENTIAL_OILS } from "./globalBotanicals";
import { ALL_COMPREHENSIVE_ESSENTIAL_OILS } from "./comprehensiveBotanicalsList";
import { USER_STANDARDIZED_ESSENTIAL_OILS, USER_STANDARDIZED_CARRIER_OILS } from "./unioBotanicalsAdapter";
import { enrichSingleEssentialOil } from "../utils/botanicalStandardizer";

const RAW_CARRIER_OILS: CarrierOilInfo[] = [
  {
    id: "carrier_jojoba",
    name: "有机金黄荷荷巴油 (Golden Jojoba)",
    latin: "Simmondsia chinensis",
    texture: "极高亲肤",
    absorptionRate: "极速渗透",
    shelfLife: "3-5 年 (极抗氧化液体蜡)",
    bestFor: "全肤质面部点涂、滚珠调香底油、情绪脉搏油",
    tcmProperty: "性平味甘，平衡阴阳油脂"
  },
  {
    id: "carrier_sweet_almond",
    name: "冷初榨甜杏仁油 (Sweet Almond)",
    latin: "Prunus amygdalus dulcis",
    texture: "柔润适中",
    absorptionRate: "中速吸收",
    shelfLife: "1-2 年",
    bestFor: "全身经络推拿按摩、穴位深层渗透、婴儿与敏感肌",
    tcmProperty: "归肺、大肠经，润燥滑肠宣肺"
  },
  {
    id: "carrier_camellia",
    name: "东方野生山茶花籽油 (Camellia Seed)",
    latin: "Camellia oleifera",
    texture: "轻盈清爽",
    absorptionRate: "极速渗透",
    shelfLife: "2 年",
    bestFor: "东方古法调香、发丝与面部滋养、抗氧化抗衰",
    tcmProperty: "性凉味苦，清热润肺通经"
  },
  {
    id: "carrier_rosehip",
    name: "超临界高山野生玫瑰果油 (Rosehip)",
    latin: "Rosa canina / Rosa rubiginosa",
    texture: "深层滋养",
    absorptionRate: "中速吸收",
    shelfLife: "1 年 (冷藏避光)",
    bestFor: "夜间修护、疤痕淡化、熟龄肌能量激活",
    tcmProperty: "性平味酸微涩，活血行气生肌"
  },
  {
    id: "carrier_alcohol",
    name: "有机甘蔗发酵植物酒精 (95% Organic Perfumer's Alcohol)",
    latin: "Saccharum officinarum fermentation",
    texture: "轻盈清爽",
    absorptionRate: "极速渗透",
    shelfLife: "5 年以上",
    bestFor: "高定沙龙淡香精 (EDP 15%~20%)、空间喷雾",
    tcmProperty: "行气发散，通络引药"
  }
];

export const CARRIER_OILS_DATABASE: CarrierOilInfo[] = [
  ...USER_STANDARDIZED_CARRIER_OILS,
  ...EXPANDED_CARRIER_OILS.filter(e => !USER_STANDARDIZED_CARRIER_OILS.some(u => u.name === e.name || u.latin === e.latin)),
  ...RAW_CARRIER_OILS.filter(r => !USER_STANDARDIZED_CARRIER_OILS.some(u => u.name === r.name) && !EXPANDED_CARRIER_OILS.some(e => e.id === r.id))
];

const RAW_ESSENTIAL_OILS: SingleEssentialOil[] = [
  // ===================== 【木】行 (Wood - 肝/胆/筋目/生发条达) =====================
  {
    id: "oil_agarwood",
    name: "海南沉香",
    pinyin: "Hǎi Nán Chén Xiāng",
    latin: "Aquilaria sinensis",
    element: "木",
    subcategory: "东方珍木",
    noteType: "base",
    scentFamily: "东方树脂",
    plantPart: "心材",
    extractionMethod: "超临界CO2萃取",
    origin: "中国海南黎母山核心林区",
    chemicalFamily: "Sesquiterpenes (倍半萜 - 镇静抗炎/潜阳)",
    primaryMolecules: [
      { name: "沉香螺醇 (Agarospirol)", percentage: "28.5%" },
      { name: "苄基丙酮 (Benzylacetone)", percentage: "18.2%" },
      { name: "愈创木烯 (Guaiene)", percentage: "12.4%" },
      { name: "沉香呋喃 (Agarofuran)", percentage: "9.8%" }
    ],
    emotionalBenefit: "定心凝神，扫除浮躁杂念，通关开窍，带来深层安全感与虚极静笃之境",
    physicalBenefit: "降气温中，暖肾纳气，下调交感神经过度亢奋",
    tcmMeridian: "归肾、脾、胃、肝经",
    maxDermalPercent: 5.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["西伯利亚冷杉", "迈索尔老山檀香", "阿曼绿乳香", "安吉白茶原精", "大马士革玫瑰"],
    caution: "极其珍稀温厚，0.5%~2% 即可发挥强大定香与镇静力量",
    storyAndLore: "《本草纲目》誉为众香之首。唐代沉香亭畔李白赋清平调，宋人四般闲事之首。千年老树受创结香，化创伤为至醇甘芬。",
    sensorySynesthesia: "深褐色老漆木光泽 · 432Hz 编钟低鸣 · 暮色穿透千年幽寺",
    perfumerTrivia: "天然沉香大分子结构极其复杂，具备卓越的「咬香」能力，可使挥发迅速的柑橘前调留香延长 3 倍以上。"
  },
  {
    id: "oil_bergamot",
    name: "卡拉布里亚无光敏佛手柑",
    pinyin: "Fó Shǒu Gān",
    latin: "Citrus bergamia (FCF)",
    element: "木",
    subcategory: "疏肝柑橘",
    noteType: "top",
    scentFamily: "清冽柑橘",
    plantPart: "果皮",
    extractionMethod: "冷压榨后真空蒸馏去光敏(FCF)",
    origin: "意大利南部卡拉布里亚 (Calabria)",
    chemicalFamily: "Monoterpenes (单萜烯 - 提神激活/行气)",
    primaryMolecules: [
      { name: "乙酸芳樟酯 (Linalyl acetate)", percentage: "36.2%" },
      { name: "柠檬烯 (d-Limonene)", percentage: "34.8%" },
      { name: "芳樟醇 (Linalool)", percentage: "12.5%" }
    ],
    emotionalBenefit: "破除郁闷情绪，扫尽案头脑雾，带来阳光破晓般的喜悦与开阔心境",
    physicalBenefit: "疏肝理气，调畅情志，促进胆汁分泌与消化机能",
    tcmMeridian: "归肝、脾、胃经",
    maxDermalPercent: 5.0,
    isPhototoxic: false,
    isPregnancySafe: true,
    isPetSafe: false,
    isKidSafe: true,
    blendingPartners: ["安吉白茶原精", "西伯利亚冷杉", "摩洛哥橙花", "迈索尔老山檀香"],
    caution: "已采用脱呋喃香豆素工艺，白天日晒无反黑光毒风险",
    storyAndLore: "伯爵红茶(Earl Grey)的灵魂香气。意大利民间自古将其挂于门楣驱散阴郁病气，被誉为「可以嗅吸的灿烂阳光」。",
    sensorySynesthesia: "金黄碎光 · 晨曦海风拂过悬崖果园 · 明快跳跃的大提琴拨弦",
    perfumerTrivia: "香水界无可替代的百搭前调，既有柑橘的明朗，又兼备薰衣草的酯类柔美，能化解一切木质香的沉重。"
  },
  {
    id: "oil_fir",
    name: "西伯利亚冷杉",
    pinyin: "Xī Bó Lì Yǎ Lěng Shān",
    latin: "Abies sibirica",
    element: "木",
    subcategory: "西方针叶",
    noteType: "middle",
    scentFamily: "木质香调",
    plantPart: "叶片/针叶",
    extractionMethod: "水蒸气蒸馏",
    origin: "俄罗斯西伯利亚原始泰加林",
    chemicalFamily: "Esters (酯类 - 抗痉挛/极度平抚)",
    primaryMolecules: [
      { name: "乙酸冰片酯 (Bornyl acetate)", percentage: "38.5%" },
      { name: "莰烯 (Camphene)", percentage: "18.2%" },
      { name: "α-蒎烯 (alpha-Pinene)", percentage: "14.6%" }
    ],
    emotionalBenefit: "涤荡胸臆烦浊，重塑边界感，让人如置身万顷雪松林海中深呼吸",
    physicalBenefit: "宣通肺气，抗支气管痉挛，化解颈项与胸口压迫紧绷",
    tcmMeridian: "归肺、肝、膀胱经",
    maxDermalPercent: 8.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["迈索尔老山檀香", "海南沉香", "卡拉布里亚无光敏佛手柑", "阿曼绿乳香"],
    caution: "高浓度富含冰片酯，极宜搭配深层木质作为中调骨架",
    storyAndLore: "在零下 50 度的西伯利亚严冬中依然青翠傲立。原住民萨满视为「森林精魄」，常用于深冬蒸气浴通泰身心。",
    sensorySynesthesia: "深冷碧绿 · 极地初雪融化的凛冽感 · 穿透层云的空灵长笛",
    perfumerTrivia: "冰片酯赋予其独特的清甜松膏香，不仅不会带来樟脑的刺鼻感，反而能令整个配方产生「大口吸氧」的开阔空间感。"
  },
  {
    id: "oil_hinoki",
    name: "日本台湾红桧 (Hinoki)",
    pinyin: "Tái Wān Hóng Kuài",
    latin: "Chamaecyparis formosensis",
    element: "木",
    subcategory: "东方珍木",
    noteType: "middle",
    scentFamily: "木质香调",
    plantPart: "心材/枝木",
    extractionMethod: "减压水蒸气蒸馏",
    origin: "阿里山高海拔千年原生林",
    chemicalFamily: "Sesquiterpenes (倍半萜 - 镇静抗炎/潜阳)",
    primaryMolecules: [
      { name: "扁柏酚 (Hinokitiol)", percentage: "24.5%" },
      { name: "α-蒎烯 (alpha-Pinene)", percentage: "32.0%" }
    ],
    emotionalBenefit: "如入深山古刹温泉，带来无与伦比的松弛洗炼与安心归宿感",
    physicalBenefit: "强大的植物杀菌素 (Phytoncide)，显著降低皮质醇并提升 NK 免疫细胞活性",
    tcmMeridian: "归肝、肺、肾经",
    maxDermalPercent: 4.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["海南沉香", "安吉白茶原精", "大西洋雪松", "佛手柑"],
    caution: "东方木质神品，木质调中极具辨识度的温润泉水感",
    storyAndLore: "古代东亚宫殿与千鸟居神木。其耐腐千年不朽，散发的高浓度芬多精被现代医学证实可诱发大脑生成阿尔法慢波。",
    sensorySynesthesia: "暖木色微光 · 雨打古寺木阶 · 温泉升腾的袅袅白雾",
    perfumerTrivia: "它带有微妙的干燥木脂与柑橘微酸，在调香中加入 1 滴即可消除沉香的沉闷感。"
  },
  {
    id: "oil_peppermint",
    name: "欧薄荷 (胡椒薄荷)",
    pinyin: "Ōu Bò Hé",
    latin: "Mentha x piperita",
    element: "木",
    subcategory: "芳香草本",
    noteType: "top",
    scentFamily: "草本根茎",
    plantPart: "全草",
    extractionMethod: "水蒸气蒸馏",
    origin: "美国华盛顿州雅基马谷",
    chemicalFamily: "Monoterpenols (单萜醇 - 清爽抑菌/疏风散热)",
    primaryMolecules: [
      { name: "薄荷醇 (Menthol)", percentage: "45.0%" },
      { name: "薄荷酮 (Menthone)", percentage: "22.5%" }
    ],
    emotionalBenefit: "瞬间破除困顿昏昧，清凉利窍，唤醒沉睡的大脑逻辑与决策力",
    physicalBenefit: "疏散风热，清利头目，解除偏头痛与晕车晕眩",
    tcmMeridian: "归肝、肺经",
    maxDermalPercent: 3.0,
    isPregnancySafe: false,
    isPetSafe: false,
    isKidSafe: false,
    blendingPartners: ["迷迭香", "卡拉布里亚佛手柑", "尤加利", "薰衣草"],
    caution: "含高浓度薄荷醇，3岁以下儿童与孕期禁用，不可接触眼周",
    storyAndLore: "古希腊神话中水仙仙女门塔(Menthe)化作的神草。古罗马人筵席上佩戴薄荷冠，以保持神志清醒与雄辩才思。",
    sensorySynesthesia: "极冰碧蓝 · 破冰而出的寒泉 · 高音清脆的银铃",
    perfumerTrivia: "微量（0.5%）使用时不会呈现牙膏感，反而能给花香前调带来清晨露珠般晶莹剔透的灵动感。"
  },
  {
    id: "oil_rosemary",
    name: "马鞭草酮迷迭香",
    pinyin: "Mǐ Dié Xiāng",
    latin: "Rosmarinus officinalis ct verbenone",
    element: "木",
    subcategory: "芳香草本",
    noteType: "top",
    scentFamily: "草本根茎",
    plantPart: "枝叶花序",
    extractionMethod: "水蒸气蒸馏",
    origin: "法国科西嘉岛原生山地",
    chemicalFamily: "Monoterpenes (单萜烯 - 提神激活/行气)",
    primaryMolecules: [
      { name: "马鞭草酮 (Verbenone)", percentage: "18.5%" },
      { name: "1,8-桉油醇 (1,8-Cineole)", percentage: "22.0%" },
      { name: "樟脑 (Camphor)", percentage: "12.0%" }
    ],
    emotionalBenefit: "增强记忆神经突触连接，激发创作灵感，强化精神明晰度",
    physicalBenefit: "疏肝利胆，促进肝细胞再生与代谢，活化微循环",
    tcmMeridian: "归肝、胆、心经",
    maxDermalPercent: 4.0,
    isPregnancySafe: false,
    isPetSafe: false,
    isKidSafe: true,
    blendingPartners: ["佛手柑", "西伯利亚冷杉", "安吉白茶原精", "杜松浆果"],
    caution: "温通活血，癫痫患者及孕早期避用",
    storyAndLore: "莎士比亚《哈姆雷特》名句：「迷迭香是为了帮助记忆」。中世纪匈牙利女王水(Queen of Hungary Water)的核心返老还童秘方。",
    sensorySynesthesia: "地中海崖壁的草木灰绿 · 烈日照射下的草本清风 · 锐利澄澈的光束",
    perfumerTrivia: "马鞭草酮多酚比普通桉油醇迷迭香更加温和高贵，带有丝丝细腻的花果香底，是调配高阶智力工作香的绝品。"
  },

  // ===================== 【火】行 (Fire - 心/小肠/血脉/神明君主) =====================
  {
    id: "oil_rose",
    name: "保加利亚大马士革玫瑰",
    pinyin: "Dà Mǎ Shì Gé Méi Guī",
    latin: "Rosa damascena",
    element: "火",
    subcategory: "温润红花",
    noteType: "middle",
    scentFamily: "古典花香",
    plantPart: "新鲜花朵",
    extractionMethod: "水蒸气蒸馏 (Rose Otto)",
    origin: "保加利亚登波峡谷 (Rose Valley)",
    chemicalFamily: "Monoterpenols (单萜醇 - 清爽抑菌/疏风散热)",
    primaryMolecules: [
      { name: "香茅醇 (Citronellol)", percentage: "35.8%" },
      { name: "香叶醇 (Geraniol)", percentage: "22.4%" },
      { name: "橙花醇 (Nerol)", percentage: "10.2%" },
      { name: "玫瑰蜡微量芳香分子", percentage: "4.5%" }
    ],
    emotionalBenefit: "温抚心神创伤，解开心结，重拾自我认同与无条件的爱",
    physicalBenefit: "活血化瘀，调和营卫，平衡女性内分泌与神经内分泌轴",
    tcmMeridian: "归心、肝、脾经",
    maxDermalPercent: 5.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["迈索尔老山檀香", "阿曼绿乳香", "佛手柑", "高地薰衣草"],
    caution: "极其珍稀尊贵，3500公斤新鲜花瓣仅提取 1 公斤纯精油",
    storyAndLore: "被奉为「精油之后」。波斯医圣阿维森纳改良蒸馏法后提取的第一滴芳香。奥斯曼帝国皇室专属香露。",
    sensorySynesthesia: "深绯红丝绒质感 · 暖阳照耀的古堡花园 · 圆润悠扬的圆号与竖琴",
    perfumerTrivia: "低温时会凝结成结晶状叶片状（玫瑰蜡），在调香中只需千分之三浓度，就能让整个基底如心花盛开般充满柔光。"
  },
  {
    id: "oil_neroli",
    name: "摩洛哥高定橙花",
    pinyin: "Chéng Huā",
    latin: "Citrus aurantium flos",
    element: "火",
    subcategory: "清幽白花",
    noteType: "middle",
    scentFamily: "古典花香",
    plantPart: "新鲜苦橙花朵",
    extractionMethod: "水蒸气蒸馏",
    origin: "摩洛哥阿特拉斯山脉山脚 (Nabeul)",
    chemicalFamily: "Monoterpenols (单萜醇 - 清爽抑菌/疏风散热)",
    primaryMolecules: [
      { name: "芳樟醇 (Linalool)", percentage: "38.5%" },
      { name: "乙酸芳樟酯 (Linalyl acetate)", percentage: "18.2%" },
      { name: "橙花叔醇 (Nerolidol)", percentage: "8.5%" },
      { name: "吲哚微量", percentage: "0.2%" }
    ],
    emotionalBenefit: "瞬间平抑心悸心慌与惊恐感，赋予灵魂纯白无暇的宁静与安抚",
    physicalBenefit: "安抚交感神经过度亢奋，缓解心因性失眠与肠易激",
    tcmMeridian: "归心、肝经",
    maxDermalPercent: 5.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["老山檀香", "佛手柑", "安吉白茶原精", "大西洋雪松"],
    caution: "白花中的贵族，极度温和安全",
    storyAndLore: "17世纪意大利奈洛拉公国(Nerola)安妮公主用其浸润手套与洗浴，贵族争相模仿。象征纯洁与崇高灵性。",
    sensorySynesthesia: "象牙白陶瓷 · 细雨初歇的宫廷回廊 · 纯净的天使童声合唱",
    perfumerTrivia: "它兼具花香的柔媚与柑橘树叶的微苦绿意，是极少数能同时贯穿前调中调的华丽过渡成分。"
  },
  {
    id: "oil_sweet_orange",
    name: "西西里阳光甜橙",
    pinyin: "Tián Chéng",
    latin: "Citrus sinensis",
    element: "火",
    subcategory: "欢愉果香",
    noteType: "top",
    scentFamily: "清冽柑橘",
    plantPart: "果皮",
    extractionMethod: "冷压榨",
    origin: "意大利西西里岛火山土壤果园",
    chemicalFamily: "Monoterpenes (单萜烯 - 提神激活/行气)",
    primaryMolecules: [
      { name: "右旋柠檬烯 (d-Limonene)", percentage: "94.5%" },
      { name: "辛醛 (Octanal)", percentage: "1.8%" }
    ],
    emotionalBenefit: "驱散内心冰冷阴霾，带来孩子般天真无邪的欢愉与食欲",
    physicalBenefit: "理气和中，消食导滞，缓解胃腹胀满",
    tcmMeridian: "归脾、胃、心经",
    maxDermalPercent: 10.0,
    isPhototoxic: false,
    isPregnancySafe: true,
    isPetSafe: false,
    isKidSafe: true,
    blendingPartners: ["罗马洋甘菊", "老山檀香", "肉桂皮", "乳香"],
    caution: "儿童与长者极其喜爱的温和安心香",
    storyAndLore: "欧洲传统圣诞节在橙皮上插满丁香制作「香橙球(Pomander)」，用以祈求新一年阖家安康、驱逐严冬寒疫。",
    sensorySynesthesia: "明亮橙金 · 冬日壁炉旁剥开的一颗多汁甜橙 · 欢快的手风琴",
    perfumerTrivia: "高达95%的柠檬烯具有极强的抗氧化活性，与辛香料（肉桂、丁香）搭配能营造出世界顶级的温馨暖冬氛围。"
  },
  {
    id: "oil_clary_sage",
    name: "高山快乐鼠尾草",
    pinyin: "Kuài Lè Shǔ Wěi Cǎo",
    latin: "Salvia sclarea",
    element: "火",
    subcategory: "芳香草本",
    noteType: "middle",
    scentFamily: "草本根茎",
    plantPart: "开花全草",
    extractionMethod: "水蒸气蒸馏",
    origin: "法国普罗旺斯高原",
    chemicalFamily: "Esters (酯类 - 抗痉挛/极度平抚)",
    primaryMolecules: [
      { name: "乙酸芳樟酯 (Linalyl acetate)", percentage: "68.5%" },
      { name: "紫苏醇 (Sclareol)", percentage: "2.5%" }
    ],
    emotionalBenefit: "引发轻微的愉悦微醺感，释放长期压抑的情感紧绷与焦虑",
    physicalBenefit: "拟雌激素样双向调节，舒缓痛经与经前情绪综合征 (PMS)",
    tcmMeridian: "归心、肾、肝经",
    maxDermalPercent: 4.0,
    isPregnancySafe: false,
    isPetSafe: true,
    isKidSafe: false,
    blendingPartners: ["大马士革玫瑰", "佛手柑", "海地岩兰草", "雪松"],
    caution: "具深度放松镇静作用，驾驶前及饮酒时不宜大量吸嗅",
    storyAndLore: "拉丁学名 Clarus 意为「清晰明亮」，中世纪药草师用其浸液清洗眼眸明目，故又被称为「清澈之眼」。",
    sensorySynesthesia: "淡紫灰调烟云 · 莫奈花园的黄昏倒影 · 慵懒低回的爵士萨克斯",
    perfumerTrivia: "其富含的双萜醇(Sclareol)在调香中是绝佳的天然龙涎香前体，能为配方赋予如天鹅绒般的微醺暖甜。"
  },

  // ===================== 【土】行 (Earth - 脾/胃/肌肉/运化中焦) =====================
  {
    id: "oil_sandalwood",
    name: "迈索尔老山檀香",
    pinyin: "Mài Suǒ Ěr Tán Xiāng",
    latin: "Santalum album",
    element: "土",
    subcategory: "安定木树",
    noteType: "base",
    scentFamily: "木质香调",
    plantPart: "心材",
    extractionMethod: "水蒸气蒸馏",
    origin: "印度卡纳塔克邦迈索尔 40 年老树",
    chemicalFamily: "Sesquiterpenes (倍半萜 - 镇静抗炎/潜阳)",
    primaryMolecules: [
      { name: "α-檀香醇 (α-Santalol)", percentage: "58.4%" },
      { name: "β-檀香醇 (β-Santalol)", percentage: "24.1%" },
      { name: "檀香萜烯 (Santalene)", percentage: "8.2%" }
    ],
    emotionalBenefit: "沉静安详，止息思虑狂躁，引导大脑进入 Theta/Delta 深度慢波状态",
    physicalBenefit: "抗炎舒缓，促进表皮黏膜修复，下调皮质醇释放",
    tcmMeridian: "归脾、胃、心经",
    maxDermalPercent: 10.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["普罗旺斯高地真薰衣草", "大马士革玫瑰", "西伯利亚冷杉", "佛手柑", "降真香"],
    caution: "温润无刺激，极佳的基底定香与调和剂",
    storyAndLore: "印度吠陀经典视为通达神界的圣木。梵文写本中记录其能清退三界热恼。中国明清家具与佛教供香之尊。",
    sensorySynesthesia: "暖象牙黄 · 盘香升起的一缕青烟 · 大提琴最深沉平稳的持续长音",
    perfumerTrivia: "α-檀香醇不仅本身气味悠长，更是已知最温润的天然固香剂，能将其他精油分子牢牢锁在皮肤上超过 24 小时。"
  },
  {
    id: "oil_vetiver",
    name: "海地极品岩兰草",
    pinyin: "Yán Lán Cǎo",
    latin: "Chrysopogon zizanioides",
    element: "土",
    subcategory: "泥土根茎",
    noteType: "base",
    scentFamily: "草本根茎",
    plantPart: "深层根系",
    extractionMethod: "高压水蒸气蒸馏",
    origin: "加勒比海海地莱凯 (Les Cayes)",
    chemicalFamily: "Sesquiterpenols (倍半萜醇 - 扎根固摄/镇痛)",
    primaryMolecules: [
      { name: "岩兰草醇 (Vetiverol)", percentage: "55.0%" },
      { name: "岩兰草酮 (Vetivone)", percentage: "18.0%" },
      { name: "岩兰草烯 (Vetiveryl acetate)", percentage: "12.0%" }
    ],
    emotionalBenefit: "赋予灵魂无可撼动的「大地扎根感(Grounding)」，终结虚妄漂浮心慌",
    physicalBenefit: "健脾固肾，温养中焦，缓解神经衰弱与过度消瘦",
    tcmMeridian: "归脾、胃、肾经",
    maxDermalPercent: 10.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["卡拉布里亚佛手柑", "海南沉香", "西伯利亚冷杉", "大西洋雪松"],
    caution: "极其浓稠粘厚，如泥浆般深邃，滴入前建议手心温瓶",
    storyAndLore: "印度称其为「宁静之油 (Oil of Tranquility)」。古时编织岩兰草根挂于窗前，风过时满室皆是泥土回甘。",
    sensorySynesthesia: "深焦糖棕 · 暴雨后饱饮甘霖的深黑沃土 · 浑厚古朴的陶埙之音",
    perfumerTrivia: "无论香水配方多么浮躁轻佻，加入 1% 岩兰草后就会立刻获得沉稳踏实的贵族质感与泥土烟熏底蕴。"
  },
  {
    id: "oil_patchouli",
    name: "印尼黑广藿香",
    pinyin: "Guǎng Huò Xiāng",
    latin: "Pogostemon cablin",
    element: "土",
    subcategory: "泥土根茎",
    noteType: "base",
    scentFamily: "草本根茎",
    plantPart: "发酵陈化叶片",
    extractionMethod: "水蒸气蒸馏后陈化3年",
    origin: "印度尼西亚苏门答腊岛",
    chemicalFamily: "Sesquiterpenes (倍半萜 - 镇静抗炎/潜阳)",
    primaryMolecules: [
      { name: "广藿香醇 (Patchoulol)", percentage: "32.5%" },
      { name: "α-愈创木烯 (alpha-Guaiene)", percentage: "15.0%" }
    ],
    emotionalBenefit: "平复焦虑，使过度活跃的大脑逻辑回归身体感知，安顿身心",
    physicalBenefit: "芳香化湿，和胃止呕，消暑解表，化解体内黏滞湿浊",
    tcmMeridian: "归脾、胃、肺经",
    maxDermalPercent: 8.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["甜橙", "迈索尔老山檀香", "大马士革玫瑰", "佛手柑"],
    caution: "如同陈年老酒，越陈越醇厚香甜",
    storyAndLore: "19世纪维多利亚时代运往欧洲的印度丝绸均夹裹广藿香叶防虫，其特殊的泥土木香由此成为东方奢华丝绸的代名词。",
    sensorySynesthesia: "古铜色光泽 · 存放百年的古旧藏书阁 · 深沉悠扬的古琴泛音",
    perfumerTrivia: "未陈化的广藿香有草腥气，经过3年以上橡木桶陈化的老广藿香则会蜕变出如巧克力与松露般的丝滑回甘。"
  },
  {
    id: "oil_cinnamon",
    name: "斯里兰卡极品肉桂皮",
    pinyin: "Ròu Guì",
    latin: "Cinnamomum verum (bark)",
    element: "土",
    subcategory: "温阳辛香",
    noteType: "middle",
    scentFamily: "辛香温热",
    plantPart: "树皮内层",
    extractionMethod: "水蒸气蒸馏",
    origin: "斯里兰卡中央高地 (Ceylon)",
    chemicalFamily: "Aldehydes (醛类 - 强烈温通/抗微生物)",
    primaryMolecules: [
      { name: "肉桂醛 (Cinnamaldehyde)", percentage: "72.0%" },
      { name: "丁香酚 (Eugenol)", percentage: "8.5%" }
    ],
    emotionalBenefit: "化解心底孤独与寒冷感，激发源源不断的热情、勇气与创造力",
    physicalBenefit: "补火助阳，引火归元，散寒止痛，温通经脉",
    tcmMeridian: "归肾、脾、心、肝经",
    maxDermalPercent: 0.5,
    isPregnancySafe: false,
    isPetSafe: false,
    isKidSafe: false,
    blendingPartners: ["甜橙", "迈索尔老山檀香", "阿曼绿乳香", "生姜"],
    caution: "强效皮肤发赤剂，涂抹浓度必须严格限制在 0.5% 以下，孕妇禁用",
    storyAndLore: "大航海时代葡萄牙与荷兰争夺香料群岛的核心珍宝。古代丝绸之路上价值等同黄金的温补圣药。",
    sensorySynesthesia: "炽烈赤金 · 寒夜中跳跃的橙红篝火 · 节奏激昂的非洲鼓点",
    perfumerTrivia: "仅需千分之一的极微量滴入，就能让原本冰冷的白花香变得如同裹上了温暖焦糖，令人垂涎欲滴。"
  },

  // ===================== 【金】行 (Metal - 肺/大肠/皮毛/肃降清肃) =====================
  {
    id: "oil_frankincense",
    name: "阿曼皇家绿乳香",
    pinyin: "Ā Màn Lǜ Rǔ Xiāng",
    latin: "Boswellia sacra (Green Hojari)",
    element: "金",
    subcategory: "深邃树脂",
    noteType: "base",
    scentFamily: "东方树脂",
    plantPart: "绝壁树脂泪滴",
    extractionMethod: "水蒸气蒸馏",
    origin: "阿曼佐法尔省绝壁荒漠核心产区",
    chemicalFamily: "Monoterpenes (单萜烯 - 提神激活/行气)",
    primaryMolecules: [
      { name: "α-蒎烯 (alpha-Pinene)", percentage: "68.5%" },
      { name: "柠檬烯 (Limonene)", percentage: "12.0%" },
      { name: "乳香酸衍生物 (Incensole)", percentage: "5.4%" }
    ],
    emotionalBenefit: "拓宽肺叶容量与呼吸深度，切断焦虑循环，带来庄严崇高的神圣感",
    physicalBenefit: "宣肺平喘，活血定痛，化解横膈膜紧绷与胸中滞气",
    tcmMeridian: "归心、肝、脾、肺经",
    maxDermalPercent: 8.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["海南沉香", "西伯利亚冷杉", "大马士革玫瑰", "安吉白茶原精"],
    caution: "乳香中的天花板级绿乳香，带有天然高贵柠檬柑橘与松脂清芬",
    storyAndLore: "三博士朝圣献给圣婴的黄金级礼物。古埃及法老涂抹肉身通神之物。阿曼绿乳香只产于面向阿拉伯海的荒漠干旱绝壁。",
    sensorySynesthesia: "青白透亮晶莹光 · 穿透哥特式大教堂彩绘玻璃的光柱 · 神圣肃穆的管风琴",
    perfumerTrivia: "它的蒎烯含量极高，初嗅有柑橘与针叶的清冽，数分钟后转为深邃树脂，是连接前调与深沉后调最完美的天然桥梁。"
  },
  {
    id: "oil_tea",
    name: "东方安吉白茶原精",
    pinyin: "Ān Jí Bái Chá",
    latin: "Camellia sinensis extract",
    element: "金",
    subcategory: "禅意茶香",
    noteType: "middle",
    scentFamily: "禅意茶香",
    plantPart: "春季初展一芽一叶",
    extractionMethod: "超临界流体CO2萃取",
    origin: "中国浙江安吉天荒坪高山竹林茶园",
    chemicalFamily: "Esters (酯类 - 抗痉挛/极度平抚)",
    primaryMolecules: [
      { name: "顺-茉莉酮 (cis-Jasmone)", percentage: "16.8%" },
      { name: "茶多酚芳香络合物", percentage: "24.5%" },
      { name: "芳樟醇 (Linalool)", percentage: "14.2%" },
      { name: "香叶醇 (Geraniol)", percentage: "9.8%" }
    ],
    emotionalBenefit: "洗尽铅华，带来文人书斋般的雅致虚静，澄澈心境，止息浮躁",
    physicalBenefit: "清热降燥，生津利咽，抗氧化并保护呼吸道黏膜屏障",
    tcmMeridian: "归肺、脾、心经",
    maxDermalPercent: 5.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["无光敏佛手柑", "西伯利亚冷杉", "海南沉香", "摩洛哥橙花"],
    caution: "东方调香神髓，不可高温加热，宜冷雾或随身滚珠点涂",
    storyAndLore: "宋徽宗《大观茶论》赞其「如玉之在璞，它茶无与伦比」。清明前采摘自竹海深处的低温氨基酸高富集白化茶树。",
    sensorySynesthesia: "淡青白透冷玉 · 晨雾笼罩的万亩修竹 · 幽谷泉水滴落青石的清脆空响",
    perfumerTrivia: "白茶原精具有极高雅的透明感，能在不掩盖其他木质花香的前提下，为整个配方铺上一层「东方文人写意水墨」的底蕴。"
  },
  {
    id: "oil_eucalyptus",
    name: "澳洲蓝胶尤加利",
    pinyin: "Yóu Jiā Lì",
    latin: "Eucalyptus globulus",
    element: "金",
    subcategory: "宣肺木叶",
    noteType: "top",
    scentFamily: "木质香调",
    plantPart: "成熟叶片",
    extractionMethod: "水蒸气蒸馏",
    origin: "澳大利亚新南威尔士州原始桉树林",
    chemicalFamily: "Oxides (氧化物 - 强力宣通呼吸/抗病毒)",
    primaryMolecules: [
      { name: "1,8-桉油醇 (1,8-Cineole)", percentage: "82.5%" },
      { name: "α-蒎烯 (alpha-Pinene)", percentage: "9.2%" }
    ],
    emotionalBenefit: "驱除被束缚压抑窒息感，打开心胸格局，带来广袤无垠的自由呼吸",
    physicalBenefit: "强效溶解呼吸道黏液，抗流感病毒与支气管炎，宣肃肺金",
    tcmMeridian: "归肺、膀胱经",
    maxDermalPercent: 5.0,
    isPregnancySafe: true,
    isPetSafe: false,
    isKidSafe: false,
    blendingPartners: ["欧薄荷", "西伯利亚冷杉", "阿曼绿乳香", "柠檬"],
    caution: "桉油醇浓度极高，2岁以下幼儿禁用，不可内服",
    storyAndLore: "澳洲土著称其为「发烧树 (Fever Tree)」，长久以来用其叶片包裹创口、焚烧叶片驱逐丛林瘴气与热毒。",
    sensorySynesthesia: "银蓝清辉 · 穿透密林的第一缕强风 · 尖锐通透的短笛高音",
    perfumerTrivia: "它不仅是呼吸道的守护神，在空间香薰中只需 2 滴，就能在 10 分钟内清除封闭室内 80% 以上的沉滞沉闷气味。"
  },
  {
    id: "oil_myrrh",
    name: "也门野生红没药",
    pinyin: "Mò Yào",
    latin: "Commiphora myrrha",
    element: "金",
    subcategory: "深邃树脂",
    noteType: "base",
    scentFamily: "东方树脂",
    plantPart: "刺灌木干涸树脂",
    extractionMethod: "CO2临界超精萃取",
    origin: "也门与东非索马里半荒漠",
    chemicalFamily: "Sesquiterpenes (倍半萜 - 镇静抗炎/潜阳)",
    primaryMolecules: [
      { name: "呋喃桉油烷 (Furanoeudesma-1,3-diene)", percentage: "38.0%" },
      { name: "姜黄烯 (Curzerene)", percentage: "24.5%" }
    ],
    emotionalBenefit: "抚平深层悲伤与创伤，给予枯竭身心如大地母亲般的温润拥抱与愈合",
    physicalBenefit: "活血止痛，消肿生肌，极佳的口腔黏膜与顽固皮肤裂口修复剂",
    tcmMeridian: "归心、肝、脾、肺经",
    maxDermalPercent: 5.0,
    isPregnancySafe: false,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["阿曼绿乳香", "迈索尔老山檀香", "大马士革玫瑰", "海南沉香"],
    caution: "具活血通经作用，孕期严禁使用",
    storyAndLore: "《圣经》中与乳香齐名的圣药。古埃及人用其与乳香制作木乃伊，能使肉身三千年不腐，象征灵魂不朽与重生。",
    sensorySynesthesia: "深红琥珀 · 暮光中的荒漠古石城 · 低沉浑厚的大提琴揉弦",
    perfumerTrivia: "没药略带微苦的药香与树脂底蕴，与乳香按 1:1 调配时能产生著名的「乳没相和」效应，定香力与深度将呈指数级增强。"
  },

  // ===================== 【水】行 (Water - 肾/膀胱/骨髓/封藏潜阳) =====================
  {
    id: "oil_lavender",
    name: "普罗旺斯高地真薰衣草",
    pinyin: "Gāo Dì Xūn Yī Cǎo",
    latin: "Lavandula angustifolia",
    element: "水",
    subcategory: "固涩本草",
    noteType: "middle",
    scentFamily: "古典花香",
    plantPart: "高山开花枝顶",
    extractionMethod: "水蒸气蒸馏",
    origin: "法国普罗旺斯海拔1200米高地",
    chemicalFamily: "Esters (酯类 - 抗痉挛/极度平抚)",
    primaryMolecules: [
      { name: "乙酸芳樟酯 (Linalyl acetate)", percentage: "48.2%" },
      { name: "芳樟醇 (Linalool)", percentage: "34.5%" },
      { name: "薰衣草烯 (Lavandulyl acetate)", percentage: "4.8%" }
    ],
    emotionalBenefit: "溶解一切焦躁、愤怒与失眠，引导神经系统从交感亢奋滑入副交感深睡",
    physicalBenefit: "镇静安神，促进皮肤烧烫伤与创口极速细胞再生，降血压降心率",
    tcmMeridian: "归心、肝、肾经",
    maxDermalPercent: 10.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["迈索尔老山檀香", "海南沉香", "卡拉布里亚佛手柑", "大马士革玫瑰"],
    caution: "芳疗百草之母，极安全温和",
    storyAndLore: "现代芳香疗法之父盖特佛塞(Gattefossé)在实验室爆炸中严重烧伤手臂，浸入薰衣草精油后奇迹般迅速愈合且无疤痕，由此诞生现代芳疗科学。",
    sensorySynesthesia: "静谧靛蓝 · 紫色花海上的微凉晚风 · 摇篮曲般温柔抚慰的钢琴琶音",
    perfumerTrivia: "必须选用海拔1000米以上的野生高地真薰衣草，其乙酸芳樟酯含量才足以产生强大的促眠神经抑制作用，绝非平原醒目薰衣草可比。"
  },
  {
    id: "oil_chamomile",
    name: "英国高地罗马洋甘菊",
    pinyin: "Luó Mǎ Yáng Gān Jú",
    latin: "Chamaemelum nobile",
    element: "水",
    subcategory: "固涩本草",
    noteType: "middle",
    scentFamily: "古典花香",
    plantPart: "新鲜小花朵",
    extractionMethod: "低温水蒸气蒸馏",
    origin: "英国汉普郡有机农场",
    chemicalFamily: "Esters (酯类 - 抗痉挛/极度平抚)",
    primaryMolecules: [
      { name: "当归酸异丁酯 (Isobutyl angelate)", percentage: "38.5%" },
      { name: "当归酸甲基丙烯酯 (Methallyl angelate)", percentage: "20.2%" }
    ],
    emotionalBenefit: "安抚惊恐受吓的内在孩童，驱除梦魇，带来如躺在妈妈怀抱里的安全感",
    physicalBenefit: "强效中枢性抗痉挛、抗组胺抗过敏，缓解偏头痛与肠胃痉挛痛",
    tcmMeridian: "归肝、脾、胃、肾经",
    maxDermalPercent: 4.0,
    isPregnancySafe: true,
    isPetSafe: true,
    isKidSafe: true,
    blendingPartners: ["卡拉布里亚佛手柑", "普罗旺斯高地薰衣草", "老山檀香", "甜橙"],
    caution: "儿童受惊夜啼与极度高敏体质的首选安抚油",
    storyAndLore: "古埃及人将其奉献给太阳神拉，尊为「植物的医生」。园艺家发现凡是有洋甘菊生长的地方，周围濒死的植物都会重获生机。",
    sensorySynesthesia: "温润苹果绿配鹅黄 · 咬开一口多汁青苹果的清甜 · 温暖柔和的长笛",
    perfumerTrivia: "它含有极罕见的当归酸酯类，散发独特的清甜苹果香，仅需 1 滴就能软化最顽固的神经性痉挛与肌肉僵硬。"
  },
  {
    id: "oil_angelica",
    name: "岷县野生当归根原精",
    pinyin: "Dāng Guī",
    latin: "Angelica sinensis root",
    element: "水",
    subcategory: "藏元深根",
    noteType: "base",
    scentFamily: "草本根茎",
    plantPart: "深山陈年主根",
    extractionMethod: "超临界流体CO2萃取",
    origin: "中国甘肃岷县高寒阴湿山区 (道地秦归)",
    chemicalFamily: "Lactones (内酯类 - 强效活血通经/温补)",
    primaryMolecules: [
      { name: "藁本内酯 (Ligustilide)", percentage: "58.0%" },
      { name: "正丁烯基酜内酯 (Butylidenephthalide)", percentage: "18.5%" }
    ],
    emotionalBenefit: "如归家般安心扎根，化解虚寒漂泊感，补足底层生命原动力与元气",
    physicalBenefit: "补血活血，调经止痛，润肠通便，温补命门相火",
    tcmMeridian: "归肝、心、脾、肾经",
    maxDermalPercent: 2.0,
    isPhototoxic: true,
    isPregnancySafe: false,
    isPetSafe: false,
    isKidSafe: false,
    blendingPartners: ["海南沉香", "大马士革玫瑰", "老山檀香", "斯里兰卡肉桂"],
    caution: "具强烈活血通经与光敏性，孕期严禁使用，涂抹后避免日光暴晒",
    storyAndLore: "《神农本草经》列为上品。古语「当归，调血气，使各归其所也」。气味辛甘温润，兼具药香与泥土焦糖甜香。",
    sensorySynesthesia: "深浓琥珀金 · 寒冬里咕嘟冒泡的紫砂药罐 · 低回温暖的古琴与大提琴合奏",
    perfumerTrivia: "藁本内酯带有极具辨识度的东方药膳甜辛香，在后调中微量使用（0.5%），能营造出令人惊叹的东方古法秘境香韵。"
  }
];

const mergedRawOils: SingleEssentialOil[] = [];
const oilIdSeen = new Set<string>();
const oilNameSeen = new Set<string>();

// 1. User provided 382 catalog items take absolute precedence
USER_STANDARDIZED_ESSENTIAL_OILS.forEach(oil => {
  oilIdSeen.add(oil.id);
  oilNameSeen.add(oil.name.toLowerCase());
  if (oil.latin) oilNameSeen.add(oil.latin.toLowerCase());
  mergedRawOils.push(oil);
});

// 2. Add existing comprehensive botanicals if not superseded
[...ALL_COMPREHENSIVE_ESSENTIAL_OILS, ...EXPANDED_ESSENTIAL_OILS, ...RAW_ESSENTIAL_OILS].forEach(oil => {
  const isDuplicateName = oilNameSeen.has(oil.name.toLowerCase()) || (oil.latin && oilNameSeen.has(oil.latin.toLowerCase()));
  if (!oilIdSeen.has(oil.id) && !isDuplicateName) {
    oilIdSeen.add(oil.id);
    mergedRawOils.push(oil);
  }
});

export const ESSENTIAL_OILS_DATABASE: SingleEssentialOil[] = mergedRawOils.map(enrichSingleEssentialOil);

export const SINGLE_ESSENTIAL_OILS = ESSENTIAL_OILS_DATABASE;

export const CURATED_PRESCRIPTIONS: ScentPrescription[] = [
  {
    id: "rx_curated_01",
    rxCode: "UNIO-2026-RX8092",
    title: "《暮山听松》",
    poeticSub: "冷杉与老山檀香 · 降心火而宁神志",
    concept: "取材西伯利亚雪山冷杉针叶与印度迈索尔老山檀香，如晚霞漫过深谷松针，让翻涌的大脑神经系统瞬间归于深山古刹般的宁静。",
    seasonTerm: "处暑 / 白露",
    fiveElement: "金水相生",
    synergyScore: 98,
    olfactoryPyramid: {
      topNotes: [
        { name: "无光敏佛手柑", latin: "Citrus bergamia", drops: 6, ratio: "30%", effect: "疏通气机，化解烦热", element: "木" },
        { name: "欧洲冷杉", latin: "Abies alba", drops: 4, ratio: "20%", effect: "清润肺气，开阔胸襟", element: "金" }
      ],
      middleNotes: [
        { name: "西伯利亚冷杉", latin: "Abies sibirica", drops: 4, ratio: "20%", effect: "降气安神，抚平杂念", element: "木" },
        { name: "高地薰衣草", latin: "Lavandula angustifolia", drops: 2, ratio: "10%", effect: "舒缓自主神经紧张", element: "水" }
      ],
      baseNotes: [
        { name: "迈索尔老山檀香", latin: "Santalum album", drops: 3, ratio: "15%", effect: "定惊潜阳，安魂定魄", element: "土" },
        { name: "海地岩兰草", latin: "Chrysopogon zizanioides", drops: 1, ratio: "5%", effect: "抓地沉淀，深层松弛", element: "土" }
      ],
      carrierOil: "有机金黄荷荷巴油 (Golden Jojoba)",
      totalDrops: 20,
      totalVolume: "10ml (3% 浓度极境油)"
    },
    molecularAnalysis: [
      { compound: "乙酸冰片酯 (Bornyl acetate)", percentage: "28.4%", pathway: "GABA-A 神经递质受体变构调节", benefit: "降低皮质醇水平，快速诱导身心进入副交感神经放松态" },
      { compound: "α-檀香醇 (alpha-Santalol)", percentage: "22.1%", pathway: "中枢抑制通道激活", benefit: "阻断外界信息过载刺激，提升冥想专注深度" }
    ],
    aromatherapyAdvice: {
      palmInhalation: "滴 2 滴于掌心搓热，呈杯状扣于鼻前，进行 4-7-8 腹式深呼吸 5 分钟。",
      diffuser: "卧室或书房使用冷雾仪，每 15 平米空间滴入 4~6 滴。",
      pulsePoint: "点涂于手腕内侧寸口脉搏处、颈侧耳后及胸前膻中穴。",
      acupoints: [
        { name: "内关穴 (手厥阴心包经)", location: "腕横纹上2寸，掌长肌腱与桡侧腕屈肌腱之间", effect: "宁心安神，理气止痛，宽胸和胃" },
        { name: "太冲穴 (足厥阴肝经)", location: "足背侧，第一、二跖骨结合部之前凹陷处", effect: "平肝息风，清热利湿，通络止痛" }
      ]
    },
    safetyNotes: "本方性质温和，已去除光敏成分，敏感肌及夜间均可安心使用。",
    createdAt: "2026-08-18T10:00:00Z",
    isFavorite: true
  },
  {
    id: "rx_curated_02",
    rxCode: "UNIO-2026-RX3041",
    title: "《元·水 · 晨曦醒神方》",
    poeticSub: "佛手柑与安吉白茶 · 扫尽脑雾破混沌",
    concept: "晨曦破晓，晨光微露。特调清冽无光敏佛手柑与高山安吉白茶原精，唤醒沉睡的晨起气机，提升清阳之气，开启高效从容的一天。",
    seasonTerm: "立春 / 雨水 / 立夏",
    fiveElement: "木火通明",
    synergyScore: 96,
    olfactoryPyramid: {
      topNotes: [
        { name: "无光敏佛手柑", latin: "Citrus bergamia", drops: 7, ratio: "35%", effect: "提振心神，清醒大脑", element: "木" },
        { name: "巴拉圭苦橙叶", latin: "Citrus aurantium", drops: 3, ratio: "15%", effect: "清降心火，扫除焦躁", element: "木" }
      ],
      middleNotes: [
        { name: "安吉白茶原精", latin: "Camellia sinensis", drops: 5, ratio: "25%", effect: "高雅茶韵，沉淀杂念", element: "金" },
        { name: "摩洛哥高定橙花", latin: "Citrus aurantium flos", drops: 2, ratio: "10%", effect: "抚慰紧绷神经，激发积极愉悦感", element: "火" }
      ],
      baseNotes: [
        { name: "大西洋雪松", latin: "Cedrus atlantica", drops: 2, ratio: "10%", effect: "赋予意志力与精神脊柱", element: "金" },
        { name: "海地岩兰草", latin: "Chrysopogon zizanioides", drops: 1, ratio: "5%", effect: "深层定锚，维持思维耐力", element: "土" }
      ],
      carrierOil: "东方野生山茶花籽油 (Camellia Seed Oil)",
      totalDrops: 20,
      totalVolume: "10ml (3% 浓度随身油)"
    },
    molecularAnalysis: [
      { compound: "柠檬烯 (d-Limonene)", percentage: "32.0%", pathway: "大脑前额叶多巴胺通路激活", benefit: "提升专注力与认知敏锐度，消除脑雾昏沉" },
      { compound: "茶多酚微分子 (Catechins)", percentage: "18.5%", pathway: "自主神经张力平衡", benefit: "平抑案头高压压力感，保持从容工作心境" }
    ],
    aromatherapyAdvice: {
      palmInhalation: "工作疲惫时，滴 1 滴于掌心搓热深呼吸 3 次，立感灵台清明。",
      diffuser: "办公或书房环境，每 20 平米滴入 5 滴扩香。",
      pulsePoint: "点涂于太阳穴及耳后。",
      acupoints: [
        { name: "百会穴 (督脉)", location: "头顶正中线与两耳尖连线交点", effect: "升阳举陷，清利头目，醒脑开窍" },
        { name: "太冲穴 (足厥阴肝经)", location: "足背第一、二跖骨结合部之前凹陷中", effect: "平肝息风，清热利湿，通络止痛" }
      ]
    },
    safetyNotes: "已采用脱光敏佛手柑，日间涂抹无需担心日光反黑。",
    createdAt: "2026-08-17T14:30:00Z",
    isFavorite: false
  },
  {
    id: "rx_curated_03",
    rxCode: "UNIO-2026-RX6180",
    title: "《月华油 · 沉香安神方》",
    poeticSub: "海南沉香与绿乳香 · 经络通达引气归元",
    concept: "结合海南野生沉香与阿曼绝壁绿乳香，两千年东方焚香智慧的现代神经科学重构。古朴庄严，如夜月悬空，万虑皆空。",
    seasonTerm: "大暑 / 处暑 / 冬至",
    fiveElement: "水木相生",
    synergyScore: 99,
    olfactoryPyramid: {
      topNotes: [
        { name: "阿曼绿乳香", latin: "Boswellia sacra", drops: 5, ratio: "25%", effect: "加深呼吸节律，通达灵性直觉", element: "金" },
        { name: "苦橙叶", latin: "Citrus aurantium", drops: 3, ratio: "15%", effect: "调和气机，疏通胸闷", element: "木" }
      ],
      middleNotes: [
        { name: "保加利亚玫瑰", latin: "Rosa damascena", drops: 3, ratio: "15%", effect: "温通血脉，温柔疗愈", element: "火" },
        { name: "罗马洋甘菊", latin: "Chamaemelum nobile", drops: 3, ratio: "15%", effect: "抗痉挛镇痛，舒缓情绪紧缩", element: "水" }
      ],
      baseNotes: [
        { name: "海南沉香", latin: "Aquilaria sinensis", drops: 3, ratio: "15%", effect: "温肾纳气，定神引气归元", element: "木" },
        { name: "海地岩兰草", latin: "Chrysopogon zizanioides", drops: 3, ratio: "15%", effect: "沉静抓地，深层松弛", element: "土" }
      ],
      carrierOil: "有机金黄荷荷巴油 (Golden Jojoba)",
      totalDrops: 20,
      totalVolume: "10ml (3% 浓度极境油)"
    },
    molecularAnalysis: [
      { compound: "沉香螺醇 (Agarospirol)", percentage: "24.5%", pathway: "中枢神经系统抑制性递质调控", benefit: "阻断焦虑过度兴奋传导，带来深度安宁感" },
      { compound: "α-蒎烯 (alpha-Pinene)", percentage: "35.2%", pathway: "支气管支架平滑肌解痉", benefit: "显著拓宽胸腔换气量，深化冥想吸呼循环" }
    ],
    aromatherapyAdvice: {
      palmInhalation: "冥想或睡前点涂于眉心印堂穴，静坐吸嗅 10 分钟。",
      diffuser: "静室禅修或睡前扩香，滴入 4~5 滴。",
      pulsePoint: "点涂于任脉膻中穴与神阙穴周围。",
      acupoints: [
        { name: "膻中穴 (任脉)", location: "胸部正中线上，平第四肋间，两乳头连线中点", effect: "宽胸理气，活血通络，降逆止呃，化解心结" },
        { name: "神门穴 (手少阴心经)", location: "腕部腕掌侧横纹尺侧端，尺侧腕屈肌腱桡侧凹陷处", effect: "补益心气，安神定志，缓解神经官能衰弱" }
      ]
    },
    safetyNotes: "温通经络，孕早期女性慎用。",
    createdAt: "2026-08-16T21:00:00Z",
    isFavorite: true
  }
];

// ===================== 全 24 节气详实芳香与中医经络养生图谱 =====================
export const SOLAR_TERMS_DETAILED_CALENDAR: SolarTermDetail[] = [
  // --- 春季 (木 · 肝胆 · 生发) ---
  {
    id: "term_01",
    name: "立春",
    season: "春",
    element: "木",
    dateRange: "2月3日 - 2月5日",
    phenology: "一候东风解冻，二候蛰虫始振，三候鱼陟负冰",
    climateFeature: "阳气初萌，乍暖还寒，气机自下而上萌发",
    vulnerableOrgan: "肝经郁结、气血不和",
    wellnessPrinciple: "借香引气，疏肝升阳，戒郁怒以养肝气",
    recommendedAroma: "佛手柑 · 苦橙叶 · 迷迭香",
    recommendedOils: ["卡拉布里亚无光敏佛手柑", "马鞭草酮迷迭香", "摩洛哥高定橙花"],
    recommendedApparatus: "「定风波」复古黄铜双头滚珠棒",
    acupointRitual: {
      name: "太冲穴 (足厥阴肝经)",
      location: "足背侧第一、二跖骨结合部之前凹陷处",
      effect: "疏肝理气，调畅气机，平熄肝阳",
      guide: "滚珠蘸取佛手柑随身油，顺经络向下推按太冲穴 36 次"
    },
    poeticVerse: "东风带雨逐西风，大地阳和暖气生。"
  },
  {
    id: "term_02",
    name: "雨水",
    season: "春",
    element: "木",
    dateRange: "2月18日 - 2月20日",
    phenology: "一候獭祭鱼，二候鸿雁来，三候草木萌动",
    climateFeature: "降雨渐增，湿冷交加，湿邪最易困阻中焦脾土",
    vulnerableOrgan: "脾胃阳气被困、脘腹胀满",
    wellnessPrinciple: "省酸增甘以养脾，芳香化湿以通达",
    recommendedAroma: "甜橙 · 罗马洋甘菊 · 广藿香",
    recommendedOils: ["西西里阳光甜橙", "英国高地罗马洋甘菊", "印尼黑广藿香"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "足三里 (足阳明胃经)",
      location: "犊鼻穴下3寸，胫骨前嵴外一横指处",
      effect: "燥化脾湿，生发胃气，培补后天之本",
      guide: "佩戴青玉香佩，掌心温热甜橙调和油按揉双侧足三里"
    },
    poeticVerse: "天街小雨润如酥，草色遥看近却无。"
  },
  {
    id: "term_03",
    name: "惊蛰",
    season: "春",
    element: "木",
    dateRange: "3月5日 - 3月7日",
    phenology: "一候桃始华，二候仓庚鸣，三候鹰化为鸠",
    climateFeature: "春雷乍动，万物苏醒，人体代谢与神经突触加速",
    vulnerableOrgan: "肝火上浮、目赤头胀、春困",
    wellnessPrinciple: "清利头目，宣通百脉，振奋清阳",
    recommendedAroma: "欧薄荷 · 迷迭香 · 佛手柑",
    recommendedOils: ["欧薄荷", "马鞭草酮迷迭香", "卡拉布里亚无光敏佛手柑"],
    recommendedApparatus: "「定风波」复古黄铜双头滚珠棒",
    acupointRitual: {
      name: "风池穴 (足少阳胆经)",
      location: "项部枕骨之下，胸锁乳突肌与斜方肌上端之间凹陷中",
      effect: "祛风解表，清头明目，通利官窍",
      guide: "黄铜滚珠点按风池穴，深深吸入清凉薄荷透气之感"
    },
    poeticVerse: "微雨众卉新，一雷惊蛰始。"
  },
  {
    id: "term_04",
    name: "春分",
    season: "春",
    element: "木",
    dateRange: "3月20日 - 3月22日",
    phenology: "一候玄鸟至，二候雷乃发声，三候始电",
    climateFeature: "昼夜均分，寒暑平衡，天地阴阳至和之时",
    vulnerableOrgan: "情绪波动、气血失衡",
    wellnessPrinciple: "调和阴阳气血，滋润肝血，安养心神",
    recommendedAroma: "保加利亚大马士革玫瑰 · 摩洛哥橙花",
    recommendedOils: ["保加利亚大马士革玫瑰", "摩洛哥高定橙花", "迈索尔老山檀香"],
    recommendedApparatus: "「栖云」黑胡桃木超声波冷雾仪",
    acupointRitual: {
      name: "期门穴 (足厥阴肝经募穴)",
      location: "胸部乳头直下，第六肋间隙中",
      effect: "疏肝健脾，和胃降逆，调节自主神经",
      guide: "玫瑰花香冷雾扩香，双手掌心温敷双侧期门穴"
    },
    poeticVerse: "日月阳阴两均天，玄鸟不辞归雁便。"
  },
  {
    id: "term_05",
    name: "清明",
    season: "春",
    element: "木",
    dateRange: "4月4日 - 4月6日",
    phenology: "一候桐始华，二候田鼠化为鴽，三候虹始见",
    climateFeature: "气清景明，万物吐故纳新，木气极盛",
    vulnerableOrgan: "肝阳上亢、思虑伤神",
    wellnessPrinciple: "清虚内照，澄澈身心，吐故纳新",
    recommendedAroma: "东方安吉白茶 · 尤加利 · 冷杉",
    recommendedOils: ["东方安吉白茶原精", "澳洲蓝胶尤加利", "西伯利亚冷杉"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "印堂穴 (督脉)",
      location: "两眉头连线中点",
      effect: "清头明目，通鼻开窍，安神定惊",
      guide: "以白茶香佩贴近呼吸，食指轻按印堂穴静坐闭目 3 分钟"
    },
    poeticVerse: "清明时节雨纷纷，路上行人欲断魂。"
  },
  {
    id: "term_06",
    name: "谷雨",
    season: "春",
    element: "木",
    dateRange: "4月19日 - 4月21日",
    phenology: "一候萍始生，二候鸣鸠拂其羽，三候戴胜降于桑",
    climateFeature: "春季最后节气，雨生百谷，湿热与暮春之气交织",
    vulnerableOrgan: "湿热内蕴、脾胃滞重",
    wellnessPrinciple: "健脾祛湿，芳香醒中，平稳过渡至初夏",
    recommendedAroma: "印尼黑广藿香 · 佛手柑 · 快乐鼠尾草",
    recommendedOils: ["印尼黑广藿香", "卡拉布里亚无光敏佛手柑", "高山快乐鼠尾草"],
    recommendedApparatus: "「定风波」复古黄铜双头滚珠棒",
    acupointRitual: {
      name: "阴陵泉 (足太阴脾经)",
      location: "小腿内侧，胫骨内侧髁下缘与胫骨内侧缘之间凹陷中",
      effect: "清利湿热，健脾理气，益肾通淋",
      guide: "滚珠棒拨按阴陵泉，促进全身下肢水湿代谢"
    },
    poeticVerse: "谷雨收寒，茶烟袅细，晴丝弄晴。"
  },

  // --- 夏季 (火 · 心小肠 · 繁茂宣泄) ---
  {
    id: "term_07",
    name: "立夏",
    season: "夏",
    element: "火",
    dateRange: "5月5日 - 5月7日",
    phenology: "一候蝼蝈鸣，二候蚯蚓出，三候王瓜生",
    climateFeature: "天地始交，万物并秀，暑阳之气升腾",
    vulnerableOrgan: "心火偏亢、烦躁失眠、盗汗",
    wellnessPrinciple: "清心泻火，安神养阴，静定心气",
    recommendedAroma: "普罗旺斯高地真薰衣草 · 摩洛哥橙花",
    recommendedOils: ["普罗旺斯高地真薰衣草", "摩洛哥高定橙花", "迈索尔老山檀香"],
    recommendedApparatus: "「棲云」黑胡桃木超声波冷雾仪",
    acupointRitual: {
      name: "神门穴 (手少阴心经)",
      location: "腕掌侧横纹尺侧端，尺侧腕屈肌腱桡侧凹陷处",
      effect: "补益心气，安神定志，调理心烦怔忡",
      guide: "睡前点涂薰衣草油于神门穴，轻柔揉按 36 次入眠"
    },
    poeticVerse: "绿树阴浓夏日长，楼台倒影入池塘。"
  },
  {
    id: "term_08",
    name: "小满",
    season: "夏",
    element: "火",
    dateRange: "5月20日 - 5月22日",
    phenology: "一候苦菜秀，二候靡草死，三候麦秋至",
    climateFeature: "江河渐满，暑热湿气并见，皮肤与神经易现躁动",
    vulnerableOrgan: "湿热蕴肤、神经焦灼",
    wellnessPrinciple: "生津止渴，清透解肌，防暑热郁结",
    recommendedAroma: "西伯利亚冷杉 · 甜橙 · 罗马洋甘菊",
    recommendedOils: ["西伯利亚冷杉", "西西里阳光甜橙", "英国高地罗马洋甘菊"],
    recommendedApparatus: "「千里江山」青瓷车载扩香夹",
    acupointRitual: {
      name: "曲池穴 (手阳明大肠经)",
      location: "尺泽与肱骨外上髁连线中点，屈肘成直角处",
      effect: "清热解表，和营落热，调和气血",
      guide: "点涂冷杉与洋甘菊调和油，按揉曲池穴清解体表热邪"
    },
    poeticVerse: "夜莺也爱新凉好，飞过青山影里啼。"
  },
  {
    id: "term_09",
    name: "芒种",
    season: "夏",
    element: "火",
    dateRange: "6月5日 - 6月7日",
    phenology: "一候螳螂生，二候鵙始鸣，三候反舌无声",
    climateFeature: "梅雨连绵，湿热蒸腾，身心极易疲惫黏滞",
    vulnerableOrgan: "中气下陷、心烦困倦",
    wellnessPrinciple: "清热醒脾，镇静敛神，排除体内水湿浊气",
    recommendedAroma: "迈索尔老山檀香 · 海地岩兰草 · 佛手柑",
    recommendedOils: ["迈索尔老山檀香", "海地极品岩兰草", "卡拉布里亚无光敏佛手柑"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "中脘穴 (任脉)",
      location: "脐中上4寸，前正中线上",
      effect: "健脾和胃，化湿降逆，调和中焦",
      guide: "掌心滴 2 滴檀香岩兰草油搓热，顺时针摩腹中脘穴"
    },
    poeticVerse: "芒种忙忙割，栽稻管家活。"
  },
  {
    id: "term_10",
    name: "夏至",
    season: "夏",
    element: "火",
    dateRange: "6月21日 - 6月22日",
    phenology: "一候鹿角解，二候蝉始鸣，三候半夏生",
    climateFeature: "日北至，阳极之至，一阴初生，阴阳转换枢纽",
    vulnerableOrgan: "心肾不交、浮阳外越、难眠",
    wellnessPrinciple: "引阳入阴，交通心肾，绝不可大汗伤阳",
    recommendedAroma: "海南沉香 · 阿曼绿乳香 · 老山檀香",
    recommendedOils: ["海南沉香", "阿曼皇家绿乳香", "迈索尔老山檀香"],
    recommendedApparatus: "「棲云」黑胡桃木超声波冷雾仪",
    acupointRitual: {
      name: "涌泉穴 (足少阴肾经)",
      location: "足底部，卷足时足前部凹陷处，约第2、3趾缝纹头端与足跟连线的前1/3与后2/3交点上",
      effect: "滋阴降火，引火归元，交通心肾",
      guide: "睡前以沉香油涂抹双足涌泉穴，搓热至脚心发暖"
    },
    poeticVerse: "绿筠尚含粉，圆荷始散芳。"
  },

  // --- 长夏 (土 · 脾胃 · 化湿固本) ---
  {
    id: "term_11",
    name: "小暑",
    season: "长夏",
    element: "土",
    dateRange: "7月6日 - 7月8日",
    phenology: "一候温风至，二候蟋蟀居宇，三候鹰始鸷",
    climateFeature: "温风扑面，溽暑蒸腾，出汗过多损耗气阴",
    vulnerableOrgan: "暑气伤津、心烦气短",
    wellnessPrinciple: "清暑益气，生津止渴，心静自然清凉",
    recommendedAroma: "印尼黑广藿香 · 欧薄荷 · 甜橙",
    recommendedOils: ["印尼黑广藿香", "欧薄荷", "西西里阳光甜橙"],
    recommendedApparatus: "「定风波」复古黄铜双头滚珠棒",
    acupointRitual: {
      name: "劳宫穴 (手厥阴心包经)",
      location: "掌心第2、3掌骨之间偏于第3掌骨，握拳屈指时中指尖处",
      effect: "清心泄热，开窍醒神，除烦止渴",
      guide: "黄铜滚珠点涂薄荷广藿油于劳宫穴，合掌深嗅"
    },
    poeticVerse: "倏忽温风至，因循小暑来。"
  },
  {
    id: "term_12",
    name: "大暑",
    season: "长夏",
    element: "土",
    dateRange: "7月22日 - 7月24日",
    phenology: "一候腐草为萤，二候土润溽暑，三候大雨时行",
    climateFeature: "一年中阳气最盛、湿热最重之时，中暑与湿阻高发",
    vulnerableOrgan: "脾胃困顿、食欲不振、中暑昏胀",
    wellnessPrinciple: "重镇化湿，芳香健运，静养元神",
    recommendedAroma: "迈索尔老山檀香 · 印尼黑广藿香 · 绿乳香",
    recommendedOils: ["迈索尔老山檀香", "印尼黑广藿香", "阿曼皇家绿乳香"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "水分穴 (任脉)",
      location: "脐中上1寸，前正中线上",
      effect: "通调水道，理气止痛，健脾化湿",
      guide: "随身佩戴青玉香佩，冷雾扩香驱散湿热黏腻"
    },
    poeticVerse: "赤日几时过，清风无处寻。"
  },

  // --- 秋季 (金 · 肺大肠 · 敛降润燥) ---
  {
    id: "term_13",
    name: "立秋",
    season: "秋",
    element: "金",
    dateRange: "8月7日 - 8月9日",
    phenology: "一候凉风至，二候白露生，三候寒蝉鸣",
    climateFeature: "阳气始收，凉风初至，秋燥渐生",
    vulnerableOrgan: "肺燥伤津、干咳无痰",
    wellnessPrinciple: "滋阴润燥，敛阳固表，收敛心神",
    recommendedAroma: "东方安吉白茶 · 卡拉布里亚佛手柑 · 橙花",
    recommendedOils: ["东方安吉白茶原精", "卡拉布里亚无光敏佛手柑", "摩洛哥高定橙花"],
    recommendedApparatus: "「棲云」黑胡桃木超声波冷雾仪",
    acupointRitual: {
      name: "列缺穴 (手太阴肺经)",
      location: "前臂桡侧缘，桡骨茎突上方，腕横纹上1.5寸",
      effect: "宣肺解表，通经活络，利咽平喘",
      guide: "白茶冷雾环绕中，双手虎口交叉点按列缺穴"
    },
    poeticVerse: "乳鸦啼散玉屏空，一枕新凉一扇风。"
  },
  {
    id: "term_14",
    name: "处暑",
    season: "秋",
    element: "金",
    dateRange: "8月22日 - 8月24日",
    phenology: "一候鹰乃祭鸟，二候天地始肃，三候禾乃登",
    climateFeature: "暑气至此而止，秋风渐劲，燥邪当令，神经易疲惫",
    vulnerableOrgan: "秋乏、咽干鼻燥、交感亢奋",
    wellnessPrinciple: "潜阳降火，宁神益气，顺应秋收之气",
    recommendedAroma: "西伯利亚冷杉 · 迈索尔老山檀香 · 玫瑰",
    recommendedOils: ["西伯利亚冷杉", "迈索尔老山檀香", "保加利亚大马士革玫瑰"],
    recommendedApparatus: "「定风波」复古黄铜双头滚珠棒",
    acupointRitual: {
      name: "迎香穴 (手阳明大肠经)",
      location: "鼻翼外缘中点旁，鼻唇沟中",
      effect: "宣通鼻窍，散风清热，润养呼吸道",
      guide: "黄铜滚珠蘸冷杉檀香油，自下而上轻推迎香穴至发热"
    },
    poeticVerse: "处暑满地黄，家家修廪仓。"
  },
  {
    id: "term_15",
    name: "白露",
    season: "秋",
    element: "金",
    dateRange: "9月7日 - 9月9日",
    phenology: "一候鸿雁来，二候玄鸟归，三候群鸟养羞",
    climateFeature: "夜寒露重，水汽凝结为白露，温差极大",
    vulnerableOrgan: "肺卫不固、呼吸道敏感、鼻炎",
    wellnessPrinciple: "温肺固表，润肺生津，防寒气直中经络",
    recommendedAroma: "阿曼皇家绿乳香 · 大西洋雪松 · 尤加利",
    recommendedOils: ["阿曼皇家绿乳香", "澳洲蓝胶尤加利", "西伯利亚冷杉"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "肺俞穴 (足太阳膀胱经)",
      location: "第3胸椎棘突下，旁开1.5寸",
      effect: "宣肺理气，平喘止咳，补益肺气",
      guide: "乳香雪松油涂抹后背肺俞穴，深呼吸 10 次"
    },
    poeticVerse: "兼葭苍苍，白露为霜。所谓伊人，在水一方。"
  },
  {
    id: "term_16",
    name: "秋分",
    season: "秋",
    element: "金",
    dateRange: "9月22日 - 9月24日",
    phenology: "一候雷始收声，二候蛰虫坯户，三候水始涸",
    climateFeature: "昼夜再次均分，雷声隐匿，燥气转为凉燥",
    vulnerableOrgan: "凉燥伤肺、秋悲忧郁",
    wellnessPrinciple: "平调阴阳，宁神解忧，防悲秋情绪蔓延",
    recommendedAroma: "大西洋雪松 · 摩洛哥橙花 · 玫瑰",
    recommendedOils: ["摩洛哥高定橙花", "保加利亚大马士革玫瑰", "迈索尔老山檀香"],
    recommendedApparatus: "「棲云」黑胡桃木超声波冷雾仪",
    acupointRitual: {
      name: "膻中穴 (任脉)",
      location: "前正中线上，平第4肋间，两乳头连线中点",
      effect: "宽胸理气，解郁和中，化解悲忧之气",
      guide: "掌心滴 2 滴橙花玫瑰油搓热，掌根轻柔安抚膻中穴"
    },
    poeticVerse: "漏钟仍夜浅，时节欲秋分。"
  },
  {
    id: "term_17",
    name: "寒露",
    season: "秋",
    element: "金",
    dateRange: "10月8日 - 10月9日",
    phenology: "一候鸿雁来宾，二候雀入大水为蛤，三候菊有黄华",
    climateFeature: "露气寒冷，将凝结成霜，秋凉转为深寒",
    vulnerableOrgan: "下肢受寒、腰膝酸冷、胃寒",
    wellnessPrinciple: "滋阴润燥，保暖脚踝，温通下元",
    recommendedAroma: "海南沉香 · 保加利亚玫瑰 · 肉桂皮",
    recommendedOils: ["海南沉香", "保加利亚大马士革玫瑰", "斯里兰卡极品肉桂皮"],
    recommendedApparatus: "「千里江山」青瓷车载扩香夹",
    acupointRitual: {
      name: "三阴交 (足太阴脾经)",
      location: "内踝尖上3寸，胫骨内侧缘后际",
      effect: "健脾益气，调补肝肾，温通下焦",
      guide: "以温热沉香玫瑰油点按三阴交穴，驱除下肢寒邪"
    },
    poeticVerse: "袅袅凉风动，凄凄寒露零。"
  },
  {
    id: "term_18",
    name: "霜降",
    season: "秋",
    element: "金",
    dateRange: "10月23日 - 10月24日",
    phenology: "一候豺乃祭兽，二候草木黄落，三候蛰虫咸俯",
    climateFeature: "秋季最后一个节气，气肃而凝，草木尽谢，初霜遍地",
    vulnerableOrgan: "脾胃受寒、关节痛、抵抗力下降",
    wellnessPrinciple: "固本培元，温脾暖胃，迎接严冬闭藏",
    recommendedAroma: "迈索尔老山檀香 · 也门野生红没药 · 沉香",
    recommendedOils: ["迈索尔老山檀香", "也门野生红没药", "海南沉香"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "关元穴 (任脉)",
      location: "脐中下3寸，前正中线上",
      effect: "培元固本，补益下焦，回阳固脱",
      guide: "檀香没药调和油温热后，顺时针摩按小腹关元穴"
    },
    poeticVerse: "霜降水返壑，风落山照胆。"
  },

  // --- 冬季 (水 · 肾膀胱 · 封藏闭蓄) ---
  {
    id: "term_19",
    name: "立冬",
    season: "冬",
    element: "水",
    dateRange: "11月7日 - 11月8日",
    phenology: "一候水始冰，二候地始冻，三候雉入大水为蜃",
    climateFeature: "水始成冰，万物收藏，阳气潜藏于地下与深部",
    vulnerableOrgan: "阳气外泄、肾气亏虚、四肢冰冷",
    wellnessPrinciple: "温阳补肾，藏精固元，避寒就温",
    recommendedAroma: "海南沉香 · 斯里兰卡肉桂皮 · 老山檀香",
    recommendedOils: ["海南沉香", "斯里兰卡极品肉桂皮", "迈索尔老山檀香"],
    recommendedApparatus: "「棲云」黑胡桃木超声波冷雾仪",
    acupointRitual: {
      name: "命门穴 (督脉)",
      location: "第二腰椎棘突下凹陷中，与肚脐相对",
      effect: "温补肾阳，强健腰膝，培补元气",
      guide: "沉香肉桂调和油涂抹后腰命门，双手搓热擦腰眼 50 次"
    },
    poeticVerse: "冻笔新诗懒写，寒炉美酒时温。"
  },
  {
    id: "term_20",
    name: "小雪",
    season: "冬",
    element: "水",
    dateRange: "11月22日 - 11月23日",
    phenology: "一候虹藏不见，二候天气上升地气下降，三候闭塞而成冬",
    climateFeature: "气温骤降，北方初雪，天地闭塞，阳气深敛",
    vulnerableOrgan: "气血循环凝滞、情绪抑郁",
    wellnessPrinciple: "静心敛阳，温通微循环，防心脑血管受寒",
    recommendedAroma: "海地极品岩兰草 · 冷杉 · 佛手柑",
    recommendedOils: ["海地极品岩兰草", "西伯利亚冷杉", "卡拉布里亚无光敏佛手柑"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "心俞穴 (足太阳膀胱经)",
      location: "第5胸椎棘突下，旁开1.5寸",
      effect: "宽胸理气，宁心安神，通畅心脉",
      guide: "佩戴岩兰草香佩于胸前，体温自然散发大地安抚能量"
    },
    poeticVerse: "莫怪虹无影，如今小雪时。"
  },
  {
    id: "term_21",
    name: "大雪",
    season: "冬",
    element: "水",
    dateRange: "12月6日 - 12月8日",
    phenology: "一候鹖鴠不鸣，二候虎始交，三候荔挺出",
    climateFeature: "至此而雪盛也，千里冰封，阴寒极盛",
    vulnerableOrgan: "寒凝血瘀、关节冷痛、深层疲倦",
    wellnessPrinciple: "大补元气，深层封藏，不可盲目扰动筋骨阳气",
    recommendedAroma: "迈索尔老山檀香 · 阿曼绿乳香 · 沉香",
    recommendedOils: ["迈索尔老山檀香", "阿曼皇家绿乳香", "海南沉香"],
    recommendedApparatus: "「棲云」黑胡桃木超声波冷雾仪",
    acupointRitual: {
      name: "照海穴 (足少阴肾经)",
      location: "内踝尖正下方凹陷中",
      effect: "滋阴清热，调神利咽，补益肾精",
      guide: "点涂檀香乳香油于照海穴，静坐吸嗅冷雾香气"
    },
    poeticVerse: "大雪江南见未曾，今年征料过严凝。"
  },
  {
    id: "term_22",
    name: "冬至",
    season: "冬",
    element: "水",
    dateRange: "12月21日 - 12月23日",
    phenology: "一候蚯蚓结，二候麋角解，三候水泉动",
    climateFeature: "日南至，夜最长，一阳初生，一年中最重要的阴阳转换节气",
    vulnerableOrgan: "元阳初生脆弱、不可受惊损扰",
    wellnessPrinciple: "静养一阳之气，安神定魂，大静方能生大动",
    recommendedAroma: "海南沉香 · 迈索尔老山檀香 · 当归根",
    recommendedOils: ["海南沉香", "迈索尔老山檀香", "岷县野生当归根原精"],
    recommendedApparatus: "「定风波」复古黄铜双头滚珠棒",
    acupointRitual: {
      name: "神阙穴 (肚脐 / 任脉)",
      location: "脐中部",
      effect: "温通元阳，复苏固脱，和胃理肠",
      guide: "沉香油滴于掌心搓至极热，覆盖神阙穴静守呼吸 10 分钟"
    },
    poeticVerse: "邯郸驿里逢冬至，抱膝灯前影伴身。"
  },
  {
    id: "term_23",
    name: "小寒",
    season: "冬",
    element: "水",
    dateRange: "1月5日 - 1月7日",
    phenology: "一候雁北乡，二候鹊始巢，三候雉始雊",
    climateFeature: "冷气积久而为寒，往往是一年中气温最低的严寒阶段",
    vulnerableOrgan: "寒凝血瘀、关节剧痛、冻疮",
    wellnessPrinciple: "温通经络，驱散顽固深寒，固护正气",
    recommendedAroma: "斯里兰卡肉桂皮 · 沉香 · 也门没药",
    recommendedOils: ["斯里兰卡极品肉桂皮", "海南沉香", "也门野生红没药"],
    recommendedApparatus: "「千里江山」青瓷车载扩香夹",
    acupointRitual: {
      name: "阳池穴 (手少阳三焦经)",
      location: "腕背横纹中，指总伸肌腱尺侧缘凹陷中",
      effect: "生发阳气，沟通表里，温暖全身四肢末梢",
      guide: "肉桂沉香调和油点涂双手阳池穴，摩擦生热驱散手脚冰凉"
    },
    poeticVerse: "小寒连大吕，欢鹊垒新巢。"
  },
  {
    id: "term_24",
    name: "大寒",
    season: "冬",
    element: "水",
    dateRange: "1月20日 - 1月21日",
    phenology: "一候鸡始乳，二候征鸟厉疾，三候水泽腹坚",
    climateFeature: "寒气之逆极，也是冬春交替、孕育新生生机的序曲",
    vulnerableOrgan: "冬春交替风寒、抵抗力临界点",
    wellnessPrinciple: "温散残寒，迎候春阳，蓄势待发",
    recommendedAroma: "西伯利亚冷杉 · 卡拉布里亚佛手柑 · 沉香",
    recommendedOils: ["西伯利亚冷杉", "卡拉布里亚无光敏佛手柑", "海南沉香"],
    recommendedApparatus: "「空山」和田青玉镂空香佩",
    acupointRitual: {
      name: "大椎穴 (督脉)",
      location: "第7颈椎棘突下凹陷中",
      effect: "益气壮阳，散寒通经，提升全身抗病卫气",
      guide: "温热精油擦拭大椎穴至皮肤微红发热，迎接立春到来"
    },
    poeticVerse: "大寒宜近火，无事莫开门。"
  }
];

// Compatibility export
export const SOLAR_TERMS_CALENDAR = SOLAR_TERMS_DETAILED_CALENDAR.map(t => ({
  name: t.name,
  element: t.element,
  aroma: t.recommendedAroma,
  desc: t.wellnessPrinciple
}));

export const UNIO_APPARATUS_LIST: ScentApparatus[] = [
  {
    id: "app_wearable_jade",
    name: "「空山」和田青玉镂空香佩",
    category: "wearable",
    categoryName: "随身香佩",
    material: "天然新疆和田青玉 · 手工打磨铜芯",
    usageScenario: "日常佩戴 / 锁骨胸前",
    desc: "将精油滴于内置天然火山浮石芯片，体温自然温润微扩香，全天环绕私密气味护盾。",
    highlight: "体温微热发散 · 私密不扰人"
  },
  {
    id: "app_roller_brass",
    name: "「定风波」复古黄铜双头滚珠棒",
    category: "roller",
    categoryName: "经络滚珠",
    material: "纯黄铜一体切削 · 316医用级钢珠",
    usageScenario: "办公间歇 / 穴位点涂",
    desc: "一端为清凉点涂滚珠，另一端为圆弧经络拨筋头，点按太阳穴、风池穴与印堂穴极佳。",
    highlight: "点涂+刮痧拨筋双效"
  },
  {
    id: "app_diffuser_wood",
    name: "「栖云」黑胡桃木超声波冷雾仪",
    category: "diffuser",
    categoryName: "空间冷雾",
    material: "北美FAS级黑胡桃木 · 医用级耐精油雾化仓",
    usageScenario: "书房 / 茶室 / 卧室",
    desc: "2.4MHz 超声波纳米级低温雾化，不破坏精油热敏活性分子，伴随432Hz微光呼吸灯。",
    highlight: "纳米冷雾 · 保护活性分子"
  },
  {
    id: "app_car_ceramic",
    name: "「千里江山」青瓷车载扩香夹",
    category: "car_accessory",
    categoryName: "车载香气",
    material: "龙泉青瓷素烧微孔件 · 铝合金磁吸夹",
    usageScenario: "汽车出风口 / 差旅",
    desc: "自然风流经微孔陶瓷呼吸发散，瞬间化解长途驾驶疲劳与烦闷心火。",
    highlight: "出风口扩散 · 行车醒神"
  },
  {
    id: "app_palm_elixir",
    name: "「寸心」手作黑陶点滴精萃皿",
    category: "palm_tool",
    categoryName: "掌心吸嗅",
    material: "宜兴原矿紫砂黑陶 · 原生软木塞",
    usageScenario: "晨起醒神 / 睡前冥想",
    desc: "精准微控1滴出油，掌心搓热产生远红外温润，释放精油全部高沸点香气分子。",
    highlight: "微量控滴 · 仪式感拉满"
  }
];

export const VIBE_DESIRE_LIST: VibeDesire[] = [
  {
    id: "vibe_clarity",
    label: "清醒 · 破除混沌",
    sub: "扫清案头脑雾昏沉，瞬间聚焦注意力与决断力",
    element: "木",
    recommendedNotes: ["卡拉布里亚无光敏佛手柑", "安吉白茶原精", "马鞭草酮迷迭香"],
    recommendedApparatus: "app_roller_brass",
    color: "#2E5339",
    tcmBenefit: "升发清阳，宣通百脉，醒脑开窍"
  },
  {
    id: "vibe_relaxation",
    label: "放松 · 卸下紧绷",
    sub: "释放肩颈与胸口紧缩感，让呼吸重归悠长平稳",
    element: "火",
    recommendedNotes: ["普罗旺斯高地真薰衣草", "摩洛哥高定橙花", "西伯利亚冷杉"],
    recommendedApparatus: "app_diffuser_wood",
    color: "#6B3B3B",
    tcmBenefit: "清解心火，缓急止痛，解痉定惊"
  },
  {
    id: "vibe_grounding",
    label: "安定 · 沉静扎根",
    sub: "对抗心慌焦虑，如同踏在古树深泥之上",
    element: "土",
    recommendedNotes: ["迈索尔老山檀香", "海地极品岩兰草", "印尼黑广藿香"],
    recommendedApparatus: "app_wearable_jade",
    color: "#7A6248",
    tcmBenefit: "健运脾胃，重镇潜阳，引气归元"
  },
  {
    id: "vibe_warmth",
    label: "温热 · 驱寒抚慰",
    sub: "胃腹冰凉、身心虚耗时，注入阳光般的暖意",
    element: "金",
    recommendedNotes: ["阿曼皇家绿乳香", "保加利亚大马士革玫瑰", "海南沉香"],
    recommendedApparatus: "app_palm_elixir",
    color: "#A84C2A",
    tcmBenefit: "温通经脉，宣肺固表，补益卫气"
  },
  {
    id: "vibe_purity",
    label: "清净 · 禅意空灵",
    sub: "切断外界纷杂干扰，在静谧中找回中心",
    element: "水",
    recommendedNotes: ["海南沉香", "东方安吉白茶原精", "西伯利亚冷杉"],
    recommendedApparatus: "app_diffuser_wood",
    color: "#2C4356",
    tcmBenefit: "纳气归肾，清虚明澈，敛阴定魄"
  },
  {
    id: "vibe_soothing_liver",
    label: "解郁 · 畅快通达",
    sub: "胸口烦闷憋屈、叹气频频时，一气周流",
    element: "木",
    recommendedNotes: ["卡拉布里亚无光敏佛手柑", "保加利亚大马士革玫瑰", "英国高地罗马洋甘菊"],
    recommendedApparatus: "app_roller_brass",
    color: "#3D6B52",
    tcmBenefit: "疏肝理气，调畅气机，化解郁结"
  },
  {
    id: "vibe_sleep",
    label: "入梦 · 深层修复",
    sub: "思绪翻涌难以入眠，让身心自然下沉进入深睡",
    element: "水",
    recommendedNotes: ["海南沉香", "普罗旺斯高地真薰衣草", "海地极品岩兰草"],
    recommendedApparatus: "app_palm_elixir",
    color: "#1B2A38",
    tcmBenefit: "交泰心肾，安魂定魄，引阳入阴"
  }
];
