import React, { useState } from 'react';
import { Team, Enigma } from '../types';
import { GraduationCap, Pause, Play, AlertTriangle, Send, Download, CheckSquare, PlusCircle } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface InstructorProps {
  teams: Team[];
  enigmas: Enigma[];
  onToggleEnigmaUnlock: (id: string) => void;
  onTriggerIncident: () => void;
  onSendHintToRadio: (hintText: string) => void;
}

export const InstructorDashboard: React.FC<InstructorProps> = ({
  teams,
  enigmas,
  onToggleEnigmaUnlock,
  onTriggerIncident,
  onSendHintToRadio
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [customHint, setCustomHint] = useState('');
  const [activityLogs, setActivityLogs] = useState([
    '14:02 - Alpha : Calcul trajectoire validé (+150 pts)',
    '14:05 - Beta : Diagnostic panne moteur injectée',
    '14:08 - Delta : Erreur capteur IMU résolue',
    '14:15 - Gamma : Simulation de descente stabilisée à 98%'
  ]);

  const handlePause = () => {
    setIsPaused(!isPaused);
    soundEngine.playRadioBeep();
  };

  const handleSendHint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHint.trim()) return;
    onSendHintToRadio(`[INDICE ANIMATEUR] : ${customHint}`);
    setActivityLogs((prev) => [`${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - Animateur : Indice envoyé`, ...prev]);
    soundEngine.playRadioBeep();
    setCustomHint('');
  };

  const exportGradesCSV = () => {
    const csvRows = [
      ['Équipe', 'Rôle', 'Score Points', 'Progression %', 'Statut'].join(','),
      ...teams.map((t) => [t.name, t.roleName, t.score, t.progressPct, t.status].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Asteria3_Evaluation_Session_${Date.now()}.csv`;
    a.click();
    soundEngine.playSuccess();
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Header Banner */}
      <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs px-2 py-0.5 rounded font-bold">
            [ADMIN]
          </span>
          <span className="text-xs font-bold text-white">SUIVI CLASSE & ANIMATEUR</span>
          <span className="text-xs text-slate-400">| Session: 315 · Groupes: 4</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePause}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              isPaused
                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}
          >
            {isPaused ? '▶ REPRENDRE' : '⏸ PAUSE MISSION'}
          </button>

          <button
            onClick={exportGradesCSV}
            className="px-3 py-1.5 bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Grille Évaluation CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Team Progress & Activity Logs */}
        <div className="space-y-4">
          {/* Progression par équipe */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2.5">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Progression par Équipe
            </h3>

            <div className="space-y-2 text-xs">
              {teams.map((t) => (
                <div key={t.id} className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </span>
                    <span className="text-cyan-400 font-bold">{t.score} pts</span>
                  </div>

                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${t.progressPct}%`, backgroundColor: t.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{t.roleName}</span>
                    <span>{t.progressPct}% complété</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs Feed */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-2.5">
              Logs d'Activité en Direct
            </h3>

            <div className="bg-black/40 border border-white/10 rounded-lg p-3 max-h-[140px] overflow-y-auto space-y-1.5 text-xs text-slate-400 font-mono">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="border-b border-white/5 pb-1 last:border-none">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enigma Management & Session Controls */}
        <div className="space-y-4">
          {/* Enigma Manager */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-2.5">
              Gestion des Énigmes & Verrous Pédagogiques
            </h3>

            <div className="space-y-2 text-xs">
              {enigmas.map((e) => (
                <div
                  key={e.id}
                  className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{e.icon}</span>
                      <span>{e.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {e.difficulty} · Réponse: <span className="text-green-400 font-bold">{e.correctAnswer}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleEnigmaUnlock(e.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${
                      e.unlocked
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    {e.unlocked ? '[DÉBLOQUÉ]' : '[VERROUILLÉ]'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Controls & Hint Sender */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-2.5">
              Contrôles de Session & Envoi d'Indices
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onTriggerIncident}
                className="py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                [ INJECTER PANNE ]
              </button>

              <button
                onClick={() => {
                  onSendHintToRadio('[ALERTE SÉCURITÉ] : Réalignement des antennes conseillé.');
                  soundEngine.playRadioBeep();
                }}
                className="py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-400 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                [ RAPPEL RADIO ]
              </button>
            </div>

            <form onSubmit={handleSendHint} className="flex gap-2">
              <input
                type="text"
                placeholder="Rédiger un indice pour le journal radio..."
                value={customHint}
                onChange={(e) => setCustomHint(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-500/30 transition"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
