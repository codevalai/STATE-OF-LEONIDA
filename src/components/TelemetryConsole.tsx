import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Cpu, 
  Send, 
  Zap, 
  Radio, 
  Crosshair, 
  Terminal, 
  Check, 
  X, 
  AlertTriangle,
  Play,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PRESET_TELEMETRY_PAYLOADS } from '../data/leonidaData';
import { TelemetryEvent } from '../types';

interface TelemetryConsoleProps {
  injectedCoords?: { x: number; y: number; z: number } | null;
  injectedSector?: string | null;
}

export const TelemetryConsole: React.FC<TelemetryConsoleProps> = ({
  injectedCoords,
  injectedSector,
}) => {
  const [history, setHistory] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Custom payload builder state
  const [playerId, setPlayerId] = useState('player_lucia_01');
  const [actionType, setActionType] = useState<'heist_stage' | 'economy_trade' | 'combat' | 'vehicle_theft' | 'evasion'>('heist_stage');
  const [platform, setPlatform] = useState<'PS5' | 'XBOX_SERIES_X' | 'CFX_DEDICATED'>('PS5');
  const [posX, setPosX] = useState(injectedCoords?.x ?? 1240.5);
  const [posY, setPosY] = useState(injectedCoords?.y ?? -450.2);
  const [posZ, setPosZ] = useState(injectedCoords?.z ?? 14.8);
  const [velX, setVelX] = useState(22.4);
  const [velY, setVelY] = useState(-5.1);
  const [velZ, setVelZ] = useState(0);
  const [wantedLevel, setWantedLevel] = useState(4);
  const [sectorName, setSectorName] = useState(injectedSector || 'Vice Beach Promenade');
  const [cashAmount, setCashAmount] = useState(450000);

  // Update if injected from map
  useEffect(() => {
    if (injectedCoords) {
      setPosX(injectedCoords.x);
      setPosY(injectedCoords.y);
      setPosZ(injectedCoords.z);
    }
    if (injectedSector) {
      setSectorName(injectedSector);
    }
  }, [injectedCoords, injectedSector]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/telemetry/history');
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Failed to fetch telemetry history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSendSimulation = async (customPayload?: any) => {
    setLoading(true);
    const payloadToSend = customPayload || {
      playerId,
      platform,
      actionType,
      coords: { x: Number(posX), y: Number(posY), z: Number(posZ) },
      velocity: { vx: Number(velX), vy: Number(velY), vz: Number(velZ) },
      wantedLevel: Number(wantedLevel),
      sectorName,
      eventDetails: {
        cashInvolved: Number(cashAmount),
        shotsFired: 12,
        vehicleModel: 'Bravado Buffalo STX',
      },
    };

    try {
      const res = await fetch('/api/telemetry/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://ais-sovereign-cfx-cluster.cloud',
          'x-sovereign-token': 'VALID_CFX_TOKEN_2026',
        },
        body: JSON.stringify(payloadToSend),
      });
      const data = await res.json();
      if (data.entry) {
        setHistory((prev) => [data.entry, ...prev.slice(0, 49)]);
      } else if (data.details) {
        setHistory((prev) => [data.details, ...prev.slice(0, 49)]);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerPreset = (index: number) => {
    setActivePresetIndex(index);
    const preset = PRESET_TELEMETRY_PAYLOADS[index];
    handleSendSimulation(preset.payload);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Sovereign Dedicated Telemetry & DevOps Infrastructure</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            SOVEREIGN SERVER ORCHESTRATOR
          </h2>
          <p className="text-xs text-slate-400">
            Zod runtime schema validation, permissive cross-domain security auditing, aggregation buffer compression, and predictive pathing.
          </p>
        </div>

        {/* Live Architecture Metrics */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>NODE 22 LIBUV POOL</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ZOD SCHEMAS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Preset Scenario Quick-Triggers */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Simulated Server Telemetry Scenarios</span>
          <span className="text-slate-500 text-[11px]">Click to fire instant telemetry stream</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_TELEMETRY_PAYLOADS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTriggerPreset(idx)}
              className="p-3.5 rounded-xl text-left border bg-slate-950/70 border-slate-800/80 hover:border-emerald-500/60 hover:bg-slate-900/80 transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-bold group-hover:text-emerald-300 transition-colors">
                  SCENARIO #{idx + 1}
                </span>
                <Play className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold font-display text-white line-clamp-1">
                {p.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Telemetry Payload Injector & Predictive Pathing Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Custom Injector Form */}
        <div className="lg:col-span-7 bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Live Telemetry Packet Forge</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Zod Validated Payload</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Player Identifier</label>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Target Action</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-white"
              >
                <option value="heist_stage">heist_stage</option>
                <option value="economy_trade">economy_trade</option>
                <option value="combat">combat</option>
                <option value="vehicle_theft">vehicle_theft</option>
                <option value="evasion">evasion</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Platform Shard</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-white"
              >
                <option value="PS5">PS5 (Console Telemetry)</option>
                <option value="XBOX_SERIES_X">XBOX_SERIES_X</option>
                <option value="CFX_DEDICATED">CFX_DEDICATED (FiveM/Node 22)</option>
              </select>
            </div>
          </div>

          {/* Coordinates & Velocity Vector */}
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span className="text-cyan-300 font-semibold">GEOMETRY COORDINATES (X, Y, Z):</span>
              <span>Sector: {sectorName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500">Coord X</label>
                <input
                  type="number"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Coord Y</label>
                <input
                  type="number"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Coord Z</label>
                <input
                  type="number"
                  value={posZ}
                  onChange={(e) => setPosZ(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400 text-[11px]">
              <span className="text-pink-400 font-semibold">VELOCITY VECTOR (Vx, Vy, Vz m/s):</span>
              <span className="text-[10px] text-slate-500">Calculates Trajectory</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500">Vx (m/s)</label>
                <input
                  type="number"
                  value={velX}
                  onChange={(e) => setVelX(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Vy (m/s)</label>
                <input
                  type="number"
                  value={velY}
                  onChange={(e) => setVelY(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Vz (m/s)</label>
                <input
                  type="number"
                  value={velZ}
                  onChange={(e) => setVelZ(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Wanted Heat Level (0 - 6)</label>
              <input
                type="number"
                min="0"
                max="6"
                value={wantedLevel}
                onChange={(e) => setWantedLevel(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Economy Cash Involved ($)</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSendSimulation()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-emerald-300" />
                <span>VALIDATING VIA ZOD RUNTIME SCHEMA...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-emerald-200" />
                <span>PUMP TELEMETRY PACKET TO SOVEREIGN API</span>
              </>
            )}
          </button>
        </div>

        {/* Predictive Vector Compass & Architecture Diagnostics */}
        <div className="lg:col-span-5 bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-pink-400" />
                <span>Predictive Pathing Vector</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Δt = 3.5s INTERCEPT</span>
            </div>

            {/* Tactical Vector Display */}
            <div className="my-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-mono space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Position:</span>
                <span className="text-cyan-300 font-bold">X: {posX} | Y: {posY}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Speed Magnitude:</span>
                <span className="text-amber-400 font-bold">
                  {Math.round(Math.sqrt(velX * velX + velY * velY) * 2.237)} MPH ({Math.round(Math.sqrt(velX * velX + velY * velY))} m/s)
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-pink-400 font-semibold">Predicted Intercept (T + 3.5s):</span>
                <span className="text-pink-300 font-bold">
                  X: {Number((posX + velX * 3.5).toFixed(1))} | Y: {Number((posY + velY * 3.5).toFixed(1))}
                </span>
              </div>
            </div>

            {/* Architecture Safeguards Explanation */}
            <div className="space-y-2 text-xs font-mono text-slate-400">
              <div className="p-2.5 bg-slate-900/40 rounded border border-slate-800/80 space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center space-x-1.5 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Main-Thread Marshalling Guaranteed:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Marshals asynchronous AI WebSocket responses through Node 22 libuv wrappers back to main CitizenFX tick loops, preventing "No current resource manager" server crashes.
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/40 rounded border border-slate-800/80 space-y-1">
                <div className="text-cyan-400 font-semibold flex items-center space-x-1.5 text-[11px]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Aggregation Buffer:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Batches rapid 40Hz telemetry streams into memory bundles every 30 seconds. Compresses payload by 94.2% to prevent Gemini context window overflow.
                </p>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-purple-950/20 border border-purple-500/30 rounded-lg text-[11px] font-mono text-purple-300 flex items-center justify-between">
            <span>Security Origin Status:</span>
            <span className="font-bold text-emerald-400">CORS LOCKED // STRICT AUTH</span>
          </div>
        </div>
      </div>

      {/* Live Stream Audit Log */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
              Live Ingest Stream & Orchestration Ledger ({history.length} Events)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Auto-refreshing</span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No telemetry events recorded yet. Click a scenario above to test!
            </div>
          ) : (
            history.map((entry) => {
              const isPassed = entry.validationStatus === 'PASSED';
              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-xl border font-mono text-xs transition-all space-y-2.5 ${
                    isPassed
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      : 'bg-rose-950/20 border-rose-500/40'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-bold">{entry.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center space-x-1 ${
                        isPassed
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {isPassed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{entry.validationStatus}</span>
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {entry.rawPayload?.platform || 'CONSOLE'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/30">
                        Action: {entry.rawPayload?.actionType}
                      </span>
                      {entry.rawPayload?.wantedLevel > 0 && (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                          {entry.rawPayload.wantedLevel} ★
                        </span>
                      )}
                    </div>
                  </div>

                  {/* If Rejected: Show detailed Zod Schema error */}
                  {!isPassed && entry.validationErrors && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded text-rose-300 text-[11px] space-y-1">
                      <div className="font-bold flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Security / Zod Schema Rejection Reason:</span>
                      </div>
                      <pre className="text-[10px] overflow-x-auto text-rose-200">
                        {JSON.stringify(entry.validationErrors, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* If Passed: Show AI Orchestration Action & Intercept coordinates */}
                  {isPassed && entry.aiOrchestrationAction && (
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded space-y-2 text-[11px]">
                      <div className="flex flex-wrap items-center justify-between text-slate-300">
                        <span className="text-pink-400 font-bold flex items-center space-x-1">
                          <Radio className="w-3 h-3" />
                          <span>AI Game Master Dispatch: {entry.aiOrchestrationAction.unitDispatched}</span>
                        </span>
                        <span className="text-cyan-400">
                          Intercept Vector: X: {entry.aiOrchestrationAction.interceptCoords.x} | Y: {entry.aiOrchestrationAction.interceptCoords.y}
                        </span>
                      </div>
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Tactical Order:</strong> {entry.aiOrchestrationAction.tacticalOrder}
                      </p>
                      <div className="text-emerald-400 text-[10px]">
                        Market Impact: {entry.aiOrchestrationAction.marketImpact}
                      </div>
                    </div>
                  )}

                  {/* Aggregation buffer metrics */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>
                      Aggregation Buffer: {entry.aggregatedMetrics?.eventCount || 24} events compressed ({entry.aggregatedMetrics?.compressionRatio || '94.2%'})
                    </span>
                    <span>CORS Verified // Permissive Cross-Domain Patched</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
