import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Banknote, Clock3, Crown, Landmark } from 'lucide-react';
import { PlayerState } from '../../core/types/game';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';
import type { CatMood } from '../../three/models/millionaire-cat/createMillionaireCatModel';
import { DoraemonAvatar } from './DoraemonAvatar';

const PlayerCatAvatar3D = lazy(() =>
  import('./PlayerCatAvatar3D').then((module) => ({ default: module.PlayerCatAvatar3D })),
);

export interface PlayerHUDProps {
  players: PlayerState[];
  activePlayerId?: number;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ players, activePlayerId }) => (
  <div
    className="player-hud-grid mx-auto mb-3 grid w-full max-w-[950px] gap-2"
    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(142px, 1fr))' }}
  >
    {players.map((player) => {
      const preset = SIX_PLAYER_PRESETS.find((item) => item.id === player.id) ?? SIX_PLAYER_PRESETS[0];
      const isActive = player.id === activePlayerId;

      return (
        <motion.div
          layout
          key={player.id}
          className="relative flex min-h-16 items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm"
          animate={{ scale: isActive ? 1.025 : 1, opacity: player.isBankrupt ? 0.45 : 1 }}
          style={{
            background: isActive ? `linear-gradient(135deg, ${preset.colorHex}22, #ffffff)` : 'rgba(255,255,255,.92)',
            borderColor: isActive ? preset.colorHex : '#e7dfc0',
            boxShadow: isActive ? `0 8px 22px ${preset.colorHex}32` : '0 4px 12px rgba(43,31,14,.08)',
          }}
        >
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <DoraemonAvatar playerId={player.id} size={40} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-black text-slate-800">{player.name}</span>
              {isActive && <Clock3 size={14} color={preset.colorHex} aria-label="Đang trong lượt" />}
            </div>
            <div className="flex items-center gap-1 text-base font-black text-emerald-700">
              <Banknote size={16} aria-hidden="true" />${player.cash.toLocaleString()}
            </div>
            {(player.taxDebt ?? 0) > 0 && (
              <div className="mt-0.5 text-xs font-extrabold text-rose-700">Nợ ${player.taxDebt} · vòng {player.taxDebtRounds}/3</div>
            )}
          </div>
          {player.isBankrupt && (
            <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/90 text-sm font-black uppercase text-rose-600">
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
}

export const PlayerSeatCard: React.FC<PlayerSeatCardProps> = ({ player, isActive, seatIndex }) => {
  const preset = SIX_PLAYER_PRESETS.find((item) => item.id === player.id) ?? SIX_PLAYER_PRESETS[0];
  const previousCash = useRef(player.cash);
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mood, setMood] = useState<CatMood>('idle');
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    const nextDelta = player.cash - previousCash.current;
    previousCash.current = player.cash;
    if (nextDelta === 0) return;

    setMood(nextDelta > 0 ? 'positive' : 'negative');
    setDelta(nextDelta);
    if (moodTimer.current) clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(() => {
      setMood('idle');
      setDelta(0);
    }, 1900);
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
      className={`player-seat-card ${isActive ? 'player-seat-active' : ''}`}
      animate={{ opacity: player.isBankrupt ? 0.38 : 1, scale: isActive ? 1.04 : 1 }}
      style={{ '--player-color': preset.colorHex } as React.CSSProperties}
      aria-label={`${player.name}, có ${player.cash.toLocaleString()} đô${isActive ? ', đang trong lượt' : ''}`}
    >
      <div className="relative">
        <div className="player-seat-glow" />
        <Suspense fallback={<div className="h-[88px] w-[92px] animate-pulse rounded-full bg-white/10" />}>
          <PlayerCatAvatar3D accentColor={preset.colorHex} mood={mood} seatIndex={seatIndex} />
        </Suspense>
        {isActive && (
          <div className="absolute -right-1 top-1 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-xs font-black text-amber-950 shadow-lg">
            <Crown size={13} fill="currentColor" /> Lượt
          </div>
        )}
        <AnimatePresence>
          {delta !== 0 && (
            <motion.div
              className={`absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-1 text-sm font-black text-white shadow-lg ${
                delta > 0 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              initial={{ opacity: 0, y: 10, scale: 0.7 }}
              animate={{ opacity: 1, y: -14, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
            >
              {delta > 0 ? `😹 +$${delta.toLocaleString()}` : `😿 −$${Math.abs(delta).toLocaleString()}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="player-seat-info">
        <div className="max-w-[112px] truncate text-sm font-black text-white">{player.name}</div>
        <div className="flex items-center justify-center gap-1 text-base font-black text-amber-300">
          <Landmark size={15} />${player.cash.toLocaleString()}
        </div>
        {(player.taxDebt ?? 0) > 0 && (
          <div className="mt-0.5 rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-extrabold text-rose-200">
            Nợ ${player.taxDebt}
          </div>
        )}
      </div>
    </motion.div>
  );
};
