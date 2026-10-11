import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Target, Eye } from 'lucide-react';
import { gameAudio } from '../../audio/audioManager';

export interface ZoomToolbarProps {
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  isAutoFollow: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleAutoFollow: () => void;
}

export const ZoomToolbar: React.FC<ZoomToolbarProps> = ({
  zoom,
  minZoom = 0.85,
  maxZoom = 1.9,
  isAutoFollow,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleAutoFollow,
}) => {
  const percent = Math.round(zoom * 100);

  const handleZoomIn = () => {
    gameAudio.playSfx('zoomAction');
    onZoomIn();
  };

  const handleZoomOut = () => {
    gameAudio.playSfx('zoomAction');
    onZoomOut();
  };

  const handleReset = () => {
    gameAudio.playSfx('zoomAction');
    onResetZoom();
  };

  const handleFollow = () => {
    gameAudio.playSfx('uiClick');
    onToggleAutoFollow();
  };

  return (
    <div
      className="zoom-toolbar pointer-events-auto absolute bottom-3 right-3 z-30 flex items-center gap-1 rounded-2xl bg-slate-900/90 p-1 backdrop-blur-md border border-slate-700/80 shadow-2xl"
      role="toolbar"
      aria-label="Điều khiển phóng to thu nhỏ bàn cờ"
    >
      {/* Zoom Out Button */}
      <button
        type="button"
        onClick={handleZoomOut}
        disabled={zoom <= minZoom + 0.02}
        className="grid h-8 w-8 place-items-center rounded-xl text-slate-300 transition-all hover:bg-slate-800 hover:text-white active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Thu nhỏ bàn cờ (-)"
        aria-label="Thu nhỏ"
      >
        <ZoomOut size={16} />
      </button>

      {/* Percentage / Reset Button */}
      <button
        type="button"
        onClick={handleReset}
        className="flex h-8 min-w-[52px] items-center justify-center gap-1 rounded-xl px-1.5 font-mono text-[11px] font-black text-amber-300 transition-all hover:bg-slate-800 active:scale-95 border border-slate-700/50"
        title="Đặt lại toàn cảnh 100%"
        aria-label="Đặt lại kích thước 100%"
      >
        <span>{percent}%</span>
        {percent !== 100 && <RotateCcw size={10} className="text-amber-400" />}
      </button>

      {/* Zoom In Button */}
      <button
        type="button"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom - 0.02}
        className="grid h-8 w-8 place-items-center rounded-xl text-slate-300 transition-all hover:bg-slate-800 hover:text-white active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Phóng to bàn cờ (+)"
        aria-label="Phóng to"
      >
        <ZoomIn size={16} />
      </button>

      <div className="mx-0.5 h-4 w-[1px] bg-slate-700/80" aria-hidden="true" />

      {/* Auto-Follow Active Token Toggle */}
      <button
        type="button"
        onClick={handleFollow}
        className={`flex h-8 items-center gap-1 rounded-xl px-2.5 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 ${
          isAutoFollow
            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
        }`}
        title={isAutoFollow ? 'Đang tự động bám sát lượt đi' : 'Bật tự động bám sát lượt đi'}
        aria-label="Tự động bám sát quân cờ"
      >
        <Target size={13} />
        <span className="hidden sm:inline">Bám sát</span>
      </button>
    </div>
  );
};
