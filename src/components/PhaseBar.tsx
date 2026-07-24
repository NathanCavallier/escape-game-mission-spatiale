import React from 'react';
import { MissionPhase } from '../types';
import { Check } from 'lucide-react';

interface PhaseBarProps {
  phases: MissionPhase[];
  currentPhaseId: number;
  onSelectPhase: (phaseId: number) => void;
}

export const PhaseBar: React.FC<PhaseBarProps> = ({ phases, currentPhaseId, onSelectPhase }) => {
  return (
    <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-3 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Timeline de Mission</span>
        <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono font-bold">
          Phase {currentPhaseId < 10 ? `0${currentPhaseId}` : currentPhaseId} / {phases.length} : {phases.find(p => p.id === currentPhaseId)?.label}
        </span>
      </div>
      <div className="flex items-center min-w-[760px] gap-1.5">
        {phases.map((p) => {
          const isDone = p.id < currentPhaseId;
          const isActive = p.id === currentPhaseId;

          return (
            <button
              key={p.id}
              onClick={() => onSelectPhase(p.id)}
              className={`flex-1 flex flex-col items-center py-2 px-2 rounded-lg transition relative border text-left ${
                isDone
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : isActive
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10'
              }`}
              title={`${p.label} : ${p.desc}`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[9px] font-mono uppercase font-bold opacity-75">
                  {p.id < 10 ? `0${p.id}` : p.id}
                </span>
                {isDone ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : isActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                ) : null}
              </div>
              <span className="text-sm mb-0.5">{p.icon}</span>
              <span
                className={`text-[10px] font-semibold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[75px] uppercase ${
                  isActive ? 'text-cyan-400 font-bold' : isDone ? 'text-green-400' : 'text-slate-400'
                }`}
              >
                {p.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
