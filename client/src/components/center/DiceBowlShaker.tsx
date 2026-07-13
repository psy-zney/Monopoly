import React, { useMemo, useRef, useState } from 'react';

export interface DiceBowlShakerProps {
  dice: [number, number];
  canRoll: boolean;
  onRollDice: () => void;
}

const SHAKE_THRESHOLD_PX = 18;
const REQUIRED_SHAKES = 3;

function DiceFace({ value }: { value: number }) {
  const dots = useMemo(() => {
    const dotMap: Record<number, string[]> = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
    };
    return dotMap[value] ?? dotMap[1];
  }, [value]);

  return (
    <div className="relative h-12 w-12 rounded-xl border-2 border-slate-200 bg-white shadow-lg shadow-slate-900/20">
      {dots.map((position) => (
        <span
          key={position}
          className={`absolute h-2.5 w-2.5 rounded-full bg-slate-900 dice-dot-${position}`}
        />
      ))}
    </div>
  );
}

export const DiceBowlShaker: React.FC<DiceBowlShakerProps> = ({
  dice,
  canRoll,
  onRollDice,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const startYRef = useRef(0);
  const lastDirectionRef = useRef<1 | -1 | 0>(0);

  const clampedDragY = Math.max(-34, Math.min(34, dragY));
  const lidClosed = canRoll;
  const bowlLift = lidClosed ? clampedDragY : -48;
  const bowlRotate = isDragging ? clampedDragY * 0.18 : 0;
  const plateSquash = isDragging ? Math.min(1.08, 1 + Math.abs(clampedDragY) / 260) : 1;

  const resetShake = () => {
    setIsDragging(false);
    setDragY(0);
    setShakeCount(0);
    lastDirectionRef.current = 0;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canRoll) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    lastDirectionRef.current = 0;
    setIsDragging(true);
    setShakeCount(0);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !canRoll) return;

    const nextDragY = event.clientY - startYRef.current;
    const direction: 1 | -1 | 0 =
      nextDragY > SHAKE_THRESHOLD_PX ? 1 : nextDragY < -SHAKE_THRESHOLD_PX ? -1 : 0;

    if (direction !== 0 && direction !== lastDirectionRef.current) {
      lastDirectionRef.current = direction;
      setShakeCount((count) => count + 1);
      startYRef.current = event.clientY;
      setDragY(0);
      return;
    }

    setDragY(nextDragY);
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    const shouldRoll = canRoll && shakeCount >= REQUIRED_SHAKES;
    resetShake();
    if (shouldRoll) onRollDice();
  };

  return (
    <div
      role="button"
      tabIndex={canRoll ? 0 : -1}
      aria-label="Shake dice bowl"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={resetShake}
      onKeyDown={(event) => {
        if (canRoll && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onRollDice();
        }
      }}
      className={`
        relative h-40 w-64 touch-none select-none outline-none
        ${canRoll ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
      `}
    >
      <div
        className="absolute left-1/2 top-[92px] h-14 w-52 -translate-x-1/2 rounded-[50%] border-4 border-amber-700 bg-gradient-to-b from-amber-200 via-yellow-100 to-amber-300 shadow-xl shadow-amber-950/25 transition-transform duration-150"
        style={{ transform: `translateX(-50%) scaleX(${plateSquash})` }}
      >
        <div className="absolute left-1/2 top-3 h-6 w-40 -translate-x-1/2 rounded-[50%] border border-amber-500/70 bg-amber-100/80" />
      </div>

      <div
        className={`absolute left-1/2 top-[70px] flex -translate-x-1/2 items-center justify-center gap-4 transition-opacity duration-200 ${
          lidClosed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <DiceFace value={dice[0]} />
        <DiceFace value={dice[1]} />
      </div>

      <div
        className="absolute left-1/2 top-8 h-24 w-44 origin-bottom -translate-x-1/2 rounded-t-[5.5rem] rounded-b-[2.2rem] border-4 border-sky-800 bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 shadow-2xl shadow-blue-950/35 transition-transform duration-150"
        style={{
          transform: `translate(-50%, ${bowlLift}px) rotate(${bowlRotate}deg)`,
        }}
      >
        <div className="absolute left-1/2 top-3 h-7 w-28 -translate-x-1/2 rounded-[50%] bg-white/30 blur-[1px]" />
        <div className="absolute bottom-0 left-1/2 h-7 w-48 -translate-x-1/2 rounded-[50%] border-4 border-sky-900 bg-gradient-to-b from-sky-200 to-blue-700" />
        <div className="absolute bottom-2 left-1/2 h-3 w-36 -translate-x-1/2 rounded-[50%] bg-blue-950/25" />
      </div>

      <div className="absolute left-1/2 top-6 h-5 w-16 -translate-x-1/2 rounded-full border-2 border-sky-800 bg-gradient-to-b from-sky-100 to-sky-400 shadow-md" />

      <div className="absolute bottom-0 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-slate-950/20 blur-sm" />
    </div>
  );
};
