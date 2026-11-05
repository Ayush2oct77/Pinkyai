import React, { useState } from 'react';
import {
  MessageSquare,
  Volume2,
  Send,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { voiceEngine } from '../../services/voiceService';

interface IncomingNotification {
  id: string;
  sender: string;
  app: 'WhatsApp' | 'SMS' | 'Telegram' | 'Slack';
  text: string;
  timestamp: string;
  suggestedDraft: string;
  isSensitive: boolean;
  status: 'pending' | 'sent' | 'dismissed';
}

export const MessagesModule: React.FC = () => {
  const [notifications, setNotifications] = useState<IncomingNotification[]>([
    {
      id: 'notif_1',
      sender: 'Alex Chen (Colleague)',
      app: 'Slack',
      text: 'Hey! Are the unit tests for the Android Room migration ready for PR review?',
      timestamp: '5m ago',
      suggestedDraft: 'Yes Alex! All Room migration tests passed with 100% assertions. Submitting the PR now.',
      isSensitive: false,
      status: 'pending',
    },
    {
      id: 'notif_2',
      sender: 'Mom',
      app: 'WhatsApp',
      text: 'Are you having dinner at home tonight? Let me know by 6 PM.',
      timestamp: '18m ago',
      suggestedDraft: 'Yes Mom, I will be home by 6:30 PM for dinner. Love you!',
      isSensitive: false,
      status: 'pending',
    },
    {
      id: 'notif_3',
      sender: 'Bank Fraud Alert (9820)',
      app: 'SMS',
      text: 'OTP 829104 for payment of $420.00 to Merchant. Never share OTP with anyone.',
      timestamp: '30m ago',
      suggestedDraft: '[Security Guard: Sensitive OTP - Auto-reply completely forbidden]',
      isSensitive: true,
      status: 'dismissed',
    },
  ]);

  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [editedDraft, setEditedDraft] = useState('');

  const handleSpeak = (text: string) => {
    voiceEngine.speak(text);
  };

  const handleOpenEdit = (notif: IncomingNotification) => {
    setActiveDraftId(notif.id);
    setEditedDraft(notif.suggestedDraft);
  };

  const handleSend = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'sent' } : n))
    );
    setActiveDraftId(null);
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'dismissed' } : n))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Smart Message Assistant
              </h2>
              <p className="text-xs text-purple-200/60">
                Android NotificationListenerService · Contextual Drafts · Sensitivity Guards
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>Listener Service: Bound</span>
          </div>
        </div>

        {/* Security Rule Banner */}
        <div className="my-4 p-3 rounded-xl bg-purple-950/25 border border-purple-500/15 text-xs text-purple-200 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Zero-Surprise Default:</strong> Sensitive messages (bank OTPs, passwords, personal security codes) are never automatically answered. Every draft requires human approval by default.
          </span>
        </div>

        {/* Notification Stream */}
        <div className="space-y-4 mt-6">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all ${
                n.isSensitive
                  ? 'bg-red-950/20 border-red-500/30'
                  : 'bg-purple-950/30 border-purple-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-white">{n.sender}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 font-mono text-pink-300">
                    {n.app}
                  </span>
                  <span className="text-purple-300/50 text-[11px]">{n.timestamp}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(`${n.sender} sent: ${n.text}`)}
                    className="p-1 rounded text-purple-300 hover:text-pink-300 transition-colors"
                    title="Speak aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      n.status === 'sent'
                        ? 'bg-emerald-950/60 text-emerald-300'
                        : n.status === 'dismissed'
                        ? 'bg-zinc-800 text-zinc-400'
                        : 'bg-pink-500/20 text-pink-300'
                    }`}
                  >
                    {n.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-sm text-purple-100 my-2 italic">
                "{n.text}"
              </p>

              {/* Draft Section */}
              {n.status === 'pending' && (
                <div className="mt-3 p-3 rounded-lg bg-black/40 border border-pink-500/20 space-y-2">
                  <div className="text-[11px] font-mono text-pink-400 font-semibold">
                    Pinky AI Suggested Reply Draft:
                  </div>

                  {activeDraftId === n.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedDraft}
                        onChange={(e) => setEditedDraft(e.target.value)}
                        className="w-full bg-purple-950/40 border border-pink-500/40 rounded-lg p-2 text-xs text-white"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSend(n.id)}
                          className="px-3 py-1 bg-pink-500 text-white rounded text-xs"
                        >
                          Send Edited
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-purple-200">
                      {n.suggestedDraft}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleSend(n.id)}
                      className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Approve & Send</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(n)}
                      className="px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/80 text-purple-200 text-xs font-medium transition-colors"
                    >
                      Edit Draft
                    </button>
                    <button
                      onClick={() => handleDismiss(n.id)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
