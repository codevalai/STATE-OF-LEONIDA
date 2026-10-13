import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  GitBranch, 
  Database, 
  Play, 
  Zap, 
  Activity, 
  Layers, 
  Terminal, 
  ShieldCheck,
  Eye,
  Radio,
  Compass
} from 'lucide-react';
import { OmniAgentDrone } from '../types';

export const OmniAgentMatrix: React.FC = () => {
  const [agents, setAgents] = useState<OmniAgentDrone[]>([]);
  const [totalSamples, setTotalSamples] = useState<string>('13,052,000 Episodic Records');
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<OmniAgentDrone | null>(null);

  const fetchMatrix = async () => {
    try {
      const res = await fetch('/api/omni-agent/matrix');
      const data = await res.json();
      if (data.omniAgents) {
        setAgents(data.omniAgents);
        if (!selectedAgent && data.omniAgents.length > 0) {
          setSelectedAgent(data.omniAgents[0]);
        }
      }
      if (data.syntheticSamplesTotal) {
        setTotalSamples(data.syntheticSamplesTotal);
      }
    } catch (err) {
      console.error('Failed to fetch omni-agent matrix:', err);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const handleCommandAgent = async (agentId: string, commandAction: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/omni-agent/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, commandAction }),
      });
      const data = await res.json();
      if (data.agent) setSelectedAgent(data.agent);
      if (data.omniAgents) setAgents(data.omniAgents);
    } catch (err) {
      console.error('Command agent error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Open-Source Bot Assimilation & Autonomous Drone Hierarchy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            OMNI-AGENT SCRAPING & DRONE MATRIX
          </h2>
          <p className="text-xs text-slate-400">
            Ingests open-source repositories (pygta5, GTAV-RewardHook, PedGPT) into an Apache Kafka pipeline. Gemini 3.8 Flash commands low-IQ execution bots.
          </p>
        </div>

        {/* Global Synthetic Dataset metric */}
        <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/40 font-mono text-right">
          <div className="text-[10px] text-purple-300 uppercase">Harvested RL Dataset</div>
          <div className="text-lg font-bold text-white font-display">
            {totalSamples}
          </div>
        </div>
      </div>

      {/* Drone Hierarchy Flow Diagram */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="text-slate-400 uppercase text-[10px] font-bold">
          SOVEREIGN COMMAND HIERARCHY ARCHITECTURE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-gradient-to-br from-pink-950/60 to-purple-950/60 rounded-lg border border-pink-500/40 space-y-1">
            <div className="text-pink-300 font-bold">LEVEL 1: SYNDICATE BOSS (HIGH-IQ)</div>
            <div className="text-white text-[11px] font-semibold">Google Gemini 3.8 Flash</div>
            <p className="text-[10px] text-slate-400">Makes strategic decisions, manages server economy, issues mission directives.</p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
            <div className="text-cyan-300 font-bold">LEVEL 2: MIDDLEWARE RELAY</div>
            <div className="text-white text-[11px] font-semibold">Express & Zod Runtime Schema</div>
            <p className="text-[10px] text-slate-400">Validates telemetry streams, audits CORS origins, aggregates WebSockets.</p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
            <div className="text-emerald-300 font-bold">LEVEL 3: EXECUTION GRUNTS (LOW-IQ)</div>
            <div className="text-white text-[11px] font-semibold">Scraped CNN & RL Drones</div>
            <p className="text-[10px] text-slate-400">pygta5 lane steering, RewardHook telemetry pumps, PedGPT dialogue logic.</p>
          </div>
        </div>
      </div>

      {/* Scraped Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {agents.map((agent) => {
          const isSelected = selectedAgent?.id === agent.id;
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => setSelectedAgent(agent)}
              className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-950/60 to-slate-900 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {agent.engine.split('_')[0]}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    agent.status === 'ACTIVE_DRONE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-display text-white">
                  {agent.name}
                </h4>
                <div className="text-[11px] font-mono text-purple-300/80 mt-0.5">
                  Repo: {agent.sourceRepo}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 font-mono text-[10px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Performance:</span>
                    <span className="text-white font-bold">{agent.lossOrRewardScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telemetry Ingest:</span>
                    <span className="text-cyan-300 font-bold">{agent.telemetryFPS} FPS</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-300 truncate">
                <span className="text-purple-400 font-semibold">Task: </span>
                <span>{agent.currentMissionTask}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Drone Inspector & Command Dispatcher */}
      {selectedAgent && (
        <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="text-purple-400 font-bold">{selectedAgent.engine}</span>
                <span>•</span>
                <span>Source: {selectedAgent.sourceRepo}</span>
                <span>•</span>
                <span>Sector: {selectedAgent.assignedSector}</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white mt-0.5">
                {selectedAgent.name}
              </h3>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleCommandAgent(selectedAgent.id, 'DISPATCH_RECON')}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Dispatch Autonomous Drone</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleCommandAgent(selectedAgent.id, 'TOGGLE_STATUS')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <span>Toggle Standby</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-purple-300 font-bold uppercase">Harvested Neural Metrics</div>
              <div className="space-y-1.5 text-slate-300">
                <div>• Ingested Episodic Samples: <span className="text-white font-bold">{selectedAgent.samplesHarvested.toLocaleString()} Frames</span></div>
                <div>• Training Benchmark: <span className="text-emerald-400 font-bold">{selectedAgent.lossOrRewardScore}</span></div>
                <div>• Sampling Throughput: <span className="text-cyan-300 font-bold">{selectedAgent.telemetryFPS} Frames/Sec</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-pink-300 font-bold uppercase">Active Mission Directive</div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {selectedAgent.currentMissionTask}
              </p>
              <div className="text-[10px] text-slate-500 pt-1">
                Zod validation enforced on all incoming Reinforcement Learning frames.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
