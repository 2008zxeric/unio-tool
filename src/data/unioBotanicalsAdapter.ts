import { SingleEssentialOil, CarrierOilInfo, ScentApparatus } from "../types";
import { enrichSingleEssentialOil } from "../utils/botanicalStandardizer";
import { deriveElement, deriveNoteType } from "./unioMasterCatalog";
import catalogJson from "./unioCatalogItems.json";

export interface RawCatalogEntry {
  oil_id: string;
  name_zh: string;
  name_en: string;
  botanical_name: string;
  family: string;
  aroma_family: string;
  plant_part: string;
  extraction: string;
  tags: string;
  blend_focus: string;
  safety_flags: string;
  notes: string;
}

const rawCatalogItems: RawCatalogEntry[] = catalogJson as RawCatalogEntry[];

/**
 * Extract Origin from notes string (e.g. "产地意大利", "产地法国普罗旺斯")
 */
function extractOrigin(notes: string): string {
  const match = notes.match(/产地([^｜|\n]+)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return "道地产区 (原生纯正芳香产地)";
}

/**
 * Extract SKU and Pricing from notes string
 */
function extractSkuPrice(notes: string): { sku?: string; price?: string } {
  const skuMatch = notes.match(/元系列SKU\s+([A-Z0-9-]+)/);
  const priceMatch = notes.match(/¥([0-9/mlg]+)/);
  return {
    sku: skuMatch ? skuMatch[1] : undefined,
    price: priceMatch ? `¥${priceMatch[1]}` : undefined
  };
}

/**
 * Derive TCM Meridian based on five elements & plant part
 */
function deriveMeridian(element: "木" | "火" | "土" | "金" | "水", plantPart: string): string {
  switch (element) {
    case "木":
      return "归肝、胆经 | 条达气机";
    case "火":
      return "归心、心包、小肠经 | 通达血脉";
    case "土":
      return "归脾、胃经 | 运化水湿";
    case "金":
      return "归肺、大肠经 | 宣发肃降";
    case "水":
      return "归肾、膀胱经 | 封藏固摄";
    default:
      return "归肺、脾、肾经 | 调和营卫";
  }
}

/**
 * Derive representative primary chemical molecules based on botanical name & family
 */
function deriveMolecules(latin: string, family: string): Array<{ name: string; percentage: string }> {
  const l = latin.toLowerCase();
  const f = family.toLowerCase();

  if (l.includes("citrus limon")) return [{ name: "右旋柠檬烯 (d-Limonene)", percentage: "68.5%" }, { name: "β-蒎烯", percentage: "12.0%" }, { name: "γ-松油烯", percentage: "9.5%" }];
  if (l.includes("citrus sinensis")) return [{ name: "右旋柠檬烯 (d-Limonene)", percentage: "92.0%" }, { name: "月桂烯", percentage: "2.5%" }, { name: "芳樟醇", percentage: "1.2%" }];
  if (l.includes("citrus bergamia")) return [{ name: "乙酸芳樟酯 (Linalyl acetate)", percentage: "36.5%" }, { name: "柠檬烯", percentage: "34.0%" }, { name: "芳樟醇", percentage: "11.5%" }];
  if (l.includes("citrus paradisi")) return [{ name: "柠檬烯 (d-Limonene)", percentage: "88.0%" }, { name: "圆柚酮 (Nootkatone)", percentage: "1.5%" }, { name: "月桂烯", percentage: "2.0%" }];
  if (l.includes("lavandula angustifolia")) return [{ name: "乙酸芳樟酯 (Linalyl acetate)", percentage: "45.0%" }, { name: "芳樟醇 (Linalool)", percentage: "32.0%" }, { name: "薰衣草烯酯", percentage: "4.5%" }];
  if (l.includes("melaleuca alternifolia")) return [{ name: "萜品烯-4-醇 (Terpinen-4-ol)", percentage: "42.0%" }, { name: "γ-松油烯", percentage: "21.0%" }, { name: "α-松油烯", percentage: "10.5%" }];
  if (l.includes("melaleuca ericifolia")) return [{ name: "芳樟醇 (Linalool)", percentage: "52.0%" }, { name: "1,8-桉油醇", percentage: "18.5%" }, { name: "α-蒎烯", percentage: "8.2%" }];
  if (l.includes("santalum")) return [{ name: "α-檀香醇 (α-Santalol)", percentage: "58.0%" }, { name: "β-檀香醇", percentage: "24.5%" }, { name: "檀香烯", percentage: "7.5%" }];
  if (l.includes("boswellia")) return [{ name: "α-蒎烯 (alpha-Pinene)", percentage: "48.0%" }, { name: "柠檬烯", percentage: "16.0%" }, { name: "辛基乙酸酯", percentage: "12.5%" }];
  if (l.includes("rosa")) return [{ name: "香茅醇 (Citronellol)", percentage: "38.0%" }, { name: "香叶醇 (Geraniol)", percentage: "22.5%" }, { name: "橙花醇", percentage: "9.0%" }, { name: "苯乙醇", percentage: "3.5%" }];
  if (l.includes("eucalyptus globulus")) return [{ name: "1,8-桉油醇 (1,8-Cineole)", percentage: "82.0%" }, { name: "α-蒎烯", percentage: "8.5%" }, { name: "柠檬烯", percentage: "5.0%" }];
  if (l.includes("mentha")) return [{ name: "薄荷醇 (l-Menthol)", percentage: "45.0%" }, { name: "薄荷酮 (Menthone)", percentage: "24.0%" }, { name: "乙酸薄荷酯", percentage: "6.5%" }];
  if (l.includes("pelargonium")) return [{ name: "香茅醇 (Citronellol)", percentage: "32.0%" }, { name: "香叶醇 (Geraniol)", percentage: "18.5%" }, { name: "甲酸香茅酯", percentage: "9.5%" }];
  if (l.includes("cedrus")) return [{ name: "α-雪松烯 (alpha-Cedrene)", percentage: "35.0%" }, { name: "雪松醇 (Cedrol)", percentage: "22.0%" }, { name: "崖柏烯", percentage: "14.5%" }];
  if (l.includes("pogostemon")) return [{ name: "广藿香醇 (Patchoulol)", percentage: "34.0%" }, { name: "α-愈创木烯", percentage: "16.5%" }, { name: "广藿香烯", percentage: "12.0%" }];
  if (l.includes("zingiber")) return [{ name: "姜烯 (alpha-Zingiberene)", percentage: "35.0%" }, { name: "姜黄烯", percentage: "12.0%" }, { name: "β-倍半水芹烯", percentage: "9.5%" }];

  // General fallbacks based on botanical family
  if (f.includes("citrus")) return [{ name: "单萜烯 (Monoterpenes)", percentage: "85.0%" }, { name: "醛酯类芳香分子", percentage: "12.0%" }];
  if (f.includes("floral")) return [{ name: "芳樟醇/香叶醇 (Aromatic Alcohols)", percentage: "55.0%" }, { name: "芳香酯类 (Esters)", percentage: "35.0%" }];
  if (f.includes("woody") || f.includes("conifer")) return [{ name: "倍半萜醇 (Sesquiterpenols)", percentage: "52.0%" }, { name: "蒎烯/雪松烯", percentage: "38.0%" }];
  if (f.includes("resin")) return [{ name: "二萜/三萜树脂酸 (Resin Acids)", percentage: "45.0%" }, { name: "单萜烃类", percentage: "42.0%" }];
  if (f.includes("spice")) return [{ name: "丁香酚/酚类与醛类 (Aromatic Phenols)", percentage: "60.0%" }, { name: "萜烯类", percentage: "30.0%" }];

  return [{ name: "天然特征芳香分子群 (Characteristic Terpenoids)", percentage: "75.0%" }, { name: "微量增效共鸣物", percentage: "25.0%" }];
}

// Convert Raw Catalog to SingleEssentialOil
export const USER_STANDARDIZED_ESSENTIAL_OILS: SingleEssentialOil[] = rawCatalogItems
  .filter(item => !item.family.includes("UNIO·") && !item.family.includes("器具"))
  .map(item => {
    const element = deriveElement(item.family, item.aroma_family, item.name_zh, item.tags);
    const noteType = deriveNoteType(item.family, item.plant_part, item.aroma_family);
    const isPhototoxic = item.safety_flags.includes("光毒性");
    const isPregnancySafe = !item.safety_flags.includes("孕期慎用") && !item.safety_flags.includes("孕妇慎用");
    const isKidSafe = !item.safety_flags.includes("幼儿慎用") && !item.safety_flags.includes("婴幼儿慎用");
    const isPetSafe = !item.safety_flags.includes("毒性风险");
    const origin = extractOrigin(item.notes);
    const { sku, price } = extractSkuPrice(item.notes);
    const tcmMeridian = deriveMeridian(element, item.plant_part);

    const partners = item.blend_focus
      ? item.blend_focus.split(/[,、，\s]+/).filter(Boolean)
      : ["真正薰衣草", "甜橙", "乳香", "雪松"];

    const molecules = deriveMolecules(item.botanical_name, item.family);

    const rawOil: Partial<SingleEssentialOil> & { id: string; name: string; latin: string } = {
      id: item.oil_id,
      name: item.name_zh,
      latin: item.botanical_name,
      element,
      noteType,
      scentFamily: item.aroma_family,
      plantPart: item.plant_part,
      extractionMethod: item.extraction,
      origin,
      chemicalFamily: `${item.family} Family (${molecules[0].name.split("(")[0].trim()})`,
      primaryMolecules: molecules,
      emotionalBenefit: `带来【${item.tags}】之气韵，平衡身心节律与情绪能量。`,
      physicalBenefit: `具有植物学【${item.plant_part}】与【${item.extraction}】特质，协同调畅气机。`,
      tcmMeridian,
      maxDermalPercent: isPhototoxic ? 0.5 : 2.5,
      isPhototoxic,
      isPregnancySafe,
      isKidSafe,
      isPetSafe,
      blendingPartners: partners,
      caution: item.safety_flags,
      storyAndLore: item.notes,
      sensorySynesthesia: `气味印记：${item.aroma_family} · 触感与视觉五行归【${element}】`,
      perfumerTrivia: `UNIO 标准库产品编号 ${item.oil_id}，${item.tags}。${sku ? `元系列官方编号: ${sku}` : ''}${price ? ` (参考规格: ${price})` : ''}`,
      oneSentenceIntro: `${item.name_zh}（${item.botanical_name}），${item.aroma_family}调，${item.tags}。`,
      targetPersona: [
        `追求【${item.tags.split("、")[0] || "身心平衡"}】与【${item.aroma_family}】气韵的芳疗爱用者与高定调香师。`,
        `需要【${item.plant_part}】萃取植物能量以平衡情绪节律的现代都市人群。`
      ],
      safetyDossier: {
        dilutionAdvice: isPhototoxic
          ? "⚠️ 具有光毒性（建议面部 ≤0.5%，外用后 12~24 小时内避免日光/紫外线照射）。"
          : "面部建议稀释至 0.5%~1%，身体按摩稀释至 2%~3%。",
        phototoxicityNote: isPhototoxic ? "⚠️ 含有光敏性成分，外用后切勿日晒。" : "🟢 无光敏性负担。",
        contraindications: item.safety_flags ? [item.safety_flags] : ["外用前建议在手臂内侧进行小面积皮试。"],
        safetyLevel: isPhototoxic || !isPregnancySafe || !isKidSafe ? "yellow" : "green"
      }
    };

    return enrichSingleEssentialOil(rawOil);
  });

/**
 * Carrier Oils from the catalog
 */
export const USER_STANDARDIZED_CARRIER_OILS: CarrierOilInfo[] = rawCatalogItems
  .filter(item => item.oil_id.startsWith("UNIO012") || item.oil_id.startsWith("UNIO013") || item.oil_id.startsWith("UNIO014") || item.oil_id.startsWith("UNIO015") || item.plant_part.includes("种仁") || item.plant_part.includes("种子油"))
  .map(item => ({
    id: item.oil_id,
    name: item.name_zh,
    latin: item.botanical_name,
    texture: item.tags.includes("轻盈") ? "轻盈清爽" : item.tags.includes("深层") ? "深层滋养" : "极高亲肤",
    absorptionRate: item.tags.includes("易吸收") ? "极速渗透" : "中速吸收",
    shelfLife: "2-3 年",
    bestFor: `${item.tags}，适合与单方精油按 1%~3% 比例调配面部或身体护理油。`,
    tcmProperty: "性平味甘，润泽肌肤，调和营卫"
  }));

/**
 * Hydrosols and Special UNIO Formulas
 */
export const USER_UNIO_SPECIAL_PRODUCTS = rawCatalogItems.filter(item => item.oil_id.startsWith("UNIO"));

console.log(`[UNIO Adapter] Loaded ${USER_STANDARDIZED_ESSENTIAL_OILS.length} standardized essential oils from user catalog.`);
