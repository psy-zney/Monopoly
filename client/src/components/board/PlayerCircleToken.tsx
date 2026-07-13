import React from 'react';
import { PlayerTokenPreset, SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';

export interface PlayerCircleTokenProps {
  playerId: number;
  size?: 'sm' | 'md' | 'lg';
  isActiveTurn?: boolean;
  onClick?: () => void;
}

export const PlayerCircleToken: React.FC<PlayerCircleTokenProps> = ({
  playerId,
  size = 'md',
  isActiveTurn = false,
  onClick,
}) => {
  const preset = SIX_PLAYER_PRESETS.find((p) => p.id === playerId) ?? SIX_PLAYER_PRESETS[0];

  const sizePx = size === 'sm' ? 18 : size === 'md' ? 26 : 34;
  const fontSize = size === 'sm' ? 8 : size === 'md' ? 10 : 12;

  return (
    <div
      onClick={onClick}
      title={preset.name}
      className="relative shrink-0 cursor-pointer select-none transition-transform"
      style={{
        width: sizePx,
        height: sizePx,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${preset.colorHex}ee, ${preset.colorHex})`,
        boxShadow: isActiveTurn
          ? `0 0 0 2px #fff, 0 0 0 4px ${preset.colorHex}, 0 0 16px ${preset.colorHex}`
          : `0 2px 6px rgba(0,0,0,0.5), 0 0 6px ${preset.colorHex}55`,
        transform: isActiveTurn ? 'scale(1.15)' : 'scale(1)',
        border: `1.5px solid rgba(255,255,255,0.3)`,
      }}
    >
      {/* Gloss bubble */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          left: '20%',
          right: '20%',
          height: '35%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)',
          filter: 'blur(1px)',
        }}
      />
      {/* Label */}
      <span
        className="absolute inset-0 flex items-center justify-center font-black text-white"
        style={{ fontSize, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
      >
        {preset.shortLabel}
      </span>
    </div>
  );
};

export interface TokenClusterProps {
  playerIds: number[];
  size?: 'sm' | 'md' | 'lg';
}

export const TokenCluster: React.FC<TokenClusterProps> = ({ playerIds, size = 'md' }) => {
  if (playerIds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5">
      {playerIds.map((id) => (
        <PlayerCircleToken key={id} playerId={id} size={size} />
      ))}
    </div>
  );
};
