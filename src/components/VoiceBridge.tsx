import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Zap, 
  AlertTriangle, 
  Radio, 
  Compass, 
  ShieldAlert, 
  Navigation,
  Play,
  RotateCcw
} from 'lucide-react';

interface VoiceBridgeProps {
  wantedLevel: number;
}

export const VoiceBridge: React.FC<VoiceBridgeProps> = ({ wantedLevel }) => {
  const [isListening, setIsListening] = useState(false);
  const [speedMph, setSpeedMph] = useState(140);
  const [voiceQuery, setVoiceQuery] = useState('Vice, the transport took a detour down Ocean Drive, the tunnel is blown!');
  const [loading, setLoading] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<any>({
    status: 'VOICE_RELAY_ACTIVE',
    latencyMs: 142,
    inputTranscript: 'Vice, the transport took a detour down Ocean Drive, the tunnel is blown!',
    voiceScript: 'Understood. Rerouting to the Vice Beach marina. Take the next left through the alleyway; I am pinging a secondary extraction boat to your HUD now. Ditch the cruiser and hit the water!',
    tacticalReroute: {
      destinationSector: 'Vice Beach North Marina Dock 3',
      waypointCoords: { x: 1520, y: -290, z: 2 },
      recommendedAction: 'Amphibious Escape via Shitzu Jetboat',
    },
  });
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioWave, setAudioWave] = useState([30, 65, 85, 45, 95, 70, 40, 80, 60, 90, 50, 75]);

  // Audio wave fluctuation simulation
  useEffect(() => {
    let interval: any;
    if (isListening || audioPlaying) {
      interval = setInterval(() => {
        setAudioWave((prev) => prev.map(() => Math.floor(Math.random() * 75) + 25));
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isListening, audioPlaying]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.95;
      utterance.rate = 1.15; // Fast tactical delivery
      utterance.onstart = () => setAudioPlaying(true);
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendVoiceQuery = async (customPrompt?: string) => {
    setLoading(true);
    const query = customPrompt || voiceQuery;
    try {
      const res = await fetch('/api/advisor/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voicePrompt: query,
          playerCoords: { x: 1450, y: -380, z: 25 },
          speedMph,
          wantedLevel,
          emergencyOverride: query.includes('blown') || query.includes('ambush'),
        }),
      });
      const data = await res.json();
      setVoiceResponse(data);
      if (data.voiceScript) {
        speakText(data.voiceScript);
      }
    } catch (err) {
      console.error('Voice bridge error:', err);
    } finally {
      setLoading(false);
    }
  };

  const panicPresets = [
    'Vice, the transport took a detour down Ocean Drive, the tunnel is blown!',
    'VCPD helicopter has visual on my vehicle along Biscayne causeway!',
    'Spike strips spotted at the drawbridge, I need an immediate bypass route!',
    'Escort convoy ambushed by rival cartel fanboats in the mangrove marsh!',
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-wider">
            <Headphones className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>The "Live Wire" WebRTC Bidirectional Audio Bridge</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            HANDS-FREE IN-EAR TACTICAL COMMS
          </h2>
          <p className="text-xs text-slate-400">
            Bidirectional streaming audio with sub-150ms latency. The AI acts as your "guy in the chair" rerouting escapes at 140 MPH.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-pink-950/60 border border-pink-500/40 text-pink-300 font-bold flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-pink-400" />
            <span>WEBRTC RELAY: {voiceResponse?.latencyMs || 142}ms</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>GEMINI 3.8 FLASH</span>
          </div>
        </div>
      </div>

      {/* Main Hands-Free Comms Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voice Input & Audio Waveform Cockpit */}
        <div className="lg:col-span-7 bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-pink-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                {isListening ? 'LIVE AUDIO CAPTURE STREAMING' : 'HEADSET COMMS STANDBY'}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-400">
              VEHICLE VELOCITY: {speedMph} MPH
            </span>
          </div>

          {/* Audio Visualizer Wave */}
          <div className="bg-[#030712] p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
            <div className="flex items-end space-x-1.5 h-16 w-full justify-center">
              {audioWave.map((h, i) => (
                <div
                  key={i}
                  className="w-2.5 bg-gradient-to-t from-pink-600 via-purple-500 to-cyan-400 rounded-full transition-all duration-100"
                  style={{ height: `${isListening || audioPlaying ? h : 15}%` }}
                />
              ))}
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
              <span className={audioPlaying ? 'text-pink-400 font-bold animate-pulse' : 'text-slate-500'}>
                {audioPlaying ? 'VIC (THE FIXER) TRANSMITTING AUDIO...' : 'BUFFER READY FOR VOICE PUSH'}
              </span>
            </div>
          </div>

          {/* Speed slider & Quick panic buttons */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Simulated Vehicle Speed: <strong className="text-pink-400">{speedMph} MPH</strong></span>
              <span className="text-[11px] text-slate-500">Affects pathing look-ahead vector</span>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              step="5"
              value={speedMph}
              onChange={(e) => setSpeedMph(Number(e.target.value))}
              className="w-full accent-pink-500 bg-slate-800 h-2 rounded cursor-pointer"
            />
          </div>

          {/* Voice query input form */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-slate-400 uppercase text-[10px] tracking-wider block">
              Spoken Voice Comms (Headset Transcript)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voiceQuery}
                onChange={(e) => setVoiceQuery(e.target.value)}
                placeholder="Shout emergency update..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={() => setIsListening(!isListening)}
                className={`px-3 py-2.5 rounded-lg border flex items-center space-x-1.5 transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Toggle Mic Stream"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="text-[11px]">{isListening ? 'Muting' : 'Mic Stream'}</span>
              </button>
            </div>
          </div>

          {/* Quick Panic Scenario Buttons */}
          <div className="space-y-1.5 font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Quick In-Pursuit Panic Prompts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {panicPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setVoiceQuery(p);
                    handleSendVoiceQuery(p);
                  }}
                  className="p-2 text-left rounded bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/80 text-[11px] text-slate-300 truncate transition-colors flex items-center space-x-1.5"
                >
                  <Play className="w-3 h-3 text-pink-400 shrink-0" />
                  <span className="truncate">{p}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSendVoiceQuery()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-pink-600/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-pink-300" />
                <span>RELAYING THROUGH WEBRTC AUDIO BRIDGE...</span>
              </>
            ) : (
              <>
                <Headphones className="w-4 h-4 text-pink-200" />
                <span>SPEAK TO VIC // TRIGGER INSTANT REROUTE</span>
              </>
            )}
          </button>
        </div>

        {/* In-Ear Spoken Feedback & Spatial Reroute Card */}
        <div className="lg:col-span-5 bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2 text-pink-400">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider">
                  In-Ear Tactical Audio Feed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => speakText(voiceResponse?.voiceScript || '')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                title="Replay Voice Feed"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay Voice</span>
              </button>
            </div>

            {/* Spoken Voice Script Card */}
            <div className="my-4 p-4 rounded-xl bg-slate-900 border border-pink-500/40 relative shadow-[0_0_15px_rgba(255,42,133,0.15)] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold uppercase">Vic (The Fixer) // In-Ear</span>
                <span className="text-emerald-400 font-semibold">{voiceResponse?.latencyMs}ms Relay</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed font-sans">
                "{voiceResponse?.voiceScript}"
              </p>
            </div>

            {/* Spatial HUD Reroute Breakdown */}
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>DYNAMIC HUD WAYPOINT OVERRIDE:</span>
              </div>
              <div className="text-white font-semibold">
                Sector: {voiceResponse?.tacticalReroute?.destinationSector}
              </div>
              <div className="text-slate-400 text-[11px]">
                Waypoint Coords: X: {voiceResponse?.tacticalReroute?.waypointCoords?.x} | Y: {voiceResponse?.tacticalReroute?.waypointCoords?.y}
              </div>
              <div className="p-2 bg-emerald-950/30 rounded border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                Action: {voiceResponse?.tacticalReroute?.recommendedAction}
              </div>
            </div>
          </div>

          {/* Contextual Audio Interruption Safeguard */}
          <div className="p-3 bg-purple-950/30 border border-purple-500/40 rounded-xl text-xs font-mono space-y-1">
            <div className="text-purple-300 font-bold flex items-center space-x-1.5 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
              <span>Contextual Audio Interruption Matrix:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              If an emergency server event occurs while you speak (e.g. 5-star SWAT road block or safehouse breach), the bridge cuts audio feed to urgently shout warnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
