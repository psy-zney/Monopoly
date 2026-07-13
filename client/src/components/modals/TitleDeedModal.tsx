import React from 'react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { PropertyOwnershipState, PlayerState } from '../../core/types/game';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';

const COLOR_HEX: Record<string, string> = {
  BROWN:      '#92400e',
  LIGHT_BLUE: '#38bdf8',
  PINK:       '#ec4899',
  ORANGE:     '#f97316',
  RED:        '#ef4444',
  YELLOW:     '#eab308',
  GREEN:      '#16a34a',
  DARK_BLUE:  '#1d4ed8',
};

export interface TitleDeedModalProps {
  space: BoardSpaceData;
  ownership?: PropertyOwnershipState;
  activePlayer: PlayerState;
  onClose: () => void;
  onBuyProperty: (spaceIndex: number) => void;
  onDeclineProperty?: (spaceIndex: number) => void;
  onBuildHouse: (spaceIndex: number) => void;
}

const displayMoney = (amount: number) => amount <= 0 ? 0 : Math.max(10, Math.round(amount / 10) * 10);

export const TitleDeedModal: React.FC<TitleDeedModalProps> = ({
  space,
  ownership,
  activePlayer,
  onClose,
  onBuyProperty,
  onDeclineProperty,
  onBuildHouse,
}) => {
  const isOwner = ownership?.ownerId === activePlayer.id;
  const isUnowned = !ownership?.ownerId;
  const canBuy = isUnowned && space.price != null && activePlayer.cash >= (space.price ?? 0);
  const canBuild = isOwner && space.type === 'PROPERTY' && (ownership?.houses ?? 0) < 5 && activePlayer.cash >= 100;

  const ownerPreset = ownership?.ownerId
    ? SIX_PLAYER_PRESETS.find((p) => p.id === ownership.ownerId)
    : null;

  const accentColor = space.colorGroup ? COLOR_HEX[space.colorGroup] : '#f0b429';

  const houseLabels = ['—', '🏠', '🏠🏠', '🏠🏠🏠', '🏠🏠🏠🏠', '🏨 Khách Sạn'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #1a1a1a 0%, #111 100%)',
          border: `2px solid ${accentColor}66`,
          boxShadow: `0 0 60px ${accentColor}33, 0 30px 60px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color header */}
        <div
          className="w-full px-5 pt-5 pb-4 text-center"
          style={{ background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)` }}
        >
          <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
            Thẻ Sở Hữu · {space.type === 'RAILROAD' ? 'BẾN XE' : space.type === 'UTILITY' ? 'TIỆN ÍCH' : space.colorGroup || ''}
          </div>
          <h2
            className="text-lg font-black uppercase text-white"
            style={{ fontFamily: 'Baloo 2, cursive', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {space.name}
          </h2>

          {/* Houses display */}
          {space.type === 'PROPERTY' && ownership && ownership.houses > 0 && (
            <div className="mt-2 text-sm">{houseLabels[ownership.houses]}</div>
          )}
        </div>

        {/* Ownership banner */}
        <div
          className="px-4 py-2 text-center text-[10px] font-black uppercase tracking-wider"
          style={{
            background: ownerPreset ? `${ownerPreset.colorHex}22` : 'rgba(16,185,129,0.1)',
            borderBottom: `1px solid ${ownerPreset ? ownerPreset.colorHex + '44' : 'rgba(16,185,129,0.2)'}`,
            color: ownerPreset ? ownerPreset.colorHex : '#4ade80',
          }}
        >
          {ownerPreset
            ? `Chủ: ${ownerPreset.name}`
            : ownership?.isMortgaged
              ? '⚠️ Đang thế chấp'
              : '✅ Đất trống · Có thể mua'}
        </div>

        {/* Rent table */}
        <div className="px-4 py-4 space-y-2">
          <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
            <span className="text-white/50 font-semibold">Giá mua</span>
            <span className="font-black text-yellow-400">${space.price ?? 0}</span>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
            <span className="text-white/50 font-semibold">Tiền thuê cơ bản</span>
            <span className="font-black text-white">${displayMoney(space.baseRent ?? 0)}</span>
          </div>
          {space.type === 'PROPERTY' && (
            <>
              <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-white/50 font-semibold">Có đủ bộ màu</span>
                <span className="font-bold text-white/80">${displayMoney((space.baseRent ?? 0) * 2)}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-white/50 font-semibold">1 nhà → 4 nhà</span>
                <span className="font-bold text-white/70">×2~×10</span>
              </div>
              <div className="flex justify-between text-xs py-1.5">
                <span className="text-white/50 font-semibold">Khách sạn</span>
                <span className="font-bold text-rose-400">×50</span>
              </div>
            </>
          )}
          {space.type === 'RAILROAD' && (
            <div className="text-[10px] text-white/40 pt-1">
              1 bến $25 · 2 bến $50 · 3 bến $100 · 4 bến $200
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 space-y-2">
          {canBuy && (
            <button
              onClick={() => onBuyProperty(space.index)}
              className="w-full py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                color: '#fff',
                boxShadow: `0 4px 20px ${accentColor}55`,
              }}
            >
              💰 Mua Đất — ${space.price}
            </button>
          )}

          {canBuy && onDeclineProperty && (
            <button
              onClick={() => onDeclineProperty(space.index)}
              className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Từ Chối → Đấu Giá
            </button>
          )}

          {canBuild && (
            <button
              onClick={() => onBuildHouse(space.index)}
              className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                boxShadow: '0 4px 16px rgba(22,163,74,0.4)',
                color: '#fff',
              }}
            >
              🏠 Xây Nhà — $100
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
