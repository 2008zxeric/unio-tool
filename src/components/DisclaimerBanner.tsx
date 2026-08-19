import React, { useState } from "react";
import { ShieldCheck, X, AlertCircle } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#1C2E20]/90 text-[#E8E2D5] text-xs px-4 py-2.5 flex items-center justify-between border-b border-[#2C4432] backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1">
        <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
        <p className="leading-tight text-[11px] sm:text-xs">
          <span className="font-semibold text-[#D4AF37]">【芳疗健康免责声明】</span>
          本处方由 AI 芳香顾问根据嗅觉心理学与天然芳疗学提供建议，仅供日常香氛体验与身心放松使用，不可替代任何医疗诊断或药物治疗。
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-[#E8E2D5]/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors ml-2"
        title="关闭提醒"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
