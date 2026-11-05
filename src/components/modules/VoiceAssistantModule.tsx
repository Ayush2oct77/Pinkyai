import React, { useState, useEffect } from 'react';
import { AnimatedOrb } from '../AnimatedOrb';
import { voiceEngine, VoiceLanguage } from '../../services/voiceService';
import { askPinkyAI } from '../../services/aiService';
import { Mic, MicOff, Volume2, VolumeX, Sliders, Play, CheckCircle2, Languages, Sparkles, Database } from 'lucide-react';
import { ActiveModule } from '../../types';

interface VoiceAssistantModuleProps {
  onSelectModule: (module: ActiveModule) => void;
  onlineMode: boolean;
  onToggleOnlineMode: () => void;
}

export const VoiceAssistantModule: React.FC<VoiceAssistantModuleProps> = ({
  onSelectModule,
  onlineMode,
  onToggleOnlineMode,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentLang, setCurrentLang] = useState<VoiceLanguage>('hi-IN');
  const [lastResponse, setLastResponse] = useState(
    "नमस्ते! मैं पिंकी हूँ (Pinky AI)। 'नमस्ते पिंकी' या 'हेलो पिंकी' बोलिए, या नीचे दिए गए वॉयस कमांड्स पर टैप कीजिए।"
  );
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.1);

  useEffect(() => {
    voiceEngine.voiceSpeed = speed;
    voiceEngine.voicePitch = pitch;
    const unsub = voiceEngine.subscribeLanguage((lang) => {
      setCurrentLang(lang);
    });
    return () => unsub();
  }, [speed, pitch]);

  const toggleLanguage = (lang: VoiceLanguage) => {
    setCurrentLang(lang);
    voiceEngine.setLanguage(lang);
    if (lang === 'hi-IN') {
      const greeting = "नमस्ते! मैं पिंकी हूँ। अब मैं हिंदी में बात करने के लिए तैयार हूँ। आप कैसे हैं?";
      setLastResponse(greeting);
      speak(greeting, 'hi-IN');
    } else {
      const greeting = "Hello! Pinky voice language switched to English. How can I help you today?";
      setLastResponse(greeting);
      speak(greeting, 'en-US');
    }
  };

  const toggleListen = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
    } else {
      voiceEngine.startListening(
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            handleVoiceCommand(text);
          }
        },
        (listening) => setIsListening(listening),
        currentLang
      );
    }
  };

  const handleVoiceCommand = async (command: string) => {
    const c = command.toLowerCase();

    // Cache cleanup command
    if (c.includes('cache') || c.includes('कैशे') || c.includes('साफ़') || c.includes('clean')) {
      const res = await askPinkyAI(command, onlineMode ? 'online' : 'offline', 'storage', currentLang);
      speak(res.text, currentLang);
      return;
    }

    if (c.includes('instagram') || c.includes('इंस्टाग्राम')) {
      respondAndNavigate(
        currentLang === 'hi-IN' ? "इंस्टाग्राम रील्स एआई खोला जा रहा है।" : "Opening Instagram and Reels AI assistant.",
        'instagram'
      );
      return;
    }
    if (c.includes('message') || c.includes('संदेश')) {
      respondAndNavigate(
        currentLang === 'hi-IN' ? "स्मार्ट मैसेज असिस्टेंट खोला जा रहा है।" : "Opening Smart Message Assistant.",
        'messages'
      );
      return;
    }
    if (c.includes('assignment') || c.includes('solve') || c.includes('असाइनमेंट') || c.includes('हल')) {
      respondAndNavigate(
        currentLang === 'hi-IN' ? "असाइनमेंट सॉल्वर खोला जा रहा है।" : "Opening Assignment Solver.",
        'assignment'
      );
      return;
    }
    if (c.includes('location') || c.includes('लोकेशन')) {
      respondAndNavigate(
        currentLang === 'hi-IN' ? "सुरक्षित जीपीएस निर्देशांक प्राप्त किए जा रहे हैं।" : "Retrieving secure GPS coordinates.",
        'location'
      );
      return;
    }
    if (c.includes('screen') || c.includes('share') || c.includes('स्क्रीन')) {
      respondAndNavigate(
        currentLang === 'hi-IN' ? "मीडिया प्रोजेक्शन स्क्रीन शेयरिंग शुरू की जा रही है।" : "Initiating MediaProjection screen sharing.",
        'screen'
      );
      return;
    }
    if (c.includes('offline') || c.includes('ऑफलाइन')) {
      onToggleOnlineMode();
      speak(
        currentLang === 'hi-IN' ? "ऑन-डिवाइस ऑफलाइन मोड में बदला जा रहा है।" : "Switching to on-device offline mode.",
        currentLang
      );
      return;
    }

    // Default conversational AI execution in current language
    const res = await askPinkyAI(command, onlineMode ? 'online' : 'offline', undefined, currentLang);
    speak(res.text, currentLang);
  };

  const speak = (text: string, lang?: VoiceLanguage) => {
    setLastResponse(text);
    setIsSpeaking(true);
    voiceEngine.speak(text, () => setIsSpeaking(false), lang || currentLang);
  };

  const respondAndNavigate = (text: string, module: ActiveModule) => {
    speak(text);
    setTimeout(() => {
      onSelectModule(module);
    }, 1600);
  };

  const hindiShortcuts = [
    { label: "नमस्ते पिंकी! (Hello Pinky)", action: () => handleVoiceCommand("नमस्ते पिंकी, आप कैसी हैं?") },
    { label: "हेलो पिंकी, रूम कैशे साफ़ करो (Clear Cache)", action: () => handleVoiceCommand("पिंकी, रूम डेटाबेस का कैशे साफ़ करो") },
    { label: "पिंकी, मेरे संदेश पढ़ो (Read Messages)", target: 'messages' as ActiveModule },
    { label: "पिंकी, इंस्टाग्राम रील्स खोलो (Open Instagram)", target: 'instagram' as ActiveModule },
    { label: "पिंकी, भौतिकी असाइनमेंट हल करो (Solve Physics)", target: 'assignment' as ActiveModule },
    { label: "पिंकी, मेरी लोकेशन दिखाओ (Show Location)", target: 'location' as ActiveModule },
  ];

  const englishShortcuts = [
    { label: "Hey Pinky, clear Room database cache", action: () => handleVoiceCommand("Clear expired conversation cache from Room DB") },
    { label: "Hey Pinky, read my messages", target: 'messages' as ActiveModule },
    { label: "Hey Pinky, open Instagram Reels", target: 'instagram' as ActiveModule },
    { label: "Hey Pinky, solve my assignment", target: 'assignment' as ActiveModule },
    { label: "Hey Pinky, show my location", target: 'location' as ActiveModule },
    { label: "Hey Pinky, switch to offline mode", action: () => onToggleOnlineMode() },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Language selector toggle header */}
        <div className="w-full flex items-center justify-between border-b border-pink-500/15 pb-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-200">
            <Languages className="w-4 h-4 text-pink-400" />
            <span>Voice Language / भाषा:</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-pink-500/20">
            <button
              onClick={() => toggleLanguage('hi-IN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentLang === 'hi-IN'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => toggleLanguage('en-US')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentLang === 'en-US'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              English (US)
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-display font-bold text-white mb-1">
          {currentLang === 'hi-IN' ? 'पिंकी वॉयस असिस्टेंट' : 'Pinky Voice Assistant'}
        </h2>
        <div className="text-xs text-purple-200/60 font-mono mb-6">
          <span>{currentLang === 'hi-IN' ? 'हिंदी वॉयस रिकॉग्निशन (hi-IN)' : 'Continuous Speech Recognition (en-US)'}</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>{currentLang === 'hi-IN' ? 'वॉयस पिच और गति कैलिब्रेशन' : 'Configurable Assistant Voice'}</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>{currentLang === 'hi-IN' ? 'वेक-वर्ड: "नमस्ते पिंकी"' : 'Wake-Word: "Hey Pinky"'}</span>
        </div>

        {/* Central Orb */}
        <div className="my-3">
          <AnimatedOrb
            size="lg"
            isListening={isListening}
            isSpeaking={isSpeaking}
            onClick={toggleListen}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={toggleListen}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-pink-500/25'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? (currentLang === 'hi-IN' ? 'सुनना बंद करें' : 'Stop Listening') : (currentLang === 'hi-IN' ? 'बोलने के लिए टैप करें' : 'Tap to Speak')}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={() => {
                voiceEngine.stopSpeaking();
                setIsSpeaking(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-900/60 border border-purple-500/30 text-purple-200 hover:text-white text-sm flex items-center gap-2 transition-all"
            >
              <VolumeX className="w-4 h-4" />
              <span>{currentLang === 'hi-IN' ? 'आवाज़ रोकें' : 'Interrupt / Stop'}</span>
            </button>
          )}
        </div>

        {/* Live speech feedback */}
        <div className="mt-6 w-full max-w-lg bg-black/40 border border-pink-500/15 rounded-xl p-4 text-left">
          <div className="flex items-center justify-between text-xs text-purple-300/70 font-mono mb-2">
            <span>{currentLang === 'hi-IN' ? 'भाषण पहचान (Speech Recognition):' : 'Speech Recognition Stream:'}</span>
            {transcript && <span className="text-pink-400 font-semibold">{currentLang === 'hi-IN' ? 'ट्रांसक्राइब हो रहा है...' : 'Transcribing...'}</span>}
          </div>
          <p className="text-sm text-white min-h-[24px]">
            {transcript || (
              <span className="text-purple-300/40 italic">
                {currentLang === 'hi-IN'
                  ? 'अभी बोलिए... (उदा. "नमस्ते पिंकी, कैशे साफ़ करो" या "हेलो पिंकी")'
                  : 'Speak now... (e.g. "Hey Pinky, clear Room database cache")'}
              </span>
            )}
          </p>

          <div className="mt-3 pt-3 border-t border-purple-500/10 text-xs text-purple-200/90">
            <span className="font-semibold text-pink-400">पिंकी एआई (Pinky): </span>
            <span className="leading-relaxed">{lastResponse}</span>
          </div>
        </div>
      </div>

      {/* Shortcuts & Voice Tuning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Parameters Card */}
        <div className="glass-panel-subtle rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-white">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-pink-400" />
              <span>{currentLang === 'hi-IN' ? 'आवाज़ गति और सुर ट्यूनिंग' : 'Voice Pitch & Rate Calibration'}</span>
            </div>
            <span className="text-xs font-mono text-purple-300 px-2 py-0.5 rounded bg-black/40">
              {currentLang}
            </span>
          </div>

          <div className="space-y-3 text-xs text-purple-200/80">
            <div>
              <div className="flex justify-between mb-1">
                <span>{currentLang === 'hi-IN' ? 'बोलने की गति' : 'Speaking Rate'} ({speed}x)</span>
                <span className="font-mono text-pink-400">{speed}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>{currentLang === 'hi-IN' ? 'पिच (स्वर टोन)' : 'Pitch Tone'} ({pitch}x)</span>
                <span className="font-mono text-purple-400">{pitch}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <button
              onClick={() =>
                speak(
                  currentLang === 'hi-IN'
                    ? "नमस्ते! मैं पिंकी हूँ। मेरी आवाज़ अब हिंदी में एकदम स्पष्ट और सुरीली है।"
                    : "Hello! My vocal synthesis is calibrated for low latency and high clarity.",
                  currentLang
                )
              }
              className="w-full py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi-IN' ? 'हिंदी आवाज़ का परीक्षण करें' : 'Test Current Voice'}</span>
            </button>
          </div>
        </div>

        {/* Shortcuts / Router */}
        <div className="glass-panel-subtle rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Play className="w-4 h-4 text-purple-400" />
            <span>{currentLang === 'hi-IN' ? 'हिंदी वॉयस कमांड्स (Voice Commands)' : 'Voice Command Router'}</span>
          </div>
          <p className="text-xs text-purple-200/60">
            {currentLang === 'hi-IN'
              ? 'टैप करें या सीधे बोलें (हे / हेलो / नमस्ते पिंकी):'
              : 'Tap to simulate or speak any Android intent trigger:'}
          </p>

          <div className="space-y-1.5">
            {(currentLang === 'hi-IN' ? hindiShortcuts : englishShortcuts).map((cmd, i) => (
              <button
                key={i}
                onClick={() => {
                  setTranscript(cmd.label);
                  if (cmd.action) cmd.action();
                  else if (cmd.target) respondAndNavigate(`Navigating to ${cmd.target}`, cmd.target);
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/15 text-xs text-purple-200 flex items-center justify-between group transition-colors"
              >
                <span>"{cmd.label}"</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
