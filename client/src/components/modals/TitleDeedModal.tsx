import React from 'react';
import { Building2, HandCoins, Hammer, Hotel, X } from 'lucide-react';
import { BoardSpaceData, VIETNAMESE_BOARD_SPACES } from '../../core/constants/vietnameseBoardData';
import { PropertyOwnershipState, PlayerState } from '../../core/types/game';
import { getPlayerPreset } from '../../core/types/playerTokens';
import { formatCurrency, CurrencyType } from '../../core/types/currency';

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
  allProperties: Record<number, PropertyOwnershipState>;
  activePlayer: PlayerState;
  currency?: CurrencyType;
  onClose: () => void;
  canManage: boolean;
  onBuildHouse: (spaceIndex: number) => void;
  onSellProperty: (spaceIndex: number) => void;
}

const displayMoney = (amount: number) => amount <= 0 ? 0 : Math.max(10, Math.round(amount / 10) * 10);

const HOUSE_COST_BY_GROUP: Record<NonNullable<BoardSpaceData['colorGroup']>, number> = {
  BROWN: 50,
  LIGHT_BLUE: 50,
  PINK: 100,
  ORANGE: 100,
  RED: 150,
  YELLOW: 150,
  GREEN: 200,
  DARK_BLUE: 200,
};

export const TitleDeedModal: React.FC<TitleDeedModalProps> = ({
  space,
  ownership,
  allProperties,
  activePlayer,
  currency = 'GOLD',
  onClose,
  canManage,
  onBuildHouse,
  onSellProperty,
}) => {
  const isOwner = ownership?.ownerId === activePlayer.id;
  const buildingLevel = ownership?.houses ?? 0;
  const buildCost = space.colorGroup ? HOUSE_COST_BY_GROUP[space.colorGroup] : 100;
  const colorGroupSpaces = space.colorGroup
    ? VIETNAMESE_BOARD_SPACES.filter((candidate) => candidate.type === 'PROPERTY' && candidate.colorGroup === space.colorGroup)
    : [];
  const ownsFullGroup = colorGroupSpaces.length > 0
    && colorGroupSpaces.every((candidate) => allProperties[candidate.index]?.ownerId === activePlayer.id);
  const lowestGroupLevel = colorGroupSpaces.length > 0
    ? Math.min(...colorGroupSpaces.map((candidate) => allProperties[candidate.index]?.houses ?? 0))
    : 0;
  const canBuildEvenly = buildingLevel === lowestGroupLevel;
  const isMaxUpgrade = buildingLevel >= 5;
  const canAffordBuild = activePlayer.cash >= buildCost;
  const canBuild = canManage && isOwner
    && space.type === 'PROPERTY'
    && !isMaxUpgrade
    && ownsFullGroup
    && canBuildEvenly
    && canAffordBuild;
  const nextUpgradeLabel = buildingLevel === 0
    ? 'Xây nhà đầu tiên'
    : buildingLevel < 4
      ? `Nâng cấp nhà ${buildingLevel + 1}/4`
      : 'Nâng cấp khách sạn';
  const buildBlockedReason = !ownsFullGroup
    ? 'Cần sở hữu đủ bộ màu'
    : !canBuildEvenly
      ? 'Hãy nâng cấp đồng đều cả bộ'
      : !canAffordBuild
        ? `Cần thêm ${formatCurrency(buildCost - activePlayer.cash, currency)}`
        : isMaxUpgrade
          ? 'Đã nâng cấp tối đa'
          : '';
  const saleValue = Math.round((space.price ?? 0) / 20) * 10;
  const canSell = canManage && isOwner && (ownership?.houses ?? 0) === 0 && saleValue > 0;

  const ownerPreset = ownership?.ownerId
    ? getPlayerPreset(ownership.ownerId)
    : null;

  const accentColor = space.colorGroup ? COLOR_HEX[space.colorGroup] : '#f0b429';
  const houseLabels = ['—', '🏠', '🏠🏠', '🏠🏠🏠', '🏠🏠🏠🏠', '🏨 Khách Sạn'];

  return (
    <div
      className="property-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Thẻ tài sản ${space.name}`}
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="property-card-modal relative w-full max-w-[370px] overflow-hidden rounded-[28px] shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #1a1a1a 0%, #111 100%)',
          border: `2px solid ${accentColor}66`,
          boxShadow: `0 0 60px ${accentColor}33, 0 30px 60px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/25 text-white transition hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Đóng thẻ tài sản"
        >
          <X size={20} />
        </button>

        {/* Color header */}
        <div
          className="w-full px-6 pb-5 pt-6 text-center"
          style={{ background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)` }}
        >
          <div className="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
            <Building2 size={14} /> Thẻ tài sản
          </div>
          <h2
            className="text-2xl font-black uppercase leading-tight text-white"
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
              : 'Đất chưa có chủ · Chỉ mua khi dừng tại ô'}
        </div>

        {/* Rent table */}
        <div className="space-y-2 px-5 py-4">
          <div className="property-price-callout flex items-center justify-between rounded-2xl px-4 py-3">
            <span className="text-xs font-black uppercase tracking-wider text-white/55">Giá mua</span>
            <span className="text-2xl font-black text-yellow-300">
              {formatCurrency(space.price ?? 0, currency)}
            </span>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
            <span className="text-white/50 font-semibold">Tiền thuê cơ bản</span>
            <span className="font-black text-white">{formatCurrency(displayMoney(space.baseRent ?? 0), currency)}</span>
          </div>
          {space.type === 'PROPERTY' && (
            <>
              <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-white/50 font-semibold">Có đủ bộ màu</span>
                <span className="font-bold text-white/80">{formatCurrency(displayMoney((space.baseRent ?? 0) * 2), currency)}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-white/50 font-semibold">1 nhà → 4 nhà</span>
                <span className="font-bold text-white/70">×2 ~ ×10</span>
              </div>
              <div className="flex justify-between text-xs py-1.5">
                <span className="text-white/50 font-semibold">Khách sạn</span>
                <span className="font-bold text-rose-400">×50</span>
              </div>
            </>
          )}
          {space.type === 'RAILROAD' && (
            <div className="text-[10px] text-white/40 pt-1">
              1 bến {formatCurrency(25, currency)} · 2 bến {formatCurrency(50, currency)} · 3 bến {formatCurrency(100, currency)} · 4 bến {formatCurrency(200, currency)}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-2 px-5 pb-5">
          {isOwner && space.type === 'PROPERTY' && (
            <div className="property-upgrade-card">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200/65">Tiến độ công trình</div>
                  <div className="mt-0.5 text-sm font-black text-white">
                    {buildingLevel >= 5 ? 'Khách sạn hoàn thiện' : `${buildingLevel}/4 nhà`}
                  </div>
                </div>
                <div className="flex items-end gap-1" aria-label={`Cấp công trình ${buildingLevel} trên 5`}>
                  {[1, 2, 3, 4].map((level) => (
                    <span key={level} className={`upgrade-house-step ${buildingLevel >= level ? 'is-complete' : ''}`}>⌂</span>
                  ))}
                  <span className={`upgrade-hotel-step ${buildingLevel >= 5 ? 'is-complete' : ''}`}><Hotel size={15} /></span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => canBuild && onBuildHouse(space.index)}
                disabled={!canBuild}
                className="property-upgrade-button flex min-h-16 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/18 shadow-inner">
                  {buildingLevel === 4 ? <Hotel size={24} /> : <Hammer size={24} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-black uppercase leading-tight tracking-wide">{isMaxUpgrade ? 'Đã nâng cấp tối đa' : nextUpgradeLabel}</span>
                  <span className="mt-0.5 block text-[11px] font-bold text-emerald-50/75">
                    {canBuild ? 'Chạm để xây ngay' : buildBlockedReason}
                  </span>
                </span>
                {!isMaxUpgrade && <span className="text-xl font-black text-amber-200">{formatCurrency(buildCost, currency)}</span>}
              </button>
            </div>
          )}

          {isOwner && (
            <button
              type="button"
              onClick={() => canSell && onSellProperty(space.index)}
              disabled={!canSell}
              className="property-sell-button flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black uppercase tracking-wider transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              title={canSell ? `Bán lại cho ngân hàng với giá ${formatCurrency(saleValue, currency)}` : 'Cần bán hết nhà trước khi bán tài sản'}
            >
              <HandCoins size={18} /> Bán tài sản · +{formatCurrency(saleValue, currency)}
            </button>
          )}

          {isOwner && !canSell && (ownership?.houses ?? 0) > 0 && (
            <p className="text-center text-[11px] font-bold text-amber-200/65">Bán hết nhà trước khi bán tài sản.</p>
          )}

          <button
            type="button"
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
