/**
 * UNIO Botanical Search Engine with Chinese Pinyin, Pinyin Acronyms, English Common Names, and Latin Binomial Fuzzy Search
 */

// Unique Character Mapping string table: "char:pinyin,char:pinyin,..."
const PINYIN_RAW_DATA = `
柠:ning,檬:meng,草:cao,桉:an,香:xiang,桃:tao,木:mu,薰:xun,衣:yi,檀:tan,沉:chen,乳:ru,
没:mo,药:yao,苦:ku,橙:cheng,叶:ye,花:hua,甜:tian,佛:fo,手:shou,柑:gan,红:hong,桔:ju,
橘:ju,西:xi,柚:you,大:da,马:ma,士:shi,革:ge,玫:mei,瑰:gui,洋:yang,甘:gan,菊:ju,
罗:luo,德:de,国:guo,薄:bo,荷:he,绿:lv,广:guang,藿:huo,迷:mi,迭:die,快:kuai,乐:le,
鼠:shu,尾:wei,依:yi,兰:lan,茶:cha,树:shu,尤:you,加:jia,利:li,胶:jiao,史:shi,密:mi,
斯:si,丝:si,柏:bai,雪:xue,松:song,雅:ya,岩:yan,冷:leng,杉:shan,黑:hei,胡:hu,椒:jiao,
生:sheng,姜:jiang,肉:rou,桂:gui,豆:dou,蔻:kou,丁:ding,卡:ka,拉:la,脂:zhi,白:bai,千:qian,
层:ceng,杜:du,浆:jiang,果:guo,安:an,息:xi,万:wan,寿:shou,金:jin,盏:zhan,永:yong,久:jiu,
蜡:la,海:hai,南:nan,琼:qiong,崖:ya,印:yin,度:du,迈:mai,索:suo,尔:er,东:dong,至:zhi,
尊:zun,保:bao,亚:ya,土:tu,耳:er,其:qi,格:ge,摩:mo,洛:luo,哥:ge,突:tu,尼:ni,黄:huang,
玉:yu,栀:zhi,子:zi,晚:wan,茉:mo,莉:li,小:xiao,阿:a,伯:bo,紫:zi,鸢:yuan,根:gen,水:shui,
仙:xian,风:feng,信:xin,菩:pu,提:ti,银:yin,毫:hao,针:zhen,武:wu,夷:yi,袍:pao,正:zheng,
山:shan,种:zhong,狮:shi,峰:feng,龙:long,井:jing,溪:xi,铁:tie,观:guan,音:yin,洞:dong,庭:ting,
碧:bi,螺:luo,春:chun,滇:dian,普:pu,洱:er,熟:shu,高:gao,乌:wu,福:fu,鼎:ding,老:lao,
陈:chen,年:nian,六:liu,堡:bao,天:tian,目:mu,笋:sun,干:gan,君:jun,蒙:meng,顶:ding,芽:ya,
祁:qi,门:men,太:tai,平:ping,猴:hou,魁:kui,阳:yang,毛:mao,尖:jian,苍:cang,术:zhu,菖:chang,
蒲:pu,佩:pei,辛:xin,夷:yi,砂:sha,仁:ren,芷:zhi,防:fang,荆:jing,芥:jie,羌:qiang,活:huo,
独:du,细:xi,藁:gao,本:ben,柴:chai,胡:hu,升:sheng,麻:ma,葛:ge,牛:niu,蒡:bang,蝉:chan,
蜕:tui,桑:sang,蔓:man,淡:dan,豉:chi,浮:fu,萍:ping,贼:zei,薷:ru,苏:su,葱:cong,降:jiang,
合:he,樟:zhang,脑:nao,冰:bing,片:pian,麝:she,蟾:chan,酥:su,桃:tao,益:yi,母:mu,泽:ze,
膝:xi,川:chuan,芎:xiong,延:yan,郁:yu,莪:e,三:san,七:qi,茜:qian,蓟:ji,地:di,榆:yu,
槐:huai,茅:mao,侧:ce,鹤:he,珠:zhu,艾:ai,炮:pao,灶:zao,心:xin,当:dang,归:gui,何:he,
首:shou,芍:shao,胶:jiao,眼:yan,人:ren,参:shen,党:dang,芪:qi,蜂:feng,蜜:mi,鹿:lu,
茸:rong,河:he,车:che,淫:yin,羊:yang,巴:ba,戟:ji,补:bu,骨:gu,智:zhi,苁:cong,蓉:rong,
锁:suo,苑:yuan,菟:tu,仲:zhong,续:xu,断:duan,狗:gou,脊:ji,碎:sui,冬:dong,虫:chong,
夏:xia,蛤:ge,蚧:jie,核:he,杏:xing,百:bai,冬:dong,花:hua,款:kuan,前:qian,枇:pi,杷:pa,
桔:jie,梗:geng,竹:zhu,茹:ru,海:hai,藻:zao,昆:kun,布:bu,贝:bei,母:mu,礞:meng,石:shi,
浮:fu,石:shi,海:hai,浮:fu,胆:dan,南:nan,星:xing,半:ban,夏:xia,天:tian,南:nan,旋:xuan,
覆:fu,白:bai,前:qian,马:ma,钱:qian,番:fan,木:mu,鳖:bie,常:chang,山:shan,瓜:gua,蒂:di
`;

const PINYIN_DICT: Record<string, string> = {};
PINYIN_RAW_DATA.split(/[\n,]/).forEach(item => {
  const parts = item.trim().split(":");
  if (parts.length === 2 && parts[0] && parts[1]) {
    PINYIN_DICT[parts[0]] = parts[1];
  }
});

// Common English Roots to Chinese / Latin Keywords
const COMMON_ROOT_SYNONYMS: { roots: string[]; targets: string[] }[] = [
  { roots: ["sandal", "sandalwood", "santalum", "tanxiang", "tx"], targets: ["檀香", "santalum"] },
  { roots: ["lavender", "lavandula", "xunyicao", "xyc", "xxy"], targets: ["薰衣草", "lavandula"] },
  { roots: ["lemon", "ningmeng", "nm", "limon"], targets: ["柠檬", "citrus limon"] },
  { roots: ["lemongrass", "ningmengcao", "nmc"], targets: ["柠檬草", "cymbopogon"] },
  { roots: ["oud", "agarwood", "aquilaria", "chenxiang", "cx"], targets: ["沉香", "aquilaria"] },
  { roots: ["rose", "rosa", "meigui", "dmsg"], targets: ["玫瑰", "rosa"] },
  { roots: ["frankincense", "olibanum", "boswellia", "ruxiang", "rx"], targets: ["乳香", "boswellia"] },
  { roots: ["myrrh", "commiphora", "moyao", "my"], targets: ["没药", "commiphora"] },
  { roots: ["tea tree", "teatree", "melaleuca", "chashu", "cs"], targets: ["茶树", "melaleuca"] },
  { roots: ["peppermint", "mint", "mentha", "bohe", "bh"], targets: ["薄荷", "mentha"] },
  { roots: ["bergamot", "foshougan", "fsg"], targets: ["佛手柑", "citrus bergamia"] },
  { roots: ["neroli", "orange blossom", "chenghua", "ch"], targets: ["橙花", "citrus aurantium flos"] },
  { roots: ["petitgrain", "kuchengye", "kcy"], targets: ["苦橙叶", "citrus aurantium"] },
  { roots: ["sweet orange", "orange", "tiancheng", "tc"], targets: ["甜橙", "citrus sinensis"] },
  { roots: ["grapefruit", "xiyou", "xy"], targets: ["西柚", "葡萄柚", "citrus paradisi"] },
  { roots: ["mandarin", "tangerine", "hongju", "hj"], targets: ["红桔", "红橘", "citrus reticulata"] },
  { roots: ["patchouli", "pogostemon", "guanghuoxiang", "ghx"], targets: ["广藿香", "pogostemon"] },
  { roots: ["rosemary", "rosmarinus", "midiexiang", "mdx"], targets: ["迷迭香", "rosmarinus"] },
  { roots: ["cedar", "cedarwood", "cedrus", "xuesong", "xs"], targets: ["雪松", "cedrus"] },
  { roots: ["cypress", "cupressus", "sibai", "sb"], targets: ["丝柏", "cupressus"] },
  { roots: ["vetiver", "chrysopogon", "vetiveria", "yanlancao", "ylc"], targets: ["岩兰草", "chrysopogon", "vetiveria"] },
  { roots: ["chamomile", "matricaria", "chamaemelum", "yangganju", "ygj"], targets: ["洋甘菊", "chamaemelum", "matricaria"] },
  { roots: ["clary sage", "sage", "salvia", "shuweicao", "swc"], targets: ["鼠尾草", "salvia"] },
  { roots: ["ylang", "cananga", "yilan", "ylyl"], targets: ["依兰", "cananga"] },
  { roots: ["eucalyptus", "youjiali", "yjl"], targets: ["尤加利", "桉", "eucalyptus"] },
  { roots: ["cinnamon", "cinnamomum", "rougui", "rg"], targets: ["肉桂", "cinnamomum"] },
  { roots: ["ginger", "zingiber", "shengjiang", "sj"], targets: ["生姜", "姜", "zingiber"] },
  { roots: ["cardamom", "elettaria", "doukou", "dk"], targets: ["豆蔻", "elettaria"] },
  { roots: ["clove", "syzygium", "dingxiang", "dx"], targets: ["丁香", "syzygium"] },
  { roots: ["helichrysum", "immortelle", "yongjiuhua", "yjh"], targets: ["永久花", "helichrysum"] },
  { roots: ["pine", "pinus", "chisong", "song"], targets: ["松", "pinus"] },
  { roots: ["fir", "abies", "lengshan", "shan"], targets: ["冷杉", "杉", "abies"] },
  { roots: ["juniper", "juniperus", "dushong", "ds"], targets: ["杜松", "juniperus"] },
  { roots: ["jasmine", "jasminum", "moli", "ml"], targets: ["茉莉", "jasminum"] },
  { roots: ["geranium", "pelargonium", "tianzhukui", "tzk"], targets: ["天竺葵", "pelargonium"] }
];

// English / Latin / Synonym common alias dictionaries for fast mapping
const BOTANICAL_COMMON_ALIASES: Record<string, string[]> = {
  "柠檬": ["lemon", "citrus limon", "ningmeng", "nm", "limon"],
  "柠檬草": ["lemongrass", "cymbopogon flexuosus", "ningmengcao", "nmc", "cymbopogon"],
  "柠檬桉": ["lemon eucalyptus", "eucalyptus citriodora", "corymbia citriodora", "ningmengan", "nma"],
  "柠檬香桃木": ["lemon myrtle", "backhousia citriodora", "ningmengxiangtaomu", "nmxtm"],
  "真正薰衣草": ["lavender", "true lavender", "lavandula angustifolia", "xunyicao", "xyc", "xxy"],
  "普罗旺斯高地薰衣草": ["highland lavender", "lavandula angustifolia", "gaodixunyicao", "gdxxy"],
  "老山檀香": ["sandalwood", "sandal", "mysore sandalwood", "santalum album", "tanxiang", "tx", "laoshantanxiang"],
  "迈索尔老山檀香": ["sandalwood", "sandal", "mysore sandalwood", "santalum album", "tanxiang", "tx"],
  "海南沉香": ["agarwood", "oud", "aquilaria sinensis", "chenxiang", "cx", "hainan"],
  "阿曼至尊绿乳香": ["frankincense", "green hojari", "boswellia sacra", "boswellia carterii", "ruxiang", "rx"],
  "索马里红没药": ["myrrh", "commiphora myrrha", "moyao", "my"],
  "大马士革玫瑰": ["damask rose", "rose", "rosa damascena", "damasige", "meigui", "dmsg"],
  "突尼斯苦橙花": ["neroli", "orange blossom", "citrus aurantium flos", "chenghua", "ch", "kch"],
  "苦橙叶": ["petitgrain", "citrus aurantium", "kuchengye", "kcy"],
  "甜橙": ["sweet orange", "citrus sinensis", "tiancheng", "tc"],
  "佛手柑": ["bergamot", "citrus bergamia", "foshougan", "fsg"],
  "红桔": ["mandarin", "tangerine", "citrus reticulata", "hongju", "hj"],
  "西柚": ["grapefruit", "citrus paradisi", "xiyou", "xy"],
  "罗马洋甘菊": ["roman chamomile", "chamaemelum nobile", "anthemis nobilis", "yangganju", "ygj", "lygj"],
  "德国洋甘菊": ["german chamomile", "matricaria chamomilla", "chamazulene", "dygj"],
  "欧薄荷": ["peppermint", "mentha piperita", "bohe", "obh", "bh"],
  "绿薄荷": ["spearmint", "mentha spicata", "lvbohe", "lbh"],
  "广藿香": ["patchouli", "pogostemon cablin", "guanghuoxiang", "ghx"],
  "迷迭香": ["rosemary", "rosmarinus officinalis", "salvia rosmarinus", "midiexiang", "mdx"],
  "快乐鼠尾草": ["clary sage", "salvia sclarea", "kuaileshuweicao", "klswc"],
  "完全依兰": ["ylang ylang", "cananga odorata", "yilan", "ylyl", "yl"],
  "澳洲茶树": ["tea tree", "melaleuca alternifolia", "chashu", "cs", "azcs"],
  "蓝胶尤加利": ["eucalyptus", "eucalyptus globulus", "youjiali", "yjl", "ljyjl"],
  "丝柏": ["cypress", "cupressus sempervirens", "sibai", "sb"],
  "大西洋雪松": ["cedarwood", "cedrus atlantica", "xuesong", "xs", "dxyds"],
  "岩兰草": ["vetiver", "vetiveria zizanioides", "chrysopogon zizanioides", "yanlancao", "ylc"],
  "欧洲赤松": ["scots pine", "pinus sylvestris", "chisong", "cs"],
  "黑胡椒": ["black pepper", "piper nigrum", "heihujiao", "hhj"],
  "生姜": ["ginger", "zingiber officinale", "shengjiang", "sj"],
  "肉桂": ["cinnamon", "cinnamomum verum", "cinnamomum zeylanicum", "rougui", "rg"],
  "豆蔻": ["cardamom", "elettaria cardamomum", "doukou", "dk"],
  "丁香": ["clove", "syzygium aromaticum", "dingxiang", "dx"],
  "永久花": ["helichrysum", "immortelle", "helichrysum italicum", "yongjiuhua", "yjh"]
};

/**
 * Convert a Chinese string into:
 * 1. Full Pinyin without spaces (e.g. "ningmeng")
 * 2. Full Pinyin with spaces (e.g. "ning meng")
 * 3. Initial acronym (e.g. "nm")
 */
export function getPinyinVariants(chineseStr: string): { full: string; spaced: string; initials: string } {
  let full = "";
  let spacedArr: string[] = [];
  let initials = "";

  for (let i = 0; i < chineseStr.length; i++) {
    const char = chineseStr[i];
    const py = PINYIN_DICT[char];
    if (py) {
      full += py;
      spacedArr.push(py);
      initials += py[0];
    } else {
      if (/[a-zA-Z0-9]/.test(char)) {
        full += char.toLowerCase();
        spacedArr.push(char.toLowerCase());
        initials += char.toLowerCase();
      }
    }
  }

  return {
    full,
    spaced: spacedArr.join(" "),
    initials
  };
}

export interface BotanicalSearchableItem {
  id: string;
  name: string;
  latin: string;
  element?: string;
  origin?: string;
  botanicalFamily?: string;
  botanicalGenus?: string;
  synonyms?: string[];
  chemicalFamily?: string;
  emotionalBenefit?: string;
  physicalBenefit?: string;
  subcategory?: string;
  scentFamily?: string;
  primaryMolecules?: { name: string; percentage?: string }[];
  timeOfDay?: string[];
  [key: string]: any;
}

/**
 * High-performance, multi-layered fuzzy botanical search algorithm.
 * Evaluates Chinese name, Pinyin (full & acronym), English common names, Latin binomials,
 * chemical constituents, terroir origin, and scent notes with relevance scoring.
 */
export function searchBotanicals<T extends BotanicalSearchableItem>(items: T[], rawQuery: string): T[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return items;

  // Normalized query without spaces or punctuation
  const cleanQuery = query.replace(/[\s\-_'’()（）·,.]/g, "");

  const scoredResults: { item: T; score: number }[] = [];

  // Check if query matches any common root synonyms
  const matchedTargetKeywords: string[] = [];
  for (const group of COMMON_ROOT_SYNONYMS) {
    if (group.roots.some(r => r === query || r === cleanQuery || query.startsWith(r) || r.startsWith(query))) {
      matchedTargetKeywords.push(...group.targets);
    }
  }

  for (const item of items) {
    let score = 0;
    const nameLower = (item.name || "").toLowerCase();
    const latinLower = (item.latin || "").toLowerCase();
    const originLower = (item.origin || "").toLowerCase();
    const familyLower = (item.botanicalFamily || "").toLowerCase();
    const genusLower = (item.botanicalGenus || "").toLowerCase();
    const chemLower = (item.chemicalFamily || "").toLowerCase();
    const subcatLower = (item.subcategory || "").toLowerCase();
    const scentFamilyLower = (item.scentFamily || "").toLowerCase();
    const emotionalLower = (item.emotionalBenefit || "").toLowerCase();
    const physicalLower = (item.physicalBenefit || "").toLowerCase();

    // 0. Common root synonyms expansion (e.g. "sandal" -> matches "檀香" or "santalum")
    if (matchedTargetKeywords.length > 0) {
      for (const target of matchedTargetKeywords) {
        const targetLower = target.toLowerCase();
        if (nameLower.includes(targetLower) || latinLower.includes(targetLower)) {
          score += 175;
          break;
        }
      }
    }

    // 1. Direct Chinese Name Matching (Highest Priority)
    if (nameLower === query || nameLower === cleanQuery) {
      score += 200;
    } else if (nameLower.startsWith(query) || nameLower.startsWith(cleanQuery)) {
      score += 150;
    } else if (nameLower.includes(query) || nameLower.includes(cleanQuery)) {
      score += 120;
    }

    // 2. Direct Latin Binomial Matching
    if (latinLower === query || latinLower === cleanQuery) {
      score += 180;
    } else if (latinLower.startsWith(query) || latinLower.startsWith(cleanQuery)) {
      score += 140;
    } else if (latinLower.includes(query) || latinLower.includes(cleanQuery)) {
      score += 110;
    }

    // 3. Pinyin Analysis (Full Pinyin, Spaced Pinyin, Pinyin Acronym/Initials)
    const { full: pinyinFull, spaced: pinyinSpaced, initials: pinyinInitials } = getPinyinVariants(item.name);

    if (pinyinFull && (pinyinFull === cleanQuery || pinyinFull.startsWith(cleanQuery))) {
      score += 130;
    } else if (pinyinFull && pinyinFull.includes(cleanQuery)) {
      score += 100;
    }

    if (pinyinSpaced && pinyinSpaced.includes(query)) {
      score += 110;
    }

    // Pinyin initials (e.g. "nm" -> 柠檬, "xxy" -> 薰衣草, "tx" -> 檀香)
    if (pinyinInitials && (pinyinInitials === cleanQuery || pinyinInitials.startsWith(cleanQuery))) {
      score += 115;
    } else if (pinyinInitials && pinyinInitials.includes(cleanQuery)) {
      score += 85;
    }

    // 4. Predefined English / Latin Alias Dictionaries (Broad check)
    for (const [keyName, aliases] of Object.entries(BOTANICAL_COMMON_ALIASES)) {
      if (item.name.includes(keyName) || keyName.includes(item.name)) {
        for (const alias of aliases) {
          const aliasLower = alias.toLowerCase();
          if (aliasLower === query || aliasLower === cleanQuery) {
            score += 160;
            break;
          } else if (aliasLower.startsWith(query) || aliasLower.startsWith(cleanQuery) || query.startsWith(aliasLower)) {
            score += 135;
            break;
          } else if (aliasLower.includes(query) || aliasLower.includes(cleanQuery) || query.includes(aliasLower)) {
            score += 105;
            break;
          }
        }
      }
    }

    // 5. Synonyms & Historical Names Matching
    if (item.synonyms && item.synonyms.length > 0) {
      for (const syn of item.synonyms) {
        const synLower = syn.toLowerCase();
        if (synLower.includes(query) || synLower.includes(cleanQuery)) {
          score += 90;
          break;
        }
        const synPinyin = getPinyinVariants(syn);
        if (synPinyin.full.includes(cleanQuery) || synPinyin.initials.includes(cleanQuery)) {
          score += 75;
          break;
        }
      }
    }

    // 6. Chemical Molecules & Biochemical Family (e.g. "limonene", "linalool", "1,8-桉油醇", "santalol")
    if (item.primaryMolecules && item.primaryMolecules.length > 0) {
      for (const mol of item.primaryMolecules) {
        const molLower = mol.name.toLowerCase();
        if (molLower.includes(query) || molLower.includes(cleanQuery)) {
          score += 80;
          break;
        }
      }
    }

    if (chemLower.includes(query)) {
      score += 50;
    }

    // 7. Botanical Family & Genus (e.g. "芸香科", "rutaceae", "citrus", "沉香属")
    if (familyLower.includes(query) || genusLower.includes(query)) {
      score += 65;
    }

    // 8. Origin / Subcategory / Scent Family / Efficacy
    if (originLower.includes(query)) score += 40;
    if (subcatLower.includes(query)) score += 45;
    if (scentFamilyLower.includes(query)) score += 45;
    if (emotionalLower.includes(query) || physicalLower.includes(query)) score += 30;

    if (score > 0) {
      scoredResults.push({ item, score });
    }
  }

  // Sort strictly by descending relevance score
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map(r => r.item);
}
