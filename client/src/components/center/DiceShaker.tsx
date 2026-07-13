import React, { useState, useRef, useCallback } from 'react';

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

function DieFace({ value, size = 56 }: { value: number; size?: number }) {
  const dots = DOT_POSITIONS[value] || DOT_POSITIONS[1];
  const dotR = size * 0.09;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        background: '#fff',
        borderRadius: size * 0.18,
        boxShadow: '0 3px 12px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.8)',
        border: '2px solid #ddd',
        display: 'block',
      }}
    >
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={dotR} fill="#1a1a1a" />
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
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHolding = useRef(false);

  // ── Start holding (mousedown / touchstart) ──────────────────
  const startShake = useCallback(() => {
    if (disabled || phase === 'result') return;
    isHolding.current = true;
    setPhase('shaking');
  }, [disabled, phase]);

  // ── Release (mouseup / touchend) ───────────────────────────
  const release = useCallback(() => {
    if (!isHolding.current) return;
    isHolding.current = false;

    if (phase !== 'shaking') return;

    // Roll the dice
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setResult([d1, d2]);

    // Open lid phase
    setPhase('opening');
    setTimeout(() => {
      setPhase('result');
      onRollResult(d1, d2);
    }, 440);
  }, [phase, onRollResult]);

  // Reset to idle for next turn (called externally via prop change)
  React.useEffect(() => {
    if (!hasRolled) {
      setPhase('idle');
    }
  }, [hasRolled]);

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* ── Phase: idle or shaking → show BOWL ── */}
      {(phase === 'idle' || phase === 'shaking' || phase === 'opening') && (
        <div className="flex flex-col items-center gap-2">
          {/* Instruction hint */}
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            {phase === 'idle' ? 'Nhấn giữ để lắc' : phase === 'shaking' ? 'Đang lắc… Thả ra!' : ''}
          </p>

          {/* Bowl SVG */}
          <div
            className={`cursor-pointer ${phase === 'shaking' ? 'shake-anim' : phase === 'idle' ? 'bowl-idle' : ''}`}
            style={{ touchAction: 'none', userSelect: 'none' }}
            onMouseDown={startShake}
            onMouseUp={release}
            onMouseLeave={release}
            onTouchStart={startShake}
            onTouchEnd={release}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              style={{ overflow: 'visible', display: 'block' }}
            >
              {/* Shadow under bowl */}
              <ellipse cx="60" cy="115" rx="40" ry="6" fill="rgba(0,0,0,0.12)" />

              {/* Bowl body */}
              <path
                d="M 20 60 Q 20 100 60 105 Q 100 100 100 60 Z"
                fill="#e8d5a3"
                stroke="#c8a951"
                strokeWidth="2"
              />
              {/* Bowl inner shadow */}
              <path
                d="M 25 64 Q 25 96 60 100 Q 95 96 95 64 Z"
                fill="#d4b87a"
                opacity="0.5"
              />

              {/* Lid / top */}
              <g className={phase === 'opening' ? 'lid-open' : ''}>
                <ellipse cx="60" cy="60" rx="40" ry="10" fill="#c8a951" stroke="#a07830" strokeWidth="1.5" />
                <ellipse cx="60" cy="57" rx="40" ry="10" fill="#e8d5a3" stroke="#c8a951" strokeWidth="1.5" />
                {/* Lid rim highlight */}
                <ellipse cx="60" cy="54" rx="34" ry="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                {/* Handle knob */}
                <ellipse cx="60" cy="48" rx="8" ry="4" fill="#c8a951" stroke="#a07830" strokeWidth="1" />
                <ellipse cx="60" cy="45" rx="5" ry="3" fill="#e8d5a3" />
              </g>

              {/* Dice peeking out when opening */}
              {phase === 'opening' && (
                <>
                  <g className="dice-fly-1" style={{ transformOrigin: '60px 60px' }}>
                    <rect x="44" y="42" width="18" height="18" rx="3" fill="white" stroke="#ddd" strokeWidth="1.5" />
                    <circle cx="50" cy="48" r="2" fill="#1a1a1a" />
                    <circle cx="56" cy="54" r="2" fill="#1a1a1a" />
                  </g>
                  <g className="dice-fly-2" style={{ transformOrigin: '60px 60px' }}>
                    <rect x="58" y="42" width="18" height="18" rx="3" fill="white" stroke="#ddd" strokeWidth="1.5" />
                    <circle cx="64" cy="48" r="2" fill="#1a1a1a" />
                    <circle cx="70" cy="48" r="2" fill="#1a1a1a" />
                    <circle cx="64" cy="54" r="2" fill="#1a1a1a" />
                  </g>
                </>
              )}

              {/* Shake indicator dots around bowl */}
              {phase === 'shaking' && (
                <>
                  {[[-18, -8], [18, -8], [-22, 8], [22, 8]].map(([dx, dy], i) => (
                    <circle
                      key={i}
                      cx={60 + dx}
                      cy={60 + dy}
                      r="3"
                      fill="#c8a951"
                      opacity={0.6}
                      style={{
                        animation: `shake-cup ${0.12 + i * 0.04}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                  <text x="60" y="82" textAnchor="middle" fontSize="10" fill="#8a6a20" fontWeight="bold">
                    Lắc Lắc!
                  </text>
                </>
              )}
            </svg>
          </div>
        </div>
      )}

      {/* ── Phase: result → show big dice ── */}
      {phase === 'result' && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kết Quả</p>

          {/* Big dice pair */}
          <div className="flex items-center gap-4">
            <div className="dice-result-pop">
              <DieFace value={result[0]} size={72} />
            </div>
            <span className="text-2xl font-black text-slate-300">+</span>
            <div className="dice-result-pop" style={{ animationDelay: '0.08s' }}>
              <DieFace value={result[1]} size={72} />
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black" style={{ fontFamily: 'Baloo 2, cursive', color: '#c8a951' }}>
              {result[0] + result[1]}
            </span>
            {result[0] === result[1] && (
              <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                Đôi! 🎉
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
