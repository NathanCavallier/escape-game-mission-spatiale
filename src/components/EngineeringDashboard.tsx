import React, { useState } from 'react';
import { Wrench, Zap, Flame, ShieldAlert, Cpu, CheckCircle2, Box, PackagePlus } from 'lucide-react';
import { soundEngine } from '../lib/audio';

export const EngineeringDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>('propulsion');
  const [inventory, setInventory] = useState({
    fusibles: 4,
    capteurs: 1,
    cables: 12,
    plaGrams: 200
  });

  const [repairQueue, setRepairQueue] = useState([
    { id: 'rq1', title: 'Panne Moteur #2 (Fusible & Tuyère)', status: 'In Progress', required: '1x Fusible 10A, 2x Câbles Jumper' },
    { id: 'rq2', title: 'Fuite Thermique Radiateur B', status: 'Pending', required: '50g PLA (3D)' }
  ]);

  const components = [
    { id: 'power', name: '01. Alimentation & Batteries', health: 82, status: 'OK', color: '#22f59a' },
    { id: 'propulsion', name: '02. Propulsion & Moteurs', health: 40, status: 'WARN', color: '#f5a822' },
    { id: 'avionics', name: '03. Avionique & IMU', health: 100, status: 'OK', color: '#22d4f5' },
    { id: 'life', name: '04. Support de Vie (ECLSS)', health: 91, status: 'OK', color: '#22f59a' },
    { id: 'thermal', name: '05. Régulation Thermique', health: 88, status: 'OK', color: '#a855f7' },
    { id: 'structure', name: '06. Pieds & Ancrage Titan', health: 100, status: 'OK', color: '#22f59a' }
  ];

  const handleRepair = (id: string) => {
    soundEngine.playSuccess();
    setRepairQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderParts = () => {
    soundEngine.playRadioBeep();
    setInventory((prev) => ({
      ...prev,
      fusibles: prev.fusibles + 2,
      plaGrams: prev.plaGrams + 100
    }));
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Banner Header */}
      <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs px-2 py-0.5 rounded font-bold">
            [ENG]
          </span>
          <span className="text-xs font-bold text-white">SCHÉMA SYSTÈME ASTERIA-3</span>
          <span className="text-xs text-slate-400">| Vue Éclatée & Inventaire Logistique</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-orange-400 font-semibold">Alertes: 01</span>
          <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-lg font-bold">
            TEMP: NOMINAL (295K)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Exploded Module View */}
        <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-400" />
              Vue Éclatée du Module d'Alunissage
            </h3>
            <span className="text-[10px] text-slate-500">Sélectionnez un composant</span>
          </div>

          {/* Module Diagram Representation */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center min-h-[220px] relative">
            <div className="w-48 h-40 border-2 border-white/20 rounded-t-full relative flex flex-col items-center justify-center bg-white/5 p-2">
              <div className="text-[10px] text-slate-400 font-bold absolute top-2">ASTERIA-3 CAPS</div>

              <div className="grid grid-cols-2 gap-2 my-auto w-full px-2">
                <button
                  onClick={() => setSelectedComponent('power')}
                  className={`p-1.5 text-[10px] rounded-lg border text-center font-bold transition ${
                    selectedComponent === 'power'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  [01] Power
                </button>

                <button
                  onClick={() => setSelectedComponent('propulsion')}
                  className={`p-1.5 text-[10px] rounded-lg border text-center font-bold transition ${
                    selectedComponent === 'propulsion'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400 animate-pulse'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  [02] Propulsion
                </button>

                <button
                  onClick={() => setSelectedComponent('avionics')}
                  className={`p-1.5 text-[10px] rounded-lg border text-center font-bold transition ${
                    selectedComponent === 'avionics'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  [03] Avionique
                </button>

                <button
                  onClick={() => setSelectedComponent('life')}
                  className={`p-1.5 text-[10px] rounded-lg border text-center font-bold transition ${
                    selectedComponent === 'life'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  [04] Support Vie
                </button>
              </div>

              {/* Legs */}
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-white/20" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-white/20" />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {components.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedComponent(c.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition ${
                  selectedComponent === c.id
                    ? 'bg-white/10 border-cyan-400'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-white font-semibold">{c.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.health}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <span style={{ color: c.color }} className="font-bold text-[11px]">
                    {c.health}% ({c.status})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Repair Queue & Logistics Inventory */}
        <div className="space-y-4">
          {/* Repair Queue */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2.5">
              <Wrench className="w-4 h-4 text-orange-400" />
              Queue de Réparation Active
            </h3>

            {repairQueue.length === 0 ? (
              <div className="text-xs text-green-400 text-center py-4 bg-white/5 rounded-lg border border-white/10">
                ✓ Tous les sous-systèmes sont entièrement opérationnels !
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {repairQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-orange-500/30 p-3 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold">
                        {item.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Requis: <span className="text-orange-400 font-medium">{item.required}</span>
                    </div>

                    <button
                      onClick={() => handleRepair(item.id)}
                      className="w-full py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-400 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      [VALIDER RÉPARATION]
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parts Inventory */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                Inventaire Pièces de Rechange
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex justify-between items-center">
                <span className="text-slate-400">Fusible 10A</span>
                <span className="font-bold text-cyan-400">{inventory.fusibles} pcs</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex justify-between items-center">
                <span className="text-slate-400">Capteur IR</span>
                <span className="font-bold text-cyan-400">{inventory.capteurs} pcs</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex justify-between items-center">
                <span className="text-slate-400">Câble Jumper</span>
                <span className="font-bold text-cyan-400">{inventory.cables} pcs</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex justify-between items-center">
                <span className="text-slate-400">Filament PLA (3D)</span>
                <span className="font-bold text-cyan-400">{inventory.plaGrams} g</span>
              </div>
            </div>

            <button
              onClick={handleOrderParts}
              className="w-full py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-400 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
            >
              <PackagePlus className="w-4 h-4" />
              [ COMMANDER PIÈCE (LOGISTIQUE) ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
