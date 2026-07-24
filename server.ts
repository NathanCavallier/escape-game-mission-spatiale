import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared state for simulated telemetry & mission
  let missionState = {
    missionId: 'LUNA-315',
    phase: 6,
    phaseName: 'Tests & Calibration',
    status: 'NOMINAL',
    countdownSeconds: 45 * 60,
    timeRemaining: '00:45:00',
    altitude: 42.5, // km
    velocity: 1850, // m/s
    fuelLevel: 64, // %
    engineTemp: 312, // K
    cabinPressure: 0.85, // bar
    activeAlerts: [] as Array<{ id: string; title: string; severity: 'warn' | 'crit'; team: string; description: string }>,
    teams: {
      alpha: { name: 'Alpha (Commandement)', score: 870, status: 'OK', activeTask: 'Coordonner alunissage' },
      beta: { name: 'Beta (Ingénierie)', score: 740, status: 'OK', activeTask: 'Diagnostics réacteurs' },
      gamma: { name: 'Gamma (Pilotage/Simulation)', score: 810, status: 'OK', activeTask: 'Calculs Delta-V' },
      delta: { name: 'Delta (Rover & Sciences)', score: 920, status: 'OK', activeTask: 'Échantillonnage régolithe' }
    }
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mission: missionState.missionId });
  });

  // REST API Endpoints according to spec
  app.get('/api/mission/status', (req, res) => {
    res.json(missionState);
  });

  app.post('/api/mission/inject', (req, res) => {
    const { incident, team, severity, title } = req.body;
    const alert = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      title: title || 'Panne système détectée',
      severity: severity || 'crit',
      team: team || 'Beta',
      description: incident || 'Une défaillance mineure ou majeure nécessite intervention.'
    };
    missionState.activeAlerts.unshift(alert);
    if (missionState.activeAlerts.length > 5) missionState.activeAlerts.pop();
    missionState.status = severity === 'crit' ? 'CRITIQUE' : 'ATTENTION';
    res.json({ success: true, alert, status: missionState.status });
  });

  app.post('/api/gnc/compute', (req, res) => {
    const { mass = 1500, thrust = 4500, angle = -12.4, brakingCoeff = 0.82 } = req.body;
    // Calculate simulated descent physics
    const deltaV = Math.round((thrust / mass) * 110 * brakingCoeff);
    const fuelRequired = Math.round(mass * 0.028 * (Math.abs(angle) / 10));
    const impactVel = +(1.2 + (1 - brakingCoeff) * 2.5).toFixed(1);
    const gForce = +(1.1 + (thrust / (mass * 9.81))).toFixed(1);
    const isOptimal = impactVel <= 2.0 && gForce <= 3.5;

    res.json({
      deltaV,
      fuelRequired,
      impactVel,
      gForce,
      stabilityScore: isOptimal ? 98 : 65,
      status: isOptimal ? 'OPTIMAL' : 'AVERTISSEMENT_IMPACT',
      landingZone: 'LZ-1 (Cratère Shackleton)'
    });
  });

  app.get('/api/propulsion/status', (req, res) => {
    res.json({
      fuelLevel: missionState.fuelLevel,
      thrustNominal: 4500,
      thrustActual: missionState.status === 'CRITIQUE' ? 2700 : 4500,
      engineTemp: missionState.engineTemp,
      status: missionState.status === 'CRITIQUE' ? 'PERFORMANCE_REDUITE' : 'NOMINAL'
    });
  });

  app.get('/api/power/metrics', (req, res) => {
    res.json({
      batterySoc: 82,
      busVoltage: 28.4,
      loadWatts: 1420,
      solarInputWatts: 450,
      shedLoadActive: false
    });
  });

  app.post('/api/rover/mission', (req, res) => {
    const { command, x, y } = req.body;
    res.json({
      success: true,
      lastCommand: command,
      currentPos: { x: x || 142.5, y: y || 88.2 },
      batteryPct: 74,
      imu: { roll: 2, pitch: 1 },
      obstacleDistanceMeters: 3.4
    });
  });

  app.post('/api/enigme/submit', (req, res) => {
    const { enigmaId, answer, team } = req.body;
    // Enigma validation logic
    let correct = false;
    let hint = '';

    if (enigmaId === 'E1') {
      // Orbit Delta-V formula
      correct = String(answer).trim() === '312' || String(answer).toLowerCase().includes('312');
      hint = 'Multipliez la poussée effective par le temps de freinage divisé par la masse.';
    } else if (enigmaId === 'E2') {
      // Wiring / IMU
      correct = String(answer).trim() === 'PIN-3' || String(answer).trim() === '3' || String(answer).toLowerCase().includes('i2c');
      hint = 'Le bus I²C utilise la broche SDA-3 et SCL-4.';
    } else if (enigmaId === 'E3') {
      // Code Rover
      correct = String(answer).toLowerCase().includes('forward') || String(answer).toLowerCase().includes('avancer') || String(answer).includes('FOR');
      hint = 'Pensez à boucler 3 fois vers le nord puis contourner le cratère par la droite.';
    } else if (enigmaId === 'E4') {
      // Spectrometry regolith
      correct = String(answer).toLowerCase().includes('basalte') || String(answer).toLowerCase().includes('glace') || String(answer).toLowerCase().includes('anorthosite');
      hint = 'Le pic d\'absorption à 1.5 µm indique des traces de glace d\'eau mélangée au basalte.';
    }

    if (correct && team && missionState.teams[team.toLowerCase() as keyof typeof missionState.teams]) {
      missionState.teams[team.toLowerCase() as keyof typeof missionState.teams].score += 150;
    }

    res.json({
      success: correct,
      message: correct ? 'Énigme validée avec succès ! Module débloqué.' : 'Réponse incorrecte. Analysez les télémétries.',
      hint: correct ? null : hint
    });
  });

  // AI Co-pilot ASTRA-AI using Gemini API (@google/genai)
  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { prompt, role, contextData } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          reply: `[ASTRA-AI Mode Secours local]
Analyse de l'avarie Asteria-3 :
Pour le rôle ${role || 'Mission Control'}, vérifiez la télémétrie. Si la poussée moteur chute, contrôlez le fusible F3 et recalculez la fenêtre de freinage Δv.`
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemPrompt = `Tu es ASTRA-AI, l'intelligence artificielle embarquée du Centre de Contrôle de la mission lunaire d'urgence Asteria-3 / LUNA-315.
Ton rôle est d'assister les élèves (Collège / Lycée) dans un Escape Game spatial réaliste et stimulant.
Sois concis, immersif (utilise du jargon spatial professionnel accessible), dynamique et encourageant.
Donne des indices techniques utiles (physique, calculs de trajectoire, mécanique, code rover, diagnostic pannes) sans donner directement les réponses finales si c'est une énigme.
Rôle de l'utilisateur: ${role || 'Opérateur Mission Control'}.
Informations actuelles de la mission: ${JSON.stringify(contextData || missionState)}.
Réponds directement en français.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt || 'Rapport de situation rapide et recommandations.',
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text || 'ASTRA-AI : Télémétrie reçue. Analyse nominale.' });
    } catch (err: any) {
      console.error('Error in ASTRA-AI endpoint:', err);
      res.json({
        reply: 'ASTRA-AI [Signal intermittent] : Communication radio momentanément perturbée par les interférences lunaires. Vérifiez vos paramètres manuels.'
      });
    }
  });

  // Vite middleware for development vs static serve in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mission Control Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
