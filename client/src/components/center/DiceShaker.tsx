import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Dices, Hand } from 'lucide-react';
import { gameAudio } from '../../audio/audioManager';

interface DiceShakerProps {
  onRollResult: (die1: number, die2: number) => void;
  disabled?: boolean;
  lastDice?: [number, number];
  hasRolled?: boolean;
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
};

function DieFace({ value, size = 58 }: { value: number; size?: number }) {
  const dots = DOT_POSITIONS[value] || DOT_POSITIONS[1];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="dice-face" aria-label={`Xúc xắc ${value} nút`}>
      <rect x="3" y="3" width="94" height="94" rx="20" fill="url(#die-fill)" stroke="#c9b36e" strokeWidth="4" />
      <defs>
        <linearGradient id="die-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f8f0d6" />
        </linearGradient>
      </defs>
      {dots.map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r="8" fill={value === 1 ? '#dc2626' : '#17201b'} />
      ))}
    </svg>
  );
}

type Phase = 'idle' | 'shaking' | 'opening' | 'result';

export const DiceShaker: React.FC<DiceShakerProps> = ({
  onRollResult,
  disabled = false,
  lastDice,
  hasRolled = false,
}) => {
  const [phase, setPhase] = useState<Phase>(hasRolled ? 'result' : 'idle');
  const [result, setResult] = useState<[number, number]>(lastDice ?? [1, 1]);
  const isHolding = useRef(false);
  const resolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = Boolean(useReducedMotion());

  const startShake = useCallback(() => {
    if (disabled || phase === 'result' || phase === 'opening' || isHolding.current) return;
    isHolding.current = true;
    gameAudio.playSfx('diceShake');
    setPhase('shaking');
  }, [disabled, phase]);

  const release = useCallback(() => {
    if (!isHolding.current || phase !== 'shaking') return;
    isHolding.current = false;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setResult([d1, d2]);
    setPhase('opening');
    gameAudio.playSfx('diceRoll');
    resolveTimer.current = setTimeout(() => {
      setPhase('result');
      onRollResult(d1, d2);
    }, reduceMotion ? 120 : 460);
  }, [onRollResult, phase, reduceMotion]);

  useEffect(() => {
    if (!hasRolled) {
      isHolding.current = false;
      setPhase('idle');
    } else if (lastDice) {
      setResult(lastDice);
      setPhase('result');
    }
  }, [hasRolled, lastDice]);

  useEffect(
    () => () => {
      if (resolveTimer.current) clearTimeout(resolveTimer.current);
    },
    [],
  );

  const instruction = disabled
    ? 'Chờ lượt tiếp theo'
    : phase === 'shaking'
      ? 'Thả tay để gieo!'
      : phase === 'opening'
        ? 'Đang mở bát…'
        : 'Nhấn giữ để lắc';

  return (
    <div className="dice-console select-none">
      <div className="mb-1 flex min-h-6 items-center justify-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-emerald-950/60">
        {phase === 'shaking' ? <Dices size={15} /> : <Hand size={15} />}
        {instruction}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {phase !== 'result' ? (
          <motion.button
            key="bowl"
            type="button"
            disabled={disabled || phase === 'opening'}
            aria-label={instruction}
            className={`dice-bowl-button ${phase === 'shaking' ? 'is-shaking' : ''}`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              startShake();
            }}
            onPointerUp={release}
            onPointerCancel={() => {
              isHolding.current = false;
              if (phase === 'shaking') setPhase('idle');
            }}
            onKeyDown={(event) => {
              if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
                event.preventDefault();
                startShake();
              }
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                release();
              }
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: disabled ? 0.55 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            whileTap={disabled ? undefined : { scale: 0.96 }}
          >
            <div className="dice-bowl-shadow" />
            <svg width="126" height="116" viewBox="0 0 126 116" aria-hidden="true">
              <defs>
                <linearGradient id="bowl-body" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f8dda0" />
                  <stop offset="0.55" stopColor="#d9a83e" />
                  <stop offset="1" stopColor="#9c661d" />
                </linearGradient>
                <linearGradient id="lid-body" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff1bd" />
                  <stop offset="1" stopColor="#c88c2d" />
                </linearGradient>
              </defs>
              <path d="M20 55 Q21 102 63 108 Q105 102 106 55 Z" fill="url(#bowl-body)" stroke="#6f4516" strokeWidth="3" />
              <path d="M27 62 Q29 95 63 99 Q97 95 99 62" fill="none" stroke="#fff3c4" strokeOpacity=".5" strokeWidth="3" />
              <g className={phase === 'opening' ? 'lid-open' : ''}>
                <ellipse cx="63" cy="56" rx="43" ry="11" fill="#8d5b1d" opacity=".45" />
                <ellipse cx="63" cy="52" rx="43" ry="11" fill="url(#lid-body)" stroke="#80521b" strokeWidth="3" />
                <ellipse cx="63" cy="49" rx="33" ry="6" fill="none" stroke="#fff8d9" strokeOpacity=".65" strokeWidth="2" />
                <ellipse cx="63" cy="40" rx="10" ry="5" fill="#b97922" />
                <ellipse cx="63" cy="37" rx="7" ry="4" fill="#f7d887" />
              </g>
              {phase === 'opening' && (
                <>
                  <g className="dice-fly-1"><rect x="42" y="38" width="22" height="22" rx="5" fill="white" /><circle cx="49" cy="45" r="2.5" /><circle cx="57" cy="53" r="2.5" /></g>
                  <g className="dice-fly-2"><rect x="65" y="38" width="22" height="22" rx="5" fill="white" /><circle cx="72" cy="45" r="2.5" /><circle cx="80" cy="53" r="2.5" /></g>
                </>
              )}
            </svg>
            {phase === 'shaking' && <div className="shake-energy"><span /></div>}
          </motion.button>
        ) : (
          <motion.div
            key="result"
            className="dice-result-panel"
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: reduceMotion ? 'tween' : 'spring', stiffness: 360, damping: 22 }}
          >
            <div className="flex items-center gap-3">
              <DieFace value={result[0]} />
              <span className="text-xl font-black text-emerald-900/25">+</span>
              <DieFace value={result[1]} />
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="dice-total">{result[0] + result[1]}</span>
              {result[0] === result[1] && <span className="double-badge">🎉 Đổ đôi!</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
