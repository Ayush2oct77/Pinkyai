import React, { useState } from 'react';
import { SocialComment } from '../../types';
import {
  Instagram,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Send,
  Trash2,
  ExternalLink,
  RefreshCw,
  Power,
  Sliders
} from 'lucide-react';

export const InstagramModule: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(50);
  const [publishedToday, setPublishedToday] = useState(12);

  const [comments, setComments] = useState<SocialComment[]>([
    {
      id: 'ig_01',
      platform: 'instagram',
      author: '@tech_enthusiast_22',
      postTitle: 'Reel: Future of Android Neural Processing Units',
      content: 'This animation looks unbelievable! What tool did you use for the 3D renders?',
      sentiment: 'positive',
      category: 'compliment',
      suggestedReply: 'Thank you so much! All visual shaders were built custom using Jetpack Compose Canvas & GL shaders. Glad you loved it!',
      status: 'auto_published',
      timestamp: '14 mins ago',
    },
    {
      id: 'ig_02',
      platform: 'instagram',
      author: '@sarah_dev',
      postTitle: 'Reel: Jetpack Compose Glassmorphism in 60s',
      content: 'Hey! Is this project open source? Would love to inspect the Room database schema.',
      sentiment: 'question',
      category: 'faq',
      suggestedReply: 'Hey Sarah! Yes, you can inspect the full Kotlin codebase and Room schemas directly in the Android Studio Code Hub tab in this app!',
      status: 'pending',
      timestamp: '32 mins ago',
    },
    {
      id: 'ig_03',
      platform: 'instagram',
      author: '@crypto_bot_99',
      postTitle: 'Reel: Jetpack Compose Glassmorphism in 60s',
      content: 'DM @invest_quick for 1000% crypto returns guaranteed in 24 hours!! 🔥🔥🔥',
      sentiment: 'spam',
      category: 'abuse',
      suggestedReply: '[Flagged as Spam - Auto reply suppressed]',
      status: 'rejected',
      timestamp: '1 hour ago',
    },
    {
      id: 'ig_04',
      platform: 'instagram',
      author: '@dev_mark',
      postTitle: 'Reel: Future of Android Neural Processing Units',
      content: 'Where do you live in real life? Can we meet up tomorrow?',
      sentiment: 'sensitive',
      category: 'personal',
      suggestedReply: '[Sensitive Personal Query - Requires Manual Human Review]',
      status: 'pending',
      timestamp: '2 hours ago',
    },
  ]);

  const handleApprove = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
    );
    setPublishedToday((prev) => prev + 1);
  };

  const handleReject = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c))
    );
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Account Status Header */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-white">
                Instagram Professional API
              </h2>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${isConnected ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-red-950/60 text-red-400 border border-red-500/30'}`}>
                {isConnected ? 'Meta OAuth Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-purple-200/60">
              Account: @pinky.ai.official · Target: Own Reels & Posts Comments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleConnection}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              isConnected
                ? 'bg-red-950/30 text-red-300 border-red-500/30 hover:bg-red-900/40'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isConnected ? 'Disconnect Account' : 'Connect via Meta OAuth'}</span>
          </button>
        </div>
      </div>

      {/* Policy & Rules Guardrails */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span>Auto-Published Categories</span>
          </div>
          <p className="text-xs text-purple-200/70">
            Compliments, Greetings, Thank-you notes, and Verified FAQs on owned reels.
          </p>
        </div>

        <div className="glass-panel-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Manual Review Required</span>
          </div>
          <p className="text-xs text-purple-200/70">
            Personal inquiries, sensitive remarks, controversial topics, and unknown facts.
          </p>
        </div>

        <div className="glass-panel-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Spam & Rate Limits</span>
          </div>
          <p className="text-xs text-purple-200/70">
            Daily limit: {publishedToday}/{dailyLimit} replies. Duplicate IDs suppressed.
          </p>
        </div>
      </div>

      {/* Comments Moderation Queue */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-display font-semibold text-white">
              Live Comment Activity & Moderation
            </h3>
            <p className="text-xs text-purple-200/60">
              Only reads comments on your authorized posts. Never scrapes private feeds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
              className={`text-xs px-3 py-1 rounded-lg border font-mono transition-colors ${
                autoReplyEnabled
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              Auto-Reply: {autoReplyEnabled ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {comments.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-purple-200">
                  <span className="font-semibold text-pink-400">{item.author}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-purple-300/60 text-[11px]">{item.postTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-purple-300/40 text-[11px]">{item.timestamp}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.sentiment === 'positive'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : item.sentiment === 'spam'
                        ? 'bg-red-950/60 text-red-300 border border-red-500/30'
                        : item.sentiment === 'sensitive'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {item.category.toUpperCase()} · {item.sentiment.toUpperCase()}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === 'auto_published'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.status === 'approved'
                        ? 'bg-blue-500/20 text-blue-300'
                        : item.status === 'rejected'
                        ? 'bg-zinc-800 text-zinc-400'
                        : 'bg-pink-500/20 text-pink-300 animate-pulse'
                    }`}
                  >
                    STATUS: {item.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Comment Body */}
              <p className="text-sm text-purple-100 italic">
                "{item.content}"
              </p>

              {/* Pinky AI Suggested or Published Reply */}
              <div className="p-3 rounded-lg bg-black/40 border border-pink-500/20 text-xs text-purple-200">
                <span className="font-semibold text-pink-400">Pinky AI Reply: </span>
                <span>{item.suggestedReply}</span>
              </div>

              {/* Actions for pending items */}
              {item.status === 'pending' && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Approve & Post</span>
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/80 text-purple-300 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Dismiss</span>
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
