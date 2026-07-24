import React, { useState } from 'react';
import { RandomEvent, RandomEventSettings, RandomEventCategory, RandomEventSeverity } from '../types';
import { CATALOGUE_RANDOM_EVENTS } from '../lib/data';
import { Dices, Zap, Sliders, Play, CheckCircle, XCircle, RotateCcw, AlertTriangle, Shield, Sparkles, Filter } from 'lucide-react';

interface RandomEventsControlPanelProps {
  settings: RandomEventSettings;
  activeEvents: RandomEvent[];
  eventHistory: RandomEvent[];
  onUpdateSettings: (newSettings: Partial<RandomEventSettings>) => void;
  onTriggerRandomEvent: (eventId?: string) => void;
  onResolveEvent: (eventId: string) => void;
  onClearHistory: () => void;
}

export const RandomEventsControlPanel: React.FC<RandomEventsControlPanelProps> = ({
  settings,
  activeEvents,
  eventHistory,
  onUpdateSettings,
  onTriggerRandomEvent,
  onResolveEvent,
  onClearHistory
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const toggleCategory = (cat: RandomEventCategory) => {
    const current = settings.selectedCategories;
    const exists = current.includes(cat);
    const updated = exists ? current.filter((c) => c !== cat) : [...current, cat];
    onUpdateSettings({ selectedCategories: updated });
  };

  const filteredCatalogue = CATALOGUE_RANDOM_EVENTS.filter((e) => {
    if (selectedCategoryFilter !== 'all' && e.category !== selectedCategoryFilter) return false;
    return true;
  });

  return (
    <div className="bg-[#0a0c14] border border-white/10 rounded-lg p-4 space-y-4 font-mono">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-orange-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Système d'Événements Aléatoires Dynamiques
            <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono">
              [CONFIG ANIMATEUR]
            </span>
          </h3>
        </div>

        {/* Global Auto Trigger Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold">Générateur Automatique:</span>
          <button
            onClick={() => onUpdateSettings({ enabled: !settings.enabled })}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
              settings.enabled
                ? 'bg-green-500/20 border-green-500/40 text-green-300'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
            }`}
          >
            {settings.enabled ? '🟢 ACTIF' : '⚪ DÉSACTIVÉ'}
          </button>
        </div>
      </div>

      {/* Configuration Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Frequency Control */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            ⏱️ Fréquence de Déclenchement:
          </label>
          <div className="grid grid-cols-4 gap-1">
            {(['off', 'low', 'medium', 'high'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => onUpdateSettings({ frequency: freq })}
                className={`py-1.5 text-[10px] font-bold rounded border transition uppercase ${
                  settings.frequency === freq
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {freq === 'off' ? 'OFF' : freq === 'low' ? 'Low' : freq === 'medium' ? 'Med' : 'High'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">
            {settings.frequency === 'off' && 'Aucun événement automatique.'}
            {settings.frequency === 'low' && 'Intervalle ~90s (Calme).'}
            {settings.frequency === 'medium' && 'Intervalle ~45s (Standard).'}
            {settings.frequency === 'high' && 'Intervalle ~25s (Intense !)'}
          </p>
        </div>

        {/* Severity / Intensity Control */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            🔥 Niveau d'Intensité / Sévérité:
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['low', 'medium', 'high'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onUpdateSettings({ intensity: lvl })}
                className={`py-1.5 text-[10px] font-bold rounded border transition uppercase ${
                  settings.intensity === lvl
                    ? lvl === 'high'
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : lvl === 'medium'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-green-500/20 border-green-500 text-green-300'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'low' ? 'Minime' : lvl === 'medium' ? 'Modérée' : 'Critique'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">
            Filtre les événements générés selon la gravité des scénarios.
          </p>
        </div>

        {/* Category Filters */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            🎯 Catégories Autorisées:
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {[
              { id: 'communication', label: '📻 Comms', color: 'cyan' },
              { id: 'system', label: '⚡ Systèmes', color: 'orange' },
              { id: 'environment', label: '🌫️ Environnement', color: 'amber' },
              { id: 'discovery', label: '💎 Découvertes', color: 'purple' }
            ].map((cat) => {
              const active = settings.selectedCategories.includes(cat.id as RandomEventCategory);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id as RandomEventCategory)}
                  className={`p-1.5 rounded border font-bold transition flex items-center justify-between ${
                    active
                      ? 'bg-white/10 border-cyan-400 text-cyan-300'
                      : 'bg-black/40 border-white/10 text-slate-500 line-through'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span>{active ? '✓' : '✗'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Big Trigger Button & Manual Catalogue */}
      <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/10 pb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Play className="w-4 h-4 text-orange-400" />
            Déclenchement Manuel d'Événements
          </span>

          <button
            onClick={() => onTriggerRandomEvent()}
            className="w-full sm:w-auto px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,168,34,0.15)]"
          >
            <Dices className="w-4 h-4 text-orange-400 animate-spin" />
            [ 🎲 DÉCLENCHER ÉVÉNEMENT ALÉATOIRE ]
          </button>
        </div>

        {/* Catalogue Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtrer:
          </span>
          {['all', 'communication', 'system', 'environment', 'discovery'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedCategoryFilter(f)}
              className={`px-2.5 py-1 rounded border font-bold capitalize transition whitespace-nowrap ${
                selectedCategoryFilter === f
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Tous (' + CATALOGUE_RANDOM_EVENTS.length + ')' : f}
            </button>
          ))}
        </div>

        {/* Catalogue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1">
          {filteredCatalogue.map((evt) => (
            <div
              key={evt.id}
              className="bg-black/40 border border-white/10 p-2.5 rounded-lg space-y-1.5 flex flex-col justify-between hover:border-orange-500/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{evt.icon}</span>
                    <span className="truncate">{evt.title}</span>
                  </span>
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                    {evt.severity}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {evt.description}
                </p>
              </div>

              <button
                onClick={() => onTriggerRandomEvent(evt.id)}
                className="w-full py-1 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/40 text-slate-300 hover:text-orange-300 text-[10px] font-bold rounded transition flex items-center justify-center gap-1"
              >
                <span>[ Lancer cet événement ]</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Events & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Currently Active Events Manager */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Événements Actifs en Cours ({activeEvents.filter((e) => !e.resolved).length})
            </span>
          </div>

          <div className="space-y-2 max-h-[160px] overflow-y-auto">
            {activeEvents.filter((e) => !e.resolved).length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 bg-black/40 rounded border border-white/5">
                Aucun événement aléatoire actif pour le moment.
              </div>
            ) : (
              activeEvents
                .filter((e) => !e.resolved)
                .map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-black/40 border border-cyan-500/30 p-2.5 rounded-lg flex items-center justify-between text-xs gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{evt.icon}</span>
                        <span>{evt.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Restant: <span className="text-cyan-300 font-bold">{evt.remainingSeconds}s</span> · {evt.triggeredBy === 'auto' ? 'Auto' : 'Manuel'}
                      </div>
                    </div>

                    <button
                      onClick={() => onResolveEvent(evt.id)}
                      className="px-2.5 py-1 bg-green-500/20 border border-green-500/40 text-green-300 text-[10px] font-bold rounded hover:bg-green-500/30 transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Résoudre
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* History Log */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
              Historique des Événements ({eventHistory.length})
            </span>
            {eventHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[10px] text-slate-400 hover:text-white underline"
              >
                Effacer
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-[160px] overflow-y-auto text-xs font-mono">
            {eventHistory.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 bg-black/40 rounded border border-white/5">
                Historique vide.
              </div>
            ) : (
              eventHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 border border-white/5 p-2 rounded flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-slate-300 font-bold">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-500">{item.timestamp}</span>
                    <span className={item.resolved ? 'text-green-400' : 'text-orange-400'}>
                      {item.resolved ? 'Résolu' : 'En cours'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
