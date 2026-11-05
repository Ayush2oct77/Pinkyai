import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { askPinkyAI } from '../../services/aiService';
import { voiceEngine } from '../../services/voiceService';
import { Send, Volume2, Sparkles, Cpu, RotateCcw, Copy, Check } from 'lucide-react';

interface AIChatModuleProps {
  onlineMode: boolean;
  onToggleOnlineMode: () => void;
}

export const AIChatModule: React.FC<AIChatModuleProps> = ({
  onlineMode,
  onToggleOnlineMode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'pinky',
      text: "Hello! I am Pinky AI, your Android neural assistant. I can help solve complex physics/math equations, moderate your Instagram comments, read messages safely, draft code, or answer questions offline. What would you like to explore?",
      timestamp: 'Just now',
      model: 'online-claude',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: onlineMode ? 'online-claude' : 'offline-local',
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askPinkyAI(userText, onlineMode ? 'online' : 'offline');
      const pinkyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'pinky',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response.source,
      };
      setMessages((prev) => [...prev, pinkyMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'pinky',
          text: "I encountered a network hiccup. Switching to offline deterministic mode. All local capabilities remain active.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'offline-local',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakMessage = (text: string) => {
    voiceEngine.speak(text);
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    "नमस्ते पिंकी! आप कैसी हैं?",
    "Clear expired temporary AI conversation cache from Room DB",
    "पिंकी, रूम डेटाबेस का कैशे साफ़ करो",
    "Solve d/dx [x^3 * sin(x)] step-by-step",
    "Explain difference between battery temp and room temp in Android",
    "Draft a polite Instagram reply to a fan compliment",
  ];

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[76vh] max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-pink-500/15 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-white">AI Neural Chat</h2>
            <div className="text-xs text-purple-200/60 flex items-center gap-2">
              <span>{onlineMode ? 'Claude 3.7 Online Gateway' : 'On-Device GGUF Engine'}</span>
              <span aria-hidden="true">·</span>
              <span>Encrypted Room Local Storage</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOnlineMode}
            className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all flex items-center gap-1.5 ${
              onlineMode
                ? 'bg-pink-950/40 text-pink-300 border-pink-500/30 hover:bg-pink-900/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{onlineMode ? 'Online Mode' : 'Offline Mode'}</span>
          </button>
          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-purple-300/60 font-mono">
              <span>{msg.sender === 'user' ? 'You' : 'Pinky AI'}</span>
              <span aria-hidden="true">·</span>
              <span>{msg.timestamp}</span>
              <span aria-hidden="true">·</span>
              <span>{msg.model === 'online-claude' ? 'Cloud' : 'Local'}</span>
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-tr-none shadow-md shadow-pink-600/10'
                  : 'bg-purple-950/40 border border-purple-500/20 text-purple-100 rounded-tl-none backdrop-blur-md'
              }`}
            >
              {msg.text}

              {msg.sender === 'pinky' && (
                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-purple-500/10 text-xs text-purple-300/70">
                  <button
                    onClick={() => speakMessage(msg.text)}
                    className="flex items-center gap-1 hover:text-pink-300 transition-colors"
                    title="Speak aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Aloud</span>
                  </button>
                  <button
                    onClick={() => copyText(msg.id, msg.text)}
                    className="flex items-center gap-1 hover:text-pink-300 transition-colors"
                    title="Copy answer"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-pink-400 font-mono animate-pulse">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Pinky AI is synthesizing response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts chips */}
      <div className="px-6 py-2 border-t border-pink-500/10 bg-black/20 flex gap-2 overflow-x-auto text-xs no-scrollbar">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-purple-200 border border-pink-500/20 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-4 border-t border-pink-500/15 bg-black/40 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={onlineMode ? "Ask Pinky anything (Claude 3.7 Online)..." : "Ask Pinky (On-Device Local AI)..."}
          className="flex-1 bg-purple-950/40 border border-pink-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500/60 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 transition-all shadow-md shadow-pink-500/20"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
