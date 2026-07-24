import React, { useState } from 'react';
import { Navigation, Compass, ShieldAlert, Cpu, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square, Play, Database, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../lib/audio';

export const RoverDashboard: React.FC = () => {
  const [roverPos, setRoverPos] = useState({ x: 45, y: 55, heading: 0 });
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [telemetry, setTelemetry] = useState({
    distanceM: 142.5,
    speedMs: 0.4,
    roll: 2,
    pitch: 1,
    battery: 74,
    signal: 85,
    obstacleNear: false
  });

  const [samples, setSamples] = useState([
    { id: 'S1', name: 'Régolithe (Basalte)', status: 'En cours...', validated: false },
    { id: 'S2', name: 'Glace d\'eau (Traces)', status: 'Validé', validated: true }
  ]);

  const handleMove = (dx: number, dy: number, h: number) => {
    soundEngine.playThruster();
    setRoverPos((prev) => {
      const nx = Math.max(10, Math.min(90, prev.x + dx));
      const ny = Math.max(10, Math.min(90, prev.y + dy));
      return { x: nx, y: ny, heading: h };
    });
    setTelemetry((prev) => ({
      ...prev,
      distanceM: +(prev.distanceM + Math.hypot(dx, dy) * 2.5).toFixed(1),
      speedMs: 0.6
    }));
  };

  const handleStop = () => {
    soundEngine.playRadioBeep();
    setTelemetry((prev) => ({ ...prev, speedMs: 0 }));
  };

  const handleAnalyzeSample = () => {
    soundEngine.playSuccess();
    setSamples((prev) =>
      prev.map((s) => (s.id === 'S1' ? { ...s, status: 'Validé (Basalte Pôle Sud)', validated: true } : s))
    );
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Banner Header */}
      <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-2 py-0.5 rounded font-bold">
            [ROV]
          </span>
          <span className="text-xs font-bold text-white">LUNA-ROVER 1</span>
          <span className="text-xs text-slate-400">| Pilote Rover & Exploration Géologique</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-cyan-400 font-semibold">Signal: {telemetry.signal}%</span>
          <span className="text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-lg font-bold">
            BAT: {telemetry.battery}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Tactical Lunar Map */}
        <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Navigation className="w-4 h-4 text-green-400" />
              Carte Tactique Lunaire (2D Grid)
            </h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Cratère Shackleton (Pôle Sud)</span>
          </div>

          {/* Tactical 2D Canvas Map */}
          <div className="bg-black/40 border border-white/10 rounded-lg h-[240px] relative overflow-hidden flex items-center justify-center p-2">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Landing Zone LZ-1 */}
            <div className="absolute top-6 left-8 flex items-center gap-1">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-green-400 bg-green-500/10 flex items-center justify-center text-[9px] text-green-400 font-bold">
                LZ-1
              </div>
            </div>

            {/* Target Crater */}
            <div className="absolute bottom-8 right-10 flex items-center gap-1">
              <div className="w-12 h-12 rounded-full border border-orange-400 bg-orange-500/10 flex items-center justify-center text-[9px] text-orange-400 font-bold">
                Cratère
              </div>
            </div>

            {/* Rover Marker */}
            <div
              className="absolute w-6 h-6 bg-cyan-400 rounded-sm shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center justify-center text-[10px] text-black font-bold transition-all duration-300"
              style={{
                left: `${roverPos.x}%`,
                top: `${roverPos.y}%`,
                transform: `translate(-50%, -50%) rotate(${roverPos.heading}deg)`
              }}
            >
              🤖
            </div>

            {/* Distance line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1="20%"
                y1="20%"
                x2={`${roverPos.x}%`}
                y2={`${roverPos.y}%`}
                stroke="#4ade80"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Distance</div>
              <div className="font-bold text-green-400">{telemetry.distanceM} m</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Angle (IMU)</div>
              <div className="font-bold text-cyan-400">
                R:{telemetry.roll}° P:{telemetry.pitch}°
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Vitesse</div>
              <div className="font-bold text-orange-400">{telemetry.speedMs} m/s</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Obstacle</div>
              <div className="font-bold text-green-400">Aucun (&lt;2m)</div>
            </div>
          </div>
        </div>

        {/* Right Column: Rover Controls & Sample Analysis */}
        <div className="space-y-4">
          {/* Controls Card */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Commandes Directionnelles Rover
              </h3>
              <button
                onClick={() => setIsAutonomous(!isAutonomous)}
                className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border transition ${
                  isAutonomous
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {isAutonomous ? 'MODE AUTONOME ON' : 'MODE MANUEL'}
              </button>
            </div>

            {/* D-Pad Buttons matching Wireframe */}
            <div className="flex flex-col items-center gap-2 py-2">
              <button
                onClick={() => handleMove(0, -5, 0)}
                disabled={isAutonomous}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-cyan-500/40 text-cyan-400 rounded-lg transition"
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMove(-5, 0, 270)}
                  disabled={isAutonomous}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-cyan-500/40 text-cyan-400 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleStop}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold text-xs rounded-lg transition"
                >
                  [STOP]
                </button>

                <button
                  onClick={() => handleMove(5, 0, 90)}
                  disabled={isAutonomous}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-cyan-500/40 text-cyan-400 rounded-lg transition"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => handleMove(0, 5, 180)}
                disabled={isAutonomous}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-cyan-500/40 text-cyan-400 rounded-lg transition"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Samples Analysis Card */}
          <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-green-400" />
                Analyse des Échantillons Sol
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {samples.map((s) => (
                <div
                  key={s.id}
                  className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white">
                      {s.id}: {s.name}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">{s.status}</div>
                  </div>
                  {s.validated ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <button
                      onClick={handleAnalyzeSample}
                      className="px-2.5 py-1 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] rounded-lg font-bold hover:bg-green-500/30 transition"
                    >
                      Analyser
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => soundEngine.playRadioBeep()}
              className="w-full py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-400 font-bold text-xs rounded-lg transition"
            >
              [ ENREGISTRER POSITION & COORDONNÉES ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
