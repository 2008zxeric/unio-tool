import React from 'react';
import { motion } from 'motion/react';

const DATA_ASSETS = [
  { label: "馆藏总数", value: "226" },
  { label: "全球产地", value: "85+" },
  { label: "精油百科", value: "364" },
  { label: "调香配方", value: "483" }
];

const FOUNDERS = [
  { name: "Alice 刘元红", title: "第一创始人", desc: "以二十余年专业与温度，连接植物、身体感受与生活美学，奠定元香最初的审美与标准。" },
  { name: "Eric", title: "品牌延续/寻香者", desc: "全球极境行走，捕捉未被工业驯化的野性香气，确认每一支香气的来处。" },
  { name: "Amanda", title: "品牌延续/品控", desc: "以细致体验观察、批次确认与持续专业训练，守护每一份香气的品质。" }
];

const COLLECTIONS = [
  { name: "元 · 单方精油", eng: "Pure", desc: "从极境中撷取植物原息。按五行归类，保留植物最清晰的香气轮廓。", icon: "🌱" },
  { name: "合 · 复方", eng: "Harmony", desc: "以香气协同，安放身体与心绪。遵循君臣佐使，构建宁静避难所。", icon: "⚖️" },
  { name: "生 · 植物纯露", eng: "Life", desc: "以花水留存鲜活一面。清透雅致，适合肌肤与空间每日唤醒。", icon: "💧" },
  { name: "香 · 空间器物", eng: "Scent", desc: "气味落进空间与器物。将自然场域延伸至生活，香佩与扩香。", icon: "🌋" }
];

export const BrandHomeView: React.FC = () => {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12 px-4 font-sans">
      <article className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Section 1: 品牌起源 - Full Width */}
        <section className="md:col-span-12 bg-hallmark-paper hallmark-foil-frame p-8 md:p-12">
          <header className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-serif text-[#1C2E20]">UNIO <span className="font-light text-[#C5A880]">·</span> 元香</h1>
              <p className="text-2xl font-serif italic text-[#4A5D4E]">从极境撷取芳香，因世界元于一息。</p>
            </div>
            <div className="text-[#57534E] leading-relaxed border-l border-[#C5A880] pl-8">
              <h2 className="text-xl font-serif mb-4">品牌起源</h2>
              <p>元香 UNIO 起始于对纯净品质的执着。二十多年间，团队深耕植物观察与芳疗专业，将“极境寻香”与“AI 高定”融合，提供从植物原息到日常呼吸的完整香气照护。</p>
            </div>
          </header>
        </section>

        {/* Section 2: 创始档案 - Grid 3 columns */}
        <section className="md:col-span-12 bg-hallmark-paper hallmark-foil-frame p-8 md:p-12">
          <h2 className="text-3xl font-serif mb-12 text-center">创始档案 · Founders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FOUNDERS.map((f, i) => (
              <div key={i} className="text-center p-6 bg-white/50 border border-[#E0D7C5]">
                <div className="w-24 h-24 mx-auto mb-6 bg-[#E0D7C5] rounded-full flex items-center justify-center text-[#FAF8F3] font-serif text-3xl">
                  {f.name.charAt(0)}
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 hallmark-gold-emboss">{f.name}</h3>
                <span className="text-sm font-normal text-[#C5A880] block mb-4">({f.title})</span>
                <p className="text-sm text-[#57534E] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: 四大系列 - Grid 4 columns */}
        <section className="md:col-span-12 bg-hallmark-paper hallmark-foil-frame p-8 md:p-12">
          <h2 className="text-3xl font-serif mb-12 text-center">馆藏陈列 · Collections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((item, i) => (
              <div key={i} className="bg-white p-6 border border-[#E0D7C5] space-y-4">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="font-serif text-xl">{item.name}</h3>
                <p className="text-xs uppercase tracking-wider text-[#C5A880]">{item.eng}</p>
                <p className="text-sm text-[#57534E] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: 寻香地图 - Grid 3 columns */}
        <section className="md:col-span-12 bg-hallmark-paper hallmark-foil-frame p-8 md:p-12">
          <h2 className="text-3xl font-serif mb-12 text-center">寻香地图 · Locations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: "成都", area: "武侯/成华", tone: "暖金 Warm" },
              { city: "宁波", area: "鄞州/奉化", tone: "海蓝 Sea" },
              { city: "泰国", area: "芭提亚", tone: "热带 Tropics" }
            ].map((w, i) => (
              <div key={i} className="text-center space-y-4">
                <h3 className="font-serif text-3xl">{w.city}</h3>
                <p className="text-sm text-[#9E9689]">{w.area}</p>
                <div className="w-24 h-24 mx-auto border-2 border-[#D4AF37] flex items-center justify-center text-[10px] text-[#C5A880]">QR CODE</div>
                <p className="text-xs uppercase text-[#C5A880] tracking-widest">{w.tone}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="md:col-span-12 text-center py-6 text-[#9E9689] font-mono text-xs uppercase tracking-widest">
          © 2026 UNIO AROMA. ALL RIGHTS RESERVED.
        </footer>
      </article>
    </div>
  );
};


