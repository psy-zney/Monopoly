import React from 'react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { TokenCluster } from './PlayerCircleToken';

export interface CornerSpaceProps {
  space: BoardSpaceData;
  occupyingPlayerIds: number[];
  onClick?: () => void;
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
    bg: '#d4f7d4',
    icon: '🚀',
    label: 'BẮT ĐẦU',
    sub: 'Lãnh $200',
    labelColor: '#166534',
    subColor: '#15803d',
  },
  10: {
    bg: '#fef3c7',
    icon: '⛓️',
    label: 'THĂM TÙ',
    sub: 'Ở Tù',
    labelColor: '#92400e',
    subColor: '#b45309',
  },
  20: {
    bg: '#dbeafe',
    icon: '🚗',
    label: 'ĐẬU XE',
    sub: 'Miễn Phí',
    labelColor: '#1e40af',
    subColor: '#2563eb',
  },
  30: {
    bg: '#fee2e2',
    icon: '👮',
    label: 'VÀO TÙ',
    sub: '→ Ô 10',
    labelColor: '#991b1b',
    subColor: '#dc2626',
  },
};

export const CornerSpace: React.FC<CornerSpaceProps> = ({
  space,
  occupyingPlayerIds,
  onClick,
}) => {
  const cfg = CORNER_CONFIG[space.index] ?? CORNER_CONFIG[0];

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-1 cursor-pointer overflow-hidden transition-all duration-150 space-hover"
      style={{
        background: cfg.bg,
        border: '2px solid #c8a951',
      }}
    >
      <span style={{ fontSize: 22 }}>{cfg.icon}</span>
      <div className="text-center leading-tight px-1">
        <div
          className="font-black text-[10px] md:text-[11px] uppercase"
          style={{ color: cfg.labelColor }}
        >
          {cfg.label}
        </div>
        <div
          className="text-[9px] font-bold mt-0.5"
          style={{ color: cfg.subColor }}
        >
          {cfg.sub}
        </div>
      </div>

      {/* Player tokens */}
      {occupyingPlayerIds.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <TokenCluster playerIds={occupyingPlayerIds} size="sm" />
        </div>
      )}
    </div>
  );
};
