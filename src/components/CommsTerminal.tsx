import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Trash2,
  Zap,
  Volume2
} from 'lucide-react';
import { CommsMessage } from '../types';

export const CommsTerminal: React.FC = () => {
  const [persona, setPersona] = useState<'fixer' | 'hacker' | 'archivist' | 'sysadmin'>('fixer');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<CommsMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      persona: 'Vic "The Fixer"',
      text: "Comms link online. I'm Vic—your eye in the sky across Vice City and the Keys. Whether you need an amphibious escape route through Biscayne or advice on which Port Gellhorn chop shop pays highest, tell me what you're planning.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const quickPrompts = [
    'How do I lose a 4-star wanted level in the Everglades?',
    'What are the best locations to find exotic sports cars in Vice City?',
    'How do I make the first million dollars in Leonida?',
    'Explain how predictive pathing vectors intercept high-speed getaways',
    'Where is the sunken Spanish galleon in the Florida Keys?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: CommsMessage = {
      id: 'msg-' + Date.now(),
      sender: 'player',
      persona: 'Operator',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          persona,
        }),
      });
      const data = await res.json();

      let personaName = 'Vic "The Fixer"';
      if (persona === 'hacker') personaName = 'Nyx (Cyber Hacker)';
      if (persona === 'archivist') personaName = 'Prof. Diaz (Lore Archivist)';
      if (persona === 'sysadmin') personaName = 'Sovereign Orchestrator';

      const aiMsg: CommsMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        persona: personaName,
        text: data.reply,
        timestamp: new Date().toLocaleTimeString(),
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init-' + Date.now(),
        sender: 'ai',
        persona: 'Comms Link',
        text: 'Frequency cleared. Standing by for tactical queries.',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>Encrypted Direct Tactical Link // Voice Persona Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            VICE COMMS TERMINAL
          </h2>
          <p className="text-xs text-slate-400">
            Real-time interactive gameplay companion with persona switching and tactical Leonida intelligence.
          </p>
        </div>

        {/* Persona Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {[
            { id: 'fixer', label: 'Vic (Fixer)', color: 'text-amber-400' },
            { id: 'hacker', label: 'Nyx (Hacker)', color: 'text-cyan-400' },
            { id: 'archivist', label: 'Diaz (Archivist)', color: 'text-emerald-400' },
            { id: 'sysadmin', label: 'Sovereign (DevOps)', color: 'text-purple-400' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id as any)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                persona === p.id
                  ? 'bg-pink-600/25 border-pink-500 text-pink-300 font-bold shadow-[0_0_10px_rgba(255,42,133,0.2)]'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={p.color}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-950/90 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Terminal Header */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-semibold">ENCRYPTED CHANNEL 104.7 MHZ</span>
            <span className="text-slate-600">//</span>
            <span className="text-pink-400 font-bold uppercase">{persona} ACTIVE</span>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="text-slate-500 hover:text-rose-400 p-1 flex items-center space-x-1"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Clear Log</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'player';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-mono font-bold ${
                    isUser
                      ? 'bg-pink-950 border-pink-500/40 text-pink-300'
                      : 'bg-slate-900 border-cyan-500/40 text-cyan-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${isUser ? 'items-end' : ''}`}>
                  <div className={`flex items-center space-x-2 font-mono text-[10px] text-slate-500 ${isUser ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-slate-300">{msg.persona}</span>
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="text-emerald-500/80">({msg.source})</span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/40 text-white rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-lg">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 animate-spin text-pink-400" />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl rounded-tl-none font-mono text-xs text-slate-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                <span>Transmitting tactical response across Leonida network...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="border-t border-slate-800/80 bg-slate-900/40 px-3 py-2 overflow-x-auto flex gap-2 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-slate-400 hover:text-slate-200 text-[11px] font-mono whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder={`Ask ${persona === 'fixer' ? 'Vic' : persona === 'hacker' ? 'Nyx' : persona === 'archivist' ? 'Prof. Diaz' : 'Sovereign'} about missions, mechanics, or routes...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Transmit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
