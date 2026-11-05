import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  Sun,
  Contrast,
  Palette,
  Layers
} from 'lucide-react';

export const PhotoEditorModule: React.FC = () => {
  const [filter, setFilter] = useState<'normal' | 'cyberpunk' | 'vibrant' | 'grayscale' | 'noir'>('cyberpunk');
  const [brightness, setBrightness] = useState(105);
  const [contrast, setContrast] = useState(115);
  const [saturation, setSaturation] = useState(130);
  const [showOriginal, setShowOriginal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw procedural canvas artwork to edit
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#1a0b2e');
    grad.addColorStop(0.5, '#4a154b');
    grad.addColorStop(1, '#0b001a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Futuristic geometric lines
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(canvas.width - i, canvas.height);
      ctx.stroke();
    }

    // Glowing Neon Hologram Circle in Center
    ctx.save();
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Inner core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 35, 0, Math.PI * 2);
    ctx.fill();

    // Text label on canvas
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PINKY NEURAL VISION', canvas.width / 2, canvas.height / 2 + 110);
  }, []);

  const getFilterStyle = () => {
    if (showOriginal) return 'none';

    let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (filter === 'cyberpunk') {
      filterStr += ' hue-rotate(290deg) drop-shadow(0 0 15px rgba(236,72,153,0.5))';
    } else if (filter === 'grayscale') {
      filterStr += ' grayscale(100%)';
    } else if (filter === 'noir') {
      filterStr += ' grayscale(100%) contrast(160%)';
    } else if (filter === 'vibrant') {
      filterStr += ' saturate(190%) contrast(120%)';
    }
    return filterStr;
  };

  const resetFilters = () => {
    setFilter('normal');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                AI Photo & Shader Studio
              </h2>
              <p className="text-xs text-purple-200/60">
                GPU Shader Filters, Neural Enhancement & Before/After Comparison
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onTouchStart={() => setShowOriginal(true)}
              onTouchEnd={() => setShowOriginal(false)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-pink-400" />
              <span>Hold to View Original</span>
            </button>
            <button
              onClick={resetFilters}
              className="p-2 rounded-xl bg-purple-950/40 text-purple-300 hover:text-white"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Display Viewport */}
        <div className="relative my-6 flex justify-center items-center rounded-xl bg-black/60 p-4 border border-pink-500/20 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={360}
            className="rounded-lg max-w-full h-auto transition-all duration-200"
            style={{ filter: getFilterStyle() }}
          />

          {showOriginal && (
            <div className="absolute top-6 left-6 px-3 py-1 rounded bg-black/80 border border-white/30 text-xs font-mono text-white">
              ORIGINAL (UNFILTERED)
            </div>
          )}
        </div>

        {/* Filter Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-pink-500/15">
          <span className="text-xs font-mono text-purple-300/60 mr-2 shrink-0">SHADERS:</span>
          {(['cyberpunk', 'vibrant', 'normal', 'grayscale', 'noir'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all whitespace-nowrap ${
                filter === mode
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                  : 'bg-purple-950/30 text-purple-300 hover:bg-purple-900/40 border border-purple-500/20'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Adjustment Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5 text-xs text-purple-200/80">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>Brightness</span>
              </span>
              <span className="font-mono text-pink-400">{brightness}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Contrast className="w-3.5 h-3.5 text-purple-400" />
                <span>Contrast</span>
              </span>
              <span className="font-mono text-pink-400">{contrast}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="170"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-pink-400" />
                <span>Saturation</span>
              </span>
              <span className="font-mono text-pink-400">{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="220"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
