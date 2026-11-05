import React, { useState, useEffect } from 'react';
import { ActiveModule, DeviceHealth } from './types';
import { fetchDeviceHealth } from './services/deviceService';
import { voiceEngine, VoiceLanguage } from './services/voiceService';
import { TopNavigation } from './components/TopNavigation';
import { HomeDashboard } from './components/modules/HomeDashboard';
import { AIChatModule } from './components/modules/AIChatModule';
import { VoiceAssistantModule } from './components/modules/VoiceAssistantModule';
import { MessagesModule } from './components/modules/MessagesModule';
import { InstagramModule } from './components/modules/InstagramModule';
import { RedditModule } from './components/modules/RedditModule';
import { AssignmentSolverModule } from './components/modules/AssignmentSolverModule';
import { LocationModule } from './components/modules/LocationModule';
import { ScreenSharingModule } from './components/modules/ScreenSharingModule';
import { PhoneInfoModule } from './components/modules/PhoneInfoModule';
import { PhotoEditorModule } from './components/modules/PhotoEditorModule';
import { SmartAutomationModule } from './components/modules/SmartAutomationModule';
import { ContactsModule } from './components/modules/ContactsModule';
import { PrivacyCenterModule } from './components/modules/PrivacyCenterModule';
import { CodeStudioModule } from './components/modules/CodeStudioModule';
import {
  Home,
  MessageSquare,
  Mic,
  Camera,
  Share2,
  FileSpreadsheet,
  MapPin,
  ScreenShare,
  Battery,
  Sliders,
  ShieldCheck,
  Code2
} from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [onlineMode, setOnlineMode] = useState<boolean>(true);
  const [emergencyStop, setEmergencyStop] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<VoiceLanguage>('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [deviceHealth, setDeviceHealth] = useState<DeviceHealth>({
    batteryLevel: 84,
    isCharging: false,
    batteryTempC: 31.8,
    cpuTempC: 42.1,
    isOnline: true,
    screenStreamActive: false,
    latitude: 37.7749,
    longitude: -122.4194,
    accuracyMeters: 8.5,
  });

  useEffect(() => {
    fetchDeviceHealth().then(setDeviceHealth);
    const unsubscribe = voiceEngine.subscribeLanguage(setCurrentLanguage);
    return () => unsubscribe();
  }, []);

  const handleOrbClick = () => {
    setActiveModule('voice');
  };

  const handleToggleOnlineMode = () => {
    setOnlineMode((prev) => !prev);
  };

  const handleToggleLanguage = () => {
    const nextLang: VoiceLanguage = currentLanguage === 'hi-IN' ? 'en-US' : 'hi-IN';
    setCurrentLanguage(nextLang);
    voiceEngine.setLanguage(nextLang);
    const confirmation =
      nextLang === 'hi-IN'
        ? "नमस्ते! पिंकी वॉयस भाषा अब हिंदी में सेट है।"
        : "Pinky voice language switched to English.";
    voiceEngine.speak(confirmation, undefined, nextLang);
  };

  const handleTriggerEmergencyStop = () => {
    setEmergencyStop((prev) => {
      const next = !prev;
      if (next) {
        voiceEngine.stopSpeaking();
        voiceEngine.stopListening();
        setIsSpeaking(false);
        setIsListening(false);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#06040a] text-purple-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Bar Contract Compliant Header */}
      <TopNavigation
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onlineMode={onlineMode}
        onToggleOnlineMode={handleToggleOnlineMode}
        emergencyStop={emergencyStop}
        onTriggerEmergencyStop={handleTriggerEmergencyStop}
        currentLanguage={currentLanguage}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Emergency Stop Active Warning Banner */}
      {emergencyStop && (
        <div className="bg-red-600/90 text-white px-6 py-2 text-center text-xs font-mono font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>EMERGENCY STOP ACTIVE — ALL AUTOMATIONS, SOCIAL PUBLISHING, AND SENSORS SUSPENDED</span>
        </div>
      )}

      {/* Module Navigation Ribbon */}
      <div className="px-6 py-2.5 bg-black/40 border-b border-pink-500/10 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <NavPill
          icon={<Home className="w-3.5 h-3.5" />}
          label="Dashboard"
          active={activeModule === 'home'}
          onClick={() => setActiveModule('home')}
        />
        <NavPill
          icon={<MessageSquare className="w-3.5 h-3.5" />}
          label="AI Chat"
          active={activeModule === 'chat'}
          onClick={() => setActiveModule('chat')}
        />
        <NavPill
          icon={<Mic className="w-3.5 h-3.5" />}
          label="Voice"
          active={activeModule === 'voice'}
          onClick={() => setActiveModule('voice')}
        />
        <NavPill
          icon={<Camera className="w-3.5 h-3.5" />}
          label="Instagram AI"
          active={activeModule === 'instagram'}
          onClick={() => setActiveModule('instagram')}
        />
        <NavPill
          icon={<Share2 className="w-3.5 h-3.5" />}
          label="Reddit AI"
          active={activeModule === 'reddit'}
          onClick={() => setActiveModule('reddit')}
        />
        <NavPill
          icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
          label="Assignment Solver"
          active={activeModule === 'assignment'}
          onClick={() => setActiveModule('assignment')}
        />
        <NavPill
          icon={<MapPin className="w-3.5 h-3.5" />}
          label="Location GPS"
          active={activeModule === 'location'}
          onClick={() => setActiveModule('location')}
        />
        <NavPill
          icon={<ScreenShare className="w-3.5 h-3.5" />}
          label="Screen Share"
          active={activeModule === 'screen'}
          onClick={() => setActiveModule('screen')}
        />
        <NavPill
          icon={<Battery className="w-3.5 h-3.5" />}
          label="Phone & Battery"
          active={activeModule === 'phoneinfo'}
          onClick={() => setActiveModule('phoneinfo')}
        />
        <NavPill
          icon={<Sliders className="w-3.5 h-3.5" />}
          label="Automation"
          active={activeModule === 'automation'}
          onClick={() => setActiveModule('automation')}
        />
        <NavPill
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          label="Privacy Center"
          active={activeModule === 'privacy'}
          onClick={() => setActiveModule('privacy')}
        />
        <NavPill
          icon={<Code2 className="w-3.5 h-3.5" />}
          label="Android Project Hub"
          active={activeModule === 'studio'}
          onClick={() => setActiveModule('studio')}
        />
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {activeModule === 'home' && (
          <HomeDashboard
            onSelectModule={setActiveModule}
            onlineMode={onlineMode}
            deviceHealth={deviceHealth}
            isSpeaking={isSpeaking}
            isListening={isListening}
            onOrbClick={handleOrbClick}
          />
        )}
        {activeModule === 'chat' && (
          <AIChatModule
            onlineMode={onlineMode}
            onToggleOnlineMode={handleToggleOnlineMode}
          />
        )}
        {activeModule === 'voice' && (
          <VoiceAssistantModule
            onSelectModule={setActiveModule}
            onlineMode={onlineMode}
            onToggleOnlineMode={handleToggleOnlineMode}
          />
        )}
        {activeModule === 'messages' && <MessagesModule />}
        {activeModule === 'instagram' && <InstagramModule />}
        {activeModule === 'reddit' && <RedditModule />}
        {activeModule === 'contacts' && <ContactsModule />}
        {activeModule === 'assignment' && <AssignmentSolverModule />}
        {activeModule === 'location' && <LocationModule />}
        {activeModule === 'screen' && <ScreenSharingModule />}
        {activeModule === 'photoeditor' && <PhotoEditorModule />}
        {activeModule === 'phoneinfo' && <PhoneInfoModule />}
        {activeModule === 'automation' && <SmartAutomationModule />}
        {activeModule === 'privacy' && (
          <PrivacyCenterModule
            emergencyStop={emergencyStop}
            onToggleEmergencyStop={handleTriggerEmergencyStop}
          />
        )}
        {activeModule === 'studio' && <CodeStudioModule />}
      </main>

      {/* Footer Notice */}
      <footer className="px-6 py-4 border-t border-purple-500/15 text-center text-xs text-purple-300/50 font-mono">
        PINKY AI · Android Studio Hedgehog & Ladybug · Material 3 Glassmorphism · Room SQLite & PostgreSQL
      </footer>
    </div>
  );
}

interface NavPillProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavPill: React.FC<NavPillProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
        active
          ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-300 border border-pink-500/50 font-semibold'
          : 'text-purple-300/70 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
