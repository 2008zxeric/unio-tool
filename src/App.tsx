import React, { useState, useEffect } from "react";
import { Header, NavTab } from "./components/Header";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { DailyScentNowView } from "./components/DailyScentNowView";
import { BotanicalEncyclopediaView } from "./components/BotanicalEncyclopediaView";
import { OilBlenderView } from "./components/OilBlenderView";
import { ScentVibeTestView } from "./components/ScentVibeTestView";
import { MoodTrackerView } from "./components/MoodTrackerView";
import { ConsultationView } from "./components/ConsultationView";
import { PrescriptionView } from "./components/PrescriptionView";
import { BespokeLabView } from "./components/BespokeLabView";
import { DevicesWidgetView } from "./components/DevicesWidgetView";
import { SoundscapeModal } from "./components/SoundscapeModal";
import { BreathworkModal } from "./components/BreathworkModal";
import { BrandHomeView } from "./components/BrandHomeView";
import { ScentPrescription, MoodCheckin, BespokeOrder, SingleEssentialOil, BlendIngredient } from "./types";
import { CURATED_PRESCRIPTIONS, ESSENTIAL_OILS_DATABASE } from "./data/scentDatabase";
import { audioEngine } from "./utils/audioEngine";

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("consultation");
  const [prescriptions, setPrescriptions] = useState<ScentPrescription[]>(() => {
    const saved = localStorage.getItem("unio_prescriptions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return CURATED_PRESCRIPTIONS;
  });

  const [currentPrescription, setCurrentPrescription] = useState<ScentPrescription | null>(() => {
    return prescriptions[0] || CURATED_PRESCRIPTIONS[0];
  });

  const [blendIngredients, setBlendIngredients] = useState<BlendIngredient[]>(() => {
    const saved = localStorage.getItem("unio_blend_ingredients");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultIds = ["oil_fir", "oil_white_tea", "oil_sandalwood"];
    return defaultIds
      .map(id => {
        const oil = ESSENTIAL_OILS_DATABASE.find(o => o.id === id);
        return oil ? { oilId: id, oil, drops: 2 } : null;
      })
      .filter((item): item is BlendIngredient => item !== null);
  });

  const [orders, setOrders] = useState<BespokeOrder[]>(() => {
    const saved = localStorage.getItem("unio_orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [checkins, setCheckins] = useState<MoodCheckin[]>(() => {
    const saved = localStorage.getItem("unio_checkins");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [isLoadingRx, setIsLoadingRx] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSoundscapeModalOpen, setIsSoundscapeModalOpen] = useState(false);
  const [isBreathworkModalOpen, setIsBreathworkModalOpen] = useState(false);
  const [breathworkPrescription, setBreathworkPrescription] = useState<ScentPrescription | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("unio_prescriptions", JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem("unio_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("unio_blend_ingredients", JSON.stringify(blendIngredients));
  }, [blendIngredients]);

  useEffect(() => {
    localStorage.setItem("unio_checkins", JSON.stringify(checkins));
  }, [checkins]);

  // Add Oil from Encyclopedia / Knowledge Card into current Blender recipe
  const handleAddOilToCurrentBlend = (oil: SingleEssentialOil) => {
    setBlendIngredients((prev) => {
      const existing = prev.find((item) => item.oilId === oil.id);
      if (existing) {
        return prev.map((item) =>
          item.oilId === oil.id ? { ...item, drops: item.drops + 1 } : item
        );
      }
      return [...prev, { oilId: oil.id, oil, drops: 2 }];
    });
  };

  // Audio Play / Pause
  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      audioEngine.stop432HzDrone();
      setIsAudioPlaying(false);
    } else {
      audioEngine.start432HzDrone();
      setIsAudioPlaying(true);
    }
  };

  // When prescription is generated from ConsultationView, VibeTest or Blender
  const handlePrescriptionGenerated = (rx: ScentPrescription) => {
    setPrescriptions((prev) => [rx, ...prev]);
    setCurrentPrescription(rx);
    setActiveTab("prescriptions");
  };

  // Toggle favorite prescription
  const handleToggleFavorite = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      })
    );
    if (currentPrescription?.id === id) {
      setCurrentPrescription((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
    audioEngine.playDropletSound();
  };

  // Place bespoke order
  const handlePlaceOrder = (order: BespokeOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  // Add mood checkin
  const handleAddCheckin = (checkin: MoodCheckin) => {
    setCheckins((prev) => [checkin, ...prev]);
  };

  // Trigger breathwork modal from anywhere
  const handleStartBreathwork = (rx: ScentPrescription) => {
    setBreathworkPrescription(rx);
    setIsBreathworkModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1E1C19] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#1C2E20]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        onOpenSoundscapeModal={() => setIsSoundscapeModalOpen(true)}
        onOpenWatchModal={() => setActiveTab("devices")}
      />

      {/* Mandatory Medical & Aromatherapy Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3">
        <DisclaimerBanner />
      </div>

      {/* Main View Router - 5 Core Pillars + Sub Views */}
      <main className="flex-1 w-full pb-20 md:pb-12">
        {/* ① 今日香气 */}
        {activeTab === "daily" && (
          <DailyScentNowView
            onStartBreathwork={handleStartBreathwork}
            onOpenSoundscape={() => setIsSoundscapeModalOpen(true)}
            onGoToTracker={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("tracker");
            }}
            onGoToBlender={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("blender");
            }}
            onGoToAtelier={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("atelier");
            }}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
          />
        )}

        {/* ② 精油百科 */}
        {activeTab === "botanical" && (
          <BotanicalEncyclopediaView
            prescriptions={prescriptions}
            onGoToBlender={() => setActiveTab("blender")}
            onAddToCurrentBlend={handleAddOilToCurrentBlend}
            onBlendWithPrescription={(rx, oil) => {
              setCurrentPrescription(rx);
              handleAddOilToCurrentBlend(oil);
              setActiveTab("blender");
            }}
          />
        )}

        {/* ③ 我的配方 */}
        {activeTab === "blender" && (
          <OilBlenderView
            ingredients={blendIngredients}
            onIngredientsChange={setBlendIngredients}
            onSavePrescription={handlePrescriptionGenerated}
            onGoToAtelier={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("atelier");
            }}
          />
        )}

        {/* ④ 闻香测试 */}
        {activeTab === "vibe_test" && (
          <ScentVibeTestView
            onPrescriptionGenerated={handlePrescriptionGenerated}
            onStartBreathwork={handleStartBreathwork}
            onGoToBlender={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("blender");
            }}
            onGoToAtelier={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("atelier");
            }}
            onGoToTracker={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("tracker");
            }}
          />
        )}

        {/* ⑤ 我的香气日记 */}
        {activeTab === "tracker" && (
          <MoodTrackerView
            checkins={checkins}
            prescriptions={prescriptions}
            onAddCheckin={handleAddCheckin}
          />
        )}

        {/* 深度问诊测评 */}
        {activeTab === "consultation" && (
          <ConsultationView
            onPrescriptionGenerated={handlePrescriptionGenerated}
            isLoading={isLoadingRx}
            setIsLoading={setIsLoadingRx}
          />
        )}

        {/* 处方档案笺 */}
        {activeTab === "prescriptions" && (
          <PrescriptionView
            prescriptions={prescriptions}
            currentPrescription={currentPrescription}
            onSelectPrescription={(rx) => setCurrentPrescription(rx)}
            onToggleFavorite={handleToggleFavorite}
            onOrderBespoke={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("atelier");
            }}
            onStartBreathworkWithAroma={handleStartBreathwork}
            onGoToConsultation={() => setActiveTab("consultation")}
            onGoToBlender={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("blender");
            }}
            onLogMood={(rx) => {
              setCurrentPrescription(rx);
              setActiveTab("tracker");
            }}
          />
        )}

        {/* 专属工坊定制 */}
        {activeTab === "atelier" && (
          <BespokeLabView
            currentPrescription={currentPrescription}
            orders={orders}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {/* 桌面组件 & Watch */}
        {activeTab === "devices" && (
          <DevicesWidgetView currentPrescription={currentPrescription} />
        )}

        {/* 关于 UNIO */}
        {activeTab === "about" && (
          <BrandHomeView />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#EFECE3] border-t border-[#DDD6C5] py-8 text-center text-xs text-stone-500 no-print space-y-2 mb-12 md:mb-0">
        <div className="flex items-center justify-center gap-2">
          <span className="font-serif-sc font-bold text-[#1C2E20]">UNIO 一人一方</span>
          <span>·</span>
          <span>东方高定身心芳香处方</span>
        </div>
        <p className="text-[11px] text-stone-400 font-light">
          融合东方本草经络与现代嗅觉神经科学 · 专属于每一位身心探索者
        </p>
      </footer>

      {/* Interactive Modals */}
      <SoundscapeModal
        isOpen={isSoundscapeModalOpen}
        onClose={() => setIsSoundscapeModalOpen(false)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
      />

      <BreathworkModal
        isOpen={isBreathworkModalOpen}
        onClose={() => setIsBreathworkModalOpen(false)}
        prescription={breathworkPrescription || currentPrescription}
      />
    </div>
  );
}
export default App;
