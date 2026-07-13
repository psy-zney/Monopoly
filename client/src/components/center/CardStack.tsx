import React from 'react';

interface CardStackProps {
  color: string;
  borderColor: string;
  label: string;
  icon: React.ReactNode;
  rotate: number;
  stackCount?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

export const CardStack: React.FC<CardStackProps> = ({
  color,
  borderColor,
  label,
  icon,
  rotate,
  stackCount = 5,
  onClick,
  ariaLabel,
}) => {
  const layers = Array.from({ length: stackCount - 1 }, (_, index) => index);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={onClick}
      className="card-stack-wrap relative shrink-0 cursor-pointer"
      style={{
        width: 'clamp(50px, 11cqw, 78px)',
        aspectRatio: '0.72',
        transform: `rotate(${rotate}deg)`,
        border: 0,
        padding: 0,
        background: 'transparent',
      }}
    >
      {layers.map((index) => {
        const depth = stackCount - 1 - index;
        return (
          <span
            key={index}
            className="card-stack-layer absolute"
            style={{
              inset: 0,
              transform: `translate(${depth * 1.4}px, ${depth * 2.3}px)`,
              borderRadius: 6,
              background: color,
              filter: `brightness(${1 - Math.min(0.06 * depth, 0.3)})`,
              border: `2px solid ${borderColor}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          />
        );
      })}

      <span
        className="card-stack-top absolute flex flex-col items-center justify-center gap-1.5"
        style={{
          inset: 0,
          borderRadius: 6,
          background: color,
          border: `2.5px solid ${borderColor}`,
          boxShadow: '0 5px 18px rgba(0,0,0,0.25)',
          zIndex: 10,
        }}
      >
        <span className="pointer-events-none absolute inset-[5px] rounded-[4px] border border-white/40" />
        <span className="text-white">{icon}</span>
        <span
          className="px-1 text-center font-black uppercase text-white"
          style={{ fontSize: 'clamp(7px, 1.45cqw, 10px)', lineHeight: 1.25, whiteSpace: 'pre-line' }}
        >
          {label}
        </span>
      </span>
    </button>
  );
};
