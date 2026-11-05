import React, { useState, useEffect } from 'react';
import { getCurrentCoordinates } from '../../services/deviceService';
import { MapPin, ShieldAlert, Share2, Clock, CheckCircle2, Copy, AlertOctagon } from 'lucide-react';

export const LocationModule: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: 37.774929,
    lng: -122.419418,
    accuracy: 9,
  });
  const [isSharing, setIsSharing] = useState(false);
  const [duration, setDuration] = useState('60m');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getCurrentCoordinates().then(setCoords);
  }, []);

  const handleStartSharing = () => {
    const token = Math.random().toString(36).substring(2, 10);
    setShareLink(`https://pinky.ai/live-loc/${token}`);
    setIsSharing(true);
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    setShareLink('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Location & Ephemeral Sharing
              </h2>
              <p className="text-xs text-purple-200/60">
                Android FusedLocationProviderClient · Zero Background Snooping
              </p>
            </div>
          </div>

          <button
            onClick={isSharing ? handleStopSharing : handleStartSharing}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isSharing
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white shadow-md shadow-pink-500/20'
            }`}
          >
            {isSharing ? <AlertOctagon className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{isSharing ? 'Stop Sharing Immediately' : 'Start Ephemeral Share'}</span>
          </button>
        </div>

        {/* Telemetry Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15">
            <div className="text-[11px] font-mono text-purple-300/60">LATITUDE</div>
            <div className="text-lg font-mono font-bold text-pink-400 mt-1">{coords.lat}° N</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15">
            <div className="text-[11px] font-mono text-purple-300/60">LONGITUDE</div>
            <div className="text-lg font-mono font-bold text-purple-400 mt-1">{coords.lng}° W</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15">
            <div className="text-[11px] font-mono text-purple-300/60">GPS HORIZONTAL ACCURACY</div>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-1">±{coords.accuracy} meters</div>
          </div>
        </div>

        {/* Simulated Map View with Cyberpunk Radar Pin */}
        <div className="relative w-full h-64 rounded-xl bg-black/60 border border-pink-500/20 overflow-hidden flex items-center justify-center">
          {/* Radar scan grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

          {/* Pulse concentric rings */}
          <div className="absolute w-44 h-44 rounded-full border border-pink-500/20 animate-ping" />
          <div className="absolute w-28 h-28 rounded-full border border-purple-500/30" />

          {/* Core GPS pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-pink-500 ring-4 ring-pink-500/40 shadow-lg shadow-pink-500" />
            <div className="mt-2 px-2.5 py-1 rounded-md bg-black/80 border border-pink-500/30 text-[11px] font-mono text-pink-300">
              Live Location: Locked
            </div>
          </div>
        </div>

        {/* Sharing Details if active */}
        {isSharing && (
          <div className="mt-6 p-4 rounded-xl bg-pink-950/20 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-purple-200">
              <span className="font-semibold text-pink-400">Encrypted Token Active: </span>
              <span className="font-mono text-purple-300">{shareLink}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-medium flex items-center gap-1 shrink-0"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
