import React, { useState } from 'react';
import { Team, SystemHealth, Incident, RadioMessage } from '../types';
import { OrbitCanvas } from './OrbitCanvas';
import { Radio, AlertTriangle, Send, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface MissionControlProps {
  teams: Team[];
  systems: SystemHealth[];
  incidents: Incident[];
  radioComms: RadioMessage[];
  altitudeKm: number;
  velocityMs: number;
  fuelPct: number;
  cabinPressureBar: number;
  engineTempK: number;
  status: 'NOMINAL' | 'WARN' | 'CRIT';
  onSendMessage: (sender: string, text: string) => void;
  onResolveIncident: (incidentId: string) => void;
  onTriggerIncident: () => void;
  onOpenEnigmaModal: () => void;
}

export const MissionControlDashboard: React.FC<MissionControlProps> = ({
  teams,
  systems,
  incidents,
  radioComms,
  altitudeKm,
  velocityMs,
  fuelPct,
  cabinPressureBar,
  engineTempK,
  status,
  onSendMessage,
  onResolveIncident,
  onTriggerIncident,
  onOpenEnigmaModal
}) => {
  const [inputMsg, setInputMsg] = useState('');
  const [senderRole, setSenderRole] = useState('MISSION CTRL');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    onSendMessage(senderRole, inputMsg);
    soundEngine.playRadioBeep();
    setInputMsg('');
  };

  const activeIncidents = incidents.filter((i) => !i.resolved);

  return (
    <div className="space-y-3">
      {/* Top Banner Alert if active incidents exist */}
      {activeIncidents.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3.5 text-orange-400 flex flex-wrap items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-orange-400" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider">Alerte Critique / Incident En Cours :</span>{' '}
              <span className="text-xs text-white font-mono">{activeIncidents[0].title}</span>
              <p className="text-xs text-slate-400 mt-0.5">{activeIncidents[0].task}</p>
            </div>
          </div>
          <button
            onClick={() => onResolveIncident(activeIncidents[0].id)}
            className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/40 hover:bg-orange-500/30 text-white text-xs font-semibold rounded-lg transition"
          >
            ✓ Resolution Effectuée
          </button>
        </div>
      )}

      {/* Main Grid Layout matching Sleek Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Trajectory Orbit Canvas */}
        <div className="lg:col-span-1 bg-[#0a0c14] border border-white/10 rounded-lg p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                Simulation Orbitale
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-cyan-400">
              Asteria-3
            </span>
          </div>

          <div className="h-[230px]">
            <OrbitCanvas
              altitudeKm={altitudeKm}
              velocityMs={velocityMs}
              fuelPct={fuelPct}
              status={status}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
            <div className="bg-white/5 border border-white/10 p-2 rounded-lg">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Altitude</div>
              <div className="text-sm font-bold text-cyan-400">{altitudeKm.toFixed(1)} km</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-2 rounded-lg">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Vitesse</div>
              <div className="text-sm font-bold text-orange-400">{velocityMs.toFixed(0)} m/s</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-2 rounded-lg">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Carburant</div>
              <div className="text-sm font-bold text-green-400">{fuelPct.toFixed(0)} %</div>
            </div>
          </div>
        </div>

        {/* Center Column: Team Pulse & System Cards */}
        <div className="lg:col-span-1 space-y-4">
          {/* Team Pulse Card */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h2 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                Statut des Équipes (Team Pulse)
              </h2>
              <button
                onClick={onOpenEnigmaModal}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded hover:bg-purple-500/25 transition"
              >
                + Résoudre Énigme
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {teams.map((t) => {
                const hasWarning = incidents.some((i) => !i.resolved && (i.targetTeam === t.id || i.targetTeam === 'all'));

                return (
                  <div
                    key={t.id}
                    className="bg-white/5 border-l-2 border border-white/10 p-2.5 rounded-lg space-y-1.5"
                    style={{ borderLeftColor: t.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{t.icon}</span>
                        <span className="text-xs font-bold text-white">{t.name}</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          hasWarning ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/10 text-green-400'
                        }`}
                      >
                        {hasWarning ? '[!!]' : '[OK]'}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 truncate font-mono">
                      {t.roleName}
                    </div>

                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${t.progressPct}%`, backgroundColor: t.color }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>Progression</span>
                      <span className="text-white font-semibold">{t.score} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Onboard Subsystems Monitor */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-green-400" />
                <h2 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                  Systèmes Embarqués Asteria-3
                </h2>
              </div>
              <span className="text-[10px] font-mono text-green-400 font-bold">
                {systems.filter((s) => s.healthPct >= 80).length} / {systems.length} NOMINAL
              </span>
            </div>

            <div className="space-y-2">
              {systems.slice(0, 4).map((sys) => {
                const statusColor =
                  sys.healthPct >= 80 ? '#4ade80' : sys.healthPct >= 50 ? '#fb923c' : '#f87171';

                return (
                  <div
                    key={sys.id}
                    className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{sys.icon}</span>
                      <span className="text-slate-200 font-semibold text-[11px]">{sys.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <div className="w-16 bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${sys.healthPct}%`, backgroundColor: statusColor }}
                        />
                      </div>
                      <span style={{ color: statusColor }} className="w-8 text-right font-bold">
                        {sys.healthPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Radio Communications Log */}
        <div className="lg:col-span-1 bg-[#0a0c14] border border-white/10 rounded-lg p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h2 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                Journal des Comms Radio
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">{radioComms.length} msgs</span>
          </div>

          {/* Radio Stream */}
          <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {radioComms.map((msg) => {
              const isTx = msg.type === 'comm-tx';
              const isWarn = msg.type === 'comm-warn';
              const isCrit = msg.type === 'comm-crit';

              return (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
                    isCrit
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : isWarn
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                      : isTx
                      ? 'bg-cyan-500/5 border-cyan-500/20 text-slate-200'
                      : 'bg-green-500/5 border-green-500/20 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] mb-1 opacity-80">
                    <span className="font-bold tracking-wider uppercase flex items-center gap-1">
                      <span>{msg.icon}</span>
                      <span>{msg.sender}</span>
                    </span>
                    <span className="text-slate-500">{msg.timestamp}</span>
                  </div>
                  <div>{msg.text}</div>
                </div>
              );
            })}
          </div>

          {/* Transmit Form */}
          <form onSubmit={handleSend} className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={senderRole}
                onChange={(e) => setSenderRole(e.target.value)}
                className="bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-mono rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400"
              >
                <option value="MISSION CTRL" className="bg-[#0a0c14] text-white">MISSION CTRL</option>
                <option value="ÉQUIPE ALPHA" className="bg-[#0a0c14] text-white">ÉQUIPE ALPHA</option>
                <option value="ÉQUIPE BETA" className="bg-[#0a0c14] text-white">ÉQUIPE BETA</option>
                <option value="ÉQUIPE GAMMA" className="bg-[#0a0c14] text-white">ÉQUIPE GAMMA</option>
                <option value="ÉQUIPE DELTA" className="bg-[#0a0c14] text-white">ÉQUIPE DELTA</option>
              </select>

              <input
                type="text"
                placeholder="Émettre message radio..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 p-1.5 rounded-lg transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
