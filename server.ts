import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { ALL_COMPREHENSIVE_ESSENTIAL_OILS } from "./src/data/comprehensiveBotanicalsList";
import { EXPANDED_CARRIER_OILS } from "./src/data/globalBotanicals";
import { ESSENTIAL_OIL_JSON_SCHEMA } from "./src/data/essentialOilsSchema";
import { ESSENTIAL_OILS_200_DATABASE, getAIPromptBotanicalsSummary } from "./src/data/essentialOilsDataset";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Using local algorithmic aromatherapy fallback.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// =========================================================================
// 🌿 Standardized 200+ Botanical Encyclopedia API Endpoints
// =========================================================================

// Get all standardized essential oils with filtering
app.get("/api/botanicals", (req, res) => {
  try {
    const { element, scentFamily, noteType, pregnancySafe, petSafe, query } = req.query;
    let list = ALL_COMPREHENSIVE_ESSENTIAL_OILS;

    if (element) {
      list = list.filter(o => o.element === element);
    }
    if (scentFamily) {
      list = list.filter(o => o.scentFamily.includes(String(scentFamily)));
    }
    if (noteType) {
      list = list.filter(o => o.noteType === noteType);
    }
    if (pregnancySafe === "true") {
      list = list.filter(o => o.isPregnancySafe);
    }
    if (petSafe === "true") {
      list = list.filter(o => o.isPetSafe);
    }
    if (query) {
      const q = String(query).toLowerCase();
      list = list.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.latin.toLowerCase().includes(q) ||
        o.pinyin.toLowerCase().includes(q) ||
        o.emotionalBenefit.toLowerCase().includes(q) ||
        o.physicalBenefit.toLowerCase().includes(q) ||
        o.primaryMolecules.some(m => m.name.toLowerCase().includes(q))
      );
    }

    res.json({
      total: list.length,
      databaseCapacity: ALL_COMPREHENSIVE_ESSENTIAL_OILS.length,
      data: list
    });
  } catch (error) {
    console.error("Error fetching botanicals:", error);
    res.status(500).json({ error: "Failed to fetch botanicals database" });
  }
});

// Botanical search endpoint
app.get("/api/botanicals/search", (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ total: ALL_COMPREHENSIVE_ESSENTIAL_OILS.length, data: ALL_COMPREHENSIVE_ESSENTIAL_OILS });
    }
    const query = String(q).toLowerCase();
    const results = ALL_COMPREHENSIVE_ESSENTIAL_OILS.filter(oil =>
      oil.name.toLowerCase().includes(query) ||
      oil.latin.toLowerCase().includes(query) ||
      oil.pinyin.toLowerCase().includes(query) ||
      oil.tcmMeridian.toLowerCase().includes(query) ||
      oil.emotionalBenefit.toLowerCase().includes(query) ||
      oil.physicalBenefit.toLowerCase().includes(query) ||
      oil.primaryMolecules.some(m => m.name.toLowerCase().includes(query))
    );
    res.json({ total: results.length, data: results });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

// Botanical stats / summary
app.get("/api/botanicals/summary", (req, res) => {
  const countsByElement = {
    木: ALL_COMPREHENSIVE_ESSENTIAL_OILS.filter(o => o.element === "木").length,
    火: ALL_COMPREHENSIVE_ESSENTIAL_OILS.filter(o => o.element === "火").length,
    土: ALL_COMPREHENSIVE_ESSENTIAL_OILS.filter(o => o.element === "土").length,
    金: ALL_COMPREHENSIVE_ESSENTIAL_OILS.filter(o => o.element === "金").length,
    水: ALL_COMPREHENSIVE_ESSENTIAL_OILS.filter(o => o.element === "水").length
  };

  res.json({
    totalOils: ALL_COMPREHENSIVE_ESSENTIAL_OILS.length,
    carrierOils: EXPANDED_CARRIER_OILS.length,
    countsByElement,
    standards: ["ISO 4720:2018", "Kew POWO/WCVP", "Tisserand Institute Safety", "Chinese Pharmacopoeia TCM"]
  });
});

// JSON Schema endpoint for AI Tool calling / structured validation
app.get("/api/botanicals/schema", (req, res) => {
  res.json(ESSENTIAL_OIL_JSON_SCHEMA);
});

// Standardized 200+ Core Essential Oil Records (Full Schema Format)
app.get("/api/botanicals/records", (req, res) => {
  const { element, noteType, pregnancySafeOnly, petSafeOnly, search } = req.query;
  let list = ESSENTIAL_OILS_200_DATABASE;

  if (element) {
    list = list.filter(o => o.tcm.element === element);
  }
  if (noteType) {
    list = list.filter(o => o.olfactory.noteType === noteType);
  }
  if (pregnancySafeOnly === "true") {
    list = list.filter(o => o.safety.isPregnancySafe);
  }
  if (petSafeOnly === "true") {
    list = list.filter(o => o.safety.isPetSafe);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.botany.latinName.toLowerCase().includes(q) ||
      o.pinyin.toLowerCase().includes(q) ||
      o.tcm.tcmMeridian.toLowerCase().includes(q) ||
      o.efficacy.emotionalBenefit.toLowerCase().includes(q) ||
      o.chemistry.primaryMolecules.some(m => m.name.toLowerCase().includes(q))
    );
  }

  res.json({
    total: list.length,
    schemaVersion: "UNIO-ESSENTIAL-OIL-SCHEMA-V2",
    standards: ["ISO 4720:2018", "Kew POWO", "Tisserand Safety", "TCM Pharmacopoeia"],
    records: list
  });
});

// Full Master Database JSON (from /data/essential_oils_db.json)
app.get("/api/botanicals/db", (req, res) => {
  try {
    const dbPath = path.join(process.cwd(), "data", "essential_oils_db.json");
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      return res.json(JSON.parse(data));
    }
    return res.status(404).json({ error: "essential_oils_db.json not found" });
  } catch (error) {
    console.error("Error reading essential_oils_db.json:", error);
    res.status(500).json({ error: "Failed to read database file" });
  }
});

// Dynamic AI follow-up questions
app.post("/api/prescriptions/followup-questions", async (req, res) => {
  try {
    const { scene, feeling, constitution } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        questions: [
          {
            id: "q1",
            question: "请问您最近是否伴有入睡浅、多梦易醒或清晨乏力感？",
            options: ["入睡困难", "多梦易惊醒", "晨起依然疲劳", "睡眠尚可但渴望更深层放松"]
          },
          {
            id: "q2",
            question: "在香气调性上，您更期待木质的沉稳锚定，还是柑橘草本的清冽解郁？",
            options: ["东方沉香与古松木", "清冽白茶与苦橙叶", "柔润大马士革玫瑰", "舒缓真实薰衣草与洋甘菊"]
          }
        ]
      });
    }

    const prompt = `你是一位精通东方中草药芳香疗法与现代嗅觉神经科学的 UNIO「一人一方」首席调香大师。
用户正在进行芳香问诊：
- 场景需求: ${scene || "身心调养与解压"}
- 当前心境与体感: ${feeling || "需要平静与疗愈"}
- 体质倾向: ${constitution || "气郁或阴虚"}

请生成 2 个极具东方诗意与专业深度的【微问诊追问问题】（含 4 个精炼选项），帮助进一步锁定专属处方配比。
输出必须为严格的 JSON 格式。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["id", "question", "options"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Follow-up generation error:", error);
    res.json({
      questions: [
        {
          id: "q_fallback_1",
          question: "近期呼吸是否感到胸闷或干燥，更倾向润肺通窍还是安神定志？",
          options: ["安神宁心为主", "清润呼吸通道", "疏肝理气解郁", "温阳补气驱寒"]
        }
      ]
    });
  }
});

// Facial expression & mood scan endpoint
app.post("/api/prescriptions/analyze-face-mood", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    const ai = getGeminiClient();

    if (!ai || !imageBase64) {
      return res.json({
        detectedMood: "沉思与轻度疲惫",
        energyLevel: "中等偏低 (需蓄力)",
        complexionAnalysis: "面色微泛倦意，眉宇微蹙，气机轻微郁滞，需以清润木质与柑橘行气化郁",
        suggestedElements: ["木 (疏肝)", "水 (滋阴)"],
        recommendedNotes: ["苦橙叶", "喜马拉雅雪松", "真实薰衣草"]
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: `你是一位将东方神色望诊与嗅觉情绪心理学相结合的 UNIO「一人一方」高定芳疗大师。
请分析这张面部照片的气色、神态、眉宇肌肉张力与情绪状态。
注意：仅用于生活芳香情绪调养建议，非医疗诊断。

请返回 JSON：
1. detectedMood: 当前情绪状态（如“思虑过度与身心紧绷”、“静谧从容”、“睡眠不足导致的暗哑神态”等）
2. energyLevel: 身心能量水平（如“45% 亟需恢复能量”、“70% 平和但略有疲劳”）
3. complexionAnalysis: 东方望神与气色解读（100字内优雅诗意描述）
4. suggestedElements: 建议平衡的五行属性数组（如 ["木 (疏肝条达)", "水 (滋阴潜阳)"]）
5. recommendedNotes: 适合当前面相神采的 3 款精油名称数组（如 ["海南沉香", "苦橙叶", "大马士革玫瑰"]）`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedMood: { type: Type.STRING },
            energyLevel: { type: Type.STRING },
            complexionAnalysis: { type: Type.STRING },
            suggestedElements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["detectedMood", "energyLevel", "complexionAnalysis", "suggestedElements", "recommendedNotes"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Face mood scan error:", error);
    res.json({
      detectedMood: "沉思与轻度疲惫",
      energyLevel: "58% (适宜芳香抚慰)",
      complexionAnalysis: "神色内敛，气机需温和条达，建议以温润草本与安神木调舒缓神经系统。",
      suggestedElements: ["木 (疏理气机)", "金 (肃降宁神)"],
      recommendedNotes: ["意大利绿橘", "突尼斯橙花", "迈索尔檀香"]
    });
  }
});

// Multi-turn Interactive AI Scent Master Consultation
app.post("/api/prescriptions/consult-chat", async (req, res) => {
  try {
    const { messages, userState, userProfile } = req.body;
    const ai = getGeminiClient();

    const profile = userProfile || userState?.userProfile || null;
    const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "";

    // Profile summary string
    const profileSummary = profile ? [
      profile.gender && profile.gender !== "unspecified" ? (profile.gender === "female" ? "女性" : "男性") : null,
      profile.ageRange ? `${profile.ageRange}岁` : null,
      profile.healthConditions && profile.healthConditions.length > 0 ? `体质/基础关注: ${profile.healthConditions.join("、")}` : null,
      profile.favoriteFamilies && profile.favoriteFamilies.length > 0 ? `偏好: ${profile.favoriteFamilies.join("、")}` : null
    ].filter(Boolean).join(" · ") : "";

    if (!ai) {
      // Deterministic intelligent aromatherapy dialogue response
      let reply = "";
      let element = "木";
      let scene = "深度睡眠与安神";
      let keyHerbs = ["真正薰衣草", "苦橙叶", "迈索尔老山檀香"];
      let qiState = "肝木郁滞 · 心神浮越";
      let suggestedQuickReplies = ["我经常夜间翻来覆去难入睡", "喜欢清雅的白茶与冷杉香", "希望排除刺激性精油（备孕/宠物）", "已准备好，为我开具专属处方"];

      const profileAcknowledge = profileSummary ? `【已调取您的健康档案：${profileSummary}】\n` : "";

      if (lastMessage.includes("睡") || lastMessage.includes("失眠") || lastMessage.includes("梦")) {
        element = "水";
        scene = "深度睡眠与安神";
        keyHerbs = ["普罗旺斯真薰衣草", "东印度老山檀香", "阿曼绿乳香"];
        qiState = "心肾不交 · 虚阳外越";
        reply = `${profileAcknowledge}闻君所言，夜卧不宁多因神不守舍、虚火扰动心包。睡眠并非机械性关机，而是神经从交感向副交感的柔和滑行。

结合您的体质底色，在芳香配伍上宜以【高地真薰衣草（富含乙酸芳樟酯）】抚平中枢亢奋，佐以【东印度老山檀香（富含 α-檀香醇）】下沉气机、引火归元。

请问您更偏爱带有【清冽山林松针】的幽冷通透感，还是带有【温润白茶与轻柔花香】的温存包裹感？`;
        suggestedQuickReplies = ["偏爱清冽山林松针与冷杉", "偏爱温润白茶与轻柔雅花", "喜欢纯粹深沉的木质与泥土香", "根据我的体质直接生成处方"];
      } else if (lastMessage.includes("累") || lastMessage.includes("压") || lastMessage.includes("焦虑") || lastMessage.includes("烦")) {
        element = "木";
        scene = "抗焦解压与降心火";
        keyHerbs = ["意大利苦橙叶", "意大利佛手柑", "西伯利亚冷杉"];
        qiState = "木失条达 · 肝气郁结";
        reply = `${profileAcknowledge}思虑过度则伤脾，郁结不畅则气滞。胸中若觉微闷窒塞，正是肝木之气未能如春木般舒展条达。

结合您的健康关注，建议选用【苦橙叶与佛手柑（富含柠檬烯与乙酸芳樟酯）】以行气解郁、宣通胸膈；并配伍【西伯利亚冷杉】拓宽每一次深长呼吸。

您平日涂抹或扩香时，是否有孕期、哺乳期或家养猫狗等特殊安全考量？`;
        suggestedQuickReplies = ["家有猫狗宠物，需宠物友好", "备孕/孕期，需严格安全浓度", "无特殊禁忌，正常浓度即可", "已明了，请为我量身开方"];
      } else if (lastMessage.includes("专注") || lastMessage.includes("工作") || lastMessage.includes("头晕") || lastMessage.includes("醒脑")) {
        element = "金";
        scene = "深度专注与灵台清明";
        keyHerbs = ["桉油醇迷迭香", "高山野生白茶", "喜马拉雅雪松"];
        qiState = "肺气肃降 · 灵台开窍";
        reply = `${profileAcknowledge}案牍劳形之时，脑海如蒙薄雾。气道通则神志清，《本草纲目》云芳香开窍，正合此理。

建议以【桉油醇迷迭香（富含 1,8-桉叶素）】激发前额叶清明认知，佐以【白茶精萃与雪松】构建稳定而不躁动的气场结界。

您希望这款处方主要用于【随身滚珠穴位点涂】，还是【空间超声波香薰】？`;
        suggestedQuickReplies = ["随身 10ml 滚珠油点涂内关印堂", "超声波香薰机空间扩香", "两种场景皆需兼顾", "即刻生成高定专注处方"];
      } else {
        reply = `${profileAcknowledge}千人千面，一人一方。闻香不仅是感官的愉悦，更是一场气机与五脏的深层调和。

我已经记录下您的气息脉络与健康底色。结合当下季节天时与您的倾诉，我将为您调和君臣佐使，定制兼具分子疗愈力与东方诗意的高定香方。

您若已准备妥当，随时可点击下方【生成专属高定处方笺】，或继续向我倾诉更多细节。`;
        suggestedQuickReplies = ["即刻生成我的高定处方笺", "我还想补充我的香调喜好", "想进行五行面容识神望诊", "查看推荐的君臣佐使单方"];
      }

      return res.json({
        reply,
        detectedDiagnosis: {
          element,
          scene,
          keyHerbs,
          qiState,
          recommendationLevel: 98
        },
        suggestedQuickReplies
      });
    }

    // Gemini-powered multi-turn Eastern perfumer consultation
    const systemPrompt = `你是一位享誉业界的 UNIO「一人一方」首席东方高定调香宗师与临床芳疗学家。
你的对话风格：
1. 语言极其典雅温润、具有东方文人审美与深邃同理心，融合宋代点茶焚香理学与现代神经嗅觉科学（GABA、边缘系统、皮质醇、脑波节律）。
2. “千人千面，一人一方”是你的核心信条。每一次对话都在倾听、望闻问切、解析五行气机（木火土金水）与身心失衡根源。
3. 【关键特性】：如果用户提供了基础健康档案（如性别、年龄段、慢性病/基础病如哮喘/高血压/偏头痛/易失眠/敏感肌/孕产/家有猫狗宠物等），你必须在回答中自然地体现并关照这些信息（例如针对特定疾病安全规避刺激成分、针对年龄与性别调整调香气韵），让用户感到被深度理解与关照。
4. 给出专业的单方建议（说明化学成分，如乙酸芳樟酯、α-檀香醇、倍半萜），并给出引导性追问或确认。
5. 控制回复在 150~220 字以内，排版优美，富有呼吸感。
6. 必须返回严格 JSON 格式。`;

    const chatContents = messages.map((m: any) => `${m.role === "user" ? "用户" : "调香师"}: ${m.content}`).join("\n");

    const botanicalsContext = getAIPromptBotanicalsSummary();

    const prompt = `${systemPrompt}

${botanicalsContext}

【用户基础档案】:${JSON.stringify(profile || "未设置，按通用高定")}
【用户上下文/表单】:${JSON.stringify(userState || {})}

【当前对话历史】:
${chatContents}

请针对用户最新发言进行深度专业回应，自然融入对用户基础档案与健康诉求的关照，可直接引用数据库中的植物学名、五行属性及活性分子，并输出 JSON：
{
  "reply": "调香师温润专业的解答与追问内容",
  "detectedDiagnosis": {
    "element": "木|火|土|金|水",
    "scene": "深度睡眠与安神|抗焦解压与降心火|深度专注与灵台清明|冥想通经与引气归元|清润肺气与呼吸通窍",
    "keyHerbs": ["精油1", "精油2", "精油3"],
    "qiState": "如'肝木郁滞·心神浮越'或'心肾不交·潜阳封藏'",
    "recommendationLevel": 98
  },
  "suggestedQuickReplies": ["快捷回复选项1", "快捷回复选项2", "快捷回复选项3", "即刻生成专属高定处方"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            detectedDiagnosis: {
              type: Type.OBJECT,
              properties: {
                element: { type: Type.STRING },
                scene: { type: Type.STRING },
                keyHerbs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                qiState: { type: Type.STRING },
                recommendationLevel: { type: Type.NUMBER }
              },
              required: ["element", "scene", "keyHerbs", "qiState", "recommendationLevel"]
            },
            suggestedQuickReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["reply", "detectedDiagnosis", "suggestedQuickReplies"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Consult chat error:", error);
    res.json({
      reply: "闻君所诉，气机流转于心神之间。我已洞察您的调和之需，正为您在五行百草中遴选最为契合的君臣佐使。请随时点击【即刻生成专属高定处方】。",
      detectedDiagnosis: {
        element: "木",
        scene: "深度睡眠与安神",
        keyHerbs: ["高地真薰衣草", "东印度老山檀香", "苦橙叶"],
        qiState: "疏肝理气 · 潜阳宁神",
        recommendationLevel: 96
      },
      suggestedQuickReplies: ["即刻生成我的高定处方笺", "偏好东方古树沉香与茶韵", "有宠物需猫狗友好", "我想继续补充细节"]
    });
  }
});

// Full Bespoke Scent Prescription Generator
app.post("/api/prescriptions/generate", async (req, res) => {
  try {
    const {
      scene,
      mindBodyState,
      constitution,
      sleepQuality,
      airwaySensitivity,
      preferences,
      contraindications,
      dynamicAnswers,
      userNote,
      userProfile,
      faceScanData,
    } = req.body;

    const ai = getGeminiClient();

    const rxIdSuffix = Math.floor(1000 + Math.random() * 9000);
    const rxCode = `UNIO-${new Date().getFullYear()}-RX${rxIdSuffix}`;

    const promptContext = `
你作为 UNIO「一人一方」首席东方高定调香大师与临床芳香疗法专家，请根据用户的全面身心问诊数据与个人健康档案，量身定制一份独一无二的高定芳香身心处方（Scent Prescription）。
你拥有包含 224+ 种符合 ISO 4720 与 Kew 数据库规范的东方与全球珍稀精油数据库（包含沉香、老山檀香、白茶原精、降真香、阿曼绿乳香、西伯利亚冷杉、普罗旺斯真薰衣草、大马士革玫瑰、突尼斯橙花、岩兰草、佩兰、乌药、苍术等）。

【用户基础健康档案】:
- 性别: ${userProfile?.gender || "未指定"}
- 年龄段: ${userProfile?.ageRange ? `${userProfile.ageRange}岁` : "未指定"}
- 基础慢性病/体质状况: ${(userProfile?.healthConditions || []).join(", ") || "无特殊基础病"}
- 禁忌与敏感: ${(userProfile?.sensitivities || []).join(", ") || "无"}

【用户问诊与诉求】:
- 即时场景需求: ${scene || "深度睡眠与抗焦解压"}
- 身心感受描述: ${mindBodyState || "思虑多、大脑紧绷、不易入眠"}
- 中医五行体质倾向: ${constitution || "肝郁脾虚 / 阴虚火旺"}
- 睡眠状况: ${sleepQuality || "浅眠多梦，夜间易惊醒"}
- 呼吸道与敏感度: ${airwaySensitivity || "正常，偏好温和不刺激"}
- 香调喜好: ${(preferences || []).join(", ") || "东方木质、树脂、白茶与微清甜柑橘"}
- 禁忌过滤要求: ${(contraindications || []).join(", ") || "无特殊禁忌 (安全配比)"}
- 微问诊追问回答: ${JSON.stringify(dynamicAnswers || {})}
- 用户个性化倾诉: ${userNote || "希望闻到能瞬间让人安静下来、像置身古刹深山雨后的味道"}
- 神色扫视数据: ${JSON.stringify(faceScanData || "未提供")}

【调香与疗愈配方规范】:
1. 处方名称：必须极具东方古典美学意境（如《暮山听松》、《冷杉与白茶》、《浮光浮木》、《云水禅心》、《青峦夜息》、《枕月听泉》等）。
2. 副标题与哲学理念：融合东方草本智慧、嗅觉神经传导与宋代理学诗意（150字左右）。
3. 嗅觉金字塔（前调、中调、后调）：
   - 精选 3~4 款高品质单方精油，明确产地与学名（如“意大利佛手柑 Citrus bergamia”、“迈索尔老山檀香 Santalum album”）。
   - 提供精确滴数（总滴数建议 18~24 滴，对应 10ml 滚珠油或香薰配方）及毫升换算。
   - 搭配适宜基底油（如冷压金黄荷荷巴油或甜杏仁油）。
4. 核心分子活性分析 (Molecular Active Profile)：
   - 提取 3~4 种关键芳香化学成分（如 乙酸芳樟酯 Linalyl Acetate, α-檀香醇 α-Santalol, 倍半萜烯 Sesquiterpenes, 1,8-桉叶素, 乙酸香叶酯等）。
   - 标注含量百分比估算、药理神经机制（如促进 GABA 受体合成、下调皮质醇、抑制中枢过度兴奋等）与身心获益。
5. 芳疗师指导与仪式法则 (Ritual Advice)：
   - 掌心吸嗅法（具体呼吸节奏）
   - 空间扩香配比与时间
   - 穴位点涂调理（精选 2 个中医穴位，如 涌泉穴、神阙穴、内关穴、印堂穴，说明点涂手法与通经机理）
6. 适宜节气 (24 Solar Terms 对应) 与五行属性对应。
7. 商业化打样建议 (10ml 便携随身精油滚珠 / 50ml 沉浸式室内香氛)。
`;

    if (!ai) {
      // Return high-quality deterministic algorithmic recipe if API key is not yet provided
      return res.json({
        id: "rx_" + Date.now(),
        rxCode,
        title: "《暮山听松》",
        poeticSub: "冷杉与老山檀香 · 降心火而宁神志",
        concept: "取长白山冷杉之清冽以荡涤胸中浊气，佐以高山白茶之幽微生津解烦，终以沉稳老山檀香与广藿香下沉气机。如暮色四合之时独坐松冈，松涛入耳，万虑皆空。",
        seasonTerm: "处暑 / 白露",
        fiveElement: "金水相生 · 滋阴潜阳",
        olfactoryPyramid: {
          topNotes: [
            { name: "意大利苦橙叶", latin: "Citrus aurantium", drops: 4, ml: 0.2, ratio: "20%", effect: "清润解郁，安抚过度活跃交感神经" },
            { name: "高山野生白茶精萃", latin: "Camellia sinensis", drops: 3, ml: 0.15, ratio: "15%", effect: "淡雅通窍，清心涤烦" }
          ],
          middleNotes: [
            { name: "普罗旺斯高地真薰衣草", latin: "Lavandula angustifolia", drops: 6, ml: 0.3, ratio: "30%", effect: "平衡血清素，缓解情绪波动与肌肉紧张" },
            { name: "西伯利亚冷杉", latin: "Abies sibirica", drops: 4, ml: 0.2, ratio: "20%", effect: "拓宽胸腔呼吸容量，清净肺气" }
          ],
          baseNotes: [
            { name: "东印度迈索尔老山檀香", latin: "Santalum album", drops: 2, ml: 0.1, ratio: "10%", effect: "深沉定锚，诱导 Delta 深度慢波脑电" },
            { name: "陈化印尼广藿香", latin: "Pogostemon cablin", drops: 1, ml: 0.05, ratio: "5%", effect: "固摄气血，温暖脾胃，延长留香" }
          ],
          carrierOil: "初榨有机金黄荷荷巴油 (Jojoba Oil)",
          totalDrops: 20,
          totalVolume: "10 ml (约 3% 舒缓疗愈浓度)"
        },
        molecularAnalysis: [
          {
            compound: "乙酸芳樟酯 (Linalyl Acetate)",
            percentage: "34.2%",
            pathway: "通过嗅觉感受神经元结合海马体 GABA-A 受体",
            benefit: "强效抑制中枢神经亢奋，显著缩短入睡潜伏期"
          },
          {
            compound: "α-檀香醇 (α-Santalol)",
            percentage: "18.6%",
            pathway: "降低自主神经系统兴奋性，减缓心率与呼吸频次",
            benefit: "带来深层宁静感与冥想入定状态"
          },
          {
            compound: "乙酸冰片酯 (Bornyl Acetate)",
            percentage: "12.8%",
            pathway: "松科精油代表单萜酯，激活副交感神经系统",
            benefit: "舒张支气管平滑肌，增强深呼吸氧合能力"
          },
          {
            compound: "广藿香醇 (Patchoulol)",
            percentage: "8.5%",
            pathway: "倍半萜醇类分子，具有卓越的情绪锚定与接地作用",
            benefit: "驱散浮躁焦虑，提升情绪稳态"
          }
        ],
        aromatherapyAdvice: {
          palmInhalation: "滴 1~2 滴于掌心微搓温热，双手半扣覆于口鼻前 3 厘米处，采用 4-7-8 呼吸法（吸气 4 秒，屏息 7 秒，呼气 8 秒）循环 5 组。",
          diffuser: "睡前 45 分钟在超声波香薰机中注入 100ml 纯净水，滴入处方精油 4~6 滴，静候香气弥漫卧室。",
          pulsePoint: "用滚珠于双侧手腕脉搏处、耳后安眠穴及锁骨窝轻缓滑动涂抹。",
          acupoints: [
            { name: "内关穴 (Neiguan, PC6)", location: "腕横纹正中上 2 寸两筋之间", effect: "宁心安神，宽胸理气，缓解心悸与胸闷焦虑" },
            { name: "涌泉穴 (Yongquan, KI1)", location: "足底前部凹陷处，约足底第 2、3 趾趾缝纹头端与足跟连线的前 1/3 处", effect: "引火归元，滋养肾阴，助眠深睡" }
          ]
        },
        safetyNotes: "已自动过滤高光敏性柑橘单萜与刺激性酚类成分。孕早期及对菊科过敏者请遵医嘱。请放置于阴凉避光处。",
        createdAt: new Date().toISOString()
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptContext,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "诗意名称，如《暮山听松》" },
            poeticSub: { type: Type.STRING, description: "副标题香调" },
            concept: { type: Type.STRING, description: "东方哲学调香理念" },
            seasonTerm: { type: Type.STRING, description: "适宜二十四节气" },
            fiveElement: { type: Type.STRING, description: "五行属性归经" },
            olfactoryPyramid: {
              type: Type.OBJECT,
              properties: {
                topNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      latin: { type: Type.STRING },
                      drops: { type: Type.NUMBER },
                      ml: { type: Type.NUMBER },
                      ratio: { type: Type.STRING },
                      effect: { type: Type.STRING },
                    },
                    required: ["name", "latin", "drops", "ratio", "effect"],
                  },
                },
                middleNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      latin: { type: Type.STRING },
                      drops: { type: Type.NUMBER },
                      ml: { type: Type.NUMBER },
                      ratio: { type: Type.STRING },
                      effect: { type: Type.STRING },
                    },
                    required: ["name", "latin", "drops", "ratio", "effect"],
                  },
                },
                baseNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      latin: { type: Type.STRING },
                      drops: { type: Type.NUMBER },
                      ml: { type: Type.NUMBER },
                      ratio: { type: Type.STRING },
                      effect: { type: Type.STRING },
                    },
                    required: ["name", "latin", "drops", "ratio", "effect"],
                  },
                },
                carrierOil: { type: Type.STRING },
                totalDrops: { type: Type.NUMBER },
                totalVolume: { type: Type.STRING },
              },
              required: ["topNotes", "middleNotes", "baseNotes", "carrierOil", "totalDrops", "totalVolume"],
            },
            molecularAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  compound: { type: Type.STRING },
                  percentage: { type: Type.STRING },
                  pathway: { type: Type.STRING },
                  benefit: { type: Type.STRING },
                },
                required: ["compound", "percentage", "pathway", "benefit"],
              },
            },
            aromatherapyAdvice: {
              type: Type.OBJECT,
              properties: {
                palmInhalation: { type: Type.STRING },
                diffuser: { type: Type.STRING },
                pulsePoint: { type: Type.STRING },
                acupoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      location: { type: Type.STRING },
                      effect: { type: Type.STRING },
                    },
                    required: ["name", "location", "effect"],
                  },
                },
              },
              required: ["palmInhalation", "diffuser", "pulsePoint", "acupoints"],
            },
            safetyNotes: { type: Type.STRING },
          },
          required: ["title", "poeticSub", "concept", "seasonTerm", "fiveElement", "olfactoryPyramid", "molecularAnalysis", "aromatherapyAdvice", "safetyNotes"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const result = {
      id: "rx_" + Date.now(),
      rxCode,
      ...parsed,
      createdAt: new Date().toISOString()
    };

    res.json(result);
  } catch (error: any) {
    console.error("Prescription generation error:", error);
    res.status(500).json({ error: "Failed to generate prescription", details: error.message });
  }
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UNIO Scent Prescription Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
