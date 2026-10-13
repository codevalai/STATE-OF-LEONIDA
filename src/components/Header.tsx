import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  Map, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  Newspaper, 
  Radio, 
  Activity, 
  Zap,
  Terminal,
  Layers,
  Star,
  Headphones,
  Users,
  DollarSign,
  Bot
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  wantedLevel: number;
  setWantedLevel: (level: number) => void;
  bookmarkedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wantedLevel,
  setWantedLevel,
  bookmarkedCount,
}) => {
  const [inGameTime, setInGameTime] = useState('21:42:15');

  // Live in-game clock simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const hours = String((date.getHours() + 4) % 24).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      setInGameTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'voice', label: 'Live Wire Voice', icon: <Headphones className="w-4 h-4 text-pink-400" />, badge: 'WEBRTC' },
    { id: 'crew', label: 'Heist Matrix', icon: <Users className="w-4 h-4 text-cyan-400" />, badge: '8-NODE' },
    { id: 'arbitrage', label: 'Offline Empire', icon: <DollarSign className="w-4 h-4 text-emerald-400" />, badge: 'MACRO' },
    { id: 'omni', label: 'Omni-Agents', icon: <Bot className="w-4 h-4 text-purple-400" /> },
    { id: 'missions', label: 'Missions', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'map', label: 'Spatial Radar', icon: <Map className="w-4 h-4" /> },
    { id: 'builds', label: 'Zenith Builds', icon: <Layers className="w-4 h-4" /> },
    { id: 'session', label: "Tonight's Plan", icon: <Clock className="w-4 h-4" />, badge: bookmarkedCount > 0 ? `${bookmarkedCount}` : undefined },
    { id: 'challenges', label: 'Challenges', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'news', label: 'Leonida Times', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'telemetry', label: 'Telemetry', icon: <Activity className="w-4 h-4" />, badge: 'LIVE' },
    { id: 'comms', label: 'Vice Comms', icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top status bar */}
      <div className="border-b border-slate-800/40 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-pink-400">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="font-semibold tracking-wider">STATE OF LEONIDA</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="hidden sm:flex items-center space-x-1.5 text-cyan-300">
            <Clock className="w-3.5 h-3.5" />
            <span>VICE LOCAL: {inGameTime} EDT</span>
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <div className="hidden md:flex items-center space-x-1 text-slate-300">
            <span>CLIMATE: 79°F // BALMY HUMIDITY 84%</span>
          </div>
        </div>

        {/* Wanted Level & Server Intelligence badges */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Heat Level:</span>
            <div className="flex space-x-0.5">
              {[1, 2, 3, 4, 5, 6].map((star) => (
                <button
                  key={star}
                  type="button"
                  title={`Set Wanted Level ${star}`}
                  onClick={() => setWantedLevel(wantedLevel === star ? star - 1 : star)}
                  className="transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      star <= wantedLevel
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded font-mono text-[11px]">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="font-medium">GEMINI 3.8 FLASH ORCHESTRATOR</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo and title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('missions')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 p-0.5 neon-glow-pink flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display tracking-wider bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent uppercase">
                Vice Sovereign
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-mono bg-pink-950/70 text-pink-300 px-1.5 py-0.5 rounded border border-pink-500/40">
                GTA VI
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide font-mono">
              Leonida Tactical Strategist & Live Telemetry Oracle
            </p>
          </div>
        </div>

        {/* Tab buttons */}
        <nav className="flex items-center overflow-x-auto pb-1 md:pb-0 space-x-1 sm:space-x-1.5 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-pink-300 border border-pink-500/50 shadow-[0_0_15px_rgba(255,42,133,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    item.badge === 'LIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
