import React, { useState } from 'react';
import { ScrollText, ChevronUp, ChevronDown, ZoomIn, ZoomOut, RotateCcw, Target, Trophy } from 'lucide-react';
import { LogEntry } from '../../core/types/game';
import { gameAudio } from '../../audio/audioManager';

export interface BottomDockProps {
  logs: LogEntry[];
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  isAutoFollow: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleAutoFollow: () => void;
  onOpenRankings?: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  logs,
  zoom,
  minZoom = 0.85,
  maxZoom = 1.85,
  isAutoFollow,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleAutoFollow,
  onOpenRankings,
}) => {
  const [isLogExpanded, setIsLogExpanded] = useState(false);
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

  const handleToggleFollow = () => {
    gameAudio.playSfx('uiClick');
    onToggleAutoFollow();
  };

  return (
    <footer className="bottom-dock-bar pointer-events-auto flex items-end justify-between w-full p-2.5 z-30 select-none">
      {/* ── LEFT: Collapsible Game Log ── */}
      <div
        className={`game-log-panel flex flex-col rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-750 transition-all duration-300 shadow-xl ${
          isLogExpanded ? 'w-[320px] sm:w-[380px] max-h-48' : 'w-[260px] sm:w-[320px] max-h-[58px]'
        }`}
      >
        <div
          onClick={() => setIsLogExpanded(!isLogExpanded)}
          className="flex items-center justify-between px-3 py-1.5 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors rounded-t-2xl"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300">
            <ScrollText size={12} className="text-amber-400" />
            <span>Nhật ký ván đấu</span>
          </div>

          <button
            type="button"
            className="text-slate-400 hover:text-white"
            aria-label={isLogExpanded ? 'Thu gọn nhật ký' : 'Mở rộng nhật ký'}
          >
            {isLogExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-1.5 space-y-1">
          {logs.length === 0 ? (
            <div className="text-[10px] font-semibold text-slate-500 italic">
              Ván đấu mới bắt đầu.
            </div>
          ) : (
            (isLogExpanded ? logs : logs.slice(0, 2)).map((log) => (
              <div key={log.id} className="text-[10px] font-medium leading-tight text-slate-300">
                • {log.message}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT: Camera & Utility Controls ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {onOpenRankings && (
          <button
            type="button"
            onClick={onOpenRankings}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-slate-900/90 px-3 text-xs font-black uppercase tracking-wider text-amber-300 border border-slate-750 hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
            title="Bảng xếp hạng tài sản"
          >
            <Trophy size={14} className="text-amber-400" />
            <span className="hidden sm:inline">BXH</span>
          </button>
        )}

        {/* Zoom Controls Pill */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 backdrop-blur-md border border-slate-750 shadow-xl">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= minZoom + 0.02}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Thu nhỏ (-)"
          >
            <ZoomOut size={14} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex h-7 min-w-[46px] items-center justify-center font-mono text-[10px] font-black text-amber-300 hover:bg-slate-800 rounded-lg transition-all"
            title="Đặt lại 100%"
          >
            {percent}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= maxZoom - 0.02}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Phóng to (+)"
          >
            <ZoomIn size={14} />
          </button>

          <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

          <button
            type="button"
            onClick={handleToggleFollow}
            className={`flex h-7 items-center gap-1 rounded-lg px-2 text-[10px] font-black uppercase transition-all active:scale-95 ${
              isAutoFollow
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isAutoFollow ? 'Đang tự động bám sát' : 'Bật tự động bám sát'}
          >
            <Target size={12} />
            <span className="hidden md:inline">Bám sát</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
