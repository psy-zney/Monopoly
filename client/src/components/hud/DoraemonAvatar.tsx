import React from 'react';
import { PlayerAvatar } from './PlayerAvatar';

export interface DoraemonAvatarProps {
  playerId: number;
  size?: number;
}

export const DoraemonAvatar: React.FC<DoraemonAvatarProps> = ({ playerId, size = 56 }) => {
  return <PlayerAvatar playerId={playerId} size={size} />;
};
