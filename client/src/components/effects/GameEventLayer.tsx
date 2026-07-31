import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GameState, LogEntry } from '../../core/types/game';
import { VIETNAMESE_BOARD_SPACES } from '../../core/constants/vietnameseBoardData';
import { gameAudio } from '../../audio/audioManager';

interface MoneyBurst {
  id: string;
  playerId: number;
  playerName: string;
  amount: number;
}

const SEAT_ANCHORS: Record<number, { left: string; top: string }> = {
  1: { left: '29%', top: '79%' },
  2: { left: '13%', top: '50%' },
  3: { left: '29%', top: '18%' },
  4: { left: '71%', top: '18%' },
  5: { left: '87%', top: '50%' },
  6: { left: '71%', top: '79%' },
};

const HAPPY_CATS = ['😹', '😻', '😸', '🤑'];
const SAD_CATS = ['😿', '🙀', '😾'];

const MoneyBurstView: React.FC<{ burst: MoneyBurst; reduceMotion: boolean }> = ({ burst, reduceMotion }) => {
  const positive = burst.amount > 0;
  const anchor = SEAT_ANCHORS[burst.playerId] ?? { left: '50%', top: '50%' };
  const emojiSet = positive ? HAPPY_CATS : SAD_CATS;
  const emoji = emojiSet[burst.playerId % emojiSet.length];

  return (
    <motion.div
      className="pointer-events-none fixed z-[70] -translate-x-1/2 -translate-y-1/2"
      style={anchor}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.55, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: -38 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: 'easeOut' }}
    >
      <div className={`money-event-card ${positive ? 'money-event-positive' : 'money-event-negative'}`}>
        <motion.span
          className="text-3xl"
          animate={reduceMotion ? undefined : positive ? { rotate: [-8, 8, -4], scale: [1, 1.18, 1] } : { rotate: [0, -8, 7, 0] }}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.span>
        <div className="min-w-0">
          <div className="max-w-[130px] truncate text-xs font-extrabold text-white/80">{burst.playerName}</div>
          <div className="text-lg font-black leading-none text-white">
            {positive ? '+' : '−'}${Math.abs(burst.amount).toLocaleString()}
          </div>
        </div>
      </div>

      {positive && !reduceMotion &&
        Array.from({ length: 8 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 text-lg drop-shadow"
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.5 }}
            animate={{
              x: Math.cos((Math.PI * 2 * index) / 8) * (38 + (index % 3) * 9),
              y: Math.sin((Math.PI * 2 * index) / 8) * (34 + (index % 2) * 12) + 22,
              opacity: 0,
              rotate: index % 2 ? 180 : -180,
              scale: [0.5, 1.1, 0.8],
            }}
            transition={{ duration: 0.85, delay: index * 0.035, ease: 'easeOut' }}
          >
            🪙
          </motion.span>
        ))}
    </motion.div>
  );
};

const FortuneToast: React.FC<{ kind: 'CHANCE' | 'COMMUNITY_CHEST'; log?: LogEntry }> = ({ kind, log }) => (
  <motion.div
    className={`fortune-toast ${kind === 'CHANCE' ? 'fortune-toast-chance' : 'fortune-toast-community'}`}
    initial={{ opacity: 0, y: -14, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <span className="text-2xl">{kind === 'CHANCE' ? '🎴' : '🍀'}</span>
    <div className="min-w-0">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-white/70">
        {kind === 'CHANCE' ? 'Cơ hội xuất hiện' : 'Khí vận ghé thăm'}
      </div>
      <div className="max-w-[460px] truncate text-sm font-extrabold text-white">{log?.message}</div>
    </div>
  </motion.div>
);

export const GameEventLayer: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const previousCash = useRef<Map<number, number>>(new Map());
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const fortuneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bursts, setBursts] = useState<MoneyBurst[]>([]);
  const [visibleFortuneLogId, setVisibleFortuneLogId] = useState<string | null>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (previousCash.current.size === 0) {
      previousCash.current = new Map(gameState.players.map((player) => [player.id, player.cash]));
      return;
    }

    const nextBursts: MoneyBurst[] = [];
    gameState.players.forEach((player) => {
      const previous = previousCash.current.get(player.id);
      if (previous !== undefined && previous !== player.cash) {
        nextBursts.push({
          id: `${gameState.logs[0]?.id ?? Date.now()}-${player.id}`,
          playerId: player.id,
          playerName: player.name,
          amount: player.cash - previous,
        });
      }
      previousCash.current.set(player.id, player.cash);
    });

    if (nextBursts.length === 0) return;
    nextBursts.forEach((burst) => gameAudio.playSfx(burst.amount > 0 ? 'coinGain' : 'coinLoss'));
    setBursts((current) => [...current, ...nextBursts].slice(-8));
    nextBursts.forEach((burst) => {
      const timer = setTimeout(() => {
        setBursts((current) => current.filter((item) => item.id !== burst.id));
        timers.current.delete(burst.id);
      }, 2100);
      timers.current.set(burst.id, timer);
    });
  }, [gameState.players, gameState.logs]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
      if (fortuneTimer.current) clearTimeout(fortuneTimer.current);
    },
    [],
  );

  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const landedSpace = activePlayer ? VIETNAMESE_BOARD_SPACES[activePlayer.position] : undefined;
  const fortuneKind =
    gameState.hasRolled && (landedSpace?.type === 'CHANCE' || landedSpace?.type === 'COMMUNITY_CHEST')
      ? landedSpace.type
      : null;

  useEffect(() => {
    const logId = gameState.logs[0]?.id;
    if (!fortuneKind || !logId) return;
    gameAudio.playSfx('fortune');
    setVisibleFortuneLogId(logId);
    if (fortuneTimer.current) clearTimeout(fortuneTimer.current);
    fortuneTimer.current = setTimeout(() => setVisibleFortuneLogId(null), 3400);
  }, [fortuneKind, gameState.logs]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[65]" aria-live="polite" aria-atomic="false">
      <AnimatePresence>
        {fortuneKind && visibleFortuneLogId === gameState.logs[0]?.id && (
          <div key={gameState.logs[0]?.id} className="absolute left-1/2 top-[11%] -translate-x-1/2">
            <FortuneToast kind={fortuneKind} log={gameState.logs[0]} />
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {bursts.map((burst) => (
          <MoneyBurstView key={burst.id} burst={burst} reduceMotion={reduceMotion} />
        ))}
      </AnimatePresence>
    </div>
  );
};
