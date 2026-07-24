export type Role = 'control' | 'simulation' | 'engineering' | 'rover' | 'instructor' | 'safety';

export interface MissionPhase {
  id: number;
  icon: string;
  label: string;
  desc: string;
  durationMin: number;
}

export interface Team {
  id: 'alpha' | 'beta' | 'gamma' | 'delta';
  name: string;
  code: string;
  icon: string;
  color: string;
  roleName: string;
  score: number;
  progressPct: number;
  status: 'OK' | 'WARN' | 'CRIT';
  tasks: Array<{ id: string; label: string; done: boolean; active?: boolean }>;
}

export interface SystemHealth {
  id: string;
  name: string;
  icon: string;
  category: 'Propulsion' | 'Avionique' | 'Power' | 'LifeSupport' | 'Thermal' | 'Structure' | 'Comms';
  healthPct: number;
  status: 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
  temp: number; // K
  powerUsageWatts: number;
  description: string;
}

export interface Incident {
  id: string;
  title: string;
  icon: string;
  description: string;
  task: string;
  targetTeam: 'alpha' | 'beta' | 'gamma' | 'delta' | 'all';
  systemId: string;
  severity: 'warn' | 'crit';
  resolved: boolean;
  timestamp: string;
}

export interface RadioMessage {
  id: string;
  timestamp: string;
  type: 'comm-rx' | 'comm-tx' | 'comm-warn' | 'comm-crit';
  icon: string;
  sender: string;
  text: string;
}

export interface Enigma {
  id: string;
  title: string;
  phaseId: number;
  difficulty: 'Collège' | 'Lycée';
  icon: string;
  description: string;
  question: string;
  hint: string;
  correctAnswer: string;
  unlocked: boolean;
  solved: boolean;
  solvedByTeam?: string;
}

export interface RoverPosition {
  x: number; // 0..100
  y: number; // 0..100
  heading: number; // degrees
  speedMs: number;
  roll: number;
  pitch: number;
  batteryPct: number;
  signalQualityPct: number;
  samples: Array<{ id: string; type: string; quality: string; location: string; analyzed: boolean }>;
}

export interface SafetyCheckItem {
  id: string;
  label: string;
  category: 'Electrique' | 'Mecanique' | 'Zone' | 'Secours';
  checked: boolean;
}

export interface SafetyIncidentLog {
  id: string;
  timestamp: string;
  component: string;
  severity: 'Mineur' | 'Modéré' | 'Critique';
  description: string;
  correctiveAction: string;
}
