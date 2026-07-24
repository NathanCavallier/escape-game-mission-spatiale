import React, { useState } from 'react';
import { SafetyCheckItem, SafetyIncidentLog } from '../types';
import { ShieldCheck, CheckSquare, Square, AlertOctagon, FileText, Download, CheckCircle2, UserCheck } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface SafetyProps {
  checklist: SafetyCheckItem[];
  incidentLogs: SafetyIncidentLog[];
  onToggleCheckItem: (id: string) => void;
}

export const SafetyDashboard: React.FC<SafetyProps> = ({
  checklist,
  incidentLogs,
  onToggleCheckItem
}) => {
  const [signedBy, setSignedBy] = useState('Prof. Responsible Safety Officer');
  const [isSigned, setIsSigned] = useState(false);

  const handleSign = () => {
    setIsSigned(true);
    soundEngine.playSuccess();
  };

  const generateReportPDF = () => {
    soundEngine.playSuccess();
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport de Sécurité Asteria-3</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 10px; }
          .badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 4px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f1f5f9; }
          .signed { background: #f0fdf4; border: 1px solid #22c55e; padding: 15px; border-radius: 6px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>Rapport de Sécurité & Conformité — Atelier Escape Game Mission Spatiale</h1>
        <p><strong>Session:</strong> LUNA-315 | <strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')} | <span class="badge">RISQUE: BAS</span></p>

        <h2>1. Checklist Pré-séance</h2>
        <table>
          <tr><th>Exigence de Sécurité</th><th>Catégorie</th><th>Conformité</th></tr>
          ${checklist
            .map(
              (item) => `
            <tr>
              <td>${item.label}</td>
              <td>${item.category}</td>
              <td>${item.checked ? 'CONFORME (OK)' : 'NON CONFORME'}</td>
            </tr>
          `
            )
            .join('')}
        </table>

        <h2>2. Registre des Incidents Matériels</h2>
        <table>
          <tr><th>ID</th><th>Composant</th><th>Sévérité</th><th>Horodatage</th><th>Action Corrective</th></tr>
          ${incidentLogs
            .map(
              (log) => `
            <tr>
              <td>${log.id}</td>
              <td>${log.component}</td>
              <td>${log.severity}</td>
              <td>${log.timestamp}</td>
              <td>${log.correctiveAction}</td>
            </tr>
          `
            )
            .join('')}
        </table>

        <div class="signed">
          <h3>Validation & Signature Électronique</h3>
          <p>Responsable de Séance: <strong>${signedBy}</strong></p>
          <p>Statut: <strong>VALIDÉ ET CONFORME POUR DÉPLOIEMENT</strong></p>
        </div>

        <script>window.print();</script>
      </body>
      </html>
    `);
    reportWindow.document.close();
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Banner Header */}
      <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-2 py-0.5 rounded font-bold">
            [SAFE]
          </span>
          <span className="text-xs font-bold text-white">STATUT SÉCURITÉ & LOGISTIQUE</span>
          <span className="text-xs text-slate-400">| Conformité Électrique & Matériel</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-lg font-bold">
            NIVEAU RISQUE: BAS
          </span>
          <button
            onClick={() => soundEngine.playAlarm()}
            className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 transition"
          >
            🛑 [ARRÊT D'URGENCE]
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Checklist Pré-séance */}
        <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
          <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2.5">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            Checklist Pré-séance (Sécurité)
          </h3>

          <div className="space-y-2 text-xs">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleCheckItem(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition ${
                  item.checked
                    ? 'bg-green-500/10 border-green-500/30 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-green-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-lg border border-white/10 text-cyan-400 font-mono">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Registre Incidents & Reports */}
        <div className="space-y-4">
          {/* Incident Registry */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2.5">
              <AlertOctagon className="w-4 h-4 text-orange-400" />
              Registre Incidents & Interventions Matériel
            </h3>

            <div className="space-y-2 text-xs">
              {incidentLogs.map((log) => (
                <div key={log.id} className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {log.id} | {log.component}
                    </span>
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold">
                      {log.severity} ({log.timestamp})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{log.description}</div>
                  <div className="text-[10px] text-green-400 font-bold">Action: {log.correctiveAction}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature & Export Report */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-2.5">
              Signature Responsable & Rapport
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={signedBy}
                onChange={(e) => setSignedBy(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                onClick={handleSign}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
                  isSigned
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                {isSigned ? 'SIGNÉ' : 'SIGNER'}
              </button>
            </div>

            <button
              onClick={generateReportPDF}
              className="w-full py-2.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/40 text-green-400 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              [ GENERER RAPPORT DE SÉCURITÉ PDF / IMPRIMER ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
