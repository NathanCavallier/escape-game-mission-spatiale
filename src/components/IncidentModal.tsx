import React from 'react';
import { Incident } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface IncidentModalProps {
  incident: Incident | null;
  onClose: () => void;
  onResolve: (incidentId: string) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ incident, onClose, onResolve }) => {
  if (!incident) return null;

  const handleResolveAction = () => {
    soundEngine.playSuccess();
    onResolve(incident.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0c14] border-2 border-orange-500/50 rounded-lg max-w-md w-full p-6 text-center space-y-4 shadow-2xl font-mono">
        <div className="flex justify-center text-5xl animate-pulse">
          {incident.icon || '⚠️'}
        </div>

        <div>
          <h2 className="text-xl font-bold text-orange-400 tracking-wide uppercase">
            {incident.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-bold">INCIDENT SÉVÉRITÉ CRITIQUE</p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-white/10 font-sans">
          {incident.description}
        </p>

        <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg text-left text-xs text-slate-200 space-y-1">
          <div className="font-bold text-orange-400 uppercase tracking-wider">📋 Consigne d'Intervention :</div>
          <div className="font-mono text-slate-300">{incident.task}</div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={handleResolveAction}
            className="w-full py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-orange-400" />
            <span>✓ ÉQUIPE EN INTERVENTION → RÉSOLUTION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
