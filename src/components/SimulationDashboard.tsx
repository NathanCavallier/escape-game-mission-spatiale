import React, { useState, useRef, useEffect } from 'react';
import { Compass, Play, RotateCcw, AlertCircle, CheckCircle, Flame, Shield, Target } from 'lucide-react';
import { soundEngine } from '../lib/audio';

export const SimulationDashboard: React.FC = () => {
  const [mass, setMass] = useState(1500); // kg
  const [thrust, setThrust] = useState(4500); // N
  const [entryAngle, setEntryAngle] = useState(-12.4); // degrees
  const [brakingCoeff, setBrakingCoeff] = useState(0.82); // 0..1

  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState({
    deltaV: 312,
    fuelReq: 42.5,
    impactVel: 1.2,
    gForce: 1.4,
    stability: 98,
    status: 'OPTIMAL',
    landingZone: 'LZ-1 (Shackleton)'
  });

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    soundEngine.playThruster();

    setTimeout(() => {
      // Calculate realistic physics
      const deltaV = Math.round((thrust / mass) * 104 * brakingCoeff);
      const fuelReq = +(mass * 0.028 * (Math.abs(entryAngle) / 10)).toFixed(1);
      const impactVel = +(1.0 + (1 - brakingCoeff) * 3.2).toFixed(1);
      const gForce = +(1.0 + thrust / (mass * 9.81)).toFixed(1);
      const isOptimal = impactVel <= 2.0 && gForce <= 3.5;

      setSimResults({
        deltaV,
        fuelReq,
        impactVel,
        gForce,
        stability: isOptimal ? 98 : 62,
        status: isOptimal ? 'OPTIMAL' : 'IMPACT_DANGEREUX',
        landingZone: isOptimal ? 'LZ-1 (Shackleton)' : 'DÉRIVE (Pente > 15°)'
      });

      setIsSimulating(false);
      soundEngine.playSuccess();
    }, 600);
  };

  // Render Descent Trajectory Canvas (Real curve vs Theoretical dotted curve)
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#0f1e30';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Theoretical Curve (Dotted Gold)
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.bezierCurveTo(W * 0.4, 20, W * 0.7, H * 0.4, W - 30, H - 20);
    ctx.strokeStyle = '#f5a822';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Real Simulated Curve (Cyan Solid)
    ctx.beginPath();
    ctx.moveTo(20, 20);
    const dropOffY = (1 - brakingCoeff) * 80;
    ctx.bezierCurveTo(
      W * 0.35,
      20 + dropOffY,
      W * 0.65,
      H * 0.5 + dropOffY * 0.5,
      W - 30,
      H - 20
    );
    ctx.strokeStyle = simResults.status === 'OPTIMAL' ? '#22d4f5' : '#f54a22';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Start & Target Markers
    ctx.fillStyle = '#22d4f5';
    ctx.beginPath();
    ctx.arc(20, 20, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22f59a';
    ctx.beginPath();
    ctx.arc(W - 30, H - 20, 6, 0, Math.PI * 2);
    ctx.fill();

    // Axis Labels
    ctx.fillStyle = '#4a7aaa';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('Orbite (100km)', 25, 15);
    ctx.fillText('Surface (LZ-1)', W - 90, H - 8);
  }, [brakingCoeff, simResults]);

  return (
    <div className="space-y-3">
      {/* Top Header Card */}
      <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs px-2 py-0.5 rounded font-bold">
            [ORBIT]
          </span>
          <span className="text-xs font-bold text-white">MISSION LUNA-315</span>
          <span className="text-xs text-slate-400">| Calculs & Simulation Orbitale</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-orange-400 font-semibold">Fenêtre de Tir: T-04:12</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-lg font-bold ${
              simResults.status === 'OPTIMAL' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            [{simResults.status}]
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Physical Inputs */}
        <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              Paramètres Physiques (Inputs)
            </h3>
          </div>

          <div className="space-y-3.5 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span className="font-medium">Masse Module:</span>
                <span className="text-cyan-400 font-bold">{mass} kg</span>
              </div>
              <input
                type="range"
                min="1000"
                max="2500"
                step="50"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span className="font-medium">Poussée Moteur:</span>
                <span className="text-orange-400 font-bold">{thrust} N</span>
              </div>
              <input
                type="range"
                min="2000"
                max="8000"
                step="100"
                value={thrust}
                onChange={(e) => setThrust(Number(e.target.value))}
                className="w-full accent-orange-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span className="font-medium">Angle d'Entrée:</span>
                <span className="text-purple-400 font-bold">{entryAngle}°</span>
              </div>
              <input
                type="range"
                min="-25"
                max="-5"
                step="0.1"
                value={entryAngle}
                onChange={(e) => setEntryAngle(Number(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span className="font-medium">Coeff. Freinage Rétro:</span>
                <span className="text-green-400 font-bold">{brakingCoeff.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.01"
                value={brakingCoeff}
                onChange={(e) => setBrakingCoeff(Number(e.target.value))}
                className="w-full accent-green-400"
              />
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'CALCUL EN COURS...' : '< SIMULER TRAJECTOIRE >'}</span>
          </button>
        </div>

        {/* Center Column: Trajectory Curve Graph */}
        <div className="lg:col-span-2 bg-[#0a0c14] border border-white/10 rounded-lg p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              Visualisation Trajectoire Descente
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-mono font-medium">
              <span className="flex items-center gap-1.5 text-orange-400">
                <span className="w-2 h-0.5 bg-orange-400 inline-block" /> Courbe Théorique
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-0.5 bg-cyan-400 inline-block" /> Courbe Réelle
              </span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-2 h-[200px] relative">
            <canvas ref={chartCanvasRef} width={500} height={180} className="w-full h-full block" />
          </div>

          {/* Results Summary Grid matching Wireframe */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Δv Requis</div>
              <div className="text-sm font-bold text-cyan-400">{simResults.deltaV} m/s</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Carburant</div>
              <div className="text-sm font-bold text-orange-400">{simResults.fuelReq} kg</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Impact Vel.</div>
              <div
                className={`text-sm font-bold ${
                  simResults.impactVel <= 2.0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {simResults.impactVel} m/s
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">G-Force</div>
              <div className="text-sm font-bold text-purple-400">{simResults.gForce} G</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
