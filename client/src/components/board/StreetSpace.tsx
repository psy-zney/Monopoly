import React from 'react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { PropertyOwnershipState } from '../../core/types/game';
import { TokenCluster } from './PlayerCircleToken';
import { HouseHotelModel } from './HouseHotelModel';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';

export interface StreetSpaceProps {
  space: BoardSpaceData;
  ownership?: PropertyOwnershipState;
  occupyingPlayerIds: number[];
  positionSide: 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT';
  onClick?: () => void;
}

const COLOR_BAR: Record<string, string> = {
  BROWN:      '#8B4513',
  LIGHT_BLUE: '#87CEEB',
  PINK:       '#FF69B4',
  ORANGE:     '#FF8C00',
  RED:        '#FF0000',
  YELLOW:     '#FFD700',
  GREEN:      '#228B22',
  DARK_BLUE:  '#00008B',
};

const SPECIAL_BG: Record<string, { bg: string; icon: string; textColor: string }> = {
  RAILROAD:        { bg: '#f1f5f9', icon: '🚌', textColor: '#1e293b' },
  UTILITY_ELEC:    { bg: '#fefce8', icon: '💡', textColor: '#713f12' },
  UTILITY_WATER:   { bg: '#eff6ff', icon: '🚰', textColor: '#1e3a5f' },
  CHANCE:          { bg: '#dc2626', icon: '❓', textColor: '#ffffff' },
  COMMUNITY_CHEST: { bg: '#0d9488', icon: '🎁', textColor: '#ffffff' },
  TAX:             { bg: '#fbe9e7', icon: '💸', textColor: '#7f1d1d' },
};

const STRIP_H = 14; // px height of top/bottom color strip
const STRIP_W = 14; // px width of left/right color strip

export const StreetSpace: React.FC<StreetSpaceProps> = ({
  space,
  ownership,
  occupyingPlayerIds,
  positionSide,
  onClick,
}) => {
  const ownerPreset = ownership?.ownerId
    ? SIX_PLAYER_PRESETS.find((p) => p.id === ownership.ownerId)
    : null;

  const barColor = space.colorGroup ? COLOR_BAR[space.colorGroup] : null;

  const stripOnTop    = positionSide === 'TOP';
  const stripOnBottom = positionSide === 'BOTTOM';
  const stripOnLeft   = positionSide === 'LEFT';
  const stripOnRight  = positionSide === 'RIGHT';

  const needsVertical = positionSide === 'LEFT' || positionSide === 'RIGHT';

  // --- Get special config ---
  const getSpecial = () => {
    if (space.type === 'RAILROAD') return SPECIAL_BG.RAILROAD;
    if (space.type === 'UTILITY')  return space.index === 12 ? SPECIAL_BG.UTILITY_ELEC : SPECIAL_BG.UTILITY_WATER;
    if (space.type === 'CHANCE')   return SPECIAL_BG.CHANCE;
    if (space.type === 'COMMUNITY_CHEST') return SPECIAL_BG.COMMUNITY_CHEST;
    if (space.type === 'TAX')      return SPECIAL_BG.TAX;
    return null;
  };
  const special = getSpecial();

  // Ownership indicator styles
  const ownerBorderStyle = ownerPreset
    ? { outline: `2.5px solid ${ownerPreset.colorHex}`, outlineOffset: '-2px' }
    : {};

  const cellBg = special ? special.bg : (ownership?.isMortgaged ? '#f0f0f0' : '#ffffff');

  // ── COLOR STRIP ──
  const colorStrip = barColor ? (
    <div
      style={{
        background: barColor,
        ...(stripOnTop || stripOnBottom
          ? { width: '100%', height: STRIP_H, display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0 }
          : { height: '100%', width: STRIP_W, display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0 }),
      }}
    >
      {!needsVertical && ownership && ownership.houses > 0 && (
        <HouseHotelModel houses={ownership.houses} size="sm" />
      )}
    </div>
  ) : null;

  // ── SPECIAL SPACES ──
  if (special) {
    return (
      <div
        onClick={onClick}
        className="relative flex flex-col items-center justify-between cursor-pointer overflow-hidden space-hover"
        style={{
          background: cellBg,
          border: `1px solid ${special.bg === '#dc2626' || special.bg === '#0d9488' ? special.bg : '#c8a951'}`,
          ...ownerBorderStyle,
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 w-full h-full text-center">
          <span style={{ fontSize: 13 }}>{special.icon}</span>
          <span
            className="text-[8px] font-extrabold uppercase leading-tight break-words px-0.5"
            style={{ color: special.textColor }}
          >
            {space.name}
          </span>
          {space.price && (
            <span className="text-[7.5px] font-bold" style={{ color: special.textColor, opacity: 0.8 }}>${space.price}</span>
          )}
        </div>

        {/* Player tokens */}
        {occupyingPlayerIds.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <TokenCluster playerIds={occupyingPlayerIds} size="sm" />
          </div>
        )}
      </div>
    );
  }

  // ── PROPERTY SPACES ──
  const isHorizontal = !needsVertical;

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden space-hover ${ownership?.isMortgaged ? 'opacity-50 grayscale' : ''}`}
      style={{
        background: cellBg,
        border: '1px solid #c8a951',
        display: 'flex',
        flexDirection: (isHorizontal) ? 'column' : 'row',
        ...ownerBorderStyle,
      }}
    >
      {/* Color strip on outer edge */}
      {(stripOnTop || stripOnLeft) && colorStrip}

      {/* Main body */}
      <div
        className="flex-1 flex flex-col items-center justify-center text-center gap-0.5 p-1 overflow-hidden w-full"
      >
        {ownership && ownership.houses > 0 && (
          <div className="mb-0.5"><HouseHotelModel houses={ownership.houses} size="sm" /></div>
        )}
        <span className="text-[8px] font-extrabold text-slate-800 uppercase leading-tight break-words w-full">
          {space.name}
        </span>
        {space.price && (
          <span className="text-[7.5px] font-bold text-amber-700 leading-none">${space.price}</span>
        )}
      </div>

      {/* Color strip on inner edge */}
      {(stripOnBottom || stripOnRight) && colorStrip}

      {/* Player tokens */}
      {occupyingPlayerIds.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <TokenCluster playerIds={occupyingPlayerIds} size="sm" />
        </div>
      )}
    </div>
  );
};
