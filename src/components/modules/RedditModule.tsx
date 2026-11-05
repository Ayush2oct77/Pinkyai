import React, { useState } from 'react';
import { Bot, CheckCircle, ExternalLink, MessageCircle, Send, Trash2, ShieldCheck, Flame } from 'lucide-react';

export const RedditModule: React.FC = () => {
  const [threads, setThreads] = useState([
    {
      id: 'red_1',
      subreddit: 'r/androiddev',
      title: 'How to handle MediaProjection foreground service on Android 15?',
      author: 'u/compose_wizard',
      comment: 'I am seeing crashes when starting MediaProjection from background. What is the correct lifecycle requirement in targetSdk 35?',
      pinkyDraft: 'In targetSdk 35 (Android 15), MediaProjection must strictly be launched alongside a foreground service with type `mediaProjection` initiated while the app is in the foreground, or from an authorized prompt callback.',
      status: 'draft',
      upvotes: 42,
    },
    {
      id: 'red_2',
      subreddit: 'r/Kotlin',
      title: 'Room 2.7 KSP vs KAPT speed benchmark',
      author: 'u/jvm_enthusiast',
      comment: 'Anyone noticed huge build time improvements with Kotlin 2.0 and KSP for Room entities?',
      pinkyDraft: 'Yes! KSP2 with Room 2.6/2.7 reduces annotation processing overhead by ~45% compared to legacy KAPT because it avoids creating Java stubs.',
      status: 'published',
      upvotes: 89,
    },
  ]);

  const handlePublish = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'published' } : t))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Reddit Community AI Gateway
              </h2>
              <p className="text-xs text-purple-200/60">
                Official Reddit OAuth 2.0 · Contextual Thread Answering & Rate Limiter
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
            Reddit API: Rate Limit 58/60 RPM
          </span>
        </div>

        <div className="space-y-4 mt-6">
          {threads.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-purple-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-400">{t.subreddit}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-purple-300/70">{t.author}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-purple-300">
                  STATUS: {t.status.toUpperCase()}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white">{t.title}</h4>
              <p className="text-xs text-purple-200/80 italic">"{t.comment}"</p>

              {/* Pinky Draft */}
              <div className="p-3 rounded-lg bg-black/40 border border-orange-500/20 text-xs text-purple-100">
                <span className="font-semibold text-pink-400">Pinky AI Contextual Response: </span>
                <span>{t.pinkyDraft}</span>
              </div>

              {t.status === 'draft' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePublish(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publish via Reddit OAuth</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
