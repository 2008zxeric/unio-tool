import React, { useState } from "react";
import {
  FlaskConical,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Package,
  Gift,
  Clock,
  ChevronRight,
  Droplet,
  Tag,
  CreditCard,
  Crown
} from "lucide-react";
import confetti from "canvas-confetti";
import { ScentPrescription, BespokeOrder } from "../types";
import { audioEngine } from "../utils/audioEngine";

interface BespokeLabViewProps {
  currentPrescription: ScentPrescription | null;
  orders: BespokeOrder[];
  onPlaceOrder: (order: BespokeOrder) => void;
}

export const BespokeLabView: React.FC<BespokeLabViewProps> = ({
  currentPrescription,
  orders,
  onPlaceOrder
}) => {
  const [productType, setProductType] = useState<"roller_oil" | "pure_elixir" | "fine_edp" | "ritual_candle">("roller_oil");
  const [bottleSize, setBottleSize] = useState<"10ml" | "30ml" | "50ml">("10ml");
  const [engravingText, setEngravingText] = useState("致 晓风 · 静心安神");
  const [recipientName, setRecipientName] = useState("张先生 / 2008zx@gmail.com");
  const [sealColor, setSealColor] = useState<"cinnabar" | "matte_gold" | "pine_green">("cinnabar");
  const [woodenBoxGiftSet, setWoodenBoxGiftSet] = useState(true);
  const [sampleKitRefills, setSampleKitRefills] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [activeTab, setActiveTab] = useState<"customizer" | "orders">("customizer");

  const rx = currentPrescription || {
    id: "rx_curated_01",
    rxCode: "UNIO-2026-RX8092",
    title: "《暮山听松》",
    poeticSub: "冷杉与老山檀香 · 降心火而宁神志",
    seasonTerm: "处暑 / 白露",
    fiveElement: "金水相生"
  };

  // Price computation
  const basePrices = {
    roller_oil: bottleSize === "10ml" ? 268 : bottleSize === "30ml" ? 520 : 780,
    fine_edp: bottleSize === "10ml" ? 320 : bottleSize === "30ml" ? 680 : 980,
    pure_elixir: bottleSize === "10ml" ? 360 : bottleSize === "30ml" ? 790 : 1180,
    ritual_candle: 380
  };

  const totalPrice = basePrices[productType] + (woodenBoxGiftSet ? 60 : 0);

  const handleCreateOrder = () => {
    setIsOrdering(true);
    audioEngine.playDropletSound();

    setTimeout(() => {
      const newOrder: BespokeOrder = {
        id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        rxId: rx.id,
        rxTitle: rx.title,
        rxCode: rx.rxCode,
        bottleSize,
        productType,
        engravingText,
        recipientName,
        sealColor,
        woodenBoxGiftSet,
        sampleKitRefills,
        status: "formulating",
        trackingNumber: "SF" + Math.floor(100000000000 + Math.random() * 900000000000),
        estimatedDelivery: "2-3 个工作日 (手工调配冷链顺丰包邮)",
        createdAt: new Date().toISOString(),
        totalPrice
      };

      onPlaceOrder(newOrder);
      setIsOrdering(false);
      setActiveTab("orders");
      audioEngine.strikeSingingBowl(528);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1C2E20", "#C5A880", "#A82A2A"]
      });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2DDCF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold tracking-widest text-[#8C7A6B]">UNIO BESPOKE ATELIER</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#A82A2A] text-white font-medium">官方手工实验室打样</span>
          </div>
          <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-[#1C2E20] tracking-tight mt-1">
            专属调香工坊 · 实体瓶身定制与打样
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
            将 AI 处方一键提交至 UNIO 东方调香实验室，由资深芳疗调香师手工配比、激光镌刻并顺丰冷链配送
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#EAE5D9] p-1 rounded-xl border border-[#D8D0C0] text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab("customizer")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "customizer" ? "bg-[#1C2E20] text-white font-bold shadow-xs" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            瓶身定制工坊
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "orders" ? "bg-[#1C2E20] text-white font-bold shadow-xs" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            打样订单进度 ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === "customizer" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D-Like Luxury Bottle & Laser Engraving Preview (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#FAF8F3] to-[#ECE7DA] p-8 rounded-3xl border border-[#D8CFBD] shadow-md flex flex-col items-center justify-center relative sticky top-24">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>实时瓶身激光镌刻效果</span>
            </div>

            {/* Simulated Luxury Perfume Flacon */}
            <div className="w-48 sm:w-56 h-80 sm:h-96 relative flex flex-col items-center justify-end my-4">
              {/* Bottle Cap */}
              <div className="w-16 h-14 bg-gradient-to-r from-[#2B2B2B] via-[#4A4A4A] to-[#1F1F1F] rounded-t-lg shadow-md border-b-2 border-[#C5A880] relative z-10 flex items-center justify-center">
                <span className="font-cinzel text-[8px] tracking-widest text-[#D4AF37]">UNIO</span>
              </div>
              {/* Bottle Neck */}
              <div className="w-8 h-4 bg-gradient-to-r from-[#C5A880] to-[#E5D7BE] shadow-xs"></div>
              {/* Main Heavy Glass Bottle */}
              <div className="w-full h-64 sm:h-76 bg-gradient-to-b from-white/90 via-[#F5EEDD]/90 to-[#E8DCBF]/95 backdrop-blur-md rounded-2xl border-2 border-[#D5C9B3] shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 text-center">
                {/* Refraction Glass Highlights */}
                <div className="absolute left-2 top-0 bottom-0 w-2 bg-gradient-to-r from-white/80 to-transparent"></div>
                <div className="absolute right-2 top-0 bottom-0 w-1.5 bg-gradient-to-l from-white/60 to-transparent"></div>

                {/* Top Label Info */}
                <div className="pt-2">
                  <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#8C7A6B] block">UNIO ATELIER</span>
                  <span className="font-mono text-[9px] text-stone-400">{rx.rxCode}</span>
                </div>

                {/* Center Laser Engraving Plate */}
                <div className="bg-white/80 border border-[#D9D0BE] p-3 rounded-xl shadow-xs space-y-1 mx-2">
                  <h3 className="font-serif-sc text-base font-extrabold text-[#1C2E20] tracking-wider">
                    {rx.title}
                  </h3>
                  <p className="text-[10px] text-stone-600 font-serif-sc font-medium line-clamp-1">
                    {rx.poeticSub}
                  </p>
                  <div className="border-t border-[#EAE3D2] pt-1 mt-1">
                    <p className="font-serif-sc text-[11px] text-[#A82A2A] font-bold">
                      {engravingText || "专属高定身心处方"}
                    </p>
                  </div>
                </div>

                {/* Bottom Seal & Volume */}
                <div className="pb-1 flex items-center justify-between px-2 text-[10px] text-stone-500 font-mono">
                  <span>{bottleSize}</span>
                  <div
                    className={`w-6 h-6 rounded-xs border text-[8px] flex items-center justify-center font-serif-sc font-bold ${
                      sealColor === "cinnabar"
                        ? "border-[#A82A2A] text-[#A82A2A]"
                        : sealColor === "matte_gold"
                        ? "border-[#B5965A] text-[#8C7238] bg-[#F9F5EC]"
                        : "border-[#1C2E20] text-[#1C2E20]"
                    }`}
                  >
                    御
                  </div>
                  <span>HANDMADE</span>
                </div>
              </div>
            </div>

            {/* Cold Chain Guarantee Badge */}
            <div className="w-full bg-white/70 p-3 rounded-2xl border border-[#DCD3C1] flex items-center justify-around text-[11px] text-stone-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-800" />
                顺丰冷链特快
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                避光恒温包装
              </span>
              <span className="flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-indigo-900" />
                纯天然单方精油
              </span>
            </div>
          </div>

          {/* Right: Customization Options & Order Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Product Formulation Type */}
            <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-4">
              <h3 className="font-serif-sc text-base font-bold text-[#1C2E20] flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#1C2E20]" />
                1. 选择物理产品载体
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "roller_oil",
                    name: "便携芳香滚珠油 (Roller Oil)",
                    desc: "3%~5% 初榨荷荷巴油稀释，随身点涂脉搏穴位",
                    price: "¥268 起"
                  },
                  {
                    id: "fine_edp",
                    name: "极境沙龙高定淡香精 (EDP)",
                    desc: "15% 芳香精粹，有机甘蔗发酵植物酒精底",
                    price: "¥320 起"
                  },
                  {
                    id: "pure_elixir",
                    name: "超声波纯精油原液 (Diffuser)",
                    desc: "100% 纯单方精油高浓度调配，专供香薰扩香",
                    price: "¥360 起"
                  },
                  {
                    id: "ritual_candle",
                    name: "古法大豆精油香氛蜡烛",
                    desc: "天然低温大豆蜡与蜂蜡，温和散香净化场域",
                    price: "¥380"
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setProductType(item.id as any);
                      audioEngine.playDropletSound();
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      productType === item.id
                        ? "bg-[#1C2E20] text-white border-[#1C2E20] shadow-sm ring-1 ring-[#C5A880]"
                        : "bg-[#FAF8F3] text-stone-800 border-[#E2DAD0] hover:border-[#C5A880]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif-sc font-bold text-xs">{item.name}</span>
                      <span className={`text-[11px] font-mono font-bold ${productType === item.id ? "text-[#D4AF37]" : "text-stone-900"}`}>
                        {item.price}
                      </span>
                    </div>
                    <p className={`text-[11px] ${productType === item.id ? "text-stone-300" : "text-stone-500"}`}>
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Size & Seal Stamp */}
            <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-4">
              <h3 className="font-serif-sc text-base font-bold text-[#1C2E20] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#1C2E20]" />
                2. 容积规格与印章泥印
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-2">瓶身容量规格</label>
                  <div className="flex gap-2">
                    {(["10ml", "30ml", "50ml"] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => {
                          setBottleSize(sz);
                          audioEngine.playDropletSound();
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                          bottleSize === sz
                            ? "bg-[#1C2E20] text-white border-[#1C2E20]"
                            : "bg-[#FAF8F3] text-stone-700 border-[#E0D7C5]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-2">瓶贴专属印章色系</label>
                  <div className="flex gap-2">
                    {[
                      { id: "cinnabar", name: "朱砂红印", color: "bg-[#A82A2A]" },
                      { id: "matte_gold", name: "哑光泥金", color: "bg-[#B89B5F]" },
                      { id: "pine_green", name: "松烟墨绿", color: "bg-[#1C2E20]" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSealColor(s.id as any);
                          audioEngine.playDropletSound();
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                          sealColor === s.id
                            ? "bg-white border-[#1C2E20] text-[#1C2E20] font-bold shadow-2xs"
                            : "bg-[#FAF8F3] border-[#E0D7C5] text-stone-600"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
                        <span>{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Laser Engraving & Recipient Info */}
            <div className="bg-white/80 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-4">
              <h3 className="font-serif-sc text-base font-bold text-[#1C2E20] flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#1C2E20]" />
                3. 个性化激光刻字与收件档案
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    瓶身印刻专属赠言 / 姓名 (限 18 字)
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value)}
                    placeholder="如：致 晓风 · 愿松涛抚平心间烦忧"
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-[#1C2E20] font-serif-sc font-bold outline-none focus:ring-1 focus:ring-[#1C2E20]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    顺丰冷链收件人与手机 / 邮箱
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="张先生 13800000000 (支持全国及海外配送)"
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F3] border border-[#D5CCBA] text-[#1C2E20] outline-none"
                  />
                </div>

                {/* Additional Perks */}
                <div className="space-y-2 pt-2 border-t border-[#ECE7DA]">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F3] border border-[#E2DAD0] cursor-pointer">
                    <span className="text-stone-700">手工黑胡桃松木抽拉礼盒 (+¥60)</span>
                    <input
                      type="checkbox"
                      checked={woodenBoxGiftSet}
                      onChange={(e) => setWoodenBoxGiftSet(e.target.checked)}
                      className="accent-[#1C2E20]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F3] border border-[#E2DAD0] cursor-pointer">
                    <span className="text-stone-700">随单附赠 3 支 2ml 节气试香体验管 (免费)</span>
                    <input
                      type="checkbox"
                      checked={sampleKitRefills}
                      onChange={(e) => setSampleKitRefills(e.target.checked)}
                      className="accent-[#1C2E20]"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Order Checkout Bar */}
            <div className="bg-[#1C2E20] text-white p-6 rounded-3xl border border-[#2E4A34] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-300">工坊定制总额：</span>
                  <span className="font-mono text-2xl font-extrabold text-[#D4AF37]">¥{totalPrice}</span>
                  <span className="text-[11px] text-stone-400">顺丰包邮</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  手工调配醇化 48 小时后冷链发货 · 赠运费险与试香无忧退换
                </p>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={isOrdering}
                className="py-3.5 px-8 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1C2E20] font-serif-sc font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isOrdering ? (
                  <span>正在提交工坊配单...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>立即提交工坊打样</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Orders View */
        <div className="space-y-4">
          <h3 className="font-serif-sc text-lg font-bold text-[#1C2E20]">
            您的高定打样进度档案 ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white/70 rounded-3xl border border-[#E2DAD0] space-y-3">
              <Package className="w-10 h-10 text-stone-400 mx-auto" />
              <h4 className="font-serif-sc text-base font-bold text-stone-800">暂无进行中的打样订单</h4>
              <p className="text-xs text-stone-500">在定制工坊中选择您心仪的处方并一键下单制作</p>
              <button
                onClick={() => setActiveTab("customizer")}
                className="px-4 py-2 bg-[#1C2E20] text-white text-xs font-bold rounded-xl"
              >
                前往定制工坊
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white/90 p-6 rounded-3xl border border-[#E0D7C5] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ECE5D8] pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-stone-500 block">订单号：{order.id}</span>
                      <span className="font-serif-sc font-bold text-base text-[#1C2E20]">{order.rxTitle}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#1C2E20] text-[#D4AF37] font-medium">
                      工坊手工调配中
                    </span>
                  </div>

                  {/* Order Progress Line */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-bold text-emerald-800">1. 精油配比</span>
                      <span className="font-bold text-[#1C2E20]">2. 避光醇化</span>
                      <span>3. 激光刻字</span>
                      <span>4. 顺丰冷链</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EAE5D8] rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-[#1C2E20] rounded-full"></div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 bg-[#FAF8F3] p-3.5 rounded-xl border border-[#E2DAD0]">
                    <p className="text-stone-700">
                      <span className="font-semibold text-stone-900">瓶身镌刻：</span>《{order.engravingText}》
                    </p>
                    <p className="text-stone-700">
                      <span className="font-semibold text-stone-900">配送单号：</span>{order.trackingNumber} (顺丰特快)
                    </p>
                    <p className="text-stone-700">
                      <span className="font-semibold text-stone-900">收件档案：</span>{order.recipientName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono font-bold text-[#1C2E20] text-sm">¥{order.totalPrice}</span>
                    <span className="text-[11px] text-stone-500">{order.estimatedDelivery}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
