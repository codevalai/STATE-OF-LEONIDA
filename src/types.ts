export type ActiveTab = 
  | 'missions' 
  | 'map' 
  | 'builds' 
  | 'voice'
  | 'crew'
  | 'arbitrage'
  | 'omni'
  | 'session' 
  | 'challenges' 
  | 'news' 
  | 'telemetry' 
  | 'comms';

export interface MissionTemplate {
  id: string;
  name: string;
  sector: string;
  difficulty: 'Chill' | 'Normal' | 'Hardcore' | 'Nightmare';
  defaultApproach: string;
  synopsis: string;
  recommendedVehicle: string;
  recommendedWeapon: string;
  estimatedPayout: string;
  dangerLevel: number; // 1-5
}

export interface MapPOI {
  id: string;
  name: string;
  category: 'safehouse' | 'heist' | 'chopshop' | 'easteregg' | 'police' | 'dock';
  coords: { x: number; y: number; z: number };
  sector: string;
  description: string;
  tacticalNote: string;
  estimatedValue?: string;
  riskRating: 'Low' | 'Medium' | 'High' | 'Extreme';
}

export interface PlaystylePreset {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
  description: string;
  weaponFocus: string;
  vehicleFocus: string;
  moneyRoute: string;
  skills: {
    stealth: number;
    driving: number;
    shooting: number;
    stamina: number;
    hacking: number;
  };
}

export interface SessionPlanItem {
  id: string;
  title: string;
  timeWindow: string;
  location: string;
  action: string;
  payout: string;
  completed: boolean;
}

export interface SavedChallenge {
  id: string;
  title: string;
  difficulty: string;
  objective: string;
  rules: string[];
  duration: string;
  rewardTitle: string;
  completed: boolean;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  rawPayload: {
    playerId: string;
    platform: string;
    actionType: string;
    coords: { x: number; y: number; z: number };
    velocity: { vx: number; vy: number; vz: number };
    wantedLevel: number;
    sectorName: string;
    eventDetails?: any;
  };
  validationStatus: 'PASSED' | 'REJECTED';
  validationErrors?: any;
  securityChecks: {
    originVerified: boolean;
    crossDomainSecure: boolean;
    tamperDetected: boolean;
  };
  aggregatedMetrics: {
    eventCount: number;
    compressionRatio: string;
    velocityVector: { vx: number; vy: number; vz: number };
    predictedCoords: { x: number; y: number; z: number };
  };
  aiOrchestrationAction?: {
    actionType: string;
    unitDispatched: string;
    interceptCoords: { x: number; y: number; z: number };
    tacticalOrder: string;
    marketImpact: string;
  };
}

export interface CommsMessage {
  id: string;
  sender: 'player' | 'ai';
  persona: string;
  text: string;
  timestamp: string;
  source?: string;
}

// ==========================================
// REAL-TIME HANDS-FREE & MULTI-AGENT TYPES
// ==========================================

export interface CrewMember {
  id: string;
  name: string;
  callsign: string;
  role: 'Mastermind' | 'Ghost Infiltrator' | 'Apex Wheelman' | 'Cyber Hacker (Nyx)' | 'Heavy Gunner' | 'Demolitions' | 'Recon Spotter' | 'Marine Scuba';
  coords: { x: number; y: number; z: number };
  velocity: { vx: number; vy: number; vz: number };
  health: number; // 0-100
  armor: number; // 0-100
  status: 'OPTIMAL' | 'COMPROMISED' | 'DOWN' | 'EXTRACTING' | 'PURSUIT';
  wantedLevel: number;
  currentObjective: string;
  activeMicroPrompt: string;
  equippedWeapon: string;
  currentVehicle?: string;
}

export interface SyndicateSessionState {
  syndicateId: string;
  syndicateName: string;
  targetOperation: string;
  globalAlertLevel: number;
  overallHealth: number;
  battlefieldDirective: string;
  lastRecalculationReason: string;
  members: CrewMember[];
}

export interface ArbitrageCommodity {
  id: string;
  name: string;
  category: 'LUXURY_GOODS' | 'HARDWARE' | 'NARCOTICS' | 'CONTRABAND' | 'REAL_ESTATE';
  currentPrice: number;
  change24h: number;
  movingAverage7d: number;
  forecastTrend: 'BULLISH_SURGE' | 'BEARISH_DUMP' | 'STABLE_ACCUMULATION';
  predictedSurgeTime: string;
  catalystEvent: string;
  ownedUnits: number;
  buyThreshold: number;
  sellTarget: number;
  autoTradeActive: boolean;
}

export interface ArbitrageLedgerRecord {
  id: string;
  timestamp: string;
  commodityName: string;
  action: 'AUTONOMOUS_BUY' | 'AUTONOMOUS_SELL';
  units: number;
  unitPrice: number;
  totalCost: number;
  netProfit: number;
  triggerEvent: string;
  zodChecksum: string;
}

export interface OmniAgentDrone {
  id: string;
  name: string;
  sourceRepo: string;
  engine: 'CNN_OPENCV_VISION' | 'REINFORCEMENT_LEARNING' | 'SEMANTIC_KERNEL_LLM' | 'HDMI_HARDWARE_CAPTURE';
  status: 'ACTIVE_DRONE' | 'INGESTING_FRAMES' | 'TELEMETRY_PIPELINE' | 'STANDBY';
  telemetryFPS: number;
  lossOrRewardScore: string;
  samplesHarvested: number;
  currentMissionTask: string;
  assignedSector: string;
}
