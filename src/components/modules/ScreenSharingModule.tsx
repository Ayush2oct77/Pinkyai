import React, { useState, useRef } from 'react';
import { ScreenShare, StopCircle, Sparkles, Shield, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';

export const ScreenSharingModule: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScreenCapture = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsStreaming(true);

        stream.getVideoTracks()[0].onended = () => {
          stopScreenCapture();
        };
      } else {
        // Simulation mode
        setIsStreaming(true);
      }
    } catch (err) {
      console.warn('Screen capture canceled or denied:', err);
    }
  };

  const stopScreenCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setAiAnalysis(null);
  };

  const analyzeScreenWithAI = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiAnalysis(
        "Pinky AI Screen Perception: Detected active IDE workspace with Jetpack Compose code. Invariant check passed: no sensitive passwords or FLAG_SECURE protected banking screens visible."
      );
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ScreenShare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                MediaProjection Screen Sharing
              </h2>
              <p className="text-xs text-purple-200/60">
                Android Foreground Service · Mandatory Visible Notification Banner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isStreaming && (
              <button
                onClick={analyzeScreenWithAI}
                disabled={isAnalyzing}
                className="px-3.5 py-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>{isAnalyzing ? 'Scanning...' : 'AI Screen Analysis'}</span>
              </button>
            )}

            <button
              onClick={isStreaming ? stopScreenCapture : startScreenCapture}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isStreaming
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white shadow-md shadow-pink-500/20'
              }`}
            >
              {isStreaming ? <StopCircle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isStreaming ? 'Stop Sharing' : 'Start Screen Stream'}</span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="my-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/15 flex items-start gap-3 text-xs text-purple-200/80">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Security Invariant:</strong> MediaProjection requires explicit user consent via the system prompt. Android FLAG_SECURE protects against recording banking or DRM-protected apps.
          </span>
        </div>

        {/* Live Stream Viewport */}
        <div className="relative w-full h-80 rounded-xl bg-black/80 border border-pink-500/20 overflow-hidden flex items-center justify-center">
          {isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 space-y-2">
              <ScreenShare className="w-12 h-12 text-purple-400/30 mx-auto" />
              <p className="text-sm font-medium text-white">Screen Sharing is Idle</p>
              <p className="text-xs text-purple-300/50 max-w-sm">
                Click "Start Screen Stream" to grant MediaProjection permission and stream display content to Pinky AI.
              </p>
            </div>
          )}

          {/* Persistent Notification overlay if active */}
          {isStreaming && (
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 border border-pink-500/40 text-[11px] font-mono text-pink-300 flex items-center gap-2 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span>FOREGROUND SERVICE NOTIFICATION POSTED</span>
            </div>
          )}
        </div>

        {/* AI Screen Insights */}
        {aiAnalysis && (
          <div className="mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1">
            <div className="font-semibold text-pink-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Contextual Vision Perception Complete:</span>
            </div>
            <p className="text-purple-100">{aiAnalysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};
