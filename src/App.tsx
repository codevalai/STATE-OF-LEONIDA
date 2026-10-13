import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MissionCommander } from './components/MissionCommander';
import { LeonidaMap } from './components/LeonidaMap';
import { BuildAdvisor } from './components/BuildAdvisor';
import { SessionPlanner } from './components/SessionPlanner';
import { ChallengeHub } from './components/ChallengeHub';
import { LeonidaTimes } from './components/LeonidaTimes';
import { TelemetryConsole } from './components/TelemetryConsole';
import { CommsTerminal } from './components/CommsTerminal';
import { VoiceBridge } from './components/VoiceBridge';
import { CrewSyncMatrix } from './components/CrewSyncMatrix';
import { AutoArbitrageEmpire } from './components/AutoArbitrageEmpire';
import { OmniAgentMatrix } from './components/OmniAgentMatrix';
import { ActiveTab, MapPOI } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('voice');
  const [wantedLevel, setWantedLevel] = useState<number>(3);
  
  // Cross-component communication state
  const [selectedMissionName, setSelectedMissionName] = useState<string>('');
  const [injectedCoords, setInjectedCoords] = useState<{ x: number; y: number; z: number } | null>(null);
  const [injectedSector, setInjectedSector] = useState<string | null>(null);

  // Bookmarked mission strategies in localStorage
  const [bookmarkedMissions, setBookmarkedMissions] = useState<
    { id: string; title: string; text: string; date: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem('vice_sovereign_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vice_sovereign_bookmarks', JSON.stringify(bookmarkedMissions));
    } catch (e) {
      console.warn('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedMissions]);

  const handleBookmarkMission = (title: string, text: string) => {
    const newBookmark = {
      id: 'bm-' + Date.now(),
      title,
      text,
      date: new Date().toISOString(),
    };
    setBookmarkedMissions((prev) => [newBookmark, ...prev]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarkedMissions((prev) => prev.filter((b) => b.id !== id));
  };

  // When POI is selected from map
  const handleSelectMapPOIForMission = (poi: MapPOI) => {
    setSelectedMissionName(poi.name);
    setActiveTab('missions');
  };

  const handleSendMapPOIToTelemetry = (coords: { x: number; y: number; z: number }, sector: string) => {
    setInjectedCoords(coords);
    setInjectedSector(sector);
    setActiveTab('telemetry');
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans">
      {/* Universal Tactical Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wantedLevel={wantedLevel}
        setWantedLevel={setWantedLevel}
        bookmarkedCount={bookmarkedMissions.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'voice' && <VoiceBridge wantedLevel={wantedLevel} />}

        {activeTab === 'crew' && <CrewSyncMatrix />}

        {activeTab === 'arbitrage' && <AutoArbitrageEmpire />}

        {activeTab === 'omni' && <OmniAgentMatrix />}

        {activeTab === 'missions' && (
          <MissionCommander
            initialMissionName={selectedMissionName}
            onBookmarkMission={handleBookmarkMission}
          />
        )}

        {activeTab === 'map' && (
          <LeonidaMap
            onSelectMissionPOI={handleSelectMapPOIForMission}
            onSendToTelemetry={handleSendMapPOIToTelemetry}
          />
        )}

        {activeTab === 'builds' && <BuildAdvisor />}

        {activeTab === 'session' && (
          <SessionPlanner
            bookmarkedMissions={bookmarkedMissions}
            onRemoveBookmark={handleRemoveBookmark}
          />
        )}

        {activeTab === 'challenges' && <ChallengeHub />}

        {activeTab === 'news' && <LeonidaTimes />}

        {activeTab === 'telemetry' && (
          <TelemetryConsole
            injectedCoords={injectedCoords}
            injectedSector={injectedSector}
          />
        )}

        {activeTab === 'comms' && <CommsTerminal />}
      </main>

      {/* Tactical Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
            <span className="text-slate-400 font-semibold">VICE SOVEREIGN INTELLIGENCE SUITE</span>
            <span>// GTA 6 LEONIDA EXPEDITION</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>ENGINE: GEMINI 3.8 FLASH</span>
            <span>•</span>
            <span>SCHEMA: ZOD RUNTIME</span>
            <span>•</span>
            <span>SERVER: CFX NODE 22 LIBUV</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
