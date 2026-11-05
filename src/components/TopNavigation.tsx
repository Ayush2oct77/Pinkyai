import React from 'react';
import { ActiveModule } from '../types';
import { Code, ShieldAlert, Cpu, Languages } from 'lucide-react';
import { VoiceLanguage } from '../services/voiceService';

interface TopNavigationProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onlineMode: boolean;
  onToggleOnlineMode: () => void;
  emergencyStop: boolean;
  onTriggerEmergencyStop: () => void;
  currentLanguage: VoiceLanguage;
  onToggleLanguage: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeModule,
  onSelectModule,
  onlineMode,
  onToggleOnlineMode,
  emergencyStop,
  onTriggerEmergencyStop,
  currentLanguage,
  onToggleLanguage,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-pink-500/20 bg-[#07040a]/90 backdrop-blur-xl sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectModule('home')}
        className="text-xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-purple-400 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
      >
        PINKY AI
      </button>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-purple-200/80">
        <button
          onClick={() => onSelectModule('home')}
          className={`hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'home' ? 'text-pink-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectModule('chat')}
          className={`hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'chat' ? 'text-pink-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          AI Chat
        </button>
        <button
          onClick={() => onSelectModule('voice')}
          className={`hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'voice' ? 'text-pink-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Voice Assistant
        </button>
        <button
          onClick={() => onSelectModule('assignment')}
          className={`hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'assignment' ? 'text-pink-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Assignment Solver
        </button>
        <button
          onClick={() => onSelectModule('instagram')}
          className={`hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'instagram' ? 'text-pink-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Social AI
        </button>
        <button
          onClick={() => onSelectModule('privacy')}
          className={`hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'privacy' ? 'text-pink-400 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Privacy Center
        </button>
      </nav>

      {/* Zone 3: 1 primary action / controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Language Locale Switcher (English vs Hindi) */}
        <button
          onClick={onToggleLanguage}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            currentLanguage === 'hi-IN'
              ? 'bg-gradient-to-r from-pink-900/60 to-purple-900/60 text-pink-300 border-pink-500/50 hover:bg-pink-800/40'
              : 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/40'
          }`}
          title="Toggle Voice and UI Locale (हिन्दी vs English)"
        >
          <Languages className="w-3.5 h-3.5 text-pink-400" />
          <span>{currentLanguage === 'hi-IN' ? 'भाषा: हिन्दी' : 'Lang: EN'}</span>
        </button>

        {/* Mode Toggle Button */}
        <button
          onClick={onToggleOnlineMode}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            onlineMode
              ? 'bg-pink-950/60 text-pink-300 border-pink-500/40 hover:bg-pink-900/40'
              : 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900/40'
          }`}
          title="Switch between Claude 3.7 Online Gateway and Local On-Device Neural Engine"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{onlineMode ? 'Online (Claude)' : 'Offline (Local)'}</span>
        </button>

        {/* Emergency Stop Switch */}
        <button
          onClick={onTriggerEmergencyStop}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            emergencyStop
              ? 'bg-red-600 text-white border-red-500 animate-pulse'
              : 'bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-900/50'
          }`}
          title="Instant Emergency Kill-Switch: halts all auto-replies, screen shares, and scheduled actions"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{emergencyStop ? 'SYSTEM HALTED' : 'Emergency Stop'}</span>
        </button>

        {/* Project Studio View */}
        <button
          onClick={() => onSelectModule('studio')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeModule === 'studio'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 ring-2 ring-pink-400'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Android Studio Code Hub</span>
        </button>
      </div>
    </header>
  );
};
