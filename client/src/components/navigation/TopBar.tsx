import React, { useEffect, useState } from 'react';
import { Settings, LogOut, Volume2, VolumeX, Sparkles, Coins, Clock } from 'lucide-react';
import { gameAudio } from '../../audio/audioManager';
import { formatCurrency, CurrencyType } from '../../core/types/currency';

export interface TopBarProps {
  roomCode: string;
  taxPot: number;
  currency?: CurrencyType;
  onOpenSettings: () => void;
  onLeaveRoom: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  roomCode,
  taxPot,
  currency = 'GOLD',
  onOpenSettings,
  onLeaveRoom,
}) => {
  const [muted, setMuted] = useState(() => gameAudio.isMuted);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Match game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    gameAudio.toggleMuted();
    setMuted(gameAudio.isMuted);
  };

  return (
    <header className="top-bar-nav flex h-14 w-full shrink-0 items-center justify-between px-3 md:px-6 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/20 z-40 select-none shadow-lg">
      {/* ── LEFT: Settings, Leave, Sound ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 text-slate-300 hover:text-amber-400 hover:bg-slate-800 border border-slate-750 transition-all active:scale-95"
          title="Cài đặt phòng và người chơi"
          aria-label="Cài đặt"
        >
          <Settings size={18} />
        </button>

        <button
          type="button"
          onClick={onLeaveRoom}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 text-slate-300 hover:text-rose-400 hover:bg-slate-800 border border-slate-750 transition-all active:scale-95"
          title="Ván mới / Rời phòng"
          aria-label="Ván mới"
        >
          <LogOut size={18} />
        </button>

        <button
          type="button"
          onClick={handleToggleMute}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 ${
            muted
              ? 'bg-slate-900/90 text-slate-500 border-slate-800'
              : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
          }`}
          title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          aria-label="Âm thanh"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* ── CENTER: Luxury Brand Logo & Tax Pot ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-slate-950 font-black text-base shadow-md shadow-amber-500/30 border border-amber-300">
            🎲
          </div>
          <h1
            className="hidden sm:flex items-center gap-1.5 text-base md:text-lg font-black uppercase tracking-wider text-white"
            style={{ fontFamily: 'Baloo 2, cursive' }}
          >
            Cờ Tỷ Phú Việt Nam <Sparkles className="text-amber-400 shrink-0" size={15} />
          </h1>
        </div>

        {/* Quỹ Thuế (Tax Pot) */}
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 px-3 py-1 border border-amber-400/50 shadow-sm shadow-amber-500/10">
          <Coins size={14} className="text-amber-400 animate-bounce" />
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-200">
            Quỹ thuế:
          </span>
          <span className="font-mono text-xs font-black text-amber-300">
            {formatCurrency(taxPot, currency)}
          </span>
        </div>
      </div>

      {/* ── RIGHT: Room Code & Match Timer ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/90 px-2.5 py-1 border border-slate-750 text-slate-300 font-mono text-xs font-bold">
          <Clock size={13} className="text-slate-400" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-emerald-950/70 px-2.5 py-1 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black shadow-sm">
          <span>#{roomCode}</span>
        </div>
      </div>
    </header>
  );
};
