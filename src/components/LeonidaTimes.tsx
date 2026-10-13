import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Zap, 
  AlertCircle, 
  Radio, 
  ShieldCheck, 
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { COMMODITY_TICKER } from '../data/leonidaData';

export const LeonidaTimes: React.FC = () => {
  const [newsContent, setNewsContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Broadcast // Active Edition');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news/digest');
      const data = await res.json();
      setNewsContent(data.article);
      setLastUpdated(new Date().toLocaleTimeString() + ' EDT');
    } catch (err) {
      console.error('Failed to fetch news digest:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
            <Newspaper className="w-4 h-4 text-rose-400" />
            <span>The Leonida Times & Meta Intelligence Bureau</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            LEONIDA TIMES // STATE GAZETTE
          </h2>
          <p className="text-xs text-slate-400">
            Automated in-universe journalism, daily black market commodities, patch balance notes, and community meta shifts.
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={fetchNews}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-400' : ''}`} />
          <span>{loading ? 'Transcribing...' : 'Fetch Latest Edition'}</span>
        </button>
      </div>

      {/* Financial Terminal & Commodity Arbitrage Ticker */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-white uppercase">Leonida Commodity & Asset Terminal</span>
          </div>
          <span className="text-slate-500">Updated: {lastUpdated}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {COMMODITY_TICKER.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs space-y-1"
            >
              <div className="text-[10px] text-slate-400 truncate" title={item.name}>
                {item.name}
              </div>
              <div className="font-bold text-white text-sm">{item.price}</div>
              <div
                className={`text-[10px] font-semibold flex items-center space-x-1 ${
                  item.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newspaper Article Body */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="border-b border-slate-800 pb-3 mb-5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              DAILY EDITION
            </span>
            <span>CIRCULATION: 420,000 RESIDENTS</span>
          </div>
          <div className="text-slate-400">
            EDITOR: AI FORENSIC JOURNALIST // GEMINI 3.8 FLASH
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3 font-mono">
            <Zap className="w-8 h-8 text-pink-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300">PRINTING DAILY METRO INTELLIGENCE...</p>
            <p className="text-xs text-slate-500">Parsing server economy triggers, police logs, and patch notes</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {newsContent}
          </div>
        )}
      </div>

      {/* Meta Strategy Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-pink-400 font-bold">
            <Flame className="w-4 h-4" />
            <span>WEAPON META: SUPPRESSED SMGS</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Due to tighter recoil in moving watercraft, the compact suppressed SMG is dominant for Keys and Biscayne smuggling runs.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold">
            <Radio className="w-4 h-4" />
            <span>AI POLICE DISPATCH LOGIC</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            VCPD cruisers now utilize dynamic pathing. If you sustain speeds over 80 MPH on causeways, spike traps spawn 400m ahead.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>SAFEHOUSE VALUATION TIP</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Properties with direct water docks have experienced a 12% valuation spike following heightened road roadblock enforcement.
          </p>
        </div>
      </div>
    </div>
  );
};
