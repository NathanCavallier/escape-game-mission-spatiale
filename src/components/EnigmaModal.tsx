import React, { useState } from 'react';
import { Enigma, Team } from '../types';
import { X, HelpCircle, CheckCircle2, AlertCircle, Lightbulb, Award } from 'lucide-react';
import { soundEngine } from '../lib/audio';
import confetti from 'canvas-confetti';

interface EnigmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  enigmas: Enigma[];
  teams: Team[];
  onSolveEnigma: (enigmaId: string, answer: string, selectedTeam: string) => Promise<{ success: boolean; message: string; hint?: string | null }>;
}

export const EnigmaModal: React.FC<EnigmaModalProps> = ({
  isOpen,
  onClose,
  enigmas,
  teams,
  onSolveEnigma
}) => {
  const [selectedEnigma, setSelectedEnigma] = useState<Enigma | null>(enigmas[0] || null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('alpha');
  const [showHint, setShowHint] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnigma || !userAnswer.trim()) return;

    const result = await onSolveEnigma(selectedEnigma.id, userAnswer, selectedTeam);

    if (result.success) {
      soundEngine.playSuccess();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setStatusMsg({ text: result.message });
      setUserAnswer('');
    } else {
      soundEngine.playAlarm();
      setStatusMsg({ text: result.message, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0c14] border border-white/10 rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl font-mono">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Centre de Résolution des Énigmes Techniques
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enigma Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {enigmas.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                setSelectedEnigma(e);
                setStatusMsg(null);
                setShowHint(false);
                setUserAnswer('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedEnigma?.id === e.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : e.solved
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{e.icon}</span>
              <span>{e.id}</span>
              {e.solved && <CheckCircle2 className="w-3 h-3 text-green-400" />}
            </button>
          ))}
        </div>

        {/* Selected Enigma Content */}
        {selectedEnigma && (
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{selectedEnigma.title}</span>
              <span className="text-[10px] bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded-lg border border-purple-500/30 font-bold">
                {selectedEnigma.difficulty}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">{selectedEnigma.description}</p>

            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-xs text-cyan-400 font-bold leading-relaxed">
              ❓ {selectedEnigma.question}
            </div>

            {/* Hint Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[10px] text-orange-400 flex items-center gap-1 hover:underline font-bold"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {showHint ? 'Masquer Indice' : 'Besoin d\'un indice ?'}
              </button>
              {showHint && (
                <div className="mt-1.5 text-xs text-orange-300 bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg">
                  💡 {selectedEnigma.hint}
                </div>
              )}
            </div>

            {/* Status Feedback Message */}
            {statusMsg && (
              <div
                className={`p-2.5 rounded-lg text-xs font-bold ${
                  statusMsg.error
                    ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                    : 'bg-green-500/15 border border-green-500/30 text-green-400'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1 font-bold">Équipe Soumissionnaire:</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white text-xs p-2 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#0a0c14] text-white">
                        {t.name} ({t.roleName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1 font-bold">Votre Réponse:</label>
                  <input
                    type="text"
                    placeholder="Saisir la réponse..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-cyan-400 text-xs p-2 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                SOUMETTRE LA RÉPONSE & DÉBLOQUER (+150 PTS)
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
