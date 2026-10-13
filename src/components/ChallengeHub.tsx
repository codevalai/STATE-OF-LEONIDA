import React, { useState } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Zap, 
  RotateCcw, 
  CheckCircle, 
  Copy, 
  Check, 
  Flame, 
  Sliders,
  Send,
  ShieldAlert
} from 'lucide-react';
import { SavedChallenge } from '../types';

export const ChallengeHub: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'Chill' | 'Normal' | 'Hardcore' | 'Nightmare'>('Hardcore');
  const [theme, setTheme] = useState<string>('Heist & Stunt Night');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  const [loading, setLoading] = useState(false);
  const [challengesText, setChallengesText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick default challenge cards
  const [activeChallenges, setActiveChallenges] = useState<SavedChallenge[]>([
    {
      id: 'c-1',
      title: 'Ghost of Biscayne Bay',
      difficulty: 'Hardcore',
      objective: 'Steal yacht safe deposit keys from Starfish Island and deliver to Kelly Island drop-point.',
      rules: [
        'HUD Minimap and Reticle completely disabled',
        'Zero gunfire permitted (takedowns or distraction flares only)',
        'If 2-star wanted level is acquired, evade on foot or paddleboat only',
      ],
      duration: '20 Mins',
      rewardTitle: 'Specter of the Keys',
      completed: false,
    },
    {
      id: 'c-2',
      title: 'Neon Drift Courier',
      difficulty: 'Normal',
      objective: 'Complete 4 illicit cargo drop-offs across Downtown Vice City within one night cycle.',
      rules: [
        'Drive only rear-wheel-drive muscle cars without traction control mods',
        'Never repair vehicle at Pay n Spray; must finish with initial chassis',
        'Must drift every 90-degree intersection turn',
      ],
      duration: '25 Mins',
      rewardTitle: 'Vice City Apex Drifter',
      completed: true,
    },
    {
      id: 'c-3',
      title: 'The Six-Star Everglades Gauntlet',
      difficulty: 'Nightmare',
      objective: 'Provoke a 4+ star tactical response in Port Gellhorn and escape across the Everglades swamp into Lake Leonida.',
      rules: [
        'Air vehicles strictly forbidden',
        'Use only found or hijacked all-terrain buggies and fanboats',
        'No armor replenishment during pursuit',
      ],
      duration: '15 Mins',
      rewardTitle: 'Swamp Gator Survivor',
      completed: false,
    },
  ]);

  const handleRollChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          theme,
          durationMinutes,
        }),
      });
      const data = await res.json();
      setChallengesText(data.result);
    } catch (err) {
      console.error('Challenge error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleChallengeCompleted = (id: string) => {
    setActiveChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const handleCopy = () => {
    if (!challengesText) return;
    navigator.clipboard.writeText(challengesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Custom Challenge & Replay Modifier Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            LEONIDA CHALLENGE GENERATOR
          </h2>
          <p className="text-xs text-slate-400">
            Self-imposed rules, themed runs (No Minimap, Pacifist Getaway, Stunt Night), and difficulty presets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Prestige Tier:</span>
          <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
            COMMUNITY LEGEND
          </span>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      ? 'bg-amber-600/30 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Challenge Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Heist & Stunt Night">Heist & Stunt Night</option>
              <option value="Zero-Trace Ghost Infiltration">Zero-Trace Ghost Infiltration (No Guns)</option>
              <option value="Six-Star Wanted Level Survival">Six-Star Wanted Level Survival</option>
              <option value="Everglades Off-Road Smuggler">Everglades Off-Road Smuggler</option>
              <option value="No HUD / Ultra-Immersion Wheelman">No HUD / Ultra-Immersion Wheelman</option>
            </select>
          </div>

          {/* Session Duration */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Available Time ({durationMinutes}m)
            </label>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleRollChallenges}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 hover:from-amber-500 hover:to-pink-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Zap className="w-4 h-4 animate-spin text-amber-300" />
              <span>SYNTHESIZING PRESTIGE CHALLENGES...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>ROLL 3 DYNAMIC {difficulty.toUpperCase()} CHALLENGES</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Output */}
      {challengesText && (
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <span className="font-mono text-xs font-bold text-amber-400 uppercase">
              NEWLY GENERATED CHALLENGES
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 text-xs font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Challenges'}</span>
            </button>
          </div>
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {challengesText}
          </div>
        </div>
      )}

      {/* Featured Community Challenges Deck */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Active Challenge Deck</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                challenge.completed
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    challenge.difficulty === 'Nightmare' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    challenge.difficulty === 'Hardcore' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-slate-500">{challenge.duration}</span>
                </div>

                <h4 className={`text-base font-bold font-display ${challenge.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                  {challenge.title}
                </h4>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {challenge.objective}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                    Self-Imposed Constraints:
                  </span>
                  <ul className="text-[11px] text-slate-400 space-y-1 font-mono list-disc list-inside">
                    {challenge.rules.map((rule, idx) => (
                      <li key={idx} className="leading-snug">{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Title: {challenge.rewardTitle}
                </span>

                <button
                  type="button"
                  onClick={() => toggleChallengeCompleted(challenge.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors ${
                    challenge.completed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{challenge.completed ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
