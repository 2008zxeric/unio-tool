import React, { useState } from "react";
import { BookOpen, Sparkles, Plus, Search, Filter, Bookmark, History, FlaskConical, ArrowRight } from "lucide-react";
import { ScentPrescription } from "../types";
import { PrescriptionCard } from "./PrescriptionCard";
import { CURATED_PRESCRIPTIONS } from "../data/scentDatabase";

interface PrescriptionViewProps {
  prescriptions: ScentPrescription[];
  currentPrescription: ScentPrescription | null;
  onSelectPrescription: (rx: ScentPrescription) => void;
  onToggleFavorite: (id: string) => void;
  onOrderBespoke: (prescription: ScentPrescription) => void;
  onStartBreathworkWithAroma: (prescription: ScentPrescription) => void;
  onGoToConsultation: () => void;
  onGoToBlender?: (prescription: ScentPrescription) => void;
  onLogMood?: (prescription: ScentPrescription) => void;
}

export const PrescriptionView: React.FC<PrescriptionViewProps> = ({
  prescriptions,
  currentPrescription,
  onSelectPrescription,
  onToggleFavorite,
  onOrderBespoke,
  onStartBreathworkWithAroma,
  onGoToConsultation,
  onGoToBlender,
  onLogMood
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "favorites" | "master">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allItems = [...prescriptions, ...CURATED_PRESCRIPTIONS.filter(c => !prescriptions.some(p => p.id === c.id))];

  const filteredItems = allItems.filter(item => {
    if (filterMode === "favorites" && !item.isFavorite) return false;
    if (filterMode === "master" && !item.id.startsWith("rx_curated")) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.poeticSub.toLowerCase().includes(q) ||
        item.rxCode.toLowerCase().includes(q) ||
        item.fiveElement.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedRx = currentPrescription || allItems[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2DDCF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold tracking-widest text-[#8C7A6B]">UNIO ARCHIVE</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1C2E20]/10 text-[#1C2E20] font-medium">电子处方笺档案库</span>
          </div>
          <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20] tracking-tight mt-1">
            高定身心处方档案
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
            查阅、复配、导出并打样您的专属 AI 嗅觉处方笺
          </p>
        </div>

        <button
          onClick={onGoToConsultation}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1C2E20] text-white hover:bg-[#28422E] text-xs sm:text-sm font-bold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>开具新的芳香处方</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prescription List & Filters (4 Cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索处方名、编号、五行、精油..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9D2C2] text-xs text-[#2A2621] placeholder:text-stone-400 outline-none focus:ring-1 focus:ring-[#1C2E20]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === "all" ? "bg-[#1C2E20] text-white" : "bg-white text-stone-600 border border-[#DCD5C5]"
                }`}
              >
                全部处方 ({allItems.length})
              </button>
              <button
                onClick={() => setFilterMode("favorites")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === "favorites" ? "bg-[#1C2E20] text-white" : "bg-white text-stone-600 border border-[#DCD5C5]"
                }`}
              >
                已收藏 ({allItems.filter(i => i.isFavorite).length})
              </button>
              <button
                onClick={() => setFilterMode("master")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === "master" ? "bg-[#1C2E20] text-white" : "bg-white text-stone-600 border border-[#DCD5C5]"
                }`}
              >
                经典宗师配方
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = selectedRx?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectPrescription(item)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative ${
                    isSelected
                      ? "bg-[#1C2E20] text-white border-[#1C2E20] shadow-md ring-2 ring-[#C5A880]/50"
                      : "bg-white text-[#2C2824] border-[#E2DAD0] hover:border-[#C5A880]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-mono text-[10px] font-bold ${isSelected ? "text-[#D4AF37]" : "text-stone-500"}`}>
                      {item.rxCode}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? "bg-white/15 text-stone-200" : "bg-[#EAE5D9] text-[#4A4035]"}`}>
                      {item.seasonTerm}
                    </span>
                  </div>

                  <h3 className="font-serif-sc font-bold text-base">{item.title}</h3>
                  <p className={`text-xs ${isSelected ? "text-stone-300" : "text-stone-500"} line-clamp-1 mt-0.5`}>
                    {item.poeticSub}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/10 text-[11px]">
                    <span className={isSelected ? "text-[#D4AF37]" : "text-emerald-800 font-medium"}>
                      {item.fiveElement}
                    </span>
                    <span className={isSelected ? "text-stone-300" : "text-stone-400"}>
                      {item.olfactoryPyramid.totalDrops} 滴 · {item.olfactoryPyramid.totalVolume}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center bg-white/50 rounded-2xl border border-dashed border-[#D5CCBA] text-stone-500 text-xs">
                没有找到符合条件的处方笺
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Full Prescription Details (8 Cols on desktop) */}
        <div className="lg:col-span-8">
          {selectedRx ? (
            <PrescriptionCard
              prescription={selectedRx}
              onToggleFavorite={onToggleFavorite}
              onOrderBespoke={onOrderBespoke}
              onStartBreathworkWithAroma={onStartBreathworkWithAroma}
              onGoToBlender={onGoToBlender}
              onLogMood={onLogMood}
            />
          ) : (
            <div className="p-12 text-center bg-white/70 rounded-3xl border border-[#E2DAD0] space-y-4">
              <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-serif-sc text-lg font-bold text-[#1C2E20]">尚未选择处方笺</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                请在左侧列表中点击选择一份处方，或开具全新的个人专属处方。
              </p>
              <button
                onClick={onGoToConsultation}
                className="px-5 py-2.5 rounded-xl bg-[#1C2E20] text-white text-xs font-bold"
              >
                立即开始芳香问诊
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
