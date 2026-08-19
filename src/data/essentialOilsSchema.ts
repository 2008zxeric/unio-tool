/**
 * UNIO Aroma Essential Oils Database Schema
 * Standardized JSON Schema and TypeScript Definitions for 200+ Core Essential Oils
 * 
 * Standards Compliance:
 * - ISO 4720:2018 (Essential oils — Nomenclature)
 * - Kew Royal Botanic Gardens POWO / WCVP (Plants of the World Online)
 * - Tisserand & Young (Essential Oil Safety, 2nd Ed.)
 * - Chinese Pharmacopoeia (2020/2025 TCM Botanical Meridian Standards)
 * - Google Gemini AI Structured Output / Function Calling Schema (OpenAPI 3.0 / JSON Schema)
 */

export type FiveElement = "木" | "火" | "土" | "金" | "水";
export type NoteType = "top" | "middle" | "base";
export type SafetyLevel = "Level 1: 极度温和" | "Level 2: 标准安全" | "Level 3: 需严格稀释" | "Level 4: 禁忌限制";

export interface PrimaryMolecule {
  name: string;
  percentage: string;
  casNumber?: string;
  functionalGroup?: string;
  therapeuticPathway?: string;
}

export interface SafetyDossier {
  safetyLevel: SafetyLevel;
  maxDermalPercentage: number; // IFRA safe limit for skin application (%)
  isPhototoxic: boolean;
  phototoxicityNote?: string;
  isPregnancySafe: boolean;
  pregnancyNote?: string;
  isPetSafe: boolean;
  petNote?: string;
  isKidSafe: boolean;
  childAgeLimitYears?: number;
  generalCautions: string;
  contraindications: string[];
}

export interface BotanicalTaxonomy {
  latinName: string;
  botanicalFamily: string;
  botanicalGenus: string;
  chemotype?: string;
  isoStandard?: string;
  synonyms: string[];
  plantPart: string;
  extractionMethod: string;
  terroirOrigin: string;
}

export interface TcmProperties {
  element: FiveElement;
  subcategory: string;
  tcmMeridian: string; // 归经 (如: 归肝、肺经)
  tcmNature: string; // 性味 (如: 性温，味辛甘)
  tcmQiDynamic: string; // 气机升降 (如: 生发疏肝 · 条达气机)
}

export interface OlfactoryProfile {
  noteType: NoteType;
  scentFamily: string;
  scentKeywords: string[];
  firstImpression: string;
  deepNote: string;
  sensoryAtmosphere: string;
}

export interface EssentialOilRecord {
  id: string;
  name: string;
  pinyin: string;
  botany: BotanicalTaxonomy;
  tcm: TcmProperties;
  olfactory: OlfactoryProfile;
  chemistry: {
    chemicalFamily: string;
    primaryMolecules: PrimaryMolecule[];
    gcmsNotes?: string;
  };
  safety: SafetyDossier;
  efficacy: {
    emotionalBenefit: string;
    physicalBenefit: string;
    targetPersona: string[];
    suggestedScenarios: string[];
  };
  application: {
    diffuserAdvice: string;
    palmInhalationAdvice: string;
    bodyApplicationAdvice: string;
    bathCaution: string;
    idealTimesOfDay: ("morning" | "daytime" | "evening" | "night")[];
  };
  blending: {
    compatiblePartners: string[];
    roleInFormula: "君 (King/Chief)" | "臣 (Minister/Associate)" | "佐 (Adjuvant/Harmonizer)" | "使 (Messenger/Guide)" | string;
    synergyNotes?: string;
  };
  culturalLore?: {
    story: string;
    synesthesia: string;
    perfumerTrivia: string;
  };
}

/**
 * Standard JSON Schema (Draft-07 / OpenAPI 3.0 compatible) for AI Tools and Validation
 */
export const ESSENTIAL_OIL_JSON_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "EssentialOilRecord",
  description: "Standardized botanical, chemical, TCM, and safety record for a single essential oil in UNIO database.",
  type: "object",
  required: ["id", "name", "pinyin", "botany", "tcm", "olfactory", "chemistry", "safety", "efficacy", "blending"],
  properties: {
    id: {
      type: "string",
      description: "Unique slug identifier (e.g. 'wood_agarwood_hainan', 'fire_rose_damascena')"
    },
    name: {
      type: "string",
      description: "Standard Chinese botanical common name (e.g. '海南沉香 (白木香)', '保加利亚大马士革玫瑰')"
    },
    pinyin: {
      type: "string",
      description: "Standard Pinyin with tone marks for pronunciation"
    },
    botany: {
      type: "object",
      required: ["latinName", "botanicalFamily", "botanicalGenus", "plantPart", "extractionMethod", "terroirOrigin"],
      properties: {
        latinName: { type: "string", description: "Binomial botanical Latin name compliant with Kew POWO" },
        botanicalFamily: { type: "string", description: "Botanical family (e.g. 瑞香科 Thymelaeaceae)" },
        botanicalGenus: { type: "string", description: "Botanical genus (e.g. 沉香属 Aquilaria)" },
        chemotype: { type: "string", description: "Chemotype if applicable (e.g. CT Linalool, CT 1,8-Cineole)" },
        isoStandard: { type: "string", description: "ISO Standard code (e.g. ISO 4720, ISO 3515)" },
        synonyms: { type: "array", items: { type: "string" }, description: "Historical, pharmaceutical, or taxonomic synonyms" },
        plantPart: { type: "string", description: "Distilled plant part (e.g. 心材, 花朵, 针叶, 果皮, 根茎)" },
        extractionMethod: { type: "string", description: "Extraction technique (e.g. 超临界CO2萃取, 水蒸气蒸馏, 冷压榨)" },
        terroirOrigin: { type: "string", description: "Specific geographic terroir/origin" }
      }
    },
    tcm: {
      type: "object",
      required: ["element", "subcategory", "tcmMeridian", "tcmNature", "tcmQiDynamic"],
      properties: {
        element: { type: "string", enum: ["木", "火", "土", "金", "水"], description: "Five Elements classification" },
        subcategory: { type: "string", description: "Herbal/aromatic subcategory (e.g. 东方珍木, 清幽花香, 疏肝柑橘)" },
        tcmMeridian: { type: "string", description: "TCM Meridian tropism (e.g. 归脾、胃、肾、肝经)" },
        tcmNature: { type: "string", description: "TCM nature and flavor (e.g. 性微温，味辛微苦)" },
        tcmQiDynamic: { type: "string", description: "Qi movement dynamics (e.g. 生发疏肝 · 条达气机)" }
      }
    },
    olfactory: {
      type: "object",
      required: ["noteType", "scentFamily", "scentKeywords", "firstImpression"],
      properties: {
        noteType: { type: "string", enum: ["top", "middle", "base"], description: "Volatile pyramid level" },
        scentFamily: { type: "string", description: "Scent family classification" },
        scentKeywords: { type: "array", items: { type: "string" }, description: "Descriptive keywords with tags" },
        firstImpression: { type: "string", description: "Initial olfactory sensation" },
        deepNote: { type: "string", description: "Heart and undertone impression" },
        sensoryAtmosphere: { type: "string", description: "Synesthetic environment and imagery" }
      }
    },
    chemistry: {
      type: "object",
      required: ["chemicalFamily", "primaryMolecules"],
      properties: {
        chemicalFamily: { type: "string", description: "Dominant biochemical family (e.g. Sesquiterpenes, Esters, Monoterpenols)" },
        primaryMolecules: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "percentage"],
            properties: {
              name: { type: "string", description: "Active chemical molecule name in Chinese and English" },
              percentage: { type: "string", description: "Estimated GC-MS percentage range" },
              casNumber: { type: "string", description: "Chemical Abstracts Service registry number" },
              therapeuticPathway: { type: "string", description: "Neurological or pharmacological mechanism of action" }
            }
          }
        },
        gcmsNotes: { type: "string", description: "GC-MS chromatography notes" }
      }
    },
    safety: {
      type: "object",
      required: ["safetyLevel", "maxDermalPercentage", "isPhototoxic", "isPregnancySafe", "isPetSafe", "isKidSafe", "generalCautions", "contraindications"],
      properties: {
        safetyLevel: {
          type: "string",
          enum: ["Level 1: 极度温和", "Level 2: 标准安全", "Level 3: 需严格稀释", "Level 4: 禁忌限制"],
          description: "Standardized safety tier"
        },
        maxDermalPercentage: { type: "number", description: "Maximum IFRA dermal limit percentage in leave-on skin products" },
        isPhototoxic: { type: "boolean", description: "Whether this oil causes UV photosensitivity" },
        phototoxicityNote: { type: "string", description: "Sunlight safety instructions" },
        isPregnancySafe: { type: "boolean", description: "Safe for pregnant and nursing mothers when diluted" },
        pregnancyNote: { type: "string", description: "Trimester-specific safety guidelines" },
        isPetSafe: { type: "boolean", description: "Safe around dogs and cats in diffusion" },
        petNote: { type: "string", description: "Pet metabolic sensitivity note (e.g. feline glucuronidation limits)" },
        isKidSafe: { type: "boolean", description: "Safe for children over 3 years old" },
        childAgeLimitYears: { type: "number", description: "Minimum safe age limit" },
        generalCautions: { type: "string", description: "Summary safety caution statement" },
        contraindications: { type: "array", items: { type: "string" }, description: "Specific population contraindications" }
      }
    },
    efficacy: {
      type: "object",
      required: ["emotionalBenefit", "physicalBenefit", "targetPersona"],
      properties: {
        emotionalBenefit: { type: "string", description: "Psycho-emotional and neurotransmitter regulation benefit" },
        physicalBenefit: { type: "string", description: "Physical, respiratory, skin, and meridian somatic benefit" },
        targetPersona: { type: "array", items: { type: "string" }, description: "Ideal user profile checklist" },
        suggestedScenarios: { type: "array", items: { type: "string" }, description: "Recommended lifestyle and therapeutic scenes" }
      }
    },
    application: {
      type: "object",
      required: ["diffuserAdvice", "palmInhalationAdvice", "bodyApplicationAdvice", "bathCaution"],
      properties: {
        diffuserAdvice: { type: "string", description: "Ultrasonic or cold-air diffusion drops and room size" },
        palmInhalationAdvice: { type: "string", description: "Palm inhalation and 4-7-8 breathing guidance" },
        bodyApplicationAdvice: { type: "string", description: "Carrier oil dilution ratio and meridian acupoint application" },
        bathCaution: { type: "string", description: "Bath dispersal/emulsification requirement (never neat)" },
        idealTimesOfDay: {
          type: "array",
          items: { type: "string", enum: ["morning", "daytime", "evening", "night"] },
          description: "Circadian rhythm alignment"
        }
      }
    },
    blending: {
      type: "object",
      required: ["compatiblePartners", "roleInFormula"],
      properties: {
        compatiblePartners: { type: "array", items: { type: "string" }, description: "Harmonious botanical partners" },
        roleInFormula: { type: "string", description: "Traditional formulation hierarchy role (君/臣/佐/使)" },
        synergyNotes: { type: "string", description: "Synergistic olfactory or chemical resonance explanation" }
      }
    },
    culturalLore: {
      type: "object",
      properties: {
        story: { type: "string", description: "Historical and literary lore" },
        synesthesia: { type: "string", description: "Color, musical frequency (e.g. 432Hz), and visual metaphor" },
        perfumerTrivia: { type: "string", description: "Professional perfumer formulation secrets and trivia" }
      }
    }
  }
};

/**
 * Gemini GenAI SDK ResponseSchema for AI Prescription & Consultation Function Calling
 */
export const GEMINI_ESSENTIAL_OILS_SEARCH_SCHEMA = {
  type: "object",
  properties: {
    matchedOils: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          latinName: { type: "string" },
          element: { type: "string", enum: ["木", "火", "土", "金", "水"] },
          noteType: { type: "string", enum: ["top", "middle", "base"] },
          primaryActiveMolecules: { type: "array", items: { type: "string" } },
          tcmMeridian: { type: "string" },
          maxDermalPercentage: { type: "number" },
          safetyLevel: { type: "string" },
          recommendationReason: { type: "string" }
        },
        required: ["id", "name", "latinName", "element", "noteType", "tcmMeridian", "maxDermalPercentage", "recommendationReason"]
      }
    },
    fiveElementBalanceAnalysis: { type: "string" },
    safetyAuditPassed: { type: "boolean" }
  },
  required: ["matchedOils", "fiveElementBalanceAnalysis", "safetyAuditPassed"]
};

/**
 * Validate a single Essential Oil record against requirements
 */
export function validateEssentialOil(record: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!record.id) errors.push("Missing 'id'");
  if (!record.name) errors.push("Missing 'name'");
  if (!record.botany?.latinName) errors.push("Missing 'botany.latinName'");
  if (!record.tcm?.element || !["木", "火", "土", "金", "水"].includes(record.tcm.element)) {
    errors.push("Invalid or missing 'tcm.element'");
  }
  if (!record.safety?.safetyLevel) errors.push("Missing 'safety.safetyLevel'");
  if (typeof record.safety?.maxDermalPercentage !== "number") {
    errors.push("Missing or invalid 'safety.maxDermalPercentage'");
  }
  if (!record.chemistry?.primaryMolecules || !Array.isArray(record.chemistry.primaryMolecules)) {
    errors.push("Missing 'chemistry.primaryMolecules'");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
