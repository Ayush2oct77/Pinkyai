import React from 'react';
import { ActiveModule, DeviceHealth } from '../../types';
import { AnimatedOrb } from '../AnimatedOrb';
import {
  MessageSquare,
  Mic,
  Instagram,
  FileSpreadsheet,
  MapPin,
  ScreenShare,
  Image,
  Battery,
  Sliders,
  ShieldCheck,
  Flame,
  Wifi,
  WifiOff,
  UserCheck,
  Bot,
  HardDrive
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectModule: (module: ActiveModule) => void;
  onlineMode: boolean;
  deviceHealth: DeviceHealth;
  isSpeaking: boolean;
  isListening: boolean;
  onOrbClick: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectModule,
  onlineMode,
  deviceHealth,
  isSpeaking,
  isListening,
  onOrbClick,
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Glass Section with Animated Orb */}
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden text-center flex flex-col items-center justify-center">
        {/* Background ambient radial gradients */}
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono text-pink-300 mb-3">
          <span>Android Jetpack Compose</span>
          <span aria-hidden="true">·</span>
          <span>Claude 3.7 + On-Device GGUF</span>
          <span aria-hidden="true">·</span>
          <span>Room & PostgreSQL</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-2">
          Hello! नमस्ते! I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">PINKY AI</span>
        </h1>
        <p className="text-sm md:text-base text-purple-200/70 max-w-xl mx-auto mb-3">
          Your futuristic personal Android AI companion with multilingual voice intelligence (English & हिन्दी), automated social moderation, Room database cache maintenance, and zero-compromise privacy.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <button
            onClick={() => onSelectModule('voice')}
            className="px-3 py-1 rounded-full bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-xs text-pink-300 transition-colors flex items-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>वॉयस: "नमस्ते पिंकी" (Hindi Voice Active)</span>
          </button>
          <button
            onClick={() => onSelectModule('phoneinfo')}
            className="px-3 py-1 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-xs text-purple-300 transition-colors flex items-center gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5 text-pink-400" />
            <span>Room Cache Maintenance: Ready</span>
          </button>
        </div>

        {/* Central Glowing Orb */}
        <div className="my-2">
          <AnimatedOrb
            size="md"
            isListening={isListening}
            isSpeaking={isSpeaking}
            onClick={onOrbClick}
          />
        </div>

        <p className="text-xs font-mono text-purple-300/60 mt-3">
          {isListening
            ? 'Listening... Speak your command'
            : isSpeaking
            ? 'Pinky is speaking...'
            : 'Tap the orb or select a neural capability below'}
        </p>

        {/* Real-time Hardware Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-5 border-t border-purple-500/10 text-xs text-purple-200/80 font-mono">
          <div className="flex items-center gap-1.5">
            {onlineMode ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Network: {onlineMode ? 'Cloud Online' : 'Local Offline Mode'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Battery className="w-3.5 h-3.5 text-pink-400" />
            <span>Battery: {deviceHealth.batteryLevel}% {deviceHealth.isCharging ? '(Charging)' : ''}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>Battery Temp: {deviceHealth.batteryTempC}°C</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Room DB: Active</span>
          </div>
        </div>
      </div>

      {/* Module Navigation Cards Grid */}
      <div>
        <h2 className="text-lg font-display font-semibold text-white mb-4">
          Core Assistant Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModuleCard
            title="AI Chat"
            description="Deep reasoning, code review & translation"
            icon={<MessageSquare className="w-5 h-5 text-pink-400" />}
            status={onlineMode ? "Claude 3.7 Online" : "On-Device Model"}
            onClick={() => onSelectModule('chat')}
          />
          <ModuleCard
            title="Voice Assistant"
            description="Hands-free wake word & voice commands"
            icon={<Mic className="w-5 h-5 text-purple-400" />}
            status="STT / TTS Active"
            onClick={() => onSelectModule('voice')}
          />
          <ModuleCard
            title="Instagram & Reels"
            description="Sentiment analysis & auto-replies on own posts"
            icon={<Instagram className="w-5 h-5 text-pink-400" />}
            status="Meta Graph API"
            onClick={() => onSelectModule('instagram')}
          />
          <ModuleCard
            title="Reddit AI"
            description="Contextual thread drafting & anti-spam"
            icon={<Bot className="w-5 h-5 text-purple-400" />}
            status="OAuth 2.0"
            onClick={() => onSelectModule('reddit')}
          />
          <ModuleCard
            title="Assignment Solver"
            description="Step-by-step math, physics, & CS breakdowns"
            icon={<FileSpreadsheet className="w-5 h-5 text-pink-400" />}
            status="Formula Engine"
            onClick={() => onSelectModule('assignment')}
          />
          <ModuleCard
            title="Location Sharing"
            description="GPS coordinates & consent-based sharing tokens"
            icon={<MapPin className="w-5 h-5 text-purple-400" />}
            status="FusedLocationProvider"
            onClick={() => onSelectModule('location')}
          />
          <ModuleCard
            title="Screen Sharing"
            description="MediaProjection API with persistent notification"
            icon={<ScreenShare className="w-5 h-5 text-pink-400" />}
            status="Foreground Service"
            onClick={() => onSelectModule('screen')}
          />
          <ModuleCard
            title="AI Photo Editor"
            description="Cyberpunk filters, enhancement & canvas tools"
            icon={<Image className="w-5 h-5 text-purple-400" />}
            status="Canvas + GL Filters"
            onClick={() => onSelectModule('photoeditor')}
          />
          <ModuleCard
            title="Hardware Diagnostics"
            description="Distinguish battery temp from ambient room temp"
            icon={<Battery className="w-5 h-5 text-pink-400" />}
            status="Battery Broadcast"
            onClick={() => onSelectModule('phoneinfo')}
          />
          <ModuleCard
            title="Personal Contacts"
            description="Permission-guarded VIP allowlist & tone customizer"
            icon={<UserCheck className="w-5 h-5 text-purple-400" />}
            status="Least Privilege"
            onClick={() => onSelectModule('contacts')}
          />
          <ModuleCard
            title="Smart Automation"
            description="Configurable rule engine & auto-trigger policies"
            icon={<Sliders className="w-5 h-5 text-pink-400" />}
            status="WorkManager Sync"
            onClick={() => onSelectModule('automation')}
          />
          <ModuleCard
            title="Privacy Center"
            description="Audit trail, permission toggles & Room wipe"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
            status="Zero Dark Patterns"
            onClick={() => onSelectModule('privacy')}
          />
        </div>
      </div>
    </div>
  );
};

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: string;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon, status, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="glass-panel-subtle rounded-xl p-4.5 cursor-pointer hover:border-pink-500/40 hover:bg-purple-950/20 transition-all group flex flex-col justify-between min-h-[130px]"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <span className="text-[11px] font-mono text-purple-300/70">{status}</span>
        </div>
        <h3 className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-purple-200/60 mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};
