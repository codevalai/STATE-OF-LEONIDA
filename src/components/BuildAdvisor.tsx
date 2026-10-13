import React, { useState } from 'react';
import { 
  Layers, 
  Crown, 
  EyeOff, 
  Car, 
  Compass, 
  Zap, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Wrench,
  Send,
  Sliders
} from 'lucide-react';
import { PLAYSTYLE_PRESETS } from '../data/leonidaData';
import { PlaystylePreset } from '../types';

export const BuildAdvisor: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PlaystylePreset>(PLAYSTYLE_PRESETS[0]);
  const [budgetTier, setBudgetTier] = useState<string>('Mid-Tier ($250k - $1M)');
  const [focusArea, setFocusArea] = useState<string>('Real Estate & Smuggling');
  const [vehicleType, setVehicleType] = useState<string>('Armored Muscle & Offshore Boat');

  // Custom skills sliders (initialized from selected preset)
  const [skills, setSkills] = useState(selectedPreset.skills);

  const [loading, setLoading] = useState(false);
  const [strategyOutput, setStrategyOutput] = useState<string | null>(null);

  const handleSelectPreset = (preset: PlaystylePreset) => {
    setSelectedPreset(preset);
    setSkills(preset.skills);
  };

  const handleGenerateBuild = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playstyle: selectedPreset.name,
          budget: budgetTier,
          focusArea,
          primaryVehicleType: vehicleType,
        }),
      });
      const data = await res.json();
      setStrategyOutput(data.result);
    } catch (err) {
      console.error('Build generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'EyeOff': return <EyeOff className="w-5 h-5 text-cyan-400" />;
      case 'Car': return <Car className="w-5 h-5 text-pink-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-400" />;
      default: return <Layers className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Zenith Asset Engine & Playstyle Profiler</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            ZENITH BUILD & LOADOUT ARCHITECT
          </h2>
          <p className="text-xs text-slate-400">
            Min-max your skill progression curves, high-ROI money routes, and bespoke vehicle weapon setups.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Optimization:</span>
          <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
            S-TIER PROGRESSION
          </span>
        </div>
      </div>

      {/* Preset Archetypes Selection */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Select Master Archetype
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLAYSTYLE_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60">
                    {getPresetIcon(preset.iconName)}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold font-display text-white">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-cyan-400/80 font-mono mt-0.5">
                  {preset.tagline}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration & Skill Allocation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customization Parameters */}
        <div className="lg:col-span-6 bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Operational Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Budget & Liquid Capital Tier
            </label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Bootstrapped Hustler (Under $100,000)">Bootstrapped Hustler (Under $100,000)</option>
              <option value="Mid-Tier ($250,000 - $1,000,000)">Mid-Tier ($250,000 - $1,000,000)</option>
              <option value="Syndicate Heavyweight ($1,000,000 - $5,000,000)">Syndicate Heavyweight ($1,000,000 - $5,000,000)</option>
              <option value="Leonida Monopoly ($10,000,000+ Unlimited)">Leonida Monopoly ($10,000,000+ Unlimited)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Strategic Progression Focus
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Real Estate & Safehouse Arbitrage">Real Estate & Safehouse Arbitrage</option>
              <option value="High-Yield Chop Shops & Exotic Car Export">High-Yield Chop Shops & Exotic Car Export</option>
              <option value="Offshore Marine Smuggling & Keys Salvage">Offshore Marine Smuggling & Keys Salvage</option>
              <option value="Bank Vault Infiltration & Cyber Digital Manifests">Bank Vault Infiltration & Cyber Digital Manifests</option>
              <option value="Pawn Shop & Distressed Asset Monopolization">Pawn Shop & Distressed Asset Monopolization</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Primary Vehicle Tuning Priority
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Armored Muscle Car & Offshore Speedboat">Armored Muscle Car & Offshore Speedboat</option>
              <option value="Silent Electric Supercar & Mini-Submersible">Silent Electric Supercar & Mini-Submersible</option>
              <option value="High-Torque 4x4 Swamp Dually & Fanboat">High-Torque 4x4 Swamp Dually & Fanboat</option>
              <option value="Track-Tuned Superbike & Getaway Helicopter">Track-Tuned Superbike & Getaway Helicopter</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateBuild}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>CALCULATING OPTIMAL WEAPON & VEHICLE MATRIX...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-cyan-200" />
                  <span>GENERATE ZENITH LOADOUT DOSSIER</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skill Progression Sliders & Stat Radar */}
        <div className="lg:col-span-6 bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Character Skill Allocation Matrix</span>
            <span className="text-cyan-400 text-xs">DYNAMIC XP</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              { key: 'stealth', label: 'Stealth & Acoustic Signature', val: skills.stealth, color: 'bg-cyan-500' },
              { key: 'driving', label: 'Driving Slip & Cornering Grip', val: skills.driving, color: 'bg-pink-500' },
              { key: 'shooting', label: 'Weapon Accuracy & Recoil Dampening', val: skills.shooting, color: 'bg-amber-500' },
              { key: 'stamina', label: 'Stamina & Deep Water Breath', val: skills.stamina, color: 'bg-emerald-500' },
              { key: 'hacking', label: 'Electronic Keypad & Cyber Bypass', val: skills.hacking, color: 'bg-purple-500' },
            ].map((skill) => (
              <div key={skill.key} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{skill.label}</span>
                  <span className="font-bold text-white">{skill.val}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${skill.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${skill.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-cyan-300 font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recommended Weapon Loadout:</span>
            </div>
            <p className="text-slate-300">{selectedPreset.weaponFocus}</p>
            <div className="text-pink-300 font-semibold flex items-center space-x-1.5 pt-1">
              <Car className="w-3.5 h-3.5 text-pink-400" />
              <span>Recommended Vehicle Asset:</span>
            </div>
            <p className="text-slate-300">{selectedPreset.vehicleFocus}</p>
          </div>
        </div>
      </div>

      {/* Generated Loadout Dossier */}
      {strategyOutput && (
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {strategyOutput}
          </div>
        </div>
      )}
    </div>
  );
};
