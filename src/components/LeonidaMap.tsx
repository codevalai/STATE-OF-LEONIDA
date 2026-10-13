import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  Home, 
  DollarSign, 
  Wrench, 
  Sparkles, 
  Anchor, 
  Navigation,
  Compass,
  Crosshair,
  Layers,
  ArrowRight
} from 'lucide-react';
import { LEONIDA_POIS } from '../data/leonidaData';
import { MapPOI, ActiveTab } from '../types';

interface LeonidaMapProps {
  onSelectMissionPOI?: (poi: MapPOI) => void;
  onSendToTelemetry?: (coords: { x: number; y: number; z: number }, sector: string) => void;
}

export const LeonidaMap: React.FC<LeonidaMapProps> = ({ 
  onSelectMissionPOI,
  onSendToTelemetry 
}) => {
  const [selectedPOI, setSelectedPOI] = useState<MapPOI>(LEONIDA_POIS[0]);
  const [filter, setFilter] = useState<string>('all');
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({ x: 420, y: -180 });

  const filteredPOIs = LEONIDA_POIS.filter((poi) => {
    if (filter === 'all') return true;
    return poi.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safehouse': return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      case 'heist': return <DollarSign className="w-3.5 h-3.5 text-pink-400" />;
      case 'chopshop': return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case 'easteregg': return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'police': return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case 'dock': return <Anchor className="w-3.5 h-3.5 text-blue-400" />;
      default: return <MapPin className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Extreme': return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  // Maps coordinates to SVG 800x600 viewBox
  const mapCoordsToSvg = (x: number, y: number) => {
    // Normalization bounds: x from -2000 to +2000, y from -3200 to +2000
    const svgX = 400 + (x / 2200) * 350;
    const svgY = 320 - (y / 3200) * 270;
    return { cx: Math.min(Math.max(svgX, 30), 770), cy: Math.min(Math.max(svgY, 30), 570) };
  };

  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 800;
    const svgY = ((e.clientY - rect.top) / rect.height) * 600;

    // Convert back to game coordinates
    const gameX = Math.round(((svgX - 400) / 350) * 2200);
    const gameY = Math.round(((320 - svgY) / 270) * 3200);
    setCursorCoords({ x: gameX, y: gameY });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: '12s' }} />
            <span>State Cartography & Spatial Radar Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            LEONIDA TACTICAL GRID
          </h2>
          <p className="text-xs text-slate-400">
            Real-time coordinates, high-yield safehouses, heist choke points, and underwater Florida Keys wreckage.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {[
            { id: 'all', label: 'All POIs' },
            { id: 'heist', label: 'Heists', color: 'text-pink-400' },
            { id: 'safehouse', label: 'Safehouses', color: 'text-emerald-400' },
            { id: 'chopshop', label: 'Chop Shops', color: 'text-amber-400' },
            { id: 'police', label: 'VCPD Checkpoints', color: 'text-rose-400' },
            { id: 'easteregg', label: 'Easter Eggs', color: 'text-cyan-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filter === item.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className={item.color}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map + POI Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Radar Map */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden relative shadow-2xl flex flex-col">
          {/* Map HUD Overlay Header */}
          <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-cyan-400 font-bold">RADAR SWEEP ACTIVE</span>
              <span className="text-slate-600">//</span>
              <span className="text-slate-400">SCALE: 1:15000</span>
            </div>
            <div className="text-slate-400 flex items-center space-x-2">
              <Navigation className="w-3.5 h-3.5 text-pink-400" />
              <span>CURSOR HUD: X: {cursorCoords.x} | Y: {cursorCoords.y}</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative aspect-[4/3] w-full bg-[#030712] cyber-grid flex items-center justify-center p-2">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full cursor-crosshair select-none"
              onMouseMove={handleMapMouseMove}
            >
              <defs>
                {/* Neon radar glow filters */}
                <filter id="neon-pink" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neon-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#051329" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#020817" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Water background */}
              <rect width="800" height="600" fill="url(#oceanGrad)" />

              {/* Radar sweep line */}
              <circle cx="400" cy="300" r="280" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 4" />
              <circle cx="400" cy="300" r="180" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.2" />
              <circle cx="400" cy="300" r="80" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.2" />

              {/* Rotating radar line */}
              <g className="radar-sweep" style={{ transformOrigin: '400px 300px' }}>
                <line x1="400" y1="300" x2="680" y2="300" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.6" />
                <path d="M 400 300 L 680 300 A 280 280 0 0 0 660 210 Z" fill="#00f0ff" fillOpacity="0.05" />
              </g>

              {/* Landmass Outlines (Leonida Geography: North Ambrosia, West Grassrivers, East Vice City, South Keys) */}
              {/* Mainland Leonida */}
              <path
                d="M 120 120 C 220 80, 480 60, 620 110 C 700 140, 720 260, 680 340 C 640 420, 560 440, 490 410 C 440 390, 390 420, 310 440 C 220 460, 160 380, 140 310 C 110 220, 90 150, 120 120 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="2"
              />

              {/* Everglades Swamps (Grassrivers) */}
              <path
                d="M 160 220 C 240 240, 300 310, 260 390 C 220 430, 170 380, 160 320 Z"
                fill="#062520"
                stroke="#0d9488"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.7"
              />

              {/* Biscayne Bay Waterway & Starfish Island */}
              <path
                d="M 520 280 C 560 260, 600 270, 610 320 C 580 360, 530 350, 520 280 Z"
                fill="#071936"
                stroke="#0284c7"
                strokeWidth="1"
              />
              <circle cx="560" cy="305" r="16" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />

              {/* Vice Beach Barrier Islands */}
              <path
                d="M 640 160 C 670 200, 660 310, 630 370 C 615 360, 625 240, 620 180 Z"
                fill="#1e1b4b"
                stroke="#ec4899"
                strokeWidth="1.5"
              />

              {/* Florida Keys Arch (Southern Islands) */}
              <path
                d="M 460 460 C 430 490, 380 520, 310 540 C 250 555, 190 560, 140 550"
                fill="none"
                stroke="#334155"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="18 12"
              />
              <ellipse cx="440" cy="470" rx="14" ry="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <ellipse cx="370" cy="510" rx="18" ry="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <ellipse cx="290" cy="535" rx="22" ry="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <ellipse cx="190" cy="550" rx="25" ry="11" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />

              {/* Highway Causeways (Biscayne Drawbridge) */}
              <line x1="510" y1="280" x2="630" y2="280" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="490" y1="340" x2="615" y2="340" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />

              {/* Sector Labels */}
              <text x="640" y="145" fill="#f472b6" fontSize="11" fontFamily="Chakra Petch" fontWeight="bold">VICE BEACH</text>
              <text x="500" y="240" fill="#38bdf8" fontSize="11" fontFamily="Chakra Petch" fontWeight="bold">DOWNTOWN VICE</text>
              <text x="535" y="310" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">STARFISH ISL.</text>
              <text x="140" y="160" fill="#fb923c" fontSize="11" fontFamily="Chakra Petch" fontWeight="bold">PORT GELLHORN</text>
              <text x="320" y="120" fill="#fbbf24" fontSize="11" fontFamily="Chakra Petch" fontWeight="bold">AMBROSIA</text>
              <text x="180" y="330" fill="#34d399" fontSize="11" fontFamily="Chakra Petch" fontWeight="bold">GRASSRIVERS</text>
              <text x="210" y="580" fill="#38bdf8" fontSize="11" fontFamily="Chakra Petch" fontWeight="bold">FLORIDA KEYS</text>

              {/* POI Markers */}
              {filteredPOIs.map((poi) => {
                const { cx, cy } = mapCoordsToSvg(poi.coords.x, poi.coords.y);
                const isSelected = selectedPOI.id === poi.id;

                let markerColor = '#ec4899'; // pink
                if (poi.category === 'safehouse') markerColor = '#10b981'; // green
                if (poi.category === 'chopshop') markerColor = '#f59e0b'; // amber
                if (poi.category === 'easteregg') markerColor = '#06b6d4'; // cyan
                if (poi.category === 'police') markerColor = '#f43f5e'; // red
                if (poi.category === 'dock') markerColor = '#3b82f6'; // blue

                return (
                  <g
                    key={poi.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedPOI(poi)}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="18"
                        fill="none"
                        stroke={markerColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.8"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '9' : '6'}
                      fill={markerColor}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '2' : '1'}
                      filter={isSelected ? 'url(#neon-pink)' : undefined}
                    />
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={isSelected ? '10' : '8'}
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {poi.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map legend footer */}
          <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                <span>Heist Target</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Safehouse</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Chop Shop</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>VCPD Chokepoint</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>Easter Egg</span>
              </span>
            </div>
            <span className="text-slate-500">CLICK PIN TO INSPECT TACTICAL DATA</span>
          </div>
        </div>

        {/* POI Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                  {getCategoryIcon(selectedPOI.category)}
                </span>
                <span className="text-xs uppercase font-mono font-semibold text-slate-400 tracking-wider">
                  {selectedPOI.sector}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${getRiskBadge(selectedPOI.riskRating)}`}>
                {selectedPOI.riskRating} Risk
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-white">
              {selectedPOI.name}
            </h3>

            {/* Coordinates Badge */}
            <div className="mt-2 inline-flex items-center space-x-2 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-xs font-mono text-cyan-300">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>X: {selectedPOI.coords.x} | Y: {selectedPOI.coords.y} | Z: {selectedPOI.coords.z}</span>
            </div>

            {selectedPOI.estimatedValue && (
              <div className="mt-3 p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold">Estimated Value / Yield:</span>
                <span className="text-emerald-300 font-bold">{selectedPOI.estimatedValue}</span>
              </div>
            )}

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <h4 className="font-mono text-slate-400 uppercase tracking-wider text-[11px] mb-1">
                  Surveillance & Sector Briefing
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                  {selectedPOI.description}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-pink-400 uppercase tracking-wider text-[11px] mb-1">
                  Tactical Advantage & Escape Vectors
                </h4>
                <p className="text-slate-300 leading-relaxed bg-pink-950/20 p-2.5 rounded border border-pink-500/30">
                  {selectedPOI.tacticalNote}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 space-y-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => onSelectMissionPOI?.(selectedPOI)}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-pink-600/20"
              >
                <span>Draft Mission Strategy for this Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSendToTelemetry?.(selectedPOI.coords, selectedPOI.sector)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>Inject Coordinates to Telemetry Buffer</span>
              </button>
            </div>
          </div>

          {/* Quick Real Estate & Loot Arbitrage Summary */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300">LEONIDA SPATIAL ARBITRAGE</span>
              <span className="text-emerald-400">METRO ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Properties in Port Gellhorn currently offer 38% higher garage storage ROI than Ocean Beach, with 0% police camera saturation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
