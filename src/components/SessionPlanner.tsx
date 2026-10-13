import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Send, 
  Zap, 
  Bookmark, 
  Trash2, 
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Plus
} from 'lucide-react';
import { SessionPlanItem } from '../types';

interface SessionPlannerProps {
  bookmarkedMissions: { id: string; title: string; text: string; date: string }[];
  onRemoveBookmark: (id: string) => void;
}

export const SessionPlanner: React.FC<SessionPlannerProps> = ({
  bookmarkedMissions,
  onRemoveBookmark,
}) => {
  const [timeBudget, setTimeBudget] = useState<string>('60');
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate');
  const [currentGoal, setCurrentGoal] = useState<string>('Expand cash reserves and buy first offshore yacht safehouse');
  
  const [loading, setLoading] = useState(false);
  const [sessionRoadmapText, setSessionRoadmapText] = useState<string | null>(null);

  // Interactive Checklist Tasks for Tonight
  const [checklist, setChecklist] = useState<SessionPlanItem[]>([
    {
      id: 'task-1',
      title: 'Port Gellhorn Vehicle Snatch',
      timeWindow: '15 mins',
      location: 'Port Gellhorn Industrial Rail Yards',
      action: 'Hijack the Bravado Banshee transporter and deliver to Chop Shop',
      payout: '+$42,000 & 1,200 XP',
      completed: true,
    },
    {
      id: 'task-2',
      title: 'Grassrivers Contraband Beacon Scramble',
      timeWindow: '20 mins',
      location: 'Grassrivers Channel 4',
      action: 'Recover smuggler air-drop before swamp scavengers arrive',
      payout: '+$65,000',
      completed: false,
    },
    {
      id: 'task-3',
      title: 'Starfish Key Poker Vault Break',
      timeWindow: '15 mins',
      location: 'Vice Beach Private Club',
      action: 'Bypass keypad, crack lockbox, amphibious getaway',
      payout: '+$85,000 & Diamond Ring',
      completed: false,
    },
    {
      id: 'task-4',
      title: 'Safehouse Real Estate Acquisition',
      timeWindow: '10 mins',
      location: 'Ocean Beach Marina Penthouse',
      action: 'Stash acquired vehicles and upgrade ballistic armor',
      payout: 'Equity Asset Locked',
      completed: false,
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const removeTask = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: SessionPlanItem = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      timeWindow: '15 mins',
      location: 'Vice City Metro',
      action: 'Custom objective',
      payout: 'Progression XP',
      completed: false,
    };
    setChecklist([...checklist, newTask]);
    setNewTaskTitle('');
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor/session-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeBudget,
          experienceLevel,
          currentGoal,
        }),
      });
      const data = await res.json();
      setSessionRoadmapText(data.result);
    } catch (err) {
      console.error('Session plan generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = checklist.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-pink-400" />
            <span>Gameplay Session Coach & Agenda Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            TONIGHT'S SESSION ROADMAP
          </h2>
          <p className="text-xs text-slate-400">
            Tell the AI how much time you have (30m, 60m, 90m+) and your goals. Get a 4-phase optimized session plan.
          </p>
        </div>

        {/* Completion Progress pill */}
        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center space-x-3 font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Session Progress</div>
            <div className="text-white font-bold text-sm">{completedCount} / {checklist.length} Completed</div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-pink-500/30 flex items-center justify-center font-bold text-pink-400 text-xs">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Time Budget & Goal Form */}
      <div className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Time Budget Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Time Budget Tonight
            </label>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              {[
                { val: '30', label: '30m' },
                { val: '60', label: '60m' },
                { val: '90', label: '90m' },
                { val: '120', label: '2h+' },
              ].map((t) => (
                <button
                  key={t.val}
                  type="button"
                  onClick={() => setTimeBudget(t.val)}
                  className={`py-2 rounded-lg border text-center transition-all ${
                    timeBudget === t.val
                      ? 'bg-pink-600/30 border-pink-500 text-pink-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Player Experience Tier
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
            >
              <option value="New Recruit (Learning Mechanics)">New Recruit (Learning Mechanics)</option>
              <option value="Intermediate (Familiar with Leonida)">Intermediate (Familiar with Leonida)</option>
              <option value="Veteran / Min-Max Hustler">Veteran / Min-Max Hustler</option>
              <option value="Hardcore Syndicate Mastermind">Hardcore Syndicate Mastermind</option>
            </select>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Primary Goal for Tonight
            </label>
            <input
              type="text"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              placeholder="e.g. Grind $500k, unlock suppressed weapons"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleGeneratePlan}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-pink-600/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Zap className="w-4 h-4 animate-spin text-pink-300" />
              <span>COACHING SESSION OBJECTIVES...</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-pink-200" />
              <span>GENERATE {timeBudget}-MINUTE TONIGHT'S PLAN</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Roadmap Display */}
      {sessionRoadmapText && (
        <div className="bg-slate-900/90 border border-pink-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {sessionRoadmapText}
          </div>
        </div>
      )}

      {/* Interactive Session Checklist */}
      <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-pink-400" />
            <span>Interactive Objectives Tracker</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Check off as you complete</span>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                item.completed
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTask(item.id)}
                className="mt-0.5 text-slate-400 hover:text-pink-400 transition-colors focus:outline-none"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 hover:text-pink-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className={`text-sm font-bold font-display ${item.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {item.timeWindow}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {item.payout}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  <strong className="text-slate-300 font-mono">Location:</strong> {item.location} — {item.action}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeTask(item.id)}
                className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                title="Remove task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add custom objective form */}
        <form onSubmit={addTask} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add custom tonight objective (e.g., Scout Biscayne lighthouse for collectible)"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Bookmarked Mission Plans */}
      {bookmarkedMissions.length > 0 && (
        <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-slate-300 font-mono text-xs uppercase tracking-wider">
            <Bookmark className="w-4 h-4 text-pink-400" />
            <span>Saved Mission Strategies ({bookmarkedMissions.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookmarkedMissions.map((bm) => (
              <div key={bm.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold font-display text-white">{bm.title}</h4>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(bm.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-400 line-clamp-3">
                  {bm.text}
                </p>
                <div className="text-[10px] font-mono text-slate-600 pt-1">
                  Saved: {new Date(bm.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
