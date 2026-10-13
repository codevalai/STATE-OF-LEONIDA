import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Crosshair, 
  Radio, 
  AlertTriangle, 
  Check, 
  RotateCcw, 
  Zap, 
  Activity,
  Heart,
  Shield,
  Car,
  Key,
  Compass
} from 'lucide-react';
import { CrewMember, SyndicateSessionState } from '../types';

export const CrewSyncMatrix: React.FC = () => {
  const [syndicate, setSyndicate] = useState<SyndicateSessionState | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);

  const fetchCrewState = async () => {
    try {
      const res = await fetch('/api/crew/sync');
      const data = await res.json();
      if (data.syndicateState) {
        setSyndicate(data.syndicateState);
        if (!selectedMember && data.syndicateState.members?.length > 0) {
          setSelectedMember(data.syndicateState.members[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch crew state:', err);
    }
  };

  useEffect(() => {
    fetchCrewState();
  }, []);

  const handleSimulateCasualty = async (memberId: string, statusOverride: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/crew/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          statusOverride,
        }),
      });
      const data = await res.json();
      if (data.syndicateState) {
        setSyndicate(data.syndicateState);
        const updated = data.syndicateState.members.find((m: CrewMember) => m.id === memberId);
        if (updated) setSelectedMember(updated);
      }
    } catch (err) {
      console.error('Casualty simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSquad = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crew/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: 'all',
          statusOverride: 'OPTIMAL',
          incident: 'RESET',
        }),
      });
      const data = await res.json();
      if (data.syndicateState) {
        setSyndicate(data.syndicateState);
      }
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!syndicate) {
    return (
      <div className="py-20 text-center font-mono text-xs text-slate-500">
        <Zap className="w-6 h-6 animate-spin text-pink-400 mx-auto mb-2" />
        CONNECTING TO 8-NODE SYNDICATE WEBSOCKET HUB...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Multi-Node Crew Synchronization // "The Heist Matrix"</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            8-PLAYER BATTLEFIELD COMMANDER
          </h2>
          <p className="text-xs text-slate-400">
            Real-time multi-tenant telemetry ingestion, relative spatial coordination, and dynamic casualty role reallocation.
          </p>
        </div>

        {/* Emergency test triggers */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleSimulateCasualty('member_4_hacker', 'DOWN')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/60 font-bold transition-all flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Nyx (Hacker) Down</span>
          </button>

          <button
            type="button"
            onClick={handleResetSquad}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 8 Nodes</span>
          </button>
        </div>
      </div>

      {/* Global Directive Notice */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <span className="text-pink-400 font-bold uppercase">BATTLEFIELD COMMAND DIRECTIVE</span>
            <span className="text-slate-600">//</span>
            <span className="text-slate-400 font-semibold">{syndicate.syndicateName}</span>
          </div>
          <p className="text-sm font-semibold text-white font-sans">
            "{syndicate.battlefieldDirective}"
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono flex items-center space-x-2 shrink-0">
          <span className="text-slate-400">Syndicate Alert:</span>
          <span className="text-amber-400 font-bold">{syndicate.globalAlertLevel} ★</span>
        </div>
      </div>

      {/* 8-Player Tactical Formation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {syndicate.members.map((member) => {
          const isSelected = selectedMember?.id === member.id;
          const isDown = member.status === 'DOWN';

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => setSelectedMember(member)}
              className={`p-3.5 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                isDown
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : isSelected
                  ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400 font-bold">{member.callsign}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                    isDown
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-display text-white">
                  {member.name}
                </h4>
                <div className="text-[11px] font-mono text-cyan-400/90 mt-0.5">
                  {member.role}
                </div>

                {/* Health & Armor bars */}
                <div className="mt-2.5 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between text-slate-400">
                    <span className="flex items-center space-x-1"><Heart className="w-3 h-3 text-rose-500" /><span>HP</span></span>
                    <span className="text-white font-bold">{member.health}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full transition-all" style={{ width: `${member.health}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400 pt-0.5">
                    <span className="flex items-center space-x-1"><Shield className="w-3 h-3 text-cyan-400" /><span>Armor</span></span>
                    <span className="text-white font-bold">{member.armor}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full transition-all" style={{ width: `${member.armor}%` }} />
                  </div>
                </div>
              </div>

              {/* Individual micro-prompt preview */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-300 truncate">
                <span className="text-pink-400 font-semibold">HUD: </span>
                <span>{member.activeMicroPrompt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Crew Member Detailed Inspector & Micro-Prompt Channel */}
      {selectedMember && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold uppercase">{selectedMember.role}</span>
                <span>•</span>
                <span>Callsign: {selectedMember.callsign}</span>
                <span>•</span>
                <span>Status: {selectedMember.status}</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white mt-0.5">
                {selectedMember.name}
              </h3>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                X: {selectedMember.coords.x} | Y: {selectedMember.coords.y} | Z: {selectedMember.coords.z}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Active Micro-Prompt Pushed to Player Screen */}
            <div className="p-4 rounded-xl bg-slate-950 border border-pink-500/40 space-y-2">
              <div className="flex items-center space-x-2 text-pink-400 font-bold">
                <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>INDIVIDUALIZED MICRO-PROMPT (SCREEN HUD)</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed font-sans">
                "{selectedMember.activeMicroPrompt}"
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                Directive Objective: {selectedMember.currentObjective}
              </div>
            </div>

            {/* Gear & Loadout info */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-cyan-300 font-bold">EQUIPMENT & ASSETS</div>
              <div className="space-y-1 text-slate-300">
                <div>• Weapon: <span className="text-white font-semibold">{selectedMember.equippedWeapon}</span></div>
                {selectedMember.currentVehicle && (
                  <div>• Assigned Asset: <span className="text-pink-300 font-semibold">{selectedMember.currentVehicle}</span></div>
                )}
                <div>• Velocity Vector: <span className="text-amber-300">Vx: {selectedMember.velocity.vx} | Vy: {selectedMember.velocity.vy}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
