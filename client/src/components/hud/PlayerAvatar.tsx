import React from 'react';
import { getPlayerPreset } from '../../core/types/playerTokens';
import { CharacterPortrait } from '../board/island/CharacterPortrait';
export interface PlayerAvatarProps { playerId: number; size?: number; showGlow?: boolean; className?: string; badge?: string; }
export function PlayerAvatar({ playerId, size = 48, showGlow = false, className = '', badge }: PlayerAvatarProps) {
 const preset = getPlayerPreset(playerId);
 return <div className={`player-avatar crew-avatar ${showGlow ? 'has-turn' : ''} ${className}`} data-avatar-anchor data-player-id={playerId} style={{ width:size, height:size, '--avatar-color':preset.colorHex } as React.CSSProperties} title={preset.name}>
  <CharacterPortrait characterId={playerId}/>
  {badge && <span className="crew-badge">{badge}</span>}
 </div>;
}
