import React, { useState, useMemo } from "react";
import {
  Sparkles,
  TreePine,
  Flame,
  Mountain,
  Waves,
  Sun,
  Maximize2,
  Minimize2,
  Compass,
  Activity,
  Zap,
  Info,
  ChevronRight,
  TrendingUp,
  Shield,
  Heart
} from "lucide-react";
import { audioEngine } from "../utils/audioEngine";

export interface FiveElementScores {
  wood: number;   // 木 (0-100)
  fire: number;   // 火 (0-100)
  earth: number;  // 土 (0-100)
  metal: number;  // 金 (0-100)
  water: number;  // 水 (0-100)
}

export interface EmotionCoordinate {
  x: number; // 气机升降: -1 (沉降收敛) to +1 (升散清越)
  y: number; // 情绪状态: -1 (烦扰郁滞/虚耗) to +1 (宁和平顺/喜乐)
  dominantState: string;
  quadrantName: string;
  tcmSyndrome: string;
  remedyPrinciple: string;
  suggestedOils: string[];
}

interface FiveElementBalanceGraphProps {
  dialogueText: string;
  chatHistory: Array<{ role: string; content: string }>;
  currentStage?: number;
  onElementClick?: (elementName: string, promptText: string) => void;
  className?: string;
  compact?: boolean;
}

// Five Element definitions with TCM correlations and oils
const ELEMENT_CONFIG = {
  wood: {
    name: "木",
    organ: "肝 / 胆",
    emotion: "怒 · 郁结与急躁",
    color: "#2D5A27",
    lightColor: "#E8F0E6",
    accentColor: "#4E8752",
    glowColor: "rgba(45, 90, 39, 0.4)",
    keywords: ["烦躁", "郁闷", "叹气", "胸闷", "高压", "偏头痛", "紧绷", "工作累", "急躁", "眼干", "失控", "怒", "疏肝", "解郁"],
    keyOils: ["苦橙叶", "佛手柑", "罗马洋甘菊", "快乐鼠尾草"],
    action: "疏肝理气 · 平抑肝阳",
    icon: TreePine
  },
  fire: {
    name: "火",
    organ: "心 / 小肠",
    emotion: "喜 · 心烦多梦与神躁",
    color: "#941B1B",
    lightColor: "#FAECEB",
    accentColor: "#C23A3A",
    glowColor: "rgba(148, 27, 27, 0.4)",
    keywords: ["失眠", "多梦", "心烦", "心慌", "不易入睡", "早醒", "燥热", "亢奋", "脑热", "思绪纷飞", "清心", "降火", "安神"],
    keyOils: ["高地真薰衣草", "摩洛哥橙花", "大马士革玫瑰", "依兰依兰"],
    action: "清心降火 · 宁心安神",
    icon: Flame
  },
  earth: {
    name: "土",
    organ: "脾 / 胃",
    emotion: "思 · 忧思反刍与身重",
    color: "#B8860B",
    lightColor: "#FDF8E7",
    accentColor: "#D4AF37",
    glowColor: "rgba(184, 134, 11, 0.4)",
    keywords: ["疲惫", "乏力", "困重", "脑雾", "胡思乱想", "反刍", "消化差", "腹胀", "食欲", "胃口", "沉重", "健脾", "定心"],
    keyOils: ["东印度老山檀香", "印度广藿香", "甜橙", "生姜"],
    action: "健脾和胃 · 培土固元",
    icon: Mountain
  },
  metal: {
    name: "金",
    organ: "肺 / 大肠",
    emotion: "悲 · 气虚少气与悲忧",
    color: "#6B7280",
    lightColor: "#F3F4F6",
    accentColor: "#9CA3AF",
    glowColor: "rgba(107, 114, 128, 0.4)",
    keywords: ["咳嗽", "咽干", "呼吸", "胸闷", "短气", "悲伤", "低落", "雾霾", "鼻塞", "感冒", "清肺", "白茶", "通窍"],
    keyOils: ["阿曼绿乳香", "西伯利亚冷杉", "澳洲尤加利", "茶树"],
    action: "宣肺肃降 · 清润化滞",
    icon: Waves
  },
  water: {
    name: "水",
    organ: "肾 / 膀胱",
    emotion: "恐 · 精力透支与虚寒",
    color: "#1E3A8A",
    lightColor: "#EFF6FF",
    accentColor: "#3B82F6",
    glowColor: "rgba(30, 58, 138, 0.4)",
    keywords: ["腰酸", "畏寒", "怕冷", "精力透支", "虚弱", "恐惧", "心虚", "沉香", "禅修", "冥想", "丹田", "固本", "滋阴"],
    keyOils: ["海南沉香", "海地岩兰草", "大西洋雪松", "杜松浆果"],
    action: "滋肾涵木 · 引火归元",
    icon: Sun
  }
};

export const FiveElementBalanceGraph: React.FC<FiveElementBalanceGraphProps> = ({
  dialogueText,
  chatHistory,
  onElementClick,
  className = "",
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<"radar" | "coordinate">("radar");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Compute live scores and emotional coordinate based on conversation
  const analysisResult = useMemo(() => {
    // Combine full user text for semantic weighting
    const allUserTexts = chatHistory
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" ") + " " + dialogueText;

    const lowerText = allUserTexts.toLowerCase();

    // Base baseline values (dynamic harmony ~50)
    let wScore = 50;
    let fScore = 50;
    let eScore = 50;
    let mScore = 50;
    let uScore = 50;

    // Scan for element keywords
    ELEMENT_CONFIG.wood.keywords.forEach((kw) => {
      if (lowerText.includes(kw)) wScore += 18;
    });
    ELEMENT_CONFIG.fire.keywords.forEach((kw) => {
      if (lowerText.includes(kw)) fScore += 18;
    });
    ELEMENT_CONFIG.earth.keywords.forEach((kw) => {
      if (lowerText.includes(kw)) eScore += 18;
    });
    ELEMENT_CONFIG.metal.keywords.forEach((kw) => {
      if (lowerText.includes(kw)) mScore += 18;
    });
    ELEMENT_CONFIG.water.keywords.forEach((kw) => {
      if (lowerText.includes(kw)) uScore += 18;
    });

    // Special scene heuristics
    if (lowerText.includes("睡") || lowerText.includes("梦") || lowerText.includes("失眠")) {
      fScore += 25; // Heart fire / Shen disturbance
      uScore += 15; // Water kidney essence needed for sedation
    }
    if (lowerText.includes("高压") || lowerText.includes("烦") || lowerText.includes("闷") || lowerText.includes("累")) {
      wScore += 28; // Wood Liver Qi stagnation
      eScore += 15; // Spleen exhaustion
    }
    if (lowerText.includes("专注") || lowerText.includes("清醒") || lowerText.includes("头脑")) {
      mScore += 20; // Metal Lung clarity
      wScore += 10;
    }
    if (lowerText.includes("禅") || lowerText.includes("静") || lowerText.includes("沉香") || lowerText.includes("打坐")) {
      uScore += 30; // Water grounding
      eScore += 20;
    }

    // Clamp between 20 and 96
    const clamp = (val: number) => Math.min(96, Math.max(25, val));
    const scores: FiveElementScores = {
      wood: clamp(wScore),
      fire: clamp(fScore),
      earth: clamp(eScore),
      metal: clamp(mScore),
      water: clamp(uScore)
    };

    // Calculate dynamic balance index (standard deviation from mean)
    const values = [scores.wood, scores.fire, scores.earth, scores.metal, scores.water];
    const mean = values.reduce((a, b) => a + b, 0) / 5;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 5;
    const stdDev = Math.sqrt(variance);
    const balanceIndex = Math.max(45, Math.min(99, Math.round(100 - stdDev * 1.5)));

    // Find highest & lowest elements
    const elementsList = [
      { key: "wood", name: "木", score: scores.wood },
      { key: "fire", name: "火", score: scores.fire },
      { key: "earth", name: "土", score: scores.earth },
      { key: "metal", name: "金", score: scores.metal },
      { key: "water", name: "水", score: scores.water }
    ];
    elementsList.sort((a, b) => b.score - a.score);
    const dominant = elementsList[0];
    const deficient = elementsList[elementsList.length - 1];

    // Compute 2D Emotional Coordinate (X: Qi Dynamic, Y: Hedonic Valence / Shen Balance)
    // X > 0: 升散/清爽, X < 0: 沉降/收敛
    // Y > 0: 宁和/舒泰, Y < 0: 焦躁/紧绷/耗损
    let xCoord = (scores.wood * 0.4 + scores.metal * 0.6 - scores.water * 0.5 - scores.earth * 0.5) / 60;
    let yCoord = (70 - (scores.wood * 0.5 + scores.fire * 0.5) + (scores.water * 0.3 + scores.earth * 0.3)) / 50;

    // Clamp coords between -0.85 and +0.85
    xCoord = Math.max(-0.85, Math.min(0.85, xCoord));
    yCoord = Math.max(-0.85, Math.min(0.85, yCoord));

    let quadrantName = "平和从容象限";
    let dominantState = "气机冲和 · 身心平衡";
    let tcmSyndrome = "五脏生克平衡，阴平阳秘";
    let remedyPrinciple = "四时调和，保元守真";
    let suggestedOils = ["高地真薰衣草", "意大利苦橙叶", "老山檀香"];

    if (xCoord >= 0 && yCoord >= 0) {
      quadrantName = "第一象限 · 升发清旷 (阳和畅达)";
      dominantState = "灵台清朗 · 气机通畅";
      tcmSyndrome = "心神开朗，肺金得宣";
      remedyPrinciple = "宜白茶、迷迭香与冷杉以助心流";
      suggestedOils = ["西伯利亚冷杉", "阿曼绿乳香", "意大利佛手柑"];
    } else if (xCoord < 0 && yCoord >= 0) {
      quadrantName = "第二象限 · 沉潜定志 (阴凝蓄力)";
      dominantState = "安神入定 · 沉稳内敛";
      tcmSyndrome = "肾水充盈，虚火渐敛";
      remedyPrinciple = "宜沉香、檀香与岩兰草深层固本";
      suggestedOils = ["东印度老山檀香", "海南沉香", "海地岩兰草"];
    } else if (xCoord < 0 && yCoord < 0) {
      quadrantName = "第三象限 · 气滞痰湿 (虚郁困倦)";
      dominantState = "身重少气 · 情绪抑郁";
      tcmSyndrome = "脾虚湿阻，肝气不舒";
      remedyPrinciple = "宜广藿香、苦橙叶以健脾行气";
      suggestedOils = ["印度广藿香", "意大利苦橙叶", "罗马洋甘菊"];
    } else {
      quadrantName = "第四象限 · 浮越燥火 (心神不宁)";
      dominantState = "肝火偏旺 · 神经紧绷";
      tcmSyndrome = "心火上炎，夜间难寐";
      remedyPrinciple = "宜普罗旺斯薰衣草与橙花降火安神";
      suggestedOils = ["高地真薰衣草", "摩洛哥橙花", "马达加斯加依兰"];
    }

    const coordinate: EmotionCoordinate = {
      x: xCoord,
      y: yCoord,
      dominantState,
      quadrantName,
      tcmSyndrome,
      remedyPrinciple,
      suggestedOils
    };

    return {
      scores,
      balanceIndex,
      dominant,
      deficient,
      coordinate
    };
  }, [dialogueText, chatHistory]);

  // Pentagon Radar Geometry calculations (Center at 150, 150, radius 100)
  const radarCenter = { x: 150, y: 150 };
  const maxRadius = 95;
  // 5 vertices order: Wood (top right 18°), Fire (top 90° - or standard top-center), Earth, Metal, Water
  // Let's standardly orient: Top = Fire (-90°), Top-Right = Earth (-18°), Bottom-Right = Metal (54°), Bottom-Left = Water (126°), Top-Left = Wood (198°)
  // Traditional Five Elements cycle: Wood(top/East) -> Fire(South) -> Earth(Center) -> Metal(West) -> Water(North)
  // Let's lay out Wood (top), Fire (top-right), Earth (bottom-right), Metal (bottom-left), Water (top-left)
  const elementAngles = [
    { key: "wood", angle: -90, name: "木", config: ELEMENT_CONFIG.wood },
    { key: "fire", angle: -18, name: "火", config: ELEMENT_CONFIG.fire },
    { key: "earth", angle: 54, name: "土", config: ELEMENT_CONFIG.earth },
    { key: "metal", angle: 126, name: "金", config: ELEMENT_CONFIG.metal },
    { key: "water", angle: 198, name: "水", config: ELEMENT_CONFIG.water }
  ];

  const getPoint = (angleDeg: number, radiusRatio: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: radarCenter.x + maxRadius * radiusRatio * Math.cos(angleRad),
      y: radarCenter.y + maxRadius * radiusRatio * Math.sin(angleRad)
    };
  };

  // Generate polygon points string for a given ratio
  const getPolygonPoints = (ratios: number[]) => {
    return elementAngles
      .map((e, idx) => {
        const pt = getPoint(e.angle, ratios[idx]);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");
  };

  const userRatios = [
    analysisResult.scores.wood / 100,
    analysisResult.scores.fire / 100,
    analysisResult.scores.earth / 100,
    analysisResult.scores.metal / 100,
    analysisResult.scores.water / 100
  ];
  const userPolygonString = getPolygonPoints(userRatios);

  return (
    <div
      className={`bg-white/95 rounded-3xl border border-[#E5DEC9] shadow-md transition-all duration-300 overflow-hidden ${
        isExpanded ? "p-6" : compact ? "p-3.5" : "p-5"
      } ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1C2E20] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-2xs">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif-sc font-bold text-xs sm:text-sm text-[#1C2E20]">
                实时五行气机与情绪坐标态
              </h4>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#1C2E20]/8 text-[#1C2E20] font-bold border border-[#D4AF37]/30">
                AI 随言同步推演
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-serif-sc">
              {analysisResult.coordinate.dominantState}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Visual Mode Selector Switch */}
          <div className="flex items-center p-0.5 bg-[#FAF7F0] rounded-xl border border-[#DCD3BE] text-[10px] font-serif-sc">
            <button
              onClick={() => {
                setActiveTab("radar");
                audioEngine.playDropletSound();
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === "radar"
                  ? "bg-[#1C2E20] text-[#FAF8F3] font-bold shadow-2xs"
                  : "text-stone-600 hover:text-[#1C2E20]"
              }`}
            >
              五行雷达星盘
            </button>
            <button
              onClick={() => {
                setActiveTab("coordinate");
                audioEngine.playDropletSound();
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === "coordinate"
                  ? "bg-[#1C2E20] text-[#FAF8F3] font-bold shadow-2xs"
                  : "text-stone-600 hover:text-[#1C2E20]"
              }`}
            >
              情绪气机象限
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-stone-400 hover:text-[#1C2E20] hover:bg-[#FAF4E6] transition-colors"
            title={isExpanded ? "收起视图" : "全景放大"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Visual Display Grid */}
      <div className={`grid ${isExpanded ? "grid-cols-1 md:grid-cols-12 gap-6" : "grid-cols-1 gap-3"}`}>
        {/* Left/Center Visual Canvas */}
        <div className={`${isExpanded ? "md:col-span-7" : "w-full"} flex flex-col items-center justify-center`}>
          {activeTab === "radar" ? (
            /* TAB 1: Five Elements Energy Pentagon Radar */
            <div className="relative w-full max-w-[290px] aspect-square flex items-center justify-center p-2">
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-sm select-none">
                <defs>
                  {/* Glowing Radar Gradients */}
                  <linearGradient id="userRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2D5A27" stopOpacity="0.45" />
                    <stop offset="35%" stopColor="#941B1B" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.5" />
                  </linearGradient>

                  <radialGradient id="centerYinYangGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Subtle Background Glow */}
                <circle cx="150" cy="150" r="110" fill="url(#centerYinYangGlow)" />

                {/* Concentric Reference Rings (20%, 40%, 60%, 80%, 100%) */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, idx) => (
                  <polygon
                    key={idx}
                    points={getPolygonPoints([ratio, ratio, ratio, ratio, ratio])}
                    fill={idx === 4 ? "#FAF7F0" : "none"}
                    fillOpacity={idx === 4 ? 0.6 : 0}
                    stroke="#DCD3BE"
                    strokeWidth={idx === 4 ? "1.5" : "0.8"}
                    strokeDasharray={idx === 4 ? "none" : "3,3"}
                  />
                ))}

                {/* Axis Radial Lines */}
                {elementAngles.map((e, idx) => {
                  const pt = getPoint(e.angle, 1.0);
                  return (
                    <line
                      key={idx}
                      x1="150"
                      y1="150"
                      x2={pt.x}
                      y2={pt.y}
                      stroke="#D8CFBA"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* 相生 / Generating Flow Cycle (Golden faint dotted circle/pentagon) */}
                <polygon
                  points={getPolygonPoints([0.98, 0.98, 0.98, 0.98, 0.98])}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                  strokeDasharray="2,2"
                />

                {/* User Current Energy Polygon (Animated & Pulsing) */}
                <polygon
                  points={userPolygonString}
                  fill="url(#userRadarGrad)"
                  stroke="#1C2E20"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Five Element Vertex Nodes */}
                {elementAngles.map((elem, idx) => {
                  const score = analysisResult.scores[elem.key as keyof FiveElementScores];
                  const currentPt = getPoint(elem.angle, score / 100);
                  const labelPt = getPoint(elem.angle, 1.25);
                  const isHovered = hoveredElement === elem.key;

                  return (
                    <g
                      key={elem.key}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredElement(elem.key)}
                      onMouseLeave={() => setHoveredElement(null)}
                      onClick={() => {
                        audioEngine.playDropletSound();
                        if (onElementClick) {
                          onElementClick(
                            elem.name,
                            `我想重点调和【${elem.name}行 · ${elem.config.organ}】（当前状态：${elem.config.emotion}）`
                          );
                        }
                      }}
                    >
                      {/* Dynamic Point on polygon */}
                      <circle
                        cx={currentPt.x}
                        cy={currentPt.y}
                        r={isHovered ? "6.5" : "4.5"}
                        fill={elem.config.color}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all duration-500 ease-out drop-shadow-xs"
                      />

                      {/* Vertex Base Seal Node */}
                      <circle
                        cx={labelPt.x}
                        cy={labelPt.y}
                        r="14"
                        fill={elem.config.lightColor}
                        stroke={elem.config.color}
                        strokeWidth={isHovered ? "2" : "1.2"}
                        className="transition-transform group-hover:scale-110 drop-shadow-xs"
                      />

                      {/* Element Chinese Character */}
                      <text
                        x={labelPt.x}
                        y={labelPt.y + 4}
                        textAnchor="middle"
                        fill={elem.config.color}
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="serif"
                      >
                        {elem.name}
                      </text>

                      {/* Score Value text */}
                      <text
                        x={labelPt.x}
                        y={labelPt.y + (elem.angle > 0 && elem.angle < 180 ? 18 : -17)}
                        textAnchor="middle"
                        fill="#4B5563"
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        {score}%
                      </text>
                    </g>
                  );
                })}

                {/* Center Core: Balance Index */}
                <circle cx="150" cy="150" r="18" fill="#1C2E20" stroke="#D4AF37" strokeWidth="1.5" />
                <text
                  x="150"
                  y="147"
                  textAnchor="middle"
                  fill="#D4AF37"
                  fontSize="7"
                  fontFamily="serif"
                  fontWeight="bold"
                >
                  冲和度
                </text>
                <text
                  x="150"
                  y="159"
                  textAnchor="middle"
                  fill="#FAF8F3"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {analysisResult.balanceIndex}
                </text>
              </svg>
            </div>
          ) : (
            /* TAB 2: Emotional & Qi Dynamic Cartesian Quadrant */
            <div className="relative w-full max-w-[290px] aspect-square flex items-center justify-center p-2">
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-sm select-none">
                <defs>
                  <radialGradient id="quadrantPulseGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#941B1B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#941B1B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background Box with 4 Quadrants Tinting */}
                <rect x="25" y="25" width="125" height="125" fill="#FAF4E6" fillOpacity="0.5" rx="8" />
                <rect x="150" y="25" width="125" height="125" fill="#E8F0E6" fillOpacity="0.5" rx="8" />
                <rect x="25" y="150" width="125" height="125" fill="#FDF8E7" fillOpacity="0.5" rx="8" />
                <rect x="150" y="150" width="125" height="125" fill="#FAECEB" fillOpacity="0.5" rx="8" />

                {/* Grid Axes */}
                <line x1="25" y1="150" x2="275" y2="150" stroke="#C5BCA8" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="150" y1="25" x2="150" y2="275" stroke="#C5BCA8" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Axis Labels */}
                <text x="275" y="145" textAnchor="end" fill="#6B7280" fontSize="9" fontFamily="serif" fontWeight="bold">
                  升散清越 ➔
                </text>
                <text x="28" y="145" textAnchor="start" fill="#6B7280" fontSize="9" fontFamily="serif" fontWeight="bold">
                  ⬅ 沉潜敛降
                </text>
                <text x="155" y="38" textAnchor="start" fill="#6B7280" fontSize="9" fontFamily="serif" fontWeight="bold">
                  ⬆ 宁和平顺 (正向)
                </text>
                <text x="155" y="268" textAnchor="start" fill="#6B7280" fontSize="9" fontFamily="serif" fontWeight="bold">
                  ⬇ 紧绷烦扰 (耗损)
                </text>

                {/* Quadrant Titles */}
                <text x="205" y="80" textAnchor="middle" fill="#2D5A27" fontSize="10" fontFamily="serif" fontWeight="bold">
                  清朗通达
                </text>
                <text x="95" y="80" textAnchor="middle" fill="#1E3A8A" fontSize="10" fontFamily="serif" fontWeight="bold">
                  深潜安神
                </text>
                <text x="95" y="215" textAnchor="middle" fill="#B8860B" fontSize="10" fontFamily="serif" fontWeight="bold">
                  气滞湿阻
                </text>
                <text x="205" y="215" textAnchor="middle" fill="#941B1B" fontSize="10" fontFamily="serif" fontWeight="bold">
                  浮越心火
                </text>

                {/* Current Dynamic Emotional Point */}
                {(() => {
                  const targetX = 150 + analysisResult.coordinate.x * 110;
                  // In SVG, Y is down, so positive Y means lower, hence subtract
                  const targetY = 150 - analysisResult.coordinate.y * 110;

                  return (
                    <g className="transition-all duration-700 ease-out">
                      {/* Ripple Wave Circle */}
                      <circle cx={targetX} cy={targetY} r="22" fill="url(#quadrantPulseGlow)" className="animate-ping" opacity="0.4" />
                      <circle cx={targetX} cy={targetY} r="14" fill="#FAF8F3" stroke="#941B1B" strokeWidth="2" />
                      <circle cx={targetX} cy={targetY} r="6" fill="#941B1B" />

                      {/* Live Pin Label */}
                      <rect
                        x={targetX - 32}
                        y={targetY - 26}
                        width="64"
                        height="16"
                        rx="4"
                        fill="#1C2E20"
                        stroke="#D4AF37"
                        strokeWidth="0.8"
                      />
                      <text
                        x={targetX}
                        y={targetY - 15}
                        textAnchor="middle"
                        fill="#FAF8F3"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="serif"
                      >
                        此刻心境坐标
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          )}

          {/* Quick Balance Status Summary Pill */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF4E6] border border-[#D5CCA8] text-[#1C2E20] font-serif-sc">
              主导：<strong className="text-[#941B1B]">{analysisResult.dominant.name}行 ({analysisResult.dominant.score}%)</strong>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF4E6] border border-[#D5CCA8] text-[#1C2E20] font-serif-sc">
              需补：<strong className="text-[#2D5A27]">{analysisResult.deficient.name}行 ({analysisResult.deficient.score}%)</strong>
            </span>
          </div>
        </div>

        {/* Right Details Panel (Interactive TCM & Essential Oils Blueprint) */}
        <div className={`${isExpanded ? "md:col-span-5" : "w-full"} space-y-2.5 pt-1`}>
          {/* Syndrome & Remedy Principle */}
          <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E2DBC8] space-y-1.5 text-xs font-serif-sc">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-500 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#941B1B]" />
                <span>病机推演：</span>
              </span>
              <span className="font-bold text-[#1C2E20]">{analysisResult.coordinate.tcmSyndrome}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#2D5A27]" />
                <span>治则法度：</span>
              </span>
              <span className="font-bold text-[#2D5A27]">{analysisResult.coordinate.remedyPrinciple}</span>
            </div>
          </div>

          {/* Real-time Five Elements Quick Filter & Response Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-stone-500 font-serif-sc">
              <span>点击五行即可向宗师快速追问：</span>
              <span className="text-[#D4AF37]">相生相克调和</span>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {(Object.keys(ELEMENT_CONFIG) as Array<keyof typeof ELEMENT_CONFIG>).map((key) => {
                const cfg = ELEMENT_CONFIG[key];
                const score = analysisResult.scores[key];
                const isDom = analysisResult.dominant.key === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      audioEngine.playDropletSound();
                      if (onElementClick) {
                        onElementClick(
                          cfg.name,
                          `请针对我当前的【${cfg.name}行 · ${cfg.organ}】（气机：${cfg.action}），为我调配最适宜的君臣本草。`
                        );
                      }
                    }}
                    className={`p-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      isDom
                        ? "bg-[#1C2E20] text-white border-[#D4AF37] shadow-xs"
                        : "bg-white hover:bg-[#FAF4E6] text-stone-700 border-[#E2DBC8]"
                    }`}
                  >
                    <div className="text-[11px] font-serif-sc font-bold flex items-center gap-0.5">
                      <span>{cfg.name}</span>
                      <span className={`text-[9px] ${isDom ? "text-[#D4AF37]" : "text-stone-400"}`}>{score}%</span>
                    </div>
                    <div className={`text-[8px] truncate max-w-full ${isDom ? "text-stone-300" : "text-stone-400"}`}>
                      {cfg.organ.split("/")[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Synergistic Essential Oils Pills */}
          <div className="bg-white p-2.5 rounded-2xl border border-[#E5DEC9] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#1C2E20] font-serif-sc flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>即刻适配协同单方：</span>
              </span>
              <span className="text-[9px] text-stone-400 font-serif-sc">平衡气机核心</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {analysisResult.coordinate.suggestedOils.map((oil, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    audioEngine.playDropletSound();
                    if (onElementClick) {
                      onElementClick(oil, `我想在配方中加入【${oil}】，请评估其对当下身心的协同疗愈效果。`);
                    }
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F0] hover:bg-[#1C2E20] hover:text-white border border-[#DCD3BE] text-[#332A22] font-serif-sc transition-all flex items-center gap-0.5"
                >
                  <span>🌿 {oil}</span>
                  <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
