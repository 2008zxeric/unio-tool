import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  MessageSquare,
  ClipboardList,
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  TreePine,
  Waves,
  Mountain,
  Sun,
  Moon,
  Feather,
  HeartPulse,
  Brain,
  Shield,
  HelpCircle,
  Volume2,
  ChevronRight,
  UserCheck,
  Compass,
  Sliders,
  Leaf,
  Layers,
  Award,
  ArrowRight,
  ShieldCheck,
  Check,
  User,
  Edit3,
  CheckSquare,
  Smile,
  Zap,
  Info,
  Clock,
  Sparkle
} from "lucide-react";
import { ConsultationFormState, ScentPrescription, UserProfile } from "../types";
import { audioEngine } from "../utils/audioEngine";
import { FiveElementBalanceGraph } from "./FiveElementBalanceGraph";
import { UserProfileModal } from "./UserProfileModal";

interface ConsultationViewProps {
  onPrescriptionGenerated: (rx: ScentPrescription) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
  stage?: number;
  interactiveOptions?: string[];
  diagnosis?: {
    element: string;
    scene: string;
    keyHerbs: string[];
    qiState: string;
    recommendationLevel: number;
    pyramidPreview?: {
      top: string;
      middle: string;
      base: string;
    };
  };
}

const DEFAULT_USER_PROFILE: UserProfile = {
  gender: "female",
  ageRange: "26-35",
  healthConditions: ["易失眠多梦 / 浅眠早醒", "工作高压 / 焦虑烦躁 / 易心悸"],
  sensitivities: [],
  favoriteFamilies: ["东方木质 (沉香/檀香/雪松)", "清雅茶香 (高山白茶/岩茶)"],
  isProfileSet: true
};

const STEP_SCENES = [
  {
    id: "deep_sleep",
    label: "深度助眠与安神",
    desc: "调节神经节律，抚平中枢亢奋，切断睡前反刍",
    icon: Moon,
    element: "水",
    defaultHerbs: ["真正薰衣草", "东印度老山檀香", "阿曼绿乳香"]
  },
  {
    id: "stress_relief",
    label: "疏肝解郁与降火",
    desc: "平抑皮质醇过载，化解胸中郁闷，顺畅深呼吸",
    icon: Feather,
    element: "木",
    defaultHerbs: ["意大利苦橙叶", "意大利佛手柑", "西伯利亚冷杉"]
  },
  {
    id: "focus_mind",
    label: "灵台专注与清明",
    desc: "驱散案牍倦怠与脑雾，营造深度办公学习结界",
    icon: Brain,
    element: "金",
    defaultHerbs: ["桉油醇迷迭香", "高山野生白茶", "喜马拉雅雪松"]
  },
  {
    id: "respiratory",
    label: "宣肺清润与通窍",
    desc: "换季呼吸道呵护，洗涤浊气，通畅鼻腔气道",
    icon: Mountain,
    element: "金",
    defaultHerbs: ["澳洲尤加利", "绿乳香", "欧洲赤松"]
  },
  {
    id: "menstruation",
    label: "经期温通与暖宫",
    desc: "温经散寒，抚平经前烦躁，活血舒缓小腹紧绷",
    icon: HeartPulse,
    element: "火",
    defaultHerbs: ["快乐鼠尾草", "罗马洋甘菊", "生姜精萃"]
  },
  {
    id: "space_purify",
    label: "空间净澈与除障",
    desc: "居家或办公室气场净化，提振精神，驱除浊气",
    icon: TreePine,
    element: "木",
    defaultHerbs: ["欧洲赤松", "甜橙", "杜松浆果"]
  },
  {
    id: "meditation_zen",
    label: "东方禅修与引气",
    desc: "打坐静心，天地共振，气沉丹田的高定木质沉香",
    icon: Compass,
    element: "土",
    defaultHerbs: ["海南降真香", "老山檀香", "阿曼绿乳香"]
  }
];

const STEP_SCENT_FAMILIES = [
  { id: "oriental_wood", label: "东方木质", desc: "老山檀香、沉香、雪松", icon: TreePine },
  { id: "tea_scent", label: "清雅茶香", desc: "高山白茶、武夷岩茶", icon: Leaf },
  { id: "citrus_fresh", label: "清润柑橘", desc: "意大利佛手柑、苦橙叶、红橘", icon: Sun },
  { id: "floral_elegant", label: "典雅花香", desc: "大马士革玫瑰、橙花、茉莉", icon: Sparkles },
  { id: "herb_calm", label: "安神草本", desc: "高地真薰衣草、罗马洋甘菊", icon: Moon },
  { id: "resin_sacred", label: "灵性树脂", desc: "阿曼绿乳香、没药、降真香", icon: Flame }
];

const STEP_USAGE_TYPES = [
  { id: "pulse_roll", label: "10ml 随身滚珠油", desc: "点涂手腕内关、耳后印堂，随行芳香屏障", icon: Sliders },
  { id: "diffuser", label: "空间超声波香薰", desc: "滴入香薰机扩香，满室温润芬芳", icon: Waves },
  { id: "palm_inhalation", label: "睡前掌心吸嗅", desc: "滴在掌心搓热，配合深长腹式呼吸", icon: Moon },
  { id: "body_massage", label: "温润身体按摩油", desc: "搭配植物基础油，肩颈与背部疏通", icon: HeartPulse }
];

export const ConsultationView: React.FC<ConsultationViewProps> = ({
  onPrescriptionGenerated,
  isLoading,
  setIsLoading
}) => {
  // Main Entry Mode: "guided_steps" (常用步骤锁定) vs "direct_chat" (直接对话)
  const [activeMode, setActiveMode] = useState<"guided_steps" | "direct_chat">("guided_steps");

  // User Profile State (persisted in localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("unio_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync Profile to LocalStorage
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem("unio_user_profile", JSON.stringify(newProfile));
  };

  // Step-by-Step Wizard State
  const [stepWizard, setStepWizard] = useState({
    scene: STEP_SCENES[0],
    scentFamily: STEP_SCENT_FAMILIES[0],
    usageType: STEP_USAGE_TYPES[0]
  });

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      role: "assistant",
      content: `千人千面，一人一方。我是 UNIO 东方首席调香宗师。

我已调取您的健康与体质档案（${userProfile.gender === "female" ? "女性" : "男性"} · ${userProfile.ageRange}岁 · ${userProfile.healthConditions.slice(0, 2).join(" / ")}）。

请向我倾诉：您此时此刻的身心状态如何？有什么特别期待调和的体感或香气偏好？`,
      time: "此刻",
      interactiveOptions: [
        "近期高压脑力疲乏，夜间多梦不易深睡",
        "胸口微闷烦躁，容易叹气，求疏肝解郁",
        "案牍劳形昏沉，为办公室定制清明专注香",
        "想定制一瓶让人彻底安静的东方沉香与白茶"
      ],
      diagnosis: {
        element: "木",
        scene: "深度睡眠与抗焦解压",
        keyHerbs: ["真正薰衣草", "东印度老山檀香", "意大利苦橙叶"],
        qiState: "气机待调 · 心神待定",
        recommendationLevel: 95,
        pyramidPreview: {
          top: "意大利苦橙叶 · 3滴",
          middle: "高地真薰衣草 · 6滴",
          base: "老山檀香 · 2滴"
        }
      }
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Current Live Diagnosis Tracker
  const [currentDiagnosis, setCurrentDiagnosis] = useState<{
    element: string;
    scene: string;
    keyHerbs: string[];
    qiState: string;
    recommendationLevel: number;
    pyramidPreview?: {
      top: string;
      middle: string;
      base: string;
    };
  }>({
    element: "木",
    scene: "深度睡眠与安神",
    keyHerbs: ["真正薰衣草", "东印度老山檀香", "意大利苦橙叶"],
    qiState: "疏肝理气 · 潜阳宁神",
    recommendationLevel: 98,
    pyramidPreview: {
      top: "意大利苦橙叶 (清润疏肝)",
      middle: "普罗旺斯真薰衣草 (平衡神经)",
      base: "东印度老山檀香 (下沉定神)"
    }
  });

  // Face Scan Modal / Camera State
  const [isFaceScanOpen, setIsFaceScanOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [faceScanData, setFaceScanData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll chat
  useEffect(() => {
    if (activeMode === "direct_chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeMode]);

  // Handle Send Chat Message
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isSending) return;

    audioEngine.playDropletSound();
    const newUserMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      content: userText.trim(),
      time: "刚刚"
    };

    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    setInputValue("");
    setIsSending(true);

    // If user explicitly asks to generate prescription
    if (
      userText.includes("开具专属处方") ||
      userText.includes("直接生成") ||
      userText.includes("生成处方") ||
      userText.includes("生成我的高定处方笺")
    ) {
      setTimeout(() => {
        handleGeneratePrescription();
      }, 400);
      return;
    }

    try {
      const res = await fetch("/api/prescriptions/consult-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          userState: {
            scene: currentDiagnosis.scene,
            lastDiagnosis: currentDiagnosis
          }
        })
      });

      const data = await res.json();
      audioEngine.strikeSingingBowl(528);

      const aiMsg: ChatMessage = {
        id: "msg_ai_" + Date.now(),
        role: "assistant",
        content: data.reply || "我已体察您的心神气机，已为您精选契合的五行本草。",
        time: "刚刚",
        interactiveOptions: data.suggestedQuickReplies?.slice(0, 3),
        diagnosis: data.detectedDiagnosis
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.detectedDiagnosis) {
        setCurrentDiagnosis((prev) => ({
          ...prev,
          ...data.detectedDiagnosis,
          pyramidPreview: {
            top: data.detectedDiagnosis.keyHerbs[0]
              ? `${data.detectedDiagnosis.keyHerbs[0]} (前调清润)`
              : prev.pyramidPreview?.top || "苦橙叶",
            middle: data.detectedDiagnosis.keyHerbs[1]
              ? `${data.detectedDiagnosis.keyHerbs[1]} (中调抚慰)`
              : prev.pyramidPreview?.middle || "真正薰衣草",
            base: data.detectedDiagnosis.keyHerbs[2]
              ? `${data.detectedDiagnosis.keyHerbs[2]} (后调定神)`
              : prev.pyramidPreview?.base || "老山檀香"
          }
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Launch Full Bespoke Prescription Generation
  const handleGeneratePrescription = async () => {
    setIsLoading(true);
    audioEngine.strikeSingingBowl(432);

    try {
      const res = await fetch("/api/prescriptions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene: currentDiagnosis.scene || stepWizard.scene.label,
          mindBodyState: `【用户诉求】: ${stepWizard.scene.desc}；【香调偏好】: ${stepWizard.scentFamily.label}；【使用方式】: ${stepWizard.usageType.label}`,
          constitution: `${currentDiagnosis.element}行`,
          sleepQuality: userProfile.healthConditions.includes("易失眠多梦 / 浅眠早醒") ? "浅眠多梦" : "正常",
          airwaySensitivity: userProfile.healthConditions.includes("哮喘 / 呼吸道高敏 / 易咳嗽") ? "呼吸道高敏" : "正常",
          preferences: [stepWizard.scentFamily.label, ...userProfile.favoriteFamilies],
          contraindications: userProfile.healthConditions,
          userNote: `定制方式：${activeMode === "guided_steps" ? "步骤锁定" : "AI对话"}`,
          userProfile,
          faceScanData
        })
      });

      if (res.status === 503) {
        throw new Error("AI 调香宗师当前正在处理大量请求，请稍候片刻再尝试生成处方。");
      }

      if (!res.ok) {
        throw new Error(`生成失败 (代码: ${res.status})，请重试。`);
      }

      const newRx: ScentPrescription = await res.json();
      audioEngine.strikeSingingBowl(528);
      onPrescriptionGenerated(newRx);
    } catch (error) {
      console.error("Prescription generation error:", error);
      alert(error instanceof Error ? error.message : "生成处方时发生未知错误，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  // Step Wizard -> Trigger AI Chat with pre-populated prompt
  const handleStartChatFromWizard = () => {
    const summaryPrompt = `我已通过常用步骤锁定我的调理需求：
1. 核心场景：${stepWizard.scene.label} (${stepWizard.scene.desc})
2. 香气偏好：${stepWizard.scentFamily.label} (${stepWizard.scentFamily.desc})
3. 使用剂型：${stepWizard.usageType.label}
结合我的健康档案（${userProfile.gender === "female" ? "女性" : "男性"} · ${userProfile.ageRange}岁 · 基础关注: ${userProfile.healthConditions.join("、")}），请为我研判五行归经与精油分子君臣佐使配伍！`;

    setActiveMode("direct_chat");
    handleSendMessage(summaryPrompt);
  };

  // Face Scan handlers
  const handleStartCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      alert("无法启动摄像头，请检查权限或直接上传照片。");
      setIsCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.85);
      analyzeFaceImage(base64);
    }
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        analyzeFaceImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeFaceImage = async (base64Image: string) => {
    setIsScanningFace(true);
    audioEngine.playDropletSound();
    try {
      const res = await fetch("/api/prescriptions/analyze-face-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Image })
      });
      const data = await res.json();
      setFaceScanData(data);
      audioEngine.strikeSingingBowl(528);

      // Auto-update live diagnosis
      setCurrentDiagnosis((prev) => ({
        ...prev,
        element: data.suggestedElements?.[0] || prev.element,
        scene: data.detectedMood || prev.scene,
        keyHerbs: data.recommendedNotes?.slice(0, 3) || prev.keyHerbs
      }));

      // Add message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: "msg_facescan_" + Date.now(),
          role: "assistant",
          content: `【面容识神望诊报告】
气色研判：${data.complexionAnalysis || "面带倦容，目力疲乏"}
当下情绪：${data.detectedMood || "心火偏旺"} · 能量水平：${data.energyLevel || "中等待充盈"}
推荐五行归经：${(data.suggestedElements || ["木", "水"]).join("、")} 行
推荐单方：${(data.recommendedNotes || ["高地真薰衣草", "东印度老山檀香"]).join("、")}`,
          time: "刚刚"
        }
      ]);
      setIsFaceScanOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanningFace(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner & Profile Bar */}
      <div className="hallmark-paper p-5 sm:p-7 rounded-3xl border border-[#E0D7C4] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#8C7A6B]">
                UNIO BESPOKE AI MASTER
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C2E20] text-[#D4AF37] font-serif-sc font-bold border border-[#D4AF37]/30 shadow-2xs">
                千人千面 · 一人一方
              </span>
            </div>
            <h2 className="font-serif-sc text-xl sm:text-2xl font-bold text-[#1C2E20]">
              东方高定身心芳香问诊台
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-serif-sc mt-1">
              依据您的身体体质底色、即时失衡与气味偏好，AI 调香宗师与临床芳疗学实时推演君臣佐使专属配方
            </p>
          </div>

          {/* Quick Facial Scan Entry Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFaceScanOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FAF4E6] border border-[#D5CCA8] text-xs font-serif-sc text-[#1C2E20] font-bold transition-all shadow-2xs flex items-center gap-1.5 hover:border-[#D4AF37]"
            >
              <Camera className="w-4 h-4 text-[#D4AF37]" />
              <span>面容识神望诊</span>
              <span className="text-[10px] bg-[#941B1B] text-white px-1.5 py-0.2 rounded-full">AI视觉</span>
            </button>
          </div>
        </div>

        {/* Dynamic User Health Dossier Bar */}
        <div className="mt-4 pt-3.5 border-t border-[#EAE3D2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF4E6]/70 p-3 rounded-2xl border border-[#E5DEC9]">
          <div className="flex items-center gap-2.5 flex-wrap text-xs font-serif-sc text-[#1C2E20]">
            <div className="flex items-center gap-1.5 font-bold text-[#8C7A6B] shrink-0">
              <User className="w-4 h-4 text-[#1C2E20]" />
              <span>我的基础健康底色：</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-white px-2.5 py-0.5 rounded-lg border border-[#D5CCA8] shadow-2xs">
                {userProfile.gender === "female" ? "👤 女性" : userProfile.gender === "male" ? "👤 男性" : "👤 通用"} · {userProfile.ageRange}岁
              </span>

              {userProfile.healthConditions.slice(0, 3).map((cond, idx) => (
                <span key={idx} className="bg-white px-2.5 py-0.5 rounded-lg border border-[#D5CCA8] shadow-2xs text-[#941B1B] font-semibold">
                  🛡️ {cond.split(" (")[0]}
                </span>
              ))}

              {userProfile.favoriteFamilies.slice(0, 2).map((fam, idx) => (
                <span key={idx} className="bg-white px-2.5 py-0.5 rounded-lg border border-[#D5CCA8] shadow-2xs text-stone-600">
                  🌿 {fam.split(" (")[0]}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="text-xs font-serif-sc font-bold px-3 py-1.5 rounded-xl bg-[#1C2E20] hover:bg-[#2A4430] text-[#D4AF37] border border-[#D4AF37]/40 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>完善 / 修改健康档案</span>
          </button>
        </div>
      </div>

      {/* 2. Main Switcher Tabs: 常用步骤锁定 (Guided Steps) vs 直接对话 (Direct AI Chat) */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            setActiveMode("guided_steps");
            audioEngine.playDropletSound();
          }}
          className={`px-5 sm:px-8 py-3 rounded-2xl font-serif-sc font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-xs ${
            activeMode === "guided_steps"
              ? "bg-[#1C2E20] text-[#FAF8F3] ring-2 ring-[#D4AF37]/50 shadow-md scale-102"
              : "bg-white/90 text-stone-700 hover:bg-white border border-[#DDD5C2]"
          }`}
        >
          <Sliders className="w-4 h-4 text-[#D4AF37]" />
          <span>① 常用步骤锁定需求</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF7F0] text-[#1C2E20] font-sans font-bold">
            新手推荐
          </span>
        </button>

        <button
          onClick={() => {
            setActiveMode("direct_chat");
            audioEngine.playDropletSound();
          }}
          className={`px-5 sm:px-8 py-3 rounded-2xl font-serif-sc font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-xs ${
            activeMode === "direct_chat"
              ? "bg-[#1C2E20] text-[#FAF8F3] ring-2 ring-[#D4AF37]/50 shadow-md scale-102"
              : "bg-white/90 text-stone-700 hover:bg-white border border-[#DDD5C2]"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <span>② 直接 AI 自由对话</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#941B1B] text-white font-sans font-bold">
            千人千面
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE A: 常用步骤锁定需求 (Guided 4-Step Discovery) */}
      {/* ========================================================================= */}
      {activeMode === "guided_steps" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Step 1: Core Scene Selection */}
          <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-7 border border-[#E5DEC9] shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#1C2E20] text-[#D4AF37] font-serif-sc text-sm font-bold flex items-center justify-center border border-[#D4AF37]/40 shadow-2xs">
                1
              </div>
              <div>
                <h3 className="font-serif-sc font-bold text-base sm:text-lg text-[#1C2E20]">
                  选择即时急需的身心调理场景
                </h3>
                <p className="text-xs text-stone-500 font-serif-sc">
                  系统将依据所选场景锚定神经受体与五行归经调理方向
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STEP_SCENES.map((item) => {
                const Icon = item.icon;
                const isSelected = stepWizard.scene.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setStepWizard((prev) => ({ ...prev, scene: item }));
                      setCurrentDiagnosis((prev) => ({
                        ...prev,
                        scene: item.label,
                        element: item.element,
                        keyHerbs: item.defaultHerbs
                      }));
                      audioEngine.playDropletSound();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[120px] ${
                      isSelected
                        ? "bg-[#1C2E20] text-[#FAF8F3] border-[#1C2E20] shadow-md ring-2 ring-[#D4AF37]/50 scale-[1.01]"
                        : "bg-[#FDFBF7] text-[#2C2824] border-[#E8E2D3] hover:border-[#D4AF37] hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? "text-[#D4AF37]" : "text-[#1C2E20]"}`} />
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-serif-sc font-bold ${isSelected ? "bg-white/20 text-[#D4AF37]" : "bg-stone-200 text-stone-700"}`}>
                          {item.element}行
                        </span>
                      </div>
                      <h4 className="font-serif-sc font-bold text-sm leading-tight">{item.label}</h4>
                    </div>
                    <p className={`text-[11px] mt-2 line-clamp-2 ${isSelected ? "text-[#D8D2C4]" : "text-stone-500"}`}>
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Scent Family Preference */}
          <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-7 border border-[#E5DEC9] shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#1C2E20] text-[#D4AF37] font-serif-sc text-sm font-bold flex items-center justify-center border border-[#D4AF37]/40 shadow-2xs">
                2
              </div>
              <div>
                <h3 className="font-serif-sc font-bold text-base sm:text-lg text-[#1C2E20]">
                  选择心仪的嗅觉香调主线
                </h3>
                <p className="text-xs text-stone-500 font-serif-sc">
                  调香大师将基于该香调家族进行前中后调层次搭配
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {STEP_SCENT_FAMILIES.map((item) => {
                const Icon = item.icon;
                const isSelected = stepWizard.scentFamily.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setStepWizard((prev) => ({ ...prev, scentFamily: item }));
                      audioEngine.playDropletSound();
                    }}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-[#1C2E20] text-[#FAF8F3] border-[#1C2E20] shadow-md ring-2 ring-[#D4AF37]/50"
                        : "bg-[#FDFBF7] text-[#2C2824] border-[#E8E2D3] hover:border-[#D4AF37] hover:bg-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-[#D4AF37]" : "text-[#1C2E20]"}`} />
                    <span className="font-serif-sc font-bold text-xs">{item.label}</span>
                    <span className={`text-[9px] line-clamp-1 ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Usage Scenario & Format */}
          <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-7 border border-[#E5DEC9] shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#1C2E20] text-[#D4AF37] font-serif-sc text-sm font-bold flex items-center justify-center border border-[#D4AF37]/40 shadow-2xs">
                3
              </div>
              <div>
                <h3 className="font-serif-sc font-bold text-base sm:text-lg text-[#1C2E20]">
                  期望使用的生活仪式与剂型
                </h3>
                <p className="text-xs text-stone-500 font-serif-sc">
                  系统将依据剂型计算精确安全稀释比例（Tisserand 国际标准）
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STEP_USAGE_TYPES.map((item) => {
                const Icon = item.icon;
                const isSelected = stepWizard.usageType.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setStepWizard((prev) => ({ ...prev, usageType: item }));
                      audioEngine.playDropletSound();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#1C2E20] text-[#FAF8F3] border-[#1C2E20] shadow-md ring-2 ring-[#D4AF37]/50"
                        : "bg-[#FDFBF7] text-[#2C2824] border-[#E8E2D3] hover:border-[#D4AF37] hover:bg-white"
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isSelected ? "bg-white/10 text-[#D4AF37]" : "bg-[#FAF7F0] text-[#1C2E20]"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif-sc font-bold text-xs sm:text-sm">{item.label}</h4>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Summary & Dual Launch Gateways */}
          <div className="hallmark-cotton-card p-6 sm:p-8 rounded-3xl border border-[#D5CCA8] shadow-md space-y-5 bg-[#FAF4E6]">
            <div className="flex items-center justify-between border-b border-[#E2DBC9] pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif-sc font-bold text-base sm:text-lg text-[#1C2E20]">
                  已锁定需求与健康底色汇总
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#1C2E20] text-[#D4AF37] font-bold">
                就绪开方
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-serif-sc">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E5DEC9] space-y-1">
                <span className="text-stone-400 text-[10px]">调理诉求</span>
                <div className="font-bold text-[#1C2E20] text-sm">{stepWizard.scene.label}</div>
                <div className="text-stone-500 text-[11px]">{stepWizard.scene.desc}</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#E5DEC9] space-y-1">
                <span className="text-stone-400 text-[10px]">香调家族与用法</span>
                <div className="font-bold text-[#1C2E20] text-sm">{stepWizard.scentFamily.label}</div>
                <div className="text-stone-500 text-[11px]">{stepWizard.usageType.label}</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#E5DEC9] space-y-1">
                <span className="text-stone-400 text-[10px]">已结合健康底色</span>
                <div className="font-bold text-[#941B1B] text-sm">
                  {userProfile.gender === "female" ? "女性" : "男性"} · {userProfile.ageRange}岁
                </div>
                <div className="text-stone-500 text-[11px]">
                  {userProfile.healthConditions.slice(0, 2).join("、") || "无特殊禁忌"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Option 1: Start Chat with this context */}
              <button
                onClick={handleStartChatFromWizard}
                className="py-4 px-6 rounded-2xl bg-white hover:bg-[#FAF7F0] border-2 border-[#1C2E20] text-[#1C2E20] font-serif-sc font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-xs group"
              >
                <MessageSquare className="w-4 h-4 text-[#1C2E20] group-hover:scale-110 transition-transform" />
                <span>进入 AI 对话深入微调聊聊</span>
                <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Option 2: Generate Prescription Instantly */}
              <button
                onClick={handleGeneratePrescription}
                disabled={isLoading}
                className="py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1C2E20] via-[#2A4430] to-[#1C2E20] text-[#FAF8F3] font-serif-sc font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    <span>调香宗师正在雕琢专属处方笺...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span>一键生成专属高定处方笺</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE B: 直接 AI 自由对话 (Direct AI Scent Master Dialogue) */}
      {/* ========================================================================= */}
      {activeMode === "direct_chat" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Chat Window (7 cols on lg) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2DBC8] shadow-xs flex flex-col h-[650px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#1C2E20] via-[#243B2A] to-[#1C2E20] text-[#FAF8F3] flex items-center justify-between border-b border-[#D4AF37]/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-serif-sc font-bold text-xs">
                    宗
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-sc font-bold text-sm text-[#E5DCBE]">UNIO 东方调香宗师</h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <p className="text-[10px] text-stone-300 font-serif-sc">
                      已同步健康档案：{userProfile.gender === "female" ? "女性" : "男性"} · {userProfile.ageRange}岁 · {userProfile.healthConditions.slice(0, 2).join("、")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setMessages([
                        {
                          id: "msg_reset_" + Date.now(),
                          role: "assistant",
                          content: `千人千面，一人一方。我是 UNIO 东方首席调香宗师。\n\n我已调取您的健康档案（${userProfile.gender === "female" ? "女性" : "男性"} · ${userProfile.ageRange}岁 · ${userProfile.healthConditions.slice(0, 2).join(" / ")}）。\n\n请向我倾诉您此刻的身心感受与香气偏好。`,
                          time: "此刻",
                          interactiveOptions: [
                            "近期高压脑力疲乏，夜间多梦不易深睡",
                            "胸口微闷烦躁，容易叹气，求疏肝解郁",
                            "案牍劳形昏沉，为办公室定制清明专注香",
                            "想定制一瓶让人彻底安静的东方沉香与白茶"
                          ]
                        }
                      ]);
                      audioEngine.playDropletSound();
                    }}
                    className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="重置对话"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {messages.map((msg) => {
                  const isAi = msg.role === "assistant";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
                    >
                      {isAi && (
                        <div className="w-8 h-8 rounded-lg bg-[#1C2E20] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif-sc text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                          方
                        </div>
                      )}

                      <div
                        className={`max-w-[86%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all shadow-2xs ${
                          isAi
                            ? "bg-white border border-[#E2DBC8] text-[#2C2824] rounded-tl-none font-serif-sc"
                            : "bg-[#1C2E20] text-[#FAF8F3] rounded-tr-none font-sans border border-[#1C2E20]"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>

                        {/* Interactive Option Capsules inside message */}
                        {isAi && msg.interactiveOptions && msg.interactiveOptions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-[#EAE3D2] space-y-1.5">
                            <span className="text-[10px] text-stone-400 font-serif-sc">点击快速应答：</span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.interactiveOptions.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSendMessage(opt)}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF7F0] hover:bg-[#1C2E20] hover:text-white border border-[#D5CCA8] text-[#4A4035] transition-all font-serif-sc flex items-center gap-1 shadow-2xs"
                                >
                                  <span>{opt}</span>
                                  <ChevronRight className="w-3 h-3 opacity-60" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mini AI Diagnosis Card inside message */}
                        {isAi && msg.diagnosis && (
                          <div className="mt-3 pt-2.5 border-t border-[#EAE3D2] flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#941B1B]"></span>
                              <span className="font-bold text-[#1C2E20]">五行推演：{msg.diagnosis.element}行 ({msg.diagnosis.qiState})</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[#8C7A6B]">
                              <Leaf className="w-3 h-3 text-[#1C2E20]" />
                              <span>推荐单方：{msg.diagnosis.keyHerbs.slice(0, 2).join("、")}</span>
                            </div>
                          </div>
                        )}

                        <div className={`text-[9px] mt-1.5 text-right ${isAi ? "text-stone-400" : "text-[#D8D2C4]/70"}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isSending && (
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-serif-sc italic p-2 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                    <span>调香宗师正在结合您的健康档案研判五行分子配伍...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-[#E2DBC9] flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  placeholder="向调香宗师倾诉您的疲累、睡眠、体感或喜欢的香气..."
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#FAF7F0] border border-[#DDD5C2] text-[#1C2E20] focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isSending}
                  className="p-2.5 rounded-xl bg-[#1C2E20] hover:bg-[#2A4430] text-[#D4AF37] disabled:opacity-40 transition-all shadow-xs"
                  title="发送信息"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Live Dynamic Five-Element Balance HUD + Bespoke Formula Blueprint (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Dynamic Real-time Five-Element & Emotional Coordinate Graph */}
              <FiveElementBalanceGraph
                dialogueText={inputValue}
                chatHistory={messages}
                currentStage={2}
                onElementClick={(_elem, promptText) => handleSendMessage(promptText)}
              />

              {/* Hallmark Live Formula Blueprint Card */}
              <div className="hallmark-cotton-card p-5 space-y-4 relative overflow-hidden bg-white rounded-3xl border border-[#E2DBC8] shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E2DBC9] pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="font-serif-sc font-bold text-sm text-[#1C2E20]">高定香方实时推演看板</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C2E20] text-[#D4AF37] font-bold">
                    契合度 {currentDiagnosis.recommendationLevel}%
                  </span>
                </div>

                {/* Five Element & Qi State */}
                <div className="bg-[#FAF4E6] p-3.5 rounded-2xl border border-[#D5CCA8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-serif-sc">主调五行归属</span>
                    <span className="font-serif-sc font-bold text-sm text-[#1C2E20] bg-white px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 shadow-2xs">
                      {currentDiagnosis.element} 行
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-serif-sc">气机状态</span>
                    <span className="text-xs font-serif-sc text-[#1C2E20] font-semibold">
                      {currentDiagnosis.qiState}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-serif-sc">调理场景</span>
                    <span className="text-xs font-serif-sc text-[#941B1B] font-bold">
                      {currentDiagnosis.scene}
                    </span>
                  </div>
                </div>

                {/* Olfactory Pyramid Blueprint Preview */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#E5DEC9] space-y-2 text-xs font-serif-sc shadow-2xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-bold text-[#1C2E20] flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#1C2E20]" />
                      <span>君臣佐使推演结构</span>
                    </span>
                    <span className="text-[10px] text-stone-400">10ml 滚珠油</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">前调 (君药/透亮)</span>
                      <span className="font-semibold text-[#1C2E20]">{currentDiagnosis.pyramidPreview?.top || "苦橙叶"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">中调 (臣药/核心)</span>
                      <span className="font-semibold text-[#1C2E20]">{currentDiagnosis.pyramidPreview?.middle || "真正薰衣草"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">后调 (佐使/定香)</span>
                      <span className="font-semibold text-[#1C2E20]">{currentDiagnosis.pyramidPreview?.base || "老山檀香"}</span>
                    </div>
                  </div>
                </div>

                {/* Main Generate Hallmark Button */}
                <button
                  onClick={handleGeneratePrescription}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1C2E20] via-[#243B2A] to-[#1C2E20] text-[#FAF8F3] font-serif-sc font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md border border-[#D4AF37]/50 flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>正在雕琢专属高定处方笺...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
                      <span>即刻生成专属高定处方笺</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Facial Scan Modal */}
      {isFaceScanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF7F0] border border-[#D5CCA8] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0D7C5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-xs font-bold">
                  望
                </div>
                <h3 className="font-serif-sc font-bold text-base text-[#1C2E20]">五行面容识神望诊</h3>
              </div>
              <button
                onClick={() => {
                  setIsFaceScanOpen(false);
                  if (isCameraActive && videoRef.current?.srcObject) {
                    (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                    setIsCameraActive(false);
                  }
                }}
                className="text-stone-400 hover:text-stone-800 text-sm"
              >
                关闭
              </button>
            </div>

            <p className="text-xs text-stone-600 font-serif-sc">
              通过面部气色与微表情倦怠度，AI 智能辅助研判当下五行气机偏颇
            </p>

            {/* Video preview or upload box */}
            <div className="rounded-2xl border-2 border-dashed border-[#D5CCA8] bg-white p-4 flex flex-col items-center justify-center min-h-[220px] overflow-hidden relative">
              {isCameraActive ? (
                <div className="w-full h-full flex flex-col items-center">
                  <video ref={videoRef} autoPlay playsInline className="rounded-xl max-h-[200px] w-auto object-cover" />
                  <button
                    onClick={handleCapturePhoto}
                    className="mt-3 px-5 py-2 rounded-xl bg-[#1C2E20] text-[#D4AF37] text-xs font-serif-sc font-bold shadow-md"
                  >
                    拍摄并分析气色
                  </button>
                </div>
              ) : isScanningFace ? (
                <div className="flex flex-col items-center gap-2 text-xs font-serif-sc text-stone-600 py-8">
                  <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin" />
                  <span>Gemini 视觉正在辨识面色光泽与五行气机...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Camera className="w-8 h-8 text-[#8C7A6B]" />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStartCamera}
                      className="px-4 py-2 rounded-xl bg-[#1C2E20] text-[#D4AF37] text-xs font-serif-sc font-bold"
                    >
                      开启摄像头
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white border border-[#D5CCA8] text-stone-700 text-xs font-serif-sc"
                    >
                      上传面部照片
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
