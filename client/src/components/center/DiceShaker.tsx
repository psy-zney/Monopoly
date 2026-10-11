import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Dices, Hand, ZoomIn, ZoomOut } from 'lucide-react';
import { gameAudio } from '../../audio/audioManager';

interface DiceShakerProps {
  onRollResult: (die1: number, die2: number) => void;
  disabled?: boolean;
  lastDice?: [number, number];
  hasRolled?: boolean;
  canRollAgain?: boolean;
  variant?: 'table' | 'compact';
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
  const adjacent = [1, 2, 3, 4, 5, 6].filter((number) => number !== value && number !== 7 - value);
  const faces = [
    { side: 'front', number: value },
    { side: 'back', number: 7 - value },
    { side: 'right', number: adjacent[0] },
    { side: 'left', number: 7 - adjacent[0] },
    { side: 'top', number: adjacent[1] },
    { side: 'bottom', number: 7 - adjacent[1] },
  ];
  return (
    <div className="dice-cube-scene" style={{ '--die-size': `${size}px` } as React.CSSProperties} role="img" aria-label={`Xúc xắc ${value} nút`}>
      <div className="dice-cube">
        {faces.map(({ side, number }) => (
          <span key={side} className={`dice-cube-face dice-cube-face-${side}`}>
            {DOT_POSITIONS[number].map(([x, y], index) => (
              <i key={index} className={number === 1 ? 'dice-pip dice-pip-one' : 'dice-pip'} style={{ left: `${x}%`, top: `${y}%` }} />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

type Phase = 'idle' | 'shaking' | 'opening' | 'result';

export const DiceShaker: React.FC<DiceShakerProps> = ({
  onRollResult,
  disabled = false,
  lastDice,
  hasRolled = false,
  canRollAgain = false,
  variant = 'table',
}) => {
  const [phase, setPhase] = useState<Phase>(hasRolled ? 'result' : 'idle');
  const [result, setResult] = useState<[number, number]>(lastDice ?? [1, 1]);
  const [diceZoom, setDiceZoom] = useState(1);
  const isHolding = useRef(false);
  const resolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('monopoly:dice-phase', { detail: { phase } }));
  }, [phase]);

  const startShake = useCallback(() => {
    if (disabled || phase === 'result' || phase === 'opening' || isHolding.current) return;
    isHolding.current = true;
    gameAudio.playSfx('diceShake');
    setPhase('shaking');
  }, [disabled, phase]);

  const release = useCallback(() => {
    if (!isHolding.current || disabled) return;
    isHolding.current = false;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setResult([d1, d2]);
    setPhase('opening');
    gameAudio.playSfx('diceRoll');
    resolveTimer.current = setTimeout(() => {
      setPhase('result');
      onRollResult(d1, d2);
    }, reduceMotion ? 120 : 620);
  }, [disabled, onRollResult, reduceMotion]);

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
    ? 'Chờ hành động tiếp theo'
    : phase === 'shaking'
      ? 'Thả tay để gieo!'
      : phase === 'opening'
        ? 'Đang mở bát…'
        : 'Chạm để gieo · giữ để lắc';

  if (variant === 'compact') {
    const rolling = phase === 'opening';
    const showResult = hasRolled || rolling || phase === 'result';
    return (
      <div className={`mobile-dice-control ${rolling ? 'is-rolling' : ''}`}>
        <div className="mobile-dice-readout" aria-live="polite">
          <div className={`mobile-dice-pair ${showResult ? '' : 'is-preview'}`}>
            <DieFace value={result[0]} size={38} />
            <DieFace value={result[1]} size={38} />
          </div>
          <div><strong>{rolling ? 'Đang gieo…' : showResult ? `${result[0] + result[1]} bước` : 'Sẵn sàng gieo'}</strong><span>{showResult && result[0] === result[1] ? 'Đổ đôi' : 'Hai xúc xắc · mỗi lượt'}</span></div>
        </div>
        {(!disabled || rolling) && (
          <button type="button" className="mobile-primary-action" disabled={rolling} onClick={() => {
            if (disabled || phase === 'opening') return;
            gameAudio.playSfx('diceShake');
            isHolding.current = true;
            release();
          }}><Dices size={22} />{rolling ? 'Đang gieo xúc xắc' : canRollAgain ? 'Gieo tiếp · đổ đôi' : 'Gieo xúc xắc'}</button>
        )}
      </div>
    );
  }

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
              setPhase('idle');
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
            <svg width="148" height="136" viewBox="0 0 126 116" aria-hidden="true">
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
            className="dice-result-panel dice-result-impact relative"
            initial={{ opacity: 0, scale: 0.48, y: 26, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: reduceMotion ? 'tween' : 'spring', stiffness: 420, damping: 18 }}
            role="status"
            aria-live="polite"
          >
            {!reduceMotion && (
              <div className="dice-impact-effects" aria-hidden="true">
                <span className="dice-impact-ring" />
                {Array.from({ length: 8 }).map((_, index) => (
                  <i key={index} style={{ '--spark-index': index } as React.CSSProperties} />
                ))}
              </div>
            )}
            <div className="dice-result-head relative z-10 flex items-center justify-between gap-2">
              <span className="dice-result-label">Kết quả xúc xắc</span>
              <div className="dice-zoom-controls" aria-label="Phóng to thu nhỏ xúc xắc 3D">
                <button type="button" onClick={() => setDiceZoom((zoom) => Math.max(0.8, +(zoom - 0.1).toFixed(1)))} disabled={diceZoom <= 0.8} aria-label="Thu nhỏ xúc xắc" title="Thu nhỏ xúc xắc"><ZoomOut size={13} /></button>
                <span>{Math.round(diceZoom * 100)}%</span>
                <button type="button" onClick={() => setDiceZoom((zoom) => Math.min(1.3, +(zoom + 0.1).toFixed(1)))} disabled={diceZoom >= 1.3} aria-label="Phóng to xúc xắc" title="Phóng to xúc xắc"><ZoomIn size={13} /></button>
              </div>
            </div>
            <div className="dice-result-line relative z-10 flex items-center justify-center gap-2" style={{ '--dice-zoom': diceZoom } as React.CSSProperties}>
              <DieFace value={result[0]} />
              <span className="dice-plus">+</span>
              <DieFace value={result[1]} />
              <span className="dice-result-steps">{result[0] + result[1]} <small>bước</small></span>
            </div>
            <div className="relative z-10 mt-1 flex items-center justify-center gap-2">
              {result[0] === result[1] && <span className="double-badge">🎉 Đổ đôi!</span>}
              {canRollAgain && (
                <button type="button" className="rounded-lg bg-emerald-700 px-2 py-1 text-[10px] font-black text-white hover:bg-emerald-800" onClick={() => setPhase('idle')}>
                  Gieo tiếp
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
