import React from 'react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { PropertyOwnershipState } from '../../core/types/game';
import { TokenCluster } from './PlayerCircleToken';
import { HouseHotelModel } from './HouseHotelModel';
import { getPlayerPreset } from '../../core/types/playerTokens';
import { formatCurrency, CurrencyType } from '../../core/types/currency';

export interface StreetSpaceProps {
  space: BoardSpaceData;
  ownership?: PropertyOwnershipState;
  occupyingPlayerIds: number[];
  activePlayerId?: number;
  positionSide: 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT';
  currency?: CurrencyType;
  onClick?: () => void;
  isLandedTarget?: boolean;
}

const COLOR_BAR: Record<string, string> = {
  BROWN:      '#8b5a32',
  LIGHT_BLUE: '#38bdf8',
  PINK:       '#ec4899',
  ORANGE:     '#f97316',
  RED:        '#ef4444',
  YELLOW:     '#eab308',
  GREEN:      '#10b981',
  DARK_BLUE:  '#2563eb',
};

export const StreetSpace: React.FC<StreetSpaceProps> = ({
  space,
  ownership,
  occupyingPlayerIds,
  activePlayerId,
  positionSide,
  currency = 'GOLD',
  onClick,
  isLandedTarget = false,
}) => {
  const ownerPreset = ownership?.ownerId ? getPlayerPreset(ownership.ownerId) : null;
  const barColor = space.colorGroup ? COLOR_BAR[space.colorGroup] : null;

  // Color bar orientation facing inward toward center hub
  const stripOnTop    = positionSide === 'BOTTOM';
  const stripOnRight  = positionSide === 'LEFT';
  const stripOnBottom = positionSide === 'TOP';
  const stripOnLeft   = positionSide === 'RIGHT';
  const isVertical    = positionSide === 'LEFT' || positionSide === 'RIGHT';

  // Specific visual configuration for Special Spaces with consistent vector design
  const getSpecialConfig = () => {
    if (space.type === 'RAILROAD') {
      return {
        bg: '#f8fafc',
        icon: '🚌',
        badge: 'BẾN XE',
        textColor: '#0f172a',
        badgeBg: '#e2e8f0',
      };
    }
    if (space.type === 'UTILITY') {
      return space.index === 12
        ? {
            bg: '#fffbeb',
            icon: '💡',
            badge: 'ĐIỆN LỰC',
            textColor: '#78350f',
            badgeBg: '#fef3c7',
          }
        : {
            bg: '#eff6ff',
            icon: '🚰',
            badge: 'CẤP NƯỚC',
            textColor: '#1e3a8a',
            badgeBg: '#dbeafe',
          };
    }
    if (space.type === 'CHANCE') {
      return {
        bg: '#efad95',
        icon: '❓',
        badge: 'CƠ HỘI',
        textColor: '#663c32',
      };
    }
    if (space.type === 'COMMUNITY_CHEST') {
      return {
        bg: '#a9c6b7',
        icon: '🎁',
        badge: 'KHÍ VẬN',
        textColor: '#25483d',
      };
    }
    if (space.type === 'TAX') {
      return {
        bg: '#fff1f2',
        icon: '💸',
        badge: 'NỘP THUẾ',
        textColor: '#9f1239',
        badgeBg: '#ffe4e6',
      };
    }
    return null;
  };

  const special = getSpecialConfig();

  // Clean owner border: subtle inner ring matching owner color
  const ownerBorder = ownerPreset
    ? `inset 0 0 0 2px ${ownerPreset.colorHex}`
    : 'none';

  // Format shortName into lines cleanly
  const displayNameLines = (space.shortName || space.name).split('\n');

  // ── SPECIAL SPACES (Clean flat 2.5D with unified iconography) ──
  if (special) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`board-space board-space-special relative flex flex-col items-center justify-between p-1 overflow-hidden select-none transition-all active:scale-[0.98] ${
          isLandedTarget ? 'landed-spotlight-active z-30' : ''
        }`}
        style={{
          background: special.bg,
          boxShadow: ownerBorder,
        }}
        aria-label={`${space.name}${space.price ? `, giá ${formatCurrency(space.price, currency)}` : ''}`}
      >
        <div className="board-space-body flex-1 flex flex-col items-center justify-center gap-0.5 w-full text-center">
          <span className="board-space-icon text-base sm:text-lg leading-none select-none drop-shadow-xs">
            {special.icon}
          </span>
          <div
            className="board-space-name font-black text-[8px] sm:text-[9px] uppercase tracking-tight leading-tight select-none mt-0.5"
            style={{ color: special.textColor }}
          >
            {displayNameLines.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">{line}</span>
            ))}
          </div>
          {space.price && (
            <span
              className="board-space-price mt-0.5 rounded px-1 py-0.2 font-mono text-[7px] sm:text-[8px] font-black"
              style={{
                background: special.badgeBg || '#ffffff40',
                color: special.textColor,
              }}
            >
              {formatCurrency(space.price, currency)}
            </span>
          )}
        </div>

        {/* Player token cluster */}
        {occupyingPlayerIds.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <TokenCluster playerIds={occupyingPlayerIds} size="sm" activePlayerId={activePlayerId} />
          </div>
        )}
      </button>
    );
  }

  // ── PROPERTY SPACES ──
  // Layout arrangement based on side
  const flexDirection =
    stripOnTop ? 'flex-col' :
    stripOnBottom ? 'flex-col-reverse' :
    stripOnLeft ? 'flex-row-reverse' : 'flex-row';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`board-space board-space-property relative flex overflow-hidden select-none transition-all active:scale-[0.98] ${flexDirection} ${
        ownership?.isMortgaged ? 'opacity-50 grayscale' : ''
      } ${isLandedTarget ? 'landed-spotlight-active z-30' : ''}`}
      style={{
        background: '#fffaf0',
        boxShadow: ownerBorder,
      }}
      aria-label={`${space.name}, giá ${formatCurrency(space.price ?? 0, currency)}${ownerPreset ? `, chủ ${ownerPreset.name}` : ''}`}
    >
      {/* ── DEDICATED COLOR STRIP (Houses NEVER overlap text!) ── */}
      {barColor && (
        <div
          className="property-group-strip shrink-0 flex items-center justify-center relative z-10 p-0.5"
          data-orientation={isVertical ? 'vertical' : 'horizontal'}
          style={{
            background: barColor,
            ...(isVertical ? { width: '18px', height: '100%' } : { width: '100%', height: '18px' }),
          }}
        >
          {ownership && ownership.houses > 0 && (
            <HouseHotelModel
              houses={ownership.houses}
              size="sm"
              orientation={isVertical ? 'vertical' : 'horizontal'}
            />
          )}
        </div>
      )}

      {/* ── MAIN CONTENT (Name and Price) ── */}
      <div className="board-space-body flex-1 flex flex-col items-center justify-between p-1 w-full text-center leading-tight">
        <div className="board-space-name font-extrabold text-[8px] sm:text-[9px] uppercase tracking-tight text-slate-800 leading-tight mt-0.5">
          {displayNameLines.map((line, idx) => (
            <span key={idx} className="block whitespace-nowrap">{line}</span>
          ))}
        </div>

        {space.price && (
          <span className="board-space-price font-mono text-[7px] sm:text-[8px] font-black text-slate-600 bg-slate-100 rounded px-1 py-0.2">
            {formatCurrency(space.price, currency)}
          </span>
        )}
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
