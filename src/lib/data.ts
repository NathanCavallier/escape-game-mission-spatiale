import { MissionPhase, Team, SystemHealth, Enigma, Incident, SafetyCheckItem, SafetyIncidentLog } from '../types';

export const INITIAL_PHASES: MissionPhase[] = [
  { id: 1, icon: '📋', label: 'Briefing', desc: 'Constitution des 4 équipes, cahier des charges et rôle Asteria-3', durationMin: 10 },
  { id: 2, icon: '📐', label: 'Calculs', desc: 'Calcul de trajectoire, orbite d\'approche et poussée de freinage Δv', durationMin: 15 },
  { id: 3, icon: '🔧', label: 'Proto.', desc: 'Prototypage mécanique du module et amortisseurs d\'alunissage', durationMin: 20 },
  { id: 4, icon: '⚡', label: 'Électro.', desc: 'Câblage des capteurs IMU, alimentations et bus de communication', durationMin: 15 },
  { id: 5, icon: '💻', label: 'Code', desc: 'Programmation de l\'algorithme de guidage du rover et régulateur PID', durationMin: 20 },
  { id: 6, icon: '🧪', label: 'Tests', desc: 'Simulation sur maquette et calibration de la caméra et télémètre', durationMin: 15 },
  { id: 7, icon: '🚨', label: 'Pannes', desc: 'Injection de scénarios de secours et avaries non-planifiées', durationMin: 15 },
  { id: 8, icon: '🔗', label: 'Intégrat.', desc: 'Coordination inter-équipes et répétition générale avant alunissage', durationMin: 15 },
  { id: 9, icon: '🏁', label: 'Épreuve', desc: 'Alunissage réel chronométré et déploiement du rover lunaire', durationMin: 45 },
  { id: 10, icon: '🎓', label: 'Bilan', desc: 'Analyse des données, rapport de mission et évaluation multi-critères', durationMin: 15 },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'alpha',
    name: 'Équipe Alpha',
    code: 'ALPHA-01',
    icon: '🦅',
    color: '#22d4f5',
    roleName: 'Mission Control & Coo',
    score: 870,
    progressPct: 75,
    status: 'OK',
    tasks: [
      { id: 'a1', label: 'Supervision timeline & compte à rebours', done: true },
      { id: 'a2', label: 'Gestion du journal radio & ordres', done: true },
      { id: 'a3', label: 'Coordination des procédures de crise', done: false, active: true },
      { id: 'a4', label: 'Rédaction du rapport de synthèse', done: false }
    ]
  },
  {
    id: 'beta',
    name: 'Équipe Beta',
    code: 'BETA-02',
    icon: '🔭',
    color: '#f5a822',
    roleName: 'Ingénierie & Réparations',
    score: 740,
    progressPct: 50,
    status: 'OK',
    tasks: [
      { id: 'b1', label: 'Diagnostic schématiques Asteria-3', done: true },
      { id: 'b2', label: 'Montage du système d\'amortissement', done: false, active: true },
      { id: 'b3', label: 'Remplacement fusible circuit moteur #2', done: false },
      { id: 'b4', label: 'Inventaire des pièces imprimées 3D', done: true }
    ]
  },
  {
    id: 'gamma',
    name: 'Équipe Gamma',
    code: 'GAMMA-03',
    icon: '🛸',
    color: '#a855f7',
    roleName: 'Simulation Orbitale & GNC',
    score: 810,
    progressPct: 65,
    status: 'OK',
    tasks: [
      { id: 'g1', label: 'Calcul du vecteur impulsion Δv', done: true },
      { id: 'g2', label: 'Simulation numérique de descente', done: false, active: true },
      { id: 'g3', label: 'Calibrage du régulateur d\'attitude PID', done: false },
      { id: 'g4', label: 'Validation du point de cible LZ-1', done: false }
    ]
  },
  {
    id: 'delta',
    name: 'Équipe Delta',
    code: 'DELTA-04',
    icon: '🔬',
    color: '#22f59a',
    roleName: 'Rover & Géologie Lunaire',
    score: 920,
    progressPct: 90,
    status: 'OK',
    tasks: [
      { id: 'd1', label: 'Programmation du chemin d\'évitement', done: true },
      { id: 'd2', label: 'Analyse spectrométrique du régolithe', done: true },
      { id: 'd3', label: 'Détection de traces d\'eau glacée', done: false, active: true },
      { id: 'd4', label: 'Stabilisation du module d\'atterrissage', done: false }
    ]
  }
];

export const INITIAL_SYSTEMS: SystemHealth[] = [
  {
    id: 'sys-propulsion',
    name: 'Propulsion & Tuyères',
    icon: '🚀',
    category: 'Propulsion',
    healthPct: 95,
    status: 'NOMINAL',
    temp: 312,
    powerUsageWatts: 1800,
    description: '4 réacteurs d\'alunissage à poussée orientable. Poussée nominale: 4500 N.'
  },
  {
    id: 'sys-comms',
    name: 'Communications Radio & Data',
    icon: '📡',
    category: 'Comms',
    healthPct: 88,
    status: 'NOMINAL',
    temp: 295,
    powerUsageWatts: 250,
    description: 'Lien radio VHF/UHF et transpondeur bande S vers le Centre de Contrôle Terre.'
  },
  {
    id: 'sys-gnc',
    name: 'Guidage, Navigation & Contrôle (GNC)',
    icon: '🧭',
    category: 'Avionique',
    healthPct: 100,
    status: 'NOMINAL',
    temp: 298,
    powerUsageWatts: 420,
    description: 'Unités de mesure inertielle (IMU), altimètre radar et centrale gyroscopique.'
  },
  {
    id: 'sys-power',
    name: 'Alimentation Électrique & Batteries',
    icon: '⚡',
    category: 'Power',
    healthPct: 72,
    status: 'NOMINAL',
    temp: 305,
    powerUsageWatts: 2100,
    description: 'Panneaux solaires déployables et 2 batteries lithium-ion de secours.'
  },
  {
    id: 'sys-thermal',
    name: 'Gestion Thermique & Radiateurs',
    icon: '🌡️',
    category: 'Thermal',
    healthPct: 91,
    status: 'NOMINAL',
    temp: 290,
    powerUsageWatts: 380,
    description: 'Boucle de fluide caloporteur et panneaux d\'isolation multicouches.'
  },
  {
    id: 'sys-life',
    name: 'Support de Vie (ECLSS)',
    icon: '🫁',
    category: 'LifeSupport',
    healthPct: 96,
    status: 'NOMINAL',
    temp: 294,
    powerUsageWatts: 510,
    description: 'Recyclage d\'oxygène, élimination du CO₂ et pressurisation de cabine.'
  },
  {
    id: 'sys-structure',
    name: 'Structure & Ancrage Lunaire',
    icon: '🛡️',
    category: 'Structure',
    healthPct: 100,
    status: 'NOMINAL',
    temp: 280,
    powerUsageWatts: 50,
    description: 'Châssis en titane-aluminium et pieds rétractables à absorption de choc.'
  }
];

export const INITIAL_ENIGMAS: Enigma[] = [
  {
    id: 'E1',
    title: 'Énigme 1 : Calcul d\'Impulsion Orbitale (Δv)',
    phaseId: 2,
    difficulty: 'Collège',
    icon: '📐',
    description: 'Le module Asteria-3 doit freiner pour quitter l\'orbite et entamer la descente vers le cratère Shackleton.',
    question: 'Si la poussée F = 4500 N est appliquée pendant t = 104 s sur le module de masse m = 1500 kg, quel est le changement de vitesse Δv (en m/s) ? (Formule : Δv = (F × t) / m)',
    hint: 'Calculez : (4500 × 104) / 1500. Astuce : 4500 / 1500 = 3 !',
    correctAnswer: '312',
    unlocked: true,
    solved: false
  },
  {
    id: 'E2',
    title: 'Énigme 2 : Diagnostic Bus I²C et Câblage IMU',
    phaseId: 4,
    difficulty: 'Collège',
    icon: '🔌',
    description: 'Le capteur gyroscopique de l\'équipe Ingénierie ne transmet plus ses données à l\'ordinateur de bord.',
    question: 'Sur quelle broche du connecteur d\'avionique faut-il brancher le câble de signal de données SDA pour rétablir la communication I²C ? (Options: PIN-1, PIN-3, PIN-7)',
    hint: 'La norme d\'avionique Asteria impose la broche d\'imparité PIN-3 pour le canal de données principal.',
    correctAnswer: 'PIN-3',
    unlocked: true,
    solved: false
  },
  {
    id: 'E3',
    title: 'Énigme 3 : Algorithme d\'Évitement du Rover',
    phaseId: 5,
    difficulty: 'Lycée',
    icon: '🤖',
    description: 'Le rover doit traverser le champ de blocs de roches sans basculer pour atteindre la balise de guidage.',
    question: 'Quelle est l\'instruction principale à exécuter lorsque le télémètre laser détecte un obstacle à moins de 0.5 mètre ? (Tapez: STOP, RETOUR, AVANCER)',
    hint: 'Pour éviter toute collision imminente, la première action prioritaire de sécurité est l\'arrêt immédiat.',
    correctAnswer: 'STOP',
    unlocked: false,
    solved: false
  },
  {
    id: 'E4',
    title: 'Énigme 4 : Spectrométrie du Sol Lunaire',
    phaseId: 6,
    difficulty: 'Lycée',
    icon: '🔬',
    description: 'L\'équipe Sciences analyse le prélèvement S2 à proximité du pôle Sud lunaire.',
    question: 'Quel minéral ou élément est caractérisé par un pic d\'absorbance optique dans la zone 1.5 - 2.0 µm ? (Options: BASALTE, GLACE, ANORTHOSITE)',
    hint: 'Cette ressource précieuse permettra d\'alimenter le support de vie et fabriquer du carburant sur la Lune.',
    correctAnswer: 'GLACE',
    unlocked: false,
    solved: false
  }
];

export const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    title: 'SURCHAUFFE DU COMPARTIMENT ÉLECTRONIQUE',
    icon: '🌡️',
    description: 'La température de l\'avionique dépasse 85°C suite à une accumulation thermique.',
    task: 'Équipe Beta (Ingénierie) : activer le radiateur secondaire et basculer en mode faible consommation.',
    targetTeam: 'beta',
    systemId: 'sys-thermal',
    severity: 'crit',
    resolved: false,
    timestamp: '14:12'
  },
  {
    id: 'INC-002',
    title: 'PERTE TEMPORAIRE DU SIGNAL RADIO VHF',
    icon: '📡',
    description: 'Masquage du relief lunaire provocant des pertes de paquets sur le canal principal.',
    task: 'Équipe Alpha (Control) : réaligner l\'antenne parabolique et émettre le signal de synchronisation.',
    targetTeam: 'alpha',
    systemId: 'sys-comms',
    severity: 'warn',
    resolved: false,
    timestamp: '14:18'
  }
];

export const INITIAL_SAFETY_CHECKLIST: SafetyCheckItem[] = [
  { id: 'sc-1', label: 'Batteries LiPo du rover chargées et mesurées à 8.4V', category: 'Electrique', checked: true },
  { id: 'sc-2', label: 'Zone de simulation lunaire dégagée de tout obstacle non contrôlé', category: 'Zone', checked: true },
  { id: 'sc-3', label: 'Tension des alimentations de banc stabilisée à 5.0V ± 0.1V', category: 'Electrique', checked: true },
  { id: 'sc-4', label: 'Vérification visuelle de la maquette d\'alunissage et vis de fixation', category: 'Mecanique', checked: true },
  { id: 'sc-5', label: 'Trousse de premiers secours et extincteur CO2 accessibles', category: 'Secours', checked: true },
  { id: 'sc-6', label: 'Tablettes et postes animateurs synchronisés sur le réseau local', category: 'Electrique', checked: false }
];

export const INITIAL_SAFETY_LOGS: SafetyIncidentLog[] = [
  {
    id: 'SL-01',
    timestamp: '13:45',
    component: 'Fusible 10A Banc de test #2',
    severity: 'Mineur',
    description: 'Déclenchement du fusible suite à un court-circuit lors du câblage du moteur.',
    correctiveAction: 'Composant remplacé par l\'Équipe Beta sous supervision. Vérification au multimètre.'
  },
  {
    id: 'SL-02',
    timestamp: '14:05',
    component: 'Moteur de propulsion Rover #1',
    severity: 'Modéré',
    description: 'Bloquage mécanique temporaire causé par l\'infiltration de poussière de simulation.',
    correctiveAction: 'Dépoussiérage à l\'air comprimé et lubrification de l\'engrenage.'
  }
];
