import React, { useState, useEffect } from 'react';
import { Role } from '../types';
import { soundEngine } from '../lib/audio';
import {
  Radio,
  Compass,
  Wrench,
  Navigation,
  GraduationCap,
  ShieldCheck,
  Volume2,
  VolumeX,
  AlertTriangle,
  RotateCcw,
  FastForward,
  Bot
} from 'lucide-react';

interface HeaderProps {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  status: 'NOMINAL' | 'WARN' | 'CRIT';
  currentPhase: number;
  totalPhases: number;
  onNextPhase: () => void;
  onTriggerIncident: () => void;
  onResetAll: () => void;
  onOpenAIAssistant: () => void;
  countdownSeconds: number;
  isCountdownRunning: boolean;
  onToggleCountdown: () => void;
  onResetCountdown: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  setActiveRole,
  status,
  currentPhase,
  totalPhases,
  onNextPhase,
  onTriggerIncident,
  onResetAll,
  onOpenAIAssistant,
  countdownSeconds,
  isCountdownRunning,
  onToggleCountdown,
  onResetCountdown
}) => {
  const [missionSeconds, setMissionSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setMissionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatCountdown = (totalSec: number) => {
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    soundEngine.setEnabled(newVal);
    if (newVal) soundEngine.playRadioBeep();
  };

  const roleNavItems: { id: Role; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'control', label: 'Mission Control', icon: <Radio className="w-4 h-4" /> },
    { id: 'simulation', label: 'Simulation & GNC', icon: <Compass className="w-4 h-4" /> },
    { id: 'engineering', label: 'Ingénierie & Module', icon: <Wrench className="w-4 h-4" /> },
    { id: 'rover', label: 'Navigation Rover', icon: <Navigation className="w-4 h-4" /> },
    { id: 'instructor', label: 'Instructor Hub', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'safety', label: 'Sécurité & Logistique', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  return (
    <header className="border-b border-white/10 pb-3 mb-3 bg-[#0a0c14] backdrop-blur-md sticky top-0 z-30 pt-3 px-4 rounded-b-xl shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        {/* Left branding - Mission Identifier */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Identifier</span>
            <span className="text-lg sm:text-xl font-bold tracking-tighter text-white">
              ASTÉRIA-3 <span className="text-cyan-400">/ LUNA-315</span>
            </span>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div className="hidden lg:flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cadre Pédagogique</span>
            <span className="text-xs font-semibold text-slate-300">Collège & Lycée · Escape Game Spacial</span>
          </div>
        </div>

        {/* Center Clock & Status */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Statut Mission</span>
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 uppercase px-2.5 py-1 rounded border mt-0.5 ${
                status === 'NOMINAL'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : status === 'WARN'
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status === 'NOMINAL'
                    ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]'
                    : status === 'WARN'
                    ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] animate-pulse'
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-ping'
                }`}
              />
              {status === 'NOMINAL' ? 'Nominal' : status === 'WARN' ? 'Urgence / Warn' : 'Alerte Critique'}
            </span>
          </div>

          <div className="flex flex-col items-center px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">T-Minus Impact</span>
            <span className="text-xl sm:text-2xl font-bold tracking-widest text-white font-mono leading-none mt-0.5">
              {formatCountdown(countdownSeconds)}
            </span>
          </div>

          <div className="hidden md:flex flex-col items-center px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">T+ Mission</span>
            <span className="text-sm font-semibold font-mono text-cyan-400 mt-0.5">
              {formatTime(missionSeconds)}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition"
            title="Assistant ASTRA-AI"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
            <span className="hidden sm:inline">ASTRA-AI</span>
          </button>

          <button
            onClick={onNextPhase}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition"
            title="Sauter à la phase suivante"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Phase {currentPhase + 1}/{totalPhases}</span>
          </button>

          <button
            onClick={onTriggerIncident}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition"
            title="Injecter un incident simulé"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Incident</span>
          </button>

          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border text-xs transition ${
              soundEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
            title={soundEnabled ? 'Son activé' : 'Mute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetAll}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Réinitialiser la simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-white/5">
        {roleNavItems.map((item) => {
          const isActive = activeRole === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveRole(item.id);
                soundEngine.playRadioBeep();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition border ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
