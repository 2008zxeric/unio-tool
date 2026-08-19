import React, { useState } from "react";
import {
  CalendarHeart,
  Sparkles,
  TrendingUp,
  HeartPulse,
  Moon,
  Sun,
  Clock,
  Plus,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Wind,
  Volume2,
  Calendar
} from "lucide-react";
import { MoodCheckin, ScentPrescription } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface MoodTrackerViewProps {
  checkins: MoodCheckin[];
  prescriptions: ScentPrescription[];
  onAddCheckin: (checkin: MoodCheckin) => void;
}

const INITIAL_MOCK_CHECKINS: MoodCheckin[] = [
  {
    id: "chk_1",
    date: "2026-08-18",
    time: "22:45",
    timeSlot: "night",
    preScore: 2,
    postScore: 5,
    rxId: "rx_curated_01",
    rxTitle: "《暮山听松》",
    ritualType: "palm",
    notes: "掌心吸嗅 4-7-8 呼吸法 5 分钟，心率从 88 下降到 68，大脑彻底放空，入睡极为顺畅。",
    heartRateBefore: 88,
    heartRateAfter: 68,
    soundscapeUsed: "432Hz 宇宙谐振",
    solarTerm: "处暑"
  },
  {
    id: "chk_2",
    date: "2026-08-17",
    time: "15:20",
    timeSlot: "noon",
    preScore: 2,
    postScore: 4,
    rxId: "rx_curated_02",
    rxTitle: "《云深茶歇》",
    ritualType: "diffuser",
    notes: "下午案头烦躁，点涂内关穴与百会穴，白茶佛手柑香气瞬间扫除昏蒙感，恢复清爽专注。",
    heartRateBefore: 82,
    heartRateAfter: 73,
    soundscapeUsed: "山涧竹林流泉",
    solarTerm: "处暑"
  },
  {
    id: "chk_3",
    date: "2026-08-16",
    time: "23:10",
    timeSlot: "night",
    preScore: 1,
    postScore: 4,
    rxId: "rx_curated_03",
    rxTitle: "《月下沉香》",
    ritualType: "bath",
    notes: "沉香与绿乳香泡浴，温阳通经，深层慢波睡眠达 2.5 小时。",
    heartRateBefore: 92,
    heartRateAfter: 65,
    soundscapeUsed: "深谷古铜颂钵",
    solarTerm: "处暑"
  },
  {
    id: "chk_4",
    date: "2026-08-15",
    time: "08:15",
    timeSlot: "morning",
    preScore: 3,
    postScore: 5,
    rxId: "rx_curated_02",
    rxTitle: "《云深茶歇》",
    ritualType: "pulse",
    notes: "晨起吸嗅唤醒，精神充沛，一整天情绪保持从容稳态。",
    heartRateBefore: 76,
    heartRateAfter: 70,
    soundscapeUsed: "432Hz 宇宙谐振",
    solarTerm: "处暑"
  }
];

export const MoodTrackerView: React.FC<MoodTrackerViewProps> = ({
  checkins,
  prescriptions,
  onAddCheckin
}) => {
  const [activeCheckinList, setActiveCheckinList] = useState<MoodCheckin[]>(
    checkins.length > 0 ? checkins : INITIAL_MOCK_CHECKINS
  );
  const [showNewCheckinModal, setShowNewCheckinModal] = useState(false);

  // Form state for new check-in
  const [timeSlot, setTimeSlot] = useState<"morning" | "noon" | "night" | "moment">("night");
  const [preScore, setPreScore] = useState(2);
  const [postScore, setPostScore] = useState(5);
  const [selectedRxTitle, setSelectedRxTitle] = useState(prescriptions[0]?.title || "《暮山听松》");
  const [ritualType, setRitualType] = useState<"palm" | "diffuser" | "pulse" | "bath" | "meditation">("palm");
  const [notes, setNotes] = useState("");
  const [hrBefore, setHrBefore] = useState(86);
  const [hrAfter, setHrAfter] = useState(69);

  const handleSubmitCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: MoodCheckin = {
      id: "chk_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      timeSlot,
      preScore,
      postScore,
      rxId: "rx_custom",
      rxTitle: selectedRxTitle,
      ritualType,
      notes: notes || "使用后深层平静，身心张力得到彻底释放。",
      heartRateBefore: hrBefore,
      heartRateAfter: hrAfter,
      soundscapeUsed: "432Hz 宇宙谐振",
      solarTerm: "处暑"
    };

    setActiveCheckinList([newEntry, ...activeCheckinList]);
    onAddCheckin(newEntry);
    audioEngine.strikeSingingBowl(528);
    setShowNewCheckinModal(false);
    setNotes("");
  };

  // Compute stats
  const avgUplift = (
    activeCheckinList.reduce((acc, curr) => acc + (curr.postScore - curr.preScore), 0) /
    (activeCheckinList.length || 1)
  ).toFixed(1);

  const avgHrDrop = Math.round(
    activeCheckinList.reduce((acc, curr) => acc + ((curr.heartRateBefore || 80) - (curr.heartRateAfter || 70)), 0) /
      (activeCheckinList.length || 1)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2DDCF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold tracking-widest text-[#8C7A6B]">UNIO MOOD TRACKER</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1C2E20]/10 text-[#1C2E20] font-medium">气味情绪与生理追踪</span>
          </div>
          <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20] tracking-tight mt-1">
            气味日记与身心疗愈趋势
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
            记录每一次香气吸嗅前后的身心微变化，见证神经系统与睡眠质量的持续改善
          </p>
        </div>

        <button
          onClick={() => setShowNewCheckinModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1C2E20] text-white hover:bg-[#28422E] text-xs sm:text-sm font-bold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>记录今日气味打卡</span>
        </button>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 p-5 rounded-2xl border border-[#E0D7C5] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>平均情绪提升</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-[#1C2E20]">+{avgUplift}</span>
            <span className="text-xs text-stone-500 font-serif-sc">分 / 满分 5 分</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">
            吸嗅后副交感神经系统显著激活
          </p>
        </div>

        <div className="bg-white/80 p-5 rounded-2xl border border-[#E0D7C5] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>平均心率减缓</span>
            <HeartPulse className="w-4 h-4 text-rose-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-[#1C2E20]">-{avgHrDrop}</span>
            <span className="text-xs text-stone-500 font-mono">bpm</span>
          </div>
          <p className="text-[11px] text-stone-600">
            432Hz 配合深呼吸降血压与交感亢奋
          </p>
        </div>

        <div className="bg-white/80 p-5 rounded-2xl border border-[#E0D7C5] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>累计疗愈记录</span>
            <Calendar className="w-4 h-4 text-indigo-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-[#1C2E20]">{activeCheckinList.length}</span>
            <span className="text-xs text-stone-500 font-serif-sc">次芳香仪式</span>
          </div>
          <p className="text-[11px] text-stone-600">
            最喜爱香气：《暮山听松》(占 52%)
          </p>
        </div>
      </div>

      {/* Daily Scent Timeline (7:30 / 14:30 / 22:00) */}
      <div className="bg-gradient-to-br from-[#FAF8F3] to-[#F2EDE2] p-6 rounded-3xl border border-[#DCD3C0] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1C2E20]" />
            <h3 className="font-serif-sc font-bold text-base text-[#1C2E20]">今日个人香气时间线 (Daily Scent Routine)</h3>
          </div>
          <span className="text-xs text-[#8C7A6B] font-mono">一键快速打卡</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Morning 7:30 */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E2DAD0] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  07:30 晨起
                </span>
                <Sun className="w-4 h-4 text-amber-700" />
              </div>
              <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">使用「元·水 · 晨曦醒神方」</h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                佛手柑 + 安吉白茶 · 宣肺醒脾，激活一天清阳之气。
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRxTitle(prescriptions[1]?.title || prescriptions[0]?.title || "《元·水 · 晨曦醒神方》");
                setTimeSlot("morning");
                setRitualType("pulse");
                setNotes("晨起 7:30 使用「元·水」，精神清爽，神清气爽。");
                setShowNewCheckinModal(true);
              }}
              className="w-full py-2 bg-[#FAF8F3] hover:bg-[#1C2E20] hover:text-white text-stone-800 text-xs font-bold rounded-xl border border-[#D5CCBA] transition-all"
            >
              打卡 07:30 晨起用香
            </button>
          </div>

          {/* Noon 14:30 */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E2DAD0] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  14:30 午后
                </span>
                <Clock className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">使用「止语雾 · 疏肝解郁方」</h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                冷杉 + 罗马洋甘菊 · 滚珠点按太阳穴，抚平案头烦躁。
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRxTitle(prescriptions[2]?.title || prescriptions[0]?.title || "《止语雾 · 疏肝解郁方》");
                setTimeSlot("noon");
                setRitualType("pulse");
                setNotes("午后 14:30 使用「止语雾」，扫清脑雾，肩颈舒缓。");
                setShowNewCheckinModal(true);
              }}
              className="w-full py-2 bg-[#FAF8F3] hover:bg-[#1C2E20] hover:text-white text-stone-800 text-xs font-bold rounded-xl border border-[#D5CCBA] transition-all"
            >
              打卡 14:30 午后用香
            </button>
          </div>

          {/* Night 22:00 */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E2DAD0] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  22:00 睡前
                </span>
                <Moon className="w-4 h-4 text-indigo-700" />
              </div>
              <h4 className="font-serif-sc font-bold text-sm text-[#1C2E20]">使用「月华油 · 沉香安神方」</h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                海南沉香 + 高地薰衣草 · 掌心深吸嗅，交泰心肾安稳入梦。
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRxTitle(prescriptions[0]?.title || "《月华油 · 沉香安神方》");
                setTimeSlot("night");
                setRitualType("palm");
                setNotes("睡前 22:00 使用「月华油」，4-7-8 吸嗅 5 分钟，安心入眠。");
                setShowNewCheckinModal(true);
              }}
              className="w-full py-2 bg-[#FAF8F3] hover:bg-[#1C2E20] hover:text-white text-stone-800 text-xs font-bold rounded-xl border border-[#D5CCBA] transition-all"
            >
              打卡 22:00 睡前用香
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Uplift Trend Chart */}
      <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif-sc text-base font-bold text-[#1C2E20] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1C2E20]" />
              近 7 日情绪评分提升对比趋势 (Pre vs Post)
            </h3>
            <p className="text-xs text-stone-500">对比使用专属芳香处方前后的身心感受变化</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
              <span className="text-stone-500">吸嗅前评分</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1C2E20]"></span>
              <span className="text-[#1C2E20] font-semibold">吸嗅后评分</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Line Chart */}
        <div className="w-full h-44 sm:h-52 pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160">
            {/* Grid lines */}
            <line x1="40" y1="20" x2="680" y2="20" stroke="#EAE5D8" strokeDasharray="3 3" />
            <line x1="40" y1="60" x2="680" y2="60" stroke="#EAE5D8" strokeDasharray="3 3" />
            <line x1="40" y1="100" x2="680" y2="100" stroke="#EAE5D8" strokeDasharray="3 3" />
            <line x1="40" y1="140" x2="680" y2="140" stroke="#DDD5C5" />

            {/* Y axis labels */}
            <text x="15" y="24" fontSize="10" fill="#999">5分</text>
            <text x="15" y="64" fontSize="10" fill="#999">4分</text>
            <text x="15" y="104" fontSize="10" fill="#999">3分</text>
            <text x="15" y="144" fontSize="10" fill="#999">2分</text>

            {/* Pre-score line */}
            <path
              d="M 60 140 L 160 120 L 260 140 L 360 110 L 460 130 L 560 120 L 660 100"
              fill="none"
              stroke="#A8A29E"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Post-score line with gradient fill */}
            <path
              d="M 60 40 L 160 25 L 260 30 L 360 20 L 460 25 L 560 20 L 660 20"
              fill="none"
              stroke="#1C2E20"
              strokeWidth="3"
            />

            {/* Data Points */}
            {[
              { x: 60, pre: 140, post: 40, date: "08-12" },
              { x: 160, pre: 120, post: 25, date: "08-13" },
              { x: 260, pre: 140, post: 30, date: "08-14" },
              { x: 360, pre: 110, post: 20, date: "08-15" },
              { x: 460, pre: 130, post: 25, date: "08-16" },
              { x: 560, pre: 120, post: 20, date: "08-17" },
              { x: 660, pre: 100, post: 20, date: "今日" }
            ].map((pt, idx) => (
              <g key={idx}>
                <circle cx={pt.x} cy={pt.pre} r="4" fill="#A8A29E" />
                <circle cx={pt.x} cy={pt.post} r="5" fill="#D4AF37" stroke="#1C2E20" strokeWidth="2" />
                <text x={pt.x - 12} y="158" fontSize="10" fill="#666" fontFamily="sans-serif">{pt.date}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Diary History Feed */}
      <div className="space-y-4">
        <h3 className="font-serif-sc text-lg font-bold text-[#1C2E20]">
          气味日记档案历史 ({activeCheckinList.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCheckinList.map((entry) => (
            <div key={entry.id} className="bg-white/80 p-5 rounded-2xl border border-[#E0D7C5] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-2">
                <div className="flex items-center gap-2">
                  {entry.timeSlot === "night" ? (
                    <Moon className="w-4 h-4 text-indigo-900" />
                  ) : entry.timeSlot === "morning" ? (
                    <Sun className="w-4 h-4 text-amber-800" />
                  ) : (
                    <Clock className="w-4 h-4 text-teal-800" />
                  )}
                  <span className="font-serif-sc font-bold text-sm text-[#1C2E20]">{entry.rxTitle}</span>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  {entry.date} · {entry.time}
                </span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-light">
                {entry.notes}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F0ECE1] text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-stone-500">
                    情绪转变：<strong className="text-stone-700">{entry.preScore}分</strong> → <strong className="text-emerald-800">{entry.postScore}分</strong>
                  </span>
                  {entry.heartRateBefore && entry.heartRateAfter && (
                    <span className="text-stone-500 flex items-center gap-1">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                      {entry.heartRateBefore} → {entry.heartRateAfter} bpm
                    </span>
                  )}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFEAE0] text-[#554B3E] font-medium">
                  {entry.soundscapeUsed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Check-in Modal */}
      {showNewCheckinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#D8D0BE] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2DAD0] pb-3">
              <h3 className="font-serif-sc text-lg font-bold text-[#1C2E20]">记录今日芳香与身心打卡</h3>
              <button
                onClick={() => setShowNewCheckinModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1 bg-stone-200 rounded-full"
              >
                取消
              </button>
            </div>

            <form onSubmit={handleSubmitCheckin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">使用处方</label>
                <select
                  value={selectedRxTitle}
                  onChange={(e) => setSelectedRxTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#D5CCBA] text-stone-800"
                >
                  {prescriptions.map(p => (
                    <option key={p.id} value={p.title}>{p.title} - {p.poeticSub}</option>
                  ))}
                  <option value="《暮山听松》">《暮山听松》- 冷杉老山檀香</option>
                  <option value="《云深茶歇》">《云深茶歇》- 白茶佛手柑</option>
                  <option value="《月下沉香》">《月下沉香》- 海南沉香绿乳香</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">吸嗅前状态 (1~5分)</label>
                  <select
                    value={preScore}
                    onChange={(e) => setPreScore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D5CCBA] text-stone-800"
                  >
                    <option value={1}>1分 - 焦虑极度紧绷</option>
                    <option value={2}>2分 - 疲惫心烦思绪杂乱</option>
                    <option value={3}>3分 - 平淡尚可</option>
                    <option value={4}>4分 - 相对松弛</option>
                    <option value={5}>5分 - 祥和自在</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1C2E20] block mb-1">吸嗅后状态 (1~5分)</label>
                  <select
                    value={postScore}
                    onChange={(e) => setPostScore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D5CCBA] text-stone-800 font-bold"
                  >
                    <option value={3}>3分 - 情绪轻度平复</option>
                    <option value={4}>4分 - 显著安宁放松</option>
                    <option value={5}>5分 - 万虑皆空身心虚静</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">吸嗅前心率 (bpm)</label>
                  <input
                    type="number"
                    value={hrBefore}
                    onChange={(e) => setHrBefore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D5CCBA]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">吸嗅后心率 (bpm)</label>
                  <input
                    type="number"
                    value={hrAfter}
                    onChange={(e) => setHrAfter(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D5CCBA]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">心境笔记与身体反馈</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="记录吸嗅时的香气层次、呼吸变化、入睡快慢..."
                  className="w-full p-3 rounded-xl bg-white border border-[#D5CCBA] resize-none outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1C2E20] text-white font-serif-sc font-bold text-sm rounded-xl hover:bg-[#2B4731] transition-all shadow-md"
              >
                保存今日气味打卡
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
