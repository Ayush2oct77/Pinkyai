import React from 'react';

interface AnimatedOrbProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedOrb: React.FC<AnimatedOrbProps> = ({
  isListening = false,
  isSpeaking = false,
  onClick,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44',
    lg: 'w-56 h-56',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer select-none flex items-center justify-center ${sizeClasses}`}
      title="Tap to activate Pinky AI voice"
    >
      {/* Outer ambient glow ring */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
          isSpeaking
            ? 'bg-fuchsia-500/60 scale-125'
            : isListening
            ? 'bg-pink-500/70 scale-135'
            : 'bg-purple-600/35 scale-100'
        }`}
      />

      {/* Rotating geometric halo rings */}
      <div
        className={`absolute inset-1 rounded-full border border-pink-400/30 transition-transform duration-1000 ${
          isSpeaking ? 'animate-spin' : 'animate-pulse'
        }`}
        style={{ animationDuration: isSpeaking ? '4s' : '8s' }}
      />
      <div
        className="absolute inset-3 rounded-full border border-purple-400/20 animate-spin"
        style={{ animationDuration: '12s', animationDirection: 'reverse' }}
      />

      {/* The core holographic AI orb */}
      <div
        className={`relative z-10 w-3/4 h-3/4 rounded-full shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 ${
          isListening ? 'scale-110' : 'scale-100'
        }`}
        style={{
          background: 'radial-gradient(circle at 35% 35%, #f472b6 0%, #ec4899 45%, #9333ea 80%, #3b0764 100%)',
          boxShadow: isSpeaking
            ? '0 0 50px rgba(236,72,153,0.9), inset 0 0 20px rgba(255,255,255,0.7)'
            : '0 0 35px rgba(236,72,153,0.5), inset 0 0 15px rgba(255,255,255,0.4)',
        }}
      >
        {/* Specular highlight */}
        <div className="absolute -top-3 -left-3 w-1/2 h-1/2 bg-white/40 rounded-full blur-sm" />

        {/* Audio frequency wave visualizer */}
        <div className="flex items-center gap-1 z-20">
          {[0.6, 1.0, 0.4, 0.9, 0.5].map((scale, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-white transition-all duration-150 ${
                isSpeaking || isListening ? 'animate-pulse' : 'opacity-70'
              }`}
              style={{
                height: isSpeaking ? `${scale * 34}px` : isListening ? `${scale * 24}px` : '10px',
                animationDelay: `${i * 120}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
