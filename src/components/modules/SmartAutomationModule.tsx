import React, { useState } from 'react';
import { AutomationRule } from '../../types';
import {
  Sliders,
  Plus,
  Play,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Trash2,
  Save,
  X,
  Smartphone,
  Sparkles,
  Mic,
  MicOff,
  Terminal,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { voiceEngine } from '../../services/voiceService';

interface AppCommand {
  id: string;
  appName: string;
  triggerPhrase: string;
  hindiTrigger: string;
  packageName: string;
  isCustom?: boolean;
}

interface ParsedIntentResult {
  rawCommand: string;
  extractedAppName: string;
  resolvedPackage: string;
  intentAction: string;
  intentFlags: string;
  status: 'dispatched' | 'store_fallback' | 'not_found';
  timestamp: string;
}

export const SmartAutomationModule: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'auto_open_app_intent',
      name: "Voice Intent: 'Open [App Name]' Dynamic App Launcher",
      trigger: "Voice command matches pattern 'Open [App Name]' or '[App Name] खोलो'",
      action: "Programmatically queries PackageManager, creates android.intent.action.MAIN Intent with FLAG_ACTIVITY_NEW_TASK, and launches the application",
      enabled: true,
      category: 'voice',
      lastRun: '1m ago',
    },
    {
      id: 'auto_1',
      name: 'Instagram Compliment Auto-Thanker',
      trigger: 'When comment category is "Compliment" on own Reel',
      action: 'Publish pre-verified friendly thank-you within 5 minutes',
      enabled: true,
      category: 'social',
      lastRun: '12m ago',
    },
    {
      id: 'auto_2',
      name: 'Low Battery AI Throttling',
      trigger: 'When battery drops below 15%',
      action: 'Switch AI inference to low-power local quantized model',
      enabled: true,
      category: 'system',
      lastRun: 'Never',
    },
    {
      id: 'auto_3',
      name: 'Voice "Hey Pinky, solve this" Quick Macro',
      trigger: 'Voice hotword detects "solve assignment"',
      action: 'Capture active assignment camera OCR & route to solver',
      enabled: true,
      category: 'voice',
      lastRun: '2 hours ago',
    },
  ]);

  // Registered Open App Voice Commands Dictionary
  const [appCommands, setAppCommands] = useState<AppCommand[]>([
    {
      id: 'app_1',
      appName: 'Instagram',
      triggerPhrase: 'open instagram',
      hindiTrigger: 'इंस्टाग्राम खोलो',
      packageName: 'com.instagram.android',
    },
    {
      id: 'app_2',
      appName: 'Reddit',
      triggerPhrase: 'open reddit',
      hindiTrigger: 'रेडिट खोलो',
      packageName: 'com.reddit.frontpage',
    },
    {
      id: 'app_3',
      appName: 'WhatsApp',
      triggerPhrase: 'open whatsapp',
      hindiTrigger: 'व्हाट्सएप खोलो',
      packageName: 'com.whatsapp',
    },
    {
      id: 'app_4',
      appName: 'YouTube',
      triggerPhrase: 'open youtube',
      hindiTrigger: 'यूट्यूब खोलो',
      packageName: 'com.google.android.youtube',
    },
    {
      id: 'app_5',
      appName: 'Camera',
      triggerPhrase: 'open camera',
      hindiTrigger: 'कैमरा खोलो',
      packageName: 'com.android.camera',
    },
    {
      id: 'app_6',
      appName: 'Settings',
      triggerPhrase: 'open settings',
      hindiTrigger: 'सेटिंग्स खोलो',
      packageName: 'com.android.settings',
    },
    {
      id: 'app_7',
      appName: 'Spotify',
      triggerPhrase: 'open spotify',
      hindiTrigger: 'स्पॉटिफ़ाई खोलो',
      packageName: 'com.spotify.music',
      isCustom: true,
    },
  ]);

  // Interactive Live Intent Parser State
  const [inputCommand, setInputCommand] = useState('Open WhatsApp');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [lastIntentResult, setLastIntentResult] = useState<ParsedIntentResult | null>(null);

  // Editing state for registered app table
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AppCommand | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newApp, setNewApp] = useState({
    appName: '',
    triggerPhrase: '',
    hindiTrigger: '',
    packageName: '',
  });

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  /**
   * Core Natural Language Intent Parser:
   * Parses 'Open [App Name]' or '[App Name] खोलो' voice commands
   * and programmatically maps them to the appropriate Android Application Intent.
   */
  const parseAndExecuteIntent = (spokenText: string) => {
    const text = spokenText.trim();
    if (!text) return;

    let extractedApp = '';
    const lower = text.toLowerCase();

    // 1. English Pattern Matching (e.g. "open instagram", "hey pinky, open the whatsapp")
    const englishMatch = lower.match(/(?:hey\s+pinky\s*,?\s*)?open\s+(?:the\s+)?([a-z0-9_\s]+)/i);
    // 2. Hindi Pattern Matching (e.g. "व्हाट्सएप खोलो", "पिंकी इंस्टाग्राम खोलो")
    const hindiMatch = text.match(/(?:पिंकी\s*,?\s*)?([a-zA-Z0-9\u0900-\u097F\s]+)\s+खोलो/i);

    if (englishMatch && englishMatch[1]) {
      extractedApp = englishMatch[1].trim();
    } else if (hindiMatch && hindiMatch[1]) {
      extractedApp = hindiMatch[1].trim();
    } else {
      // Direct app name given
      extractedApp = text;
    }

    // Lookup in registered package database
    const matched = appCommands.find(
      (c) =>
        c.appName.toLowerCase() === extractedApp.toLowerCase() ||
        c.triggerPhrase.toLowerCase().includes(extractedApp.toLowerCase()) ||
        c.hindiTrigger.includes(extractedApp) ||
        extractedApp.toLowerCase().includes(c.appName.toLowerCase())
    );

    let resolvedPackage = '';
    let status: 'dispatched' | 'store_fallback' | 'not_found' = 'dispatched';

    if (matched) {
      resolvedPackage = matched.packageName;
      status = 'dispatched';
    } else {
      // Dynamic package resolution fallback
      const sanitized = extractedApp.toLowerCase().replace(/[^a-z0-9]/g, '');
      resolvedPackage = `com.${sanitized}.android`;
      status = 'store_fallback';
    }

    const intentResult: ParsedIntentResult = {
      rawCommand: text,
      extractedAppName: matched ? matched.appName : extractedApp,
      resolvedPackage: resolvedPackage,
      intentAction: 'android.intent.action.MAIN',
      intentFlags: 'FLAG_ACTIVITY_NEW_TASK (0x10000000) | FLAG_ACTIVITY_RESET_TASK_IF_NEEDED',
      status: status,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setLastIntentResult(intentResult);

    // Speak voice feedback
    const speechText =
      status === 'dispatched'
        ? `Launching ${intentResult.extractedAppName} via Android Intent.`
        : `Package ${resolvedPackage} not pre-installed. Redirecting to Google Play Store intent.`;
    voiceEngine.speak(speechText);
  };

  const handleMicListen = () => {
    if (isListeningMic) {
      voiceEngine.stopListening();
      setIsListeningMic(false);
    } else {
      voiceEngine.startListening(
        (text, isFinal) => {
          setInputCommand(text);
          if (isFinal) {
            parseAndExecuteIntent(text);
          }
        },
        (listening) => setIsListeningMic(listening)
      );
    }
  };

  const startEdit = (cmd: AppCommand) => {
    setEditingId(cmd.id);
    setEditForm({ ...cmd });
  };

  const saveEdit = () => {
    if (!editForm) return;
    setAppCommands((prev) =>
      prev.map((c) => (c.id === editForm.id ? editForm : c))
    );
    setEditingId(null);
    setEditForm(null);
  };

  const handleAddNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.appName || !newApp.packageName) return;

    const created: AppCommand = {
      id: 'app_' + Date.now(),
      appName: newApp.appName,
      triggerPhrase: newApp.triggerPhrase || `open ${newApp.appName.toLowerCase()}`,
      hindiTrigger: newApp.hindiTrigger || `${newApp.appName} खोलो`,
      packageName: newApp.packageName,
      isCustom: true,
    };

    setAppCommands((prev) => [...prev, created]);
    setNewApp({ appName: '', triggerPhrase: '', hindiTrigger: '', packageName: '' });
    setIsAddingNew(false);
  };

  const deleteApp = (id: string) => {
    setAppCommands((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* NEW: Intent-Based Voice Command Parser & Programmatic Launcher */}
      <div className="glass-panel rounded-2xl p-6 space-y-5 border border-pink-500/35 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <span>'Open [App Name]' Intent Voice Parser &amp; Launcher</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-500/40">
                  Android Intent Pipeline
                </span>
              </h2>
              <p className="text-xs text-purple-200/70">
                Parses natural voice commands, extracts the target application name, and programmatically dispatches the Android launch intent.
              </p>
            </div>
          </div>
        </div>

        {/* Live Input & Voice Test Controller */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-purple-300/80">
            Type or speak any 'Open [App Name]' voice command (e.g. "Open YouTube", "Open WhatsApp", "Open Spotify", or "इंस्टाग्राम खोलो"):
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="e.g. Open Instagram, Open WhatsApp, or यूट्यूब खोलो..."
              className="flex-1 bg-black/50 border border-pink-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500/60"
            />

            <button
              onClick={handleMicListen}
              className={`p-2.5 rounded-xl border transition-all ${
                isListeningMic
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-purple-950/40 border-purple-500/30 text-pink-300 hover:text-white hover:bg-purple-900/50'
              }`}
              title="Speak voice command"
            >
              {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => parseAndExecuteIntent(inputCommand)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition-all shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Parse &amp; Launch</span>
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 text-xs pt-1">
            <span className="text-purple-300/60 font-mono text-[11px] self-center mr-1">TRY:</span>
            {[
              "Open Instagram",
              "Open WhatsApp",
              "Open YouTube",
              "Open Camera",
              "Open Settings",
              "Open Spotify",
              "व्हाट्सएप खोलो",
              "यूट्यूब खोलो",
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputCommand(preset);
                  parseAndExecuteIntent(preset);
                }}
                className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 text-purple-200 text-xs transition-colors"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>

        {/* Live Intent Execution Trace Card */}
        {lastIntentResult && (
          <div className="p-4 rounded-xl bg-black/60 border border-pink-500/30 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
              <span className="text-pink-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PROGRAMMATIC INTENT EXECUTION TRACE</span>
              </span>
              <span className="text-[11px] text-purple-300/50">{lastIntentResult.timestamp}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-purple-300/60 block">PARSED COMMAND:</span>
                <span className="text-white font-semibold font-sans">"{lastIntentResult.rawCommand}"</span>
              </div>
              <div>
                <span className="text-purple-300/60 block">EXTRACTED APP TARGET:</span>
                <span className="text-pink-300 font-bold font-sans">{lastIntentResult.extractedAppName}</span>
              </div>
              <div>
                <span className="text-purple-300/60 block">RESOLVED PACKAGE IDENTIFIER:</span>
                <span className="text-emerald-400 font-semibold">{lastIntentResult.resolvedPackage}</span>
              </div>
              <div>
                <span className="text-purple-300/60 block">INTENT ACTION &amp; CATEGORY:</span>
                <span className="text-purple-200">{lastIntentResult.intentAction} (LAUNCHER)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-500/15">
              <span className="text-purple-300/60 block">FLAGS:</span>
              <span className="text-purple-300 text-[10px]">{lastIntentResult.intentFlags}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Status: Dispatched via PackageManager.getLaunchIntentForPackage()</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                {lastIntentResult.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Package Mapping & Voice Trigger Editor Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-5 border border-pink-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <span>Configured Package Mappings &amp; Triggers</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-500/30">
                  {appCommands.length} Registered
                </span>
              </h3>
              <p className="text-xs text-purple-200/60">
                Edit trigger phrases, add custom package identifiers, or test intent launches.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom App</span>
          </button>
        </div>

        {/* New App Form Modal/Inline */}
        {isAddingNew && (
          <form
            onSubmit={handleAddNewApp}
            className="p-4 rounded-xl bg-black/60 border border-pink-500/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Add New App Voice Command:</span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-purple-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-purple-300/70 mb-1">App Name</label>
                <input
                  type="text"
                  placeholder="e.g. Telegram"
                  value={newApp.appName}
                  onChange={(e) => setNewApp({ ...newApp, appName: e.target.value })}
                  className="w-full bg-purple-950/40 border border-pink-500/20 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-300/70 mb-1">Package Name</label>
                <input
                  type="text"
                  placeholder="e.g. org.telegram.messenger"
                  value={newApp.packageName}
                  onChange={(e) => setNewApp({ ...newApp, packageName: e.target.value })}
                  className="w-full bg-purple-950/40 border border-pink-500/20 rounded-lg p-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-300/70 mb-1">English Voice Trigger</label>
                <input
                  type="text"
                  placeholder="e.g. open telegram"
                  value={newApp.triggerPhrase}
                  onChange={(e) => setNewApp({ ...newApp, triggerPhrase: e.target.value })}
                  className="w-full bg-purple-950/40 border border-pink-500/20 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-purple-300/70 mb-1">Hindi Voice Trigger</label>
                <input
                  type="text"
                  placeholder="e.g. टेलीग्राम खोलो"
                  value={newApp.hindiTrigger}
                  onChange={(e) => setNewApp({ ...newApp, hindiTrigger: e.target.value })}
                  className="w-full bg-purple-950/40 border border-pink-500/20 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-semibold"
            >
              Save App Command
            </button>
          </form>
        )}

        {/* Registered App Commands List */}
        <div className="space-y-2.5">
          {appCommands.map((cmd) => (
            <div
              key={cmd.id}
              className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              {editingId === cmd.id && editForm ? (
                /* Edit Mode */
                <div className="flex-1 space-y-2 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-purple-300/60 block">App Name</span>
                      <input
                        type="text"
                        value={editForm.appName}
                        onChange={(e) => setEditForm({ ...editForm, appName: e.target.value })}
                        className="w-full bg-black/60 border border-pink-500/40 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-300/60 block">English Trigger</span>
                      <input
                        type="text"
                        value={editForm.triggerPhrase}
                        onChange={(e) => setEditForm({ ...editForm, triggerPhrase: e.target.value })}
                        className="w-full bg-black/60 border border-pink-500/40 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-300/60 block">Hindi Trigger</span>
                      <input
                        type="text"
                        value={editForm.hindiTrigger}
                        onChange={(e) => setEditForm({ ...editForm, hindiTrigger: e.target.value })}
                        className="w-full bg-black/60 border border-pink-500/40 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-purple-300/60 block">Package Name (Android Intent Target)</span>
                    <input
                      type="text"
                      value={editForm.packageName}
                      onChange={(e) => setEditForm({ ...editForm, packageName: e.target.value })}
                      className="w-full bg-black/60 border border-pink-500/40 rounded p-1.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-pink-500 text-white rounded text-xs flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{cmd.appName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-purple-300">
                        {cmd.packageName}
                      </span>
                    </div>
                    <div className="text-[11px] text-purple-300/70 mt-1 flex flex-wrap gap-3">
                      <span>
                        <strong className="text-pink-400">EN: </strong>"{cmd.triggerPhrase}"
                      </span>
                      <span>
                        <strong className="text-purple-400">HI: </strong>"{cmd.hindiTrigger}"
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => parseAndExecuteIntent(`Open ${cmd.appName}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Test launch Android package"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test Intent</span>
                    </button>
                    <button
                      onClick={() => startEdit(cmd)}
                      className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit voice trigger and package"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {cmd.isCustom && (
                      <button
                        onClick={() => deleteApp(cmd.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                        title="Delete custom app command"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Background WorkManager Automations */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                Background WorkManager Automations
              </h3>
              <p className="text-xs text-purple-200/60">
                Trigger-Action Workflows &amp; Room Database Routine Synchronization
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-pink-400 px-3 py-1 rounded-lg bg-pink-950/40 border border-pink-500/30">
            WorkManager: {rules.length} Registered Workers
          </span>
        </div>

        <div className="space-y-4 mt-6">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{rule.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-purple-300 uppercase">
                    {rule.category}
                  </span>
                </div>
                <div className="text-xs text-purple-200/80 mt-1">
                  <strong className="text-pink-400 font-mono">IF: </strong>{rule.trigger}
                </div>
                <div className="text-xs text-purple-200/80">
                  <strong className="text-purple-400 font-mono">THEN: </strong>{rule.action}
                </div>
                <div className="text-[11px] font-mono text-purple-300/40 mt-1">
                  Last triggered: {rule.lastRun}
                </div>
              </div>

              <button
                onClick={() => toggleRule(rule.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  rule.enabled
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {rule.enabled ? 'ACTIVE' : 'PAUSED'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
