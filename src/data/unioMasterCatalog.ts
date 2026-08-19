import { SingleEssentialOil, CarrierOilInfo, ScentApparatus } from "../types";
import { enrichSingleEssentialOil } from "../utils/botanicalStandardizer";

export interface RawCatalogItem {
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

/**
 * Determine Five-Element (五行) based on botanical family, scent profile, and TCM properties
 */
export function deriveElement(family: string, aromaFamily: string, nameZh: string, tags: string): "木" | "火" | "土" | "金" | "水" {
  if (tags.includes("木单方") || tags.includes("木系空间")) return "木";
  if (tags.includes("火单方") || tags.includes("火系空间")) return "火";
  if (tags.includes("土单方") || tags.includes("土系空间")) return "土";
  if (tags.includes("金单方")) return "金";
  if (tags.includes("水单方") || tags.includes("水系空间")) return "水";

  const fam = family.toLowerCase();
  const aroma = aromaFamily.toLowerCase();
  const name = nameZh.toLowerCase();

  // Citrus & Green Herb -> Wood
  if (fam.includes("citrus") || aroma.includes("柑橘") || aroma.includes("草本") || aroma.includes("疏肝") || fam.includes("herbaceous") || fam.includes("leaf")) {
    if (name.includes("佛手") || name.includes("甜橙") || name.includes("红桔") || name.includes("苦橙") || name.includes("柠檬") || name.includes("青柠") || name.includes("迷迭香") || name.includes("茶树")) {
      return "木";
    }
  }

  // Floral & Spice / Warm -> Fire
  if (fam.includes("floral") || fam.includes("spice") || aroma.includes("花香") || aroma.includes("玫瑰") || aroma.includes("茉莉") || aroma.includes("依兰") || aroma.includes("辛香") || aroma.includes("暖") || aroma.includes("温")) {
    if (name.includes("玫瑰") || name.includes("依兰") || name.includes("生姜") || name.includes("肉桂") || name.includes("丁香") || name.includes("黑胡椒") || name.includes("豆蔻") || name.includes("花椒") || name.includes("辣椒")) {
      return "火";
    }
  }

  // Earth / Resin / Roots / Earthy -> Earth
  if (fam.includes("resin") || fam.includes("woody") || fam.includes("root") || fam.includes("nut") || aroma.includes("土") || aroma.includes("树脂") || aroma.includes("根") || aroma.includes("檀香") || aroma.includes("广藿香") || aroma.includes("岩兰草")) {
    if (name.includes("檀香") || name.includes("广藿香") || name.includes("岩兰草") || name.includes("安息香") || name.includes("没药") || name.includes("姜黄") || name.includes("苍术") || name.includes("胡萝卜籽") || name.includes("核桃")) {
      return "土";
    }
  }

  // Metal / Conifer / White Floral / Camphor / Mint / Lungs -> Metal
  if (fam.includes("conifer") || fam.includes("mint") || fam.includes("camphor") || aroma.includes("冷杉") || aroma.includes("云杉") || aroma.includes("松") || aroma.includes("白花") || aroma.includes("薄荷") || aroma.includes("尤加利") || aroma.includes("白千层")) {
    return "金";
  }

  // Water / Deep Sedative / High Resin / Deep Roots -> Water
  if (name.includes("沉香") || name.includes("薰衣草") || name.includes("洋甘菊") || name.includes("当归") || name.includes("缬草") || name.includes("紫草") || name.includes("冬青") || name.includes("海棠") || fam.includes("berry") || fam.includes("fruit")) {
    return "水";
  }

  // Default fallback according to family
  if (fam.includes("citrus") || fam.includes("leaf")) return "木";
  if (fam.includes("floral") || fam.includes("spice")) return "火";
  if (fam.includes("resin") || fam.includes("root")) return "土";
  if (fam.includes("conifer") || fam.includes("mint") || fam.includes("camphoraceous")) return "金";
  return "水";
}

/**
 * Determine Note Type (Top / Middle / Base)
 */
export function deriveNoteType(family: string, plantPart: string, aromaFamily: string): "top" | "middle" | "base" {
  const fam = family.toLowerCase();
  const part = plantPart.toLowerCase();
  const aroma = aromaFamily.toLowerCase();

  if (fam.includes("citrus") || fam.includes("mint") || part.includes("果皮") || part.includes("叶") || aroma.includes("明亮") || aroma.includes("轻快") || aroma.includes("锐亮") || aroma.includes("清凉")) {
    return "top";
  }

  if (fam.includes("woody") || fam.includes("resin") || fam.includes("root") || part.includes("心材") || part.includes("树脂") || part.includes("根") || aroma.includes("深沉") || aroma.includes("厚重") || aroma.includes("树脂") || aroma.includes("定香") || aroma.includes("泥土")) {
    return "base";
  }

  return "middle";
}
