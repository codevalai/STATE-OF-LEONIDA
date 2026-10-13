import React, { useState } from 'react';
import { 
  Crosshair, 
  Send, 
  Bookmark, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  Copy, 
  Car, 
  Zap, 
  Compass,
  Users,
  User,
  Sliders
} from 'lucide-react';
import { MISSION_TEMPLATES } from '../data/leonidaData';
import { MissionTemplate } from '../types';

interface MissionCommanderProps {
  initialMissionName?: string;
  onBookmarkMission?: (title: string, text: string) => void;
}

export const MissionCommander: React.FC<MissionCommanderProps> = ({ 
  initialMissionName,
  onBookmarkMission 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MissionTemplate>(MISSION_TEMPLATES[0]);
  const [customMissionName, setCustomMissionName] = useState(initialMissionName || '');
  const [approach, setApproach] = useState<'stealth' | 'chaos' | 'infiltrate' | 'highspeed'>('stealth');
  const [teamMode, setTeamMode] = useState<'solo' | 'coop'>('solo');
  const [difficulty, setDifficulty] = useState<'Chill' | 'Normal' | 'Hardcore' | 'Nightmare'>('Hardcore');
  const [playerContext, setPlayerContext] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [dossierResult, setDossierResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (missionTitleToUse?: string) => {
    setLoading(true);
    setSaved(false);

    const title = missionTitleToUse || customMissionName || selectedTemplate.name;

    const approachText = 
      approach === 'stealth' ? 'Silent Infiltration & Acoustic Dampening' :
      approach === 'chaos' ? 'Full Overwhelming Chaos & Explosive Distraction' :
      approach === 'infiltrate' ? 'Disguised Employee & Cyber Badge Cloning' :
      'High-Speed Vehicle Chase & Drawbridge Blockade';

    const fullContext = `${teamMode === 'solo' ? 'Solo Operator' : '2-Player Co-op Syndicate'}. ${playerContext || 'Standard loadout equipped'}.`;

    try {
      const res = await fetch('/api/advisor/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionName: title,
          approach: approachText,
          difficulty,
          playerContext: fullContext,
        }),
      });
      const data = await res.json();
      setDossierResult(data.result);
    } catch (err) {
      console.error('Failed to generate mission strategy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!dossierResult) return;
    navigator.clipboard.writeText(dossierResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!dossierResult) return;
    const title = customMissionName || selectedTemplate.name;
    onBookmarkMission?.(title, dossierResult);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-wider">
            <Crosshair className="w-4 h-4 text-pink-400" />
            <span>Mission & Progression Dossier Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            VICE MISSION COMMAND
          </h2>
          <p className="text-xs text-slate-400">
            Algorithmic mission breakdowns, failure point warnings, stealth vs chaos divergences, and replay challenge modifiers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Tactical Engine:</span>
          <span className="px-2.5 py-1 rounded bg-pink-950/60 border border-pink-500/40 text-pink-300 font-mono text-xs font-bold">
            GEMINI 3.8 FLASH
          </span>
        </div>
      </div>

      {/* Preset Blueprints Carousel */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Preset Leonida Mission Archetypes</span>
          <span className="text-slate-500 text-[11px]">Click to load parameters</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MISSION_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id && !customMissionName;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  setSelectedTemplate(tmpl);
                  setCustomMissionName('');
                  setDifficulty(tmpl.difficulty);
                }}
                className={`p-3.5 rounded-xl text-left border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-pink-950/50 to-slate-900 border-pink-500/60 shadow-[0_0_15px_rgba(255,42,133,0.15)]'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-pink-400 font-semibold">{tmpl.sector}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    tmpl.difficulty === 'Nightmare' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    tmpl.difficulty === 'Hardcore' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {tmpl.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-bold font-display text-white leading-tight">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {tmpl.synopsis}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">{tmpl.estimatedPayout}</span>
                  <span className="text-slate-500">Danger: {'★'.repeat(tmpl.dangerLevel)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration & Custom Input */}
      <div className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Mission Name Input */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Target Mission Name or Custom Scenario
            </label>
            <input
              type="text"
              placeholder={selectedTemplate.name}
              value={customMissionName}
              onChange={(e) => setCustomMissionName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>

          {/* Player Loadout Context */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Player Context / Current Weapons / Assets
            </label>
            <input
              type="text"
              placeholder="e.g. Suppressed combat SMG, night vision goggles, getaway speedboat"
              value={playerContext}
              onChange={(e) => setPlayerContext(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>
        </div>

        {/* Toggles: Approach, Mode, Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Approach */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Strategic Approach
            </label>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {[
                { id: 'stealth', label: 'Stealth Infiltration' },
                { id: 'chaos', label: 'Full Chaos' },
                { id: 'infiltrate', label: 'Disguise / Hack' },
                { id: 'highspeed', label: 'High-Speed Ambush' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setApproach(item.id as any)}
                  className={`py-2 px-2 rounded-lg border text-center transition-all ${
                    approach === item.id
                      ? 'bg-pink-600/25 border-pink-500 text-pink-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Squad Composition
            </label>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setTeamMode('solo')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                  teamMode === 'solo'
                    ? 'bg-cyan-600/25 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Solo Lone Wolf</span>
              </button>
              <button
                type="button"
                onClick={() => setTeamMode('coop')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                  teamMode === 'coop'
                    ? 'bg-cyan-600/25 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>2-Player Co-op</span>
              </button>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-4 gap-1 font-mono text-[11px]">
              {(['Chill', 'Normal', 'Hardcore', 'Nightmare'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 rounded-lg border text-center transition-all ${
                    difficulty === d
                      ? 'bg-purple-600/30 border-purple-400 text-purple-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleGenerate()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white font-mono text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-pink-600/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-pink-300" />
                <span>ANALYZING LEONIDA TACTICAL MATRIX...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-pink-200" />
                <span>GENERATE HIGH-IQ MISSION DOSSIER</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Dossier View */}
      {dossierResult && (
        <div className="bg-slate-900/90 border border-pink-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase">
                TACTICAL INTELLIGENCE VERIFIED
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Brief'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-pink-950/60 hover:bg-pink-900/60 text-pink-300 border border-pink-500/40 flex items-center space-x-1.5 transition-colors"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-pink-300" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved to Session' : 'Bookmark Plan'}</span>
              </button>
            </div>
          </div>

          {/* Markdown-style content view */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {dossierResult}
          </div>
        </div>
      )}
    </div>
  );
};
