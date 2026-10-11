import React from 'react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { TokenCluster } from './PlayerCircleToken';
import { CurrencyType, formatCurrency } from '../../core/types/currency';

export interface CornerSpaceProps {
  space: BoardSpaceData;
  occupyingPlayerIds: number[];
  activePlayerId?: number;
  currency?: CurrencyType;
  onClick?: () => void;
  isLandedTarget?: boolean;
}

const CORNER_CONFIG: Record<number, {
  bg: string;
  icon: string;
  label: string;
  sub: string;
  labelColor: string;
  subColor: string;
}> = {
  0: {
    bg: '#ecfdf5',
    icon: '🚩',
    label: 'BẮT ĐẦU',
    sub: '+200',
    labelColor: '#065f46',
    subColor: '#047857',
  },
  10: {
    bg: '#fffbeb',
    icon: '⛓️',
    label: 'THĂM TÙ',
    sub: 'Ở TÙ',
    labelColor: '#92400e',
    subColor: '#b45309',
  },
  20: {
    bg: '#f0f9ff',
    icon: '🅿️',
    label: 'ĐẬU XE',
    sub: 'MIỄN PHÍ',
    labelColor: '#0369a1',
    subColor: '#0284c7',
  },
  30: {
    bg: '#fef2f2',
    icon: '🚨',
    label: 'VÀO TÙ',
    sub: '→ Ô 10',
    labelColor: '#991b1b',
    subColor: '#b91c1c',
  },
};

export const CornerSpace: React.FC<CornerSpaceProps> = ({
  space,
  occupyingPlayerIds,
  activePlayerId,
  currency = 'GOLD',
  onClick,
  isLandedTarget = false,
}) => {
  const cfg = CORNER_CONFIG[space.index] ?? CORNER_CONFIG[0];
  const subText = space.index === 0 ? `Lãnh ${formatCurrency(200, currency)}` : cfg.sub;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`board-space board-space-corner relative flex flex-col items-center justify-center p-1.5 overflow-hidden select-none transition-all active:scale-[0.98] ${
        isLandedTarget ? 'landed-spotlight-active z-30' : ''
      }`}
      style={{
        background: cfg.bg,
      }}
      aria-label={`${cfg.label}, ${subText}`}
    >
      <span className="text-xl sm:text-2xl leading-none select-none drop-shadow-xs mb-1">
        {cfg.icon}
      </span>
      <div className="text-center leading-tight">
        <div
          className="font-black text-[9px] sm:text-[10px] uppercase tracking-tight"
          style={{ color: cfg.labelColor }}
        >
          {cfg.label}
        </div>
        <div
          className="text-[8px] font-bold mt-0.5"
          style={{ color: cfg.subColor }}
        >
          {subText}
        </div>
      </div>

      {/* Player token cluster */}
      {occupyingPlayerIds.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <TokenCluster playerIds={occupyingPlayerIds} size="sm" activePlayerId={activePlayerId} />
        </div>
      )}
    </button>
  );
};
