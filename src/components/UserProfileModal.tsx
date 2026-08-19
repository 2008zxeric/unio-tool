import React, { useState } from "react";
import {
  X,
  User,
  Heart,
  ShieldAlert,
  Sparkles,
  Check,
  Calendar,
  AlertCircle,
  Leaf,
  Smile,
  Cat,
  Zap
} from "lucide-react";
import { UserProfile } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (newProfile: UserProfile) => void;
}

const COMMON_HEALTH_CONDITIONS = [
  { id: "migraine", label: "易偏头痛 / 头部昏沉", category: "pain", icon: Zap },
  { id: "insomnia", label: "易失眠多梦 / 浅眠早醒", category: "sleep", icon: Heart },
  { id: "anxiety", label: "工作高压 / 焦虑烦躁 / 易心悸", category: "emotion", icon: Smile },
  { id: "asthma", label: "哮喘 / 呼吸道高敏 / 易咳嗽", category: "respiratory", icon: Leaf },
  { id: "rhinitis", label: "过敏性鼻炎 / 换季鼻塞", category: "respiratory", icon: Leaf },
  { id: "hypertension", label: "血压偏高 (需避开过激升压)", category: "circulatory", icon: Heart },
  { id: "hypotension", label: "血压偏低 (需避开过量镇静)", category: "circulatory", icon: Heart },
  { id: "skin_sensitive", label: "敏感肌 / 屏障脆弱 (需低敏配比)", category: "skin", icon: AlertCircle },
  { id: "menstruation", label: "痛经 / 经期不适 / 经前烦躁", category: "female", icon: Heart },
  { id: "pregnancy", label: "备孕中 / 怀孕期 (需严格孕期安全)", category: "special", icon: ShieldAlert },
  { id: "nursing", label: "哺乳期 (需避开通乳受阻精油)", category: "special", icon: ShieldAlert },
  { id: "pets", label: "家有猫狗宠物 (需宠物安全无茶树酚)", category: "lifestyle", icon: Cat },
  { id: "fatigue", label: "常态性疲惫 / 气虚乏力 / 湿重", category: "body", icon: Leaf },
  { id: "none", label: "无特殊基础病 / 体质健康均衡", category: "healthy", icon: Check }
];

const SCENT_FAMILIES = [
  "东方木质 (沉香/檀香/雪松)",
  "清雅茶香 (高山白茶/岩茶)",
  "清润柑橘 (佛手柑/红橘/甜橙)",
  "典雅花香 (玫瑰/橙花/茉莉)",
  "安神草本 (真正薰衣草/苦橙叶)",
  "灵性树脂 (阿曼乳香/没药)",
  "冷冽针叶 (冷杉/杜松/黑云杉)"
];

const PRESETS: { title: string; desc: string; data: Partial<UserProfile> }[] = [
  {
    title: "都市白领 · 高压失眠",
    desc: "26-35岁 · 易失眠焦虑 · 偶发偏头痛 · 偏爱木质茶香",
    data: {
      gender: "female",
      ageRange: "26-35",
      healthConditions: ["易失眠多梦 / 浅眠早醒", "工作高压 / 焦虑烦躁 / 易心悸", "易偏头痛 / 头部昏沉"],
      favoriteFamilies: ["东方木质 (沉香/檀香/雪松)", "清雅茶香 (高山白茶/岩茶)"]
    }
  },
  {
    title: "居家有宠 · 敏感肌呵护",
    desc: "家有猫咪 · 屏障敏感 · 严格过滤茶树与高酚类",
    data: {
      gender: "female",
      ageRange: "26-35",
      healthConditions: ["家有猫狗宠物 (需宠物安全无茶树酚)", "敏感肌 / 屏障脆弱 (需低敏配比)"],
      favoriteFamilies: ["安神草本 (真正薰衣草/苦橙叶)", "清润柑橘 (佛手柑/红橘/甜橙)"]
    }
  },
  {
    title: "东方文人 · 养生静心",
    desc: "36-45岁 · 气虚易疲惫 · 偏爱沉香乳香树脂调",
    data: {
      gender: "male",
      ageRange: "36-45",
      healthConditions: ["常态性疲惫 / 气虚乏力 / 湿重"],
      favoriteFamilies: ["东方木质 (沉香/檀香/雪松)", "灵性树脂 (阿曼乳香/没药)"]
    }
  }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const toggleCondition = (label: string) => {
    setFormData((prev) => {
      if (label.includes("无特殊基础病")) {
        return { ...prev, healthConditions: [label] };
      }
      const filtered = prev.healthConditions.filter((c) => !c.includes("无特殊基础病"));
      const exists = filtered.includes(label);
      const updated = exists ? filtered.filter((c) => c !== label) : [...filtered, label];
      return {
        ...prev,
        healthConditions: updated.length === 0 ? ["无特殊基础病 / 体质健康均衡"] : updated
      };
    });
    audioEngine.playDropletSound();
  };

  const toggleFamily = (fam: string) => {
    setFormData((prev) => {
      const exists = prev.favoriteFamilies.includes(fam);
      return {
        ...prev,
        favoriteFamilies: exists
          ? prev.favoriteFamilies.filter((f) => f !== fam)
          : [...prev.favoriteFamilies, fam]
      };
    });
    audioEngine.playDropletSound();
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      ...preset.data,
      isProfileSet: true
    }));
    audioEngine.strikeSingingBowl(528);
  };

  const handleSave = () => {
    onSaveProfile({
      ...formData,
      isProfileSet: true
    });
    audioEngine.playDropletSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F0] border border-[#D5CCA8] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1C2E20] via-[#243B2A] to-[#1C2E20] text-[#FAF8F3] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-sc text-base sm:text-lg font-bold text-[#E5DCBE]">
                我的健康档案与基础信息
              </h2>
              <p className="text-xs text-stone-300 font-serif-sc">
                AI 在每次调香问诊与开方时，将自动引用并严格遵循此安全基线
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif-sc font-bold text-[#1C2E20] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                一键套用常见画像模板：
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className="p-3 rounded-2xl bg-white hover:bg-[#FAF4E6] border border-[#E5DEC9] hover:border-[#D4AF37] text-left transition-all shadow-2xs group"
                >
                  <div className="font-serif-sc font-bold text-xs text-[#1C2E20] group-hover:text-[#941B1B]">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                    {preset.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Gender & Age Range */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5DEC9] space-y-4 shadow-2xs">
            <div className="font-serif-sc font-bold text-sm text-[#1C2E20] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px]">
                1
              </span>
              <span>性别与生理阶段</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: "female", label: "女性 (生理关怀)" },
                { value: "male", label: "男性 (阳气调和)" },
                { value: "other", label: "其他" },
                { value: "unspecified", label: "保密/通用" }
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, gender: g.value as any }));
                    audioEngine.playDropletSound();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-serif-sc transition-all border ${
                    formData.gender === g.value
                      ? "bg-[#1C2E20] text-[#D4AF37] border-[#1C2E20] font-bold shadow-2xs"
                      : "bg-[#FAF7F0] text-stone-700 border-[#DDD5C2] hover:border-stone-400"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-stone-500 font-serif-sc block mb-1.5">
                年龄段 (用于精油安全稀释比与神经耐受度计算)：
              </label>
              <div className="flex flex-wrap gap-2">
                {["18-25", "26-35", "36-45", "46-60", "60+"].map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, ageRange: age as any }));
                      audioEngine.playDropletSound();
                    }}
                    className={`py-1.5 px-3.5 rounded-xl text-xs font-mono transition-all border ${
                      formData.ageRange === age
                        ? "bg-[#1C2E20] text-[#D4AF37] border-[#1C2E20] font-bold shadow-2xs"
                        : "bg-[#FAF7F0] text-stone-700 border-[#DDD5C2] hover:border-stone-400"
                    }`}
                  >
                    {age} 岁
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Chronic Health Conditions / Concerns */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5DEC9] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="font-serif-sc font-bold text-sm text-[#1C2E20] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>常态健康关注与禁忌 (可多选)</span>
              </div>
              <span className="text-[10px] text-stone-400 font-serif-sc">
                AI 将自动进行安全排查与浓度调控
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_HEALTH_CONDITIONS.map((cond) => {
                const isSelected = formData.healthConditions.includes(cond.label);
                return (
                  <button
                    key={cond.id}
                    onClick={() => toggleCondition(cond.label)}
                    className={`p-2.5 rounded-xl text-left text-xs font-serif-sc transition-all border flex items-center justify-between ${
                      isSelected
                        ? "bg-[#1C2E20] text-[#FAF8F3] border-[#1C2E20] font-bold shadow-2xs"
                        : "bg-[#FAF7F0] text-stone-700 border-[#DDD5C2] hover:border-stone-400"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <cond.icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#D4AF37]" : "text-stone-500"}`} />
                      <span>{cond.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Favorite Scent Families */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5DEC9] space-y-3 shadow-2xs">
            <div className="font-serif-sc font-bold text-sm text-[#1C2E20] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1C2E20] text-[#D4AF37] flex items-center justify-center text-[10px]">
                3
              </span>
              <span>偏好香气家族 (可多选)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SCENT_FAMILIES.map((fam) => {
                const isSelected = formData.favoriteFamilies.includes(fam);
                return (
                  <button
                    key={fam}
                    onClick={() => toggleFamily(fam)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif-sc transition-all border ${
                      isSelected
                        ? "bg-[#1C2E20] text-[#D4AF37] border-[#1C2E20] font-bold shadow-2xs"
                        : "bg-[#FAF7F0] text-stone-700 border-[#DDD5C2] hover:border-stone-400"
                    }`}
                  >
                    {fam}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#FAF4E6] border-t border-[#E5DEC9] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-serif-sc text-stone-600 hover:text-stone-900"
          >
            取消
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#1C2E20] hover:bg-[#2A4430] text-[#D4AF37] font-serif-sc font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 border border-[#D4AF37]/50"
          >
            <Check className="w-4 h-4 text-[#D4AF37]" />
            <span>保存并同步至 AI 调香大脑</span>
          </button>
        </div>
      </div>
    </div>
  );
};
