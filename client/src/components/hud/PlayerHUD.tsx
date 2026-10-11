import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, Crown, Landmark, Home } from 'lucide-react';
import { PlayerState } from '../../core/types/game';
import { getPlayerPreset } from '../../core/types/playerTokens';
import { formatCurrency, CurrencyType } from '../../core/types/currency';
import { PlayerAvatar } from './PlayerAvatar';

export interface PlayerHUDProps {
  players: PlayerState[];
  activePlayerId?: number;
  currency?: CurrencyType;
  onSelectPlayer?: (player: PlayerState) => void;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  players,
  activePlayerId,
  currency = 'GOLD',
  onSelectPlayer,
}) => (
  <div
    className="player-hud-grid mx-auto mb-2 flex w-full max-w-[950px] gap-2 overflow-x-auto px-2 py-1 scrollbar-none"
  >
    {players.map((player) => {
      const preset = getPlayerPreset(player.id);
      const isActive = player.id === activePlayerId;

      return (
        <motion.div
          layout
          key={player.id}
          onClick={() => onSelectPlayer?.(player)}
          title={`Nhấn để xem tài sản của ${player.name}`}
          className="relative flex min-h-[52px] min-w-[140px] flex-1 cursor-pointer select-none items-center gap-2 rounded-2xl border px-2.5 py-1.5 shadow-sm transition-all hover:brightness-105 active:scale-95"
          animate={{ scale: isActive ? 1.025 : 1, opacity: player.isBankrupt ? 0.45 : 1 }}
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${preset.colorHex}25, rgba(255,255,255,0.98))`
              : 'rgba(255,255,255,0.92)',
            borderColor: isActive ? preset.colorHex : '#e7dfc0',
            boxShadow: isActive ? `0 6px 18px ${preset.colorHex}35` : '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div className="shrink-0">
            <PlayerAvatar playerId={player.id} size={36} showGlow={isActive} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-xs font-black text-slate-800">{player.name}</span>
              {isActive && (
                <span
                  className="flex shrink-0 items-center rounded-full px-1.5 py-0.2 text-[8px] font-black uppercase text-white shadow-sm"
                  style={{ background: preset.colorHex }}
                >
                  <Clock3 size={8} className="mr-0.5" /> Lượt
                </span>
              )}
            </div>
            <div className="text-xs font-black text-emerald-800">
              {formatCurrency(player.cash, currency)}
            </div>
            {(player.taxDebt ?? 0) > 0 && (
              <div className="text-[10px] font-black text-rose-600">
                Nợ {formatCurrency(player.taxDebt, currency)} ({player.taxDebtRounds}/3)
              </div>
            )}
          </div>
          {player.isBankrupt && (
            <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/90 text-xs font-black uppercase text-rose-600">
              Phá sản
            </div>
          )}
        </motion.div>
      );
    })}
  </div>
);

export interface PlayerSeatCardProps {
  player: PlayerState;
  isActive: boolean;
  seatIndex: number;
  currency?: CurrencyType;
  assets?: { propertyCount: number; houses: number; hotels: number };
  onSelectPlayer?: (player: PlayerState) => void;
}

export const PlayerSeatCard: React.FC<PlayerSeatCardProps> = ({
  player,
  isActive,
  seatIndex,
  currency = 'GOLD',
  assets,
  onSelectPlayer,
}) => {
  const preset = getPlayerPreset(player.id);
  const previousCash = useRef(player.cash);
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    const nextDelta = player.cash - previousCash.current;
    previousCash.current = player.cash;
    if (nextDelta === 0) return;

    setDelta(nextDelta);
    if (moodTimer.current) clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(() => {
      setDelta(0);
    }, 2200);
  }, [player.cash]);

  useEffect(
    () => () => {
      if (moodTimer.current) clearTimeout(moodTimer.current);
    },
    [],
  );

  return (
    <motion.div
      layout
      onClick={() => onSelectPlayer?.(player)}
      className={`player-seat-card cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${
        isActive ? 'player-seat-active' : ''
      }`}
      animate={{ opacity: player.isBankrupt ? 0.38 : 1, scale: isActive ? 1.015 : 1 }}
      style={{ '--player-color': preset.colorHex } as React.CSSProperties}
      title={`Nhấn để xem danh mục tài sản của ${player.name}`}
      aria-label={`${player.name}, có ${formatCurrency(player.cash, currency)}${isActive ? ', đang trong lượt' : ''}`}
    >
      <div className="relative flex shrink-0 items-center">
        <div className="player-seat-glow" />

        <div className="relative">
          <PlayerAvatar playerId={player.id} size={48} showGlow={isActive} className="seat-avatar" />
          {isActive && (
            <motion.div
              className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-amber-950 shadow-md border border-white"
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Crown size={10} fill="currentColor" /> LƯỢT
            </motion.div>
          )}
        </div>

        {/* Delta Floating Money Animation */}
        <AnimatePresence>
          {delta !== 0 && (
            <motion.div
              className={`absolute -top-7 left-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-black text-white shadow-xl border border-white/50 z-30 ${
                delta > 0 ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
              initial={{ opacity: 0, y: 8, scale: 0.7 }}
              animate={{ opacity: 1, y: -16, scale: 1.05 }}
              exit={{ opacity: 0, y: -32 }}
            >
              {delta > 0 ? `+${formatCurrency(delta, currency)}` : `−${formatCurrency(Math.abs(delta), currency)}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="player-seat-info min-w-0 flex-1">
        <div className="truncate text-xs font-black text-white">
          {player.name}
        </div>
        <div className="flex items-center gap-1 text-sm font-black text-amber-300">
          <Landmark size={12} className="text-amber-400" />
          {formatCurrency(player.cash, currency)}
        </div>
        <div className="seat-assets mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-bold text-emerald-50/70">
          <span title="Số bất động sản">▣ {assets?.propertyCount ?? 0}</span>
          <span title="Số nhà"><Home size={10} className="inline" /> {assets?.houses ?? 0}</span>
          <span title="Số khách sạn">▥ {assets?.hotels ?? 0}</span>
        </div>
        {(player.taxDebt ?? 0) > 0 && (
          <div className="mt-0.5 text-[10px] font-extrabold text-rose-200">
            Nợ {formatCurrency(player.taxDebt, currency)}
          </div>
        )}
      </div>
    </motion.div>
  );
};
