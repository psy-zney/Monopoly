import React from 'react';
import { PlayerAvatar } from '../hud/PlayerAvatar';
import { getPlayerPreset } from '../../core/types/playerTokens';

export interface PlayerCircleTokenProps {
  playerId: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isActiveTurn?: boolean;
  onClick?: () => void;
}

export const PlayerCircleToken: React.FC<PlayerCircleTokenProps> = ({
  playerId,
  size = 'md',
  isActiveTurn = false,
  onClick,
}) => {
  const preset = getPlayerPreset(playerId);

  const sizePx = size === 'xs' ? 18 : size === 'sm' ? 26 : size === 'md' ? 34 : 42;

  return (
    <div
      onClick={onClick}
      title={preset.name}
      className="player-board-token relative shrink-0 cursor-pointer select-none transition-transform"
      style={{
        width: sizePx,
        height: sizePx,
        borderRadius: '50%',
        background: preset.bgGradient,
        boxShadow: isActiveTurn
          ? `0 0 0 2px #fff, 0 0 0 4px ${preset.colorHex}, 0 0 16px ${preset.colorHex}`
          : `0 2px 6px rgba(0,0,0,0.45), 0 0 6px ${preset.colorHex}55`,
        transform: isActiveTurn ? 'scale(1.15)' : 'scale(1)',
        border: `2px solid rgba(255,255,255,0.95)`,
      }}
    >
<PlayerAvatar playerId={playerId} size={sizePx - 4}/>
      {isActiveTurn && <span className="active-token-caret" aria-hidden="true">▼</span>}
    </div>
  );
};

export interface TokenClusterProps {
  playerIds: number[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  activePlayerId?: number;
}

export const TokenCluster: React.FC<TokenClusterProps> = ({ playerIds, size = 'md', activePlayerId }) => {
  if (playerIds.length === 0) return null;

  return (
    <div className="token-cluster flex flex-wrap items-center justify-center" data-count={playerIds.length}>
      {playerIds.map((id) => (
        <PlayerCircleToken key={id} playerId={id} size={playerIds.length >= 3 ? 'xs' : size} isActiveTurn={id === activePlayerId} />
      ))}
    </div>
  );
};
