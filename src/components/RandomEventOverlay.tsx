import React from 'react';
import { RandomEvent } from '../types';
import { Zap, ShieldAlert, Sparkles, Wind, Radio, CheckCircle, Clock } from 'lucide-react';

interface RandomEventOverlayProps {
  activeEvents: RandomEvent[];
  onResolveEvent: (eventId: string) => void;
}

export const RandomEventOverlay: React.FC<RandomEventOverlayProps> = ({
  activeEvents,
  onResolveEvent
}) => {
  const unresolvedEvents = activeEvents.filter((e) => !e.resolved);

  if (unresolvedEvents.length === 0) {
    return null;
  }

  const hasDustStorm = unresolvedEvents.some((e) => e.effectCode === 'dust_storm');
  const hasPowerFlicker = unresolvedEvents.some((e) => e.effectCode === 'power_flicker');
  const hasSolarFlare = unresolvedEvents.some((e) => e.effectCode === 'solar_flare');

  return (
    <>
      {/* Visual Environment FX Overlays */}
      {hasDustStorm && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-orange-950/10 backdrop-blur-[1px] mix-blend-overlay animate-pulse">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f5a822_1px,transparent_1px)] [background-size:16px_16px] animate-[ping_3s_infinite]" />
        </div>
      )}

      {hasPowerFlicker && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/20 animate-[pulse_0.4s_infinite]" />
      )}

      {hasSolarFlare && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-purple-950/10 border-4 border-purple-500/30 animate-pulse" />
      )}

      {/* Top Banner Alert Bar for Active Events */}
      <div className="space-y-2 font-mono my-2 transition-all duration-300">
        {unresolvedEvents.map((evt) => {
          const isDiscovery = evt.category === 'discovery';
          const isCritical = evt.severity === 'critical';
          const isModerate = evt.severity === 'moderate';

          let borderClass = 'border-cyan-500/40 bg-cyan-950/40';
          let textClass = 'text-cyan-300';
          let badgeClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

          if (isDiscovery) {
            borderClass = 'border-purple-500/50 bg-purple-950/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
            textClass = 'text-purple-300';
            badgeClass = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
          } else if (isCritical) {
            borderClass = 'border-red-500/60 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse';
            textClass = 'text-red-300';
            badgeClass = 'bg-red-500/20 text-red-400 border-red-500/40';
          } else if (isModerate) {
            borderClass = 'border-orange-500/50 bg-orange-950/40';
            textClass = 'text-orange-300';
            badgeClass = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
          }

          return (
            <div
              key={evt.id}
              className={`border rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-all ${borderClass}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl pt-0.5">{evt.icon}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold uppercase tracking-wide ${textClass}`}>
                      {evt.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${badgeClass}`}>
                      {evt.category}
                    </span>
                    <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded border border-white/10 font-mono">
                      Équipes: {Array.isArray(evt.targetTeams) ? evt.targetTeams.join(', ').toUpperCase() : 'TOUTES'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-slate-400 font-normal">Impact Systèmes:</span>
                    <span className={textClass}>{evt.impact}</span>
                  </div>
                </div>
              </div>

              {/* Action and Timer Section */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
                {evt.durationSeconds > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-black/40 px-2.5 py-1 rounded border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="font-mono font-bold text-cyan-300">{evt.remainingSeconds}s</span>
                  </div>
                )}

                <button
                  onClick={() => onResolveEvent(evt.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 whitespace-nowrap ${
                    isDiscovery
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-200'
                      : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/40 text-green-300'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{evt.mitigationAction ? 'Atténuer / Résoudre' : 'Valider'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
