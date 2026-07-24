import React, { useState, useEffect } from 'react';
import {
  Role,
  Team,
  SystemHealth,
  Enigma,
  Incident,
  RadioMessage,
  SafetyCheckItem,
  SafetyIncidentLog,
  RandomEvent,
  RandomEventSettings
} from './types';
import {
  INITIAL_PHASES,
  INITIAL_TEAMS,
  INITIAL_SYSTEMS,
  INITIAL_ENIGMAS,
  SAMPLE_INCIDENTS,
  INITIAL_SAFETY_CHECKLIST,
  INITIAL_SAFETY_LOGS,
  CATALOGUE_RANDOM_EVENTS,
  DEFAULT_RANDOM_EVENT_SETTINGS
} from './lib/data';
import { Header } from './components/Header';
import { PhaseBar } from './components/PhaseBar';
import { MissionControlDashboard } from './components/MissionControlDashboard';
import { SimulationDashboard } from './components/SimulationDashboard';
import { EngineeringDashboard } from './components/EngineeringDashboard';
import { RoverDashboard } from './components/RoverDashboard';
import { InstructorDashboard } from './components/InstructorDashboard';
import { SafetyDashboard } from './components/SafetyDashboard';
import { EnigmaModal } from './components/EnigmaModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { IncidentModal } from './components/IncidentModal';
import { RandomEventOverlay } from './components/RandomEventOverlay';
import { soundEngine } from './lib/audio';

export default function App() {
  const [activeRole, setActiveRole] = useState<Role>('control');
  const [currentPhaseId, setCurrentPhaseId] = useState(6); // Phase 6: Tests & Calibration
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [systems, setSystems] = useState<SystemHealth[]>(INITIAL_SYSTEMS);
  const [enigmas, setEnigmas] = useState<Enigma[]>(INITIAL_ENIGMAS);
  const [incidents, setIncidents] = useState<Incident[]>(SAMPLE_INCIDENTS);
  const [safetyChecklist, setSafetyChecklist] = useState<SafetyCheckItem[]>(INITIAL_SAFETY_CHECKLIST);
  const [safetyLogs, setSafetyLogs] = useState<SafetyIncidentLog[]>(INITIAL_SAFETY_LOGS);

  // Dynamic Random Events System State
  const [randomEventSettings, setRandomEventSettings] = useState<RandomEventSettings>(DEFAULT_RANDOM_EVENT_SETTINGS);
  const [activeRandomEvents, setActiveRandomEvents] = useState<RandomEvent[]>([]);
  const [randomEventHistory, setRandomEventHistory] = useState<RandomEvent[]>([]);


  // Telemetry metrics
  const [altitudeKm, setAltitudeKm] = useState(42.5);
  const [velocityMs, setVelocityMs] = useState(1850);
  const [fuelPct, setFuelPct] = useState(64);
  const [cabinPressureBar, setCabinPressureBar] = useState(0.85);
  const [engineTempK, setEngineTempK] = useState(312);

  // Countdown
  const [countdownSeconds, setCountdownSeconds] = useState(45 * 60);
  const [isCountdownRunning, setIsCountdownRunning] = useState(true);

  // Modals
  const [isEnigmaOpen, setIsEnigmaOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeIncidentModal, setActiveIncidentModal] = useState<Incident | null>(null);

  // Radio logs
  const [radioComms, setRadioComms] = useState<RadioMessage[]>([
    { id: 'm1', timestamp: '14:15', type: 'comm-rx', icon: '📡', sender: 'MISSION CTRL', text: 'Luna-315, vous êtes autorisés pour la phase d\'approche. Bonne chance.' },
    { id: 'm2', timestamp: '14:16', type: 'comm-tx', icon: '🚀', sender: 'ÉQUIPE ALPHA', text: 'Centre de contrôle, équipes en position. Systèmes vérifiés.' },
    { id: 'm3', timestamp: '14:18', type: 'comm-warn', icon: '⚡', sender: 'SYSTÈME', text: 'Perte de signal radio VHF momentanée... Masquage lunaire.' }
  ]);

  // Telemetry loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAltitudeKm((prev) => Math.max(12.0, +(prev - 0.05).toFixed(1)));
      setVelocityMs((prev) => +(prev + (Math.random() - 0.5) * 4).toFixed(0));
      setFuelPct((prev) => Math.max(5, +(prev - 0.01).toFixed(1)));
      setCabinPressureBar((prev) => +(0.85 + (Math.random() - 0.5) * 0.01).toFixed(2));
      setEngineTempK((prev) => +(312 + (Math.random() - 0.5) * 2).toFixed(1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer loop
  useEffect(() => {
    if (!isCountdownRunning) return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          setIsCountdownRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCountdownRunning]);

  // Trigger a random event or specific catalogue event
  const handleTriggerRandomEvent = (eventId?: string) => {
    let template = CATALOGUE_RANDOM_EVENTS.find((e) => e.id === eventId);

    if (!template) {
      // Pick a random event filtered by selected categories
      const eligible = CATALOGUE_RANDOM_EVENTS.filter((e) =>
        randomEventSettings.selectedCategories.includes(e.category)
      );
      if (eligible.length === 0) return;
      template = eligible[Math.floor(Math.random() * eligible.length)];
    }

    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const newEvent: RandomEvent = {
      ...template,
      id: `EVT-ACT-${Date.now().toString().slice(-4)}`,
      remainingSeconds: template.durationSeconds,
      active: true,
      timestamp: nowStr,
      resolved: false,
      triggeredBy: eventId ? 'manual' : 'auto'
    };

    // Play appropriate sound effect
    if (newEvent.category === 'discovery') {
      soundEngine.playSuccess();
    } else {
      soundEngine.playAlarm();
    }

    // Add radio comm message
    const commMsgText = newEvent.category === 'discovery'
      ? `💎 DÉCOUVERTE SPATIALE : ${newEvent.title} - ${newEvent.impact}`
      : `⚠️ ÉVÉNEMENT ALÉATOIRE : ${newEvent.title} - ${newEvent.impact}`;

    const newMsg: RadioMessage = {
      id: `m-${Date.now()}`,
      timestamp: nowStr,
      type: newEvent.category === 'discovery' ? 'comm-tx' : 'comm-warn',
      icon: newEvent.icon,
      sender: 'SYSTÈME',
      text: commMsgText
    };
    setRadioComms((prev) => [newMsg, ...prev]);

    // Apply score bonus if positive discovery event
    if (newEvent.scoreBonus && newEvent.scoreBonus > 0) {
      setTeams((prev) =>
        prev.map((t) => {
          if (
            newEvent.targetTeams === 'all' ||
            (Array.isArray(newEvent.targetTeams) && newEvent.targetTeams.includes(t.id))
          ) {
            return { ...t, score: t.score + newEvent.scoreBonus! };
          }
          return t;
        })
      );
    }

    setActiveRandomEvents((prev) => [newEvent, ...prev]);
    setRandomEventHistory((prev) => [newEvent, ...prev]);
    setRandomEventSettings((prev) => ({ ...prev, autoTriggerCount: prev.autoTriggerCount + 1 }));
  };

  // Resolve / mitigate an active event
  const handleResolveRandomEvent = (eventId: string) => {
    soundEngine.playSuccess();
    const evt = activeRandomEvents.find((e) => e.id === eventId);

    setActiveRandomEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, resolved: true, active: false } : e))
    );
    setRandomEventHistory((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, resolved: true } : e))
    );

    if (evt) {
      const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const newMsg: RadioMessage = {
        id: `m-${Date.now()}`,
        timestamp: nowStr,
        type: 'comm-tx',
        icon: '✓',
        sender: 'MISSION CTRL',
        text: `✓ Événement "${evt.title}" résolu / atténué avec succès par l'équipage.`
      };
      setRadioComms((prev) => [newMsg, ...prev]);
    }
  };

  // Active Events Timer Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRandomEvents((prev) =>
        prev.map((evt) => {
          if (evt.resolved || evt.durationSeconds <= 0) return evt;
          if (evt.remainingSeconds <= 1) {
            soundEngine.playSuccess();
            return { ...evt, remainingSeconds: 0, resolved: true, active: false };
          }
          return { ...evt, remainingSeconds: evt.remainingSeconds - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Interval for automatic random event generation
  useEffect(() => {
    if (!randomEventSettings.enabled || randomEventSettings.frequency === 'off') return;

    const intervalMs =
      randomEventSettings.frequency === 'high'
        ? 20000
        : randomEventSettings.frequency === 'medium'
        ? 40000
        : 80000;

    const timer = setInterval(() => {
      if (Math.random() < 0.65) {
        handleTriggerRandomEvent();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    randomEventSettings.enabled,
    randomEventSettings.frequency,
    randomEventSettings.selectedCategories,
    randomEventSettings.intensity
  ]);


  const handleSendMessage = (sender: string, text: string) => {
    const newMsg: RadioMessage = {
      id: `m-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'comm-tx',
      icon: '📻',
      sender,
      text
    };
    setRadioComms((prev) => [newMsg, ...prev]);
  };

  const handleTriggerRandomIncident = () => {
    soundEngine.playAlarm();
    const newIncident: Incident = {
      id: `INC-${Date.now().toString().slice(-3)}`,
      title: 'SURCHAUFFE CIRCUIT MOTEUR #2',
      icon: '⚡',
      description: 'Défaillance thermique sur la tuyère tribord. Poussée réduite de 40%.',
      task: 'Équipe Beta (Ingénierie) : Remplacer le fusible F3 et réinitialiser la vanne de régulation.',
      targetTeam: 'beta',
      systemId: 'sys-propulsion',
      severity: 'crit',
      resolved: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setActiveIncidentModal(newIncident);

    // Degrade propulsion system
    setSystems((prev) =>
      prev.map((s) => (s.id === 'sys-propulsion' ? { ...s, healthPct: 40, status: 'CRITICAL' } : s))
    );

    handleSendMessage('ALERTE', `INCIDENT DÉCLENCHÉ : ${newIncident.title}`);
  };

  const handleResolveIncident = (incidentId: string) => {
    soundEngine.playSuccess();
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, resolved: true } : i))
    );
    setSystems((prev) =>
      prev.map((s) => (s.id === 'sys-propulsion' ? { ...s, healthPct: 95, status: 'NOMINAL' } : s))
    );
    handleSendMessage('MISSION CTRL', `Incident ${incidentId} résolu avec succès ! Systèmes rétablis.`);
  };

  const handleSolveEnigma = async (enigmaId: string, answer: string, selectedTeam: string) => {
    try {
      const res = await fetch('/api/enigme/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enigmaId, answer, team: selectedTeam })
      });
      const data = await res.json();

      if (data.success) {
        setEnigmas((prev) =>
          prev.map((e) => (e.id === enigmaId ? { ...e, solved: true, solvedByTeam: selectedTeam } : e))
        );
        setTeams((prev) =>
          prev.map((t) =>
            t.id === selectedTeam
              ? { ...t, score: t.score + 150, progressPct: Math.min(100, t.progressPct + 15) }
              : t
          )
        );
        handleSendMessage('SYSTEME', `Énigme ${enigmaId} résolue par l'Équipe ${selectedTeam.toUpperCase()} ! (+150 pts)`);
      }

      return data;
    } catch (e) {
      return { success: false, message: 'Erreur réseau lors de la validation.' };
    }
  };

  const handleToggleEnigmaUnlock = (id: string) => {
    soundEngine.playRadioBeep();
    setEnigmas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, unlocked: !e.unlocked } : e))
    );
  };

  const handleToggleCheckItem = (id: string) => {
    soundEngine.playRadioBeep();
    setSafetyChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleResetAll = () => {
    soundEngine.playRadioBeep();
    setCurrentPhaseId(1);
    setAltitudeKm(185.4);
    setVelocityMs(1847);
    setFuelPct(100);
    setTeams(INITIAL_TEAMS);
    setSystems(INITIAL_SYSTEMS);
    setIncidents([]);
    setCountdownSeconds(45 * 60);
    setIsCountdownRunning(true);
    handleSendMessage('MISSION CTRL', 'Réinitialisation complète de la simulation Asteria-3.');
  };

  const currentStatus: 'NOMINAL' | 'WARN' | 'CRIT' =
    incidents.some((i) => !i.resolved && i.severity === 'crit')
      ? 'CRIT'
      : incidents.some((i) => !i.resolved)
      ? 'WARN'
      : 'NOMINAL';

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-sans p-2 sm:p-4 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-[1550px] mx-auto space-y-3">
        {/* Top Header */}
        <Header
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          status={currentStatus}
          currentPhase={currentPhaseId}
          totalPhases={INITIAL_PHASES.length}
          onNextPhase={() => setCurrentPhaseId((prev) => Math.min(10, prev + 1))}
          onTriggerIncident={handleTriggerRandomIncident}
          onResetAll={handleResetAll}
          onOpenAIAssistant={() => setIsAIOpen(true)}
          countdownSeconds={countdownSeconds}
          isCountdownRunning={isCountdownRunning}
          onToggleCountdown={() => setIsCountdownRunning(!isCountdownRunning)}
          onResetCountdown={() => setCountdownSeconds(45 * 60)}
        />

        {/* Timeline Phase Bar */}
        <PhaseBar
          phases={INITIAL_PHASES}
          currentPhaseId={currentPhaseId}
          onSelectPhase={(id) => setCurrentPhaseId(id)}
        />

        {/* Dynamic Random Events Overlay & Environmental FX */}
        <RandomEventOverlay
          activeEvents={activeRandomEvents}
          onResolveEvent={handleResolveRandomEvent}
        />

        {/* Dashboard Views Routing */}
        <main className="transition-all duration-300">
          {activeRole === 'control' && (
            <MissionControlDashboard
              teams={teams}
              systems={systems}
              incidents={incidents}
              radioComms={radioComms}
              altitudeKm={altitudeKm}
              velocityMs={velocityMs}
              fuelPct={fuelPct}
              cabinPressureBar={cabinPressureBar}
              engineTempK={engineTempK}
              status={currentStatus}
              onSendMessage={handleSendMessage}
              onResolveIncident={handleResolveIncident}
              onTriggerIncident={handleTriggerRandomIncident}
              onOpenEnigmaModal={() => setIsEnigmaOpen(true)}
            />
          )}

          {activeRole === 'simulation' && <SimulationDashboard />}

          {activeRole === 'engineering' && <EngineeringDashboard />}

          {activeRole === 'rover' && <RoverDashboard />}

          {activeRole === 'instructor' && (
            <InstructorDashboard
              teams={teams}
              enigmas={enigmas}
              onToggleEnigmaUnlock={handleToggleEnigmaUnlock}
              onTriggerIncident={handleTriggerRandomIncident}
              onSendHintToRadio={(hint) => handleSendMessage('ANIMATEUR', hint)}
              randomEventSettings={randomEventSettings}
              activeRandomEvents={activeRandomEvents}
              randomEventHistory={randomEventHistory}
              onUpdateRandomEventSettings={(newSettings) =>
                setRandomEventSettings((prev) => ({ ...prev, ...newSettings }))
              }
              onTriggerRandomEvent={handleTriggerRandomEvent}
              onResolveRandomEvent={handleResolveRandomEvent}
              onClearRandomEventHistory={() => setRandomEventHistory([])}
            />
          )}


          {activeRole === 'safety' && (
            <SafetyDashboard
              checklist={safetyChecklist}
              incidentLogs={safetyLogs}
              onToggleCheckItem={handleToggleCheckItem}
            />
          )}
        </main>

        {/* Modals */}
        <EnigmaModal
          isOpen={isEnigmaOpen}
          onClose={() => setIsEnigmaOpen(false)}
          enigmas={enigmas}
          teams={teams}
          onSolveEnigma={handleSolveEnigma}
        />

        <AIAssistantModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          activeRole={activeRole}
          contextData={{ altitudeKm, velocityMs, fuelPct, currentPhaseId, status: currentStatus }}
        />

        <IncidentModal
          incident={activeIncidentModal}
          onClose={() => setActiveIncidentModal(null)}
          onResolve={handleResolveIncident}
        />
      </div>
    </div>
  );
}
