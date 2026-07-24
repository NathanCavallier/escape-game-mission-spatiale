import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, MessageSquare } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: string;
  contextData: any;
}

export const AIAssistantModal: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  activeRole,
  contextData
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Bonjour Opérateur Asteria-3 ! Je suis ASTRA-AI, votre assistant de vol et de simulation. Quelle est votre question technique ou le problème à diagnostiquer ?',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userText = inputPrompt;
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time }]);
    setInputPrompt('');
    setLoading(true);
    soundEngine.playRadioBeep();

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          role: activeRole,
          contextData
        })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || 'ASTRA-AI : Données reçues. Télémétrie nominale.',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      soundEngine.playRadioBeep();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'ASTRA-AI : Communication momentanément affaiblie. Vérifiez vos paramètres d\'entrée manuels.',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0c14] border border-white/10 rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl font-mono">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                ASTRA-AI · Assistant IA Mission
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h2>
              <p className="text-[10px] text-slate-400">IA Générative Embarquée (Gemini)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="h-[280px] overflow-y-auto space-y-2.5 p-3 bg-black/40 border border-white/10 rounded-lg text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border max-w-[90%] space-y-1 ${
                m.sender === 'user'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200 ml-auto'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-200'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span className={`font-bold ${m.sender === 'user' ? 'text-cyan-400' : 'text-purple-300'}`}>
                  {m.sender === 'user' ? 'OPÉRATEUR' : 'ASTRA-AI'}
                </span>
                <span>{m.time}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap font-sans text-slate-200">{m.text}</p>
            </div>
          ))}

          {loading && (
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 animate-pulse font-mono">
              ASTRA-AI calcule et analyse la télémétrie...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendPrompt} className="flex gap-2">
          <input
            type="text"
            placeholder="Poser une question à ASTRA-AI..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-purple-400 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Émettre</span>
          </button>
        </form>
      </div>
    </div>
  );
};
