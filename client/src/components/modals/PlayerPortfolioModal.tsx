import React from 'react';
import { X, Building2, Home, Landmark, Hotel, ShieldAlert, Award } from 'lucide-react';
import { PlayerState, PropertyOwnershipState } from '../../core/types/game';
import { VIETNAMESE_BOARD_SPACES, BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { getPlayerPreset } from '../../core/types/playerTokens';
import { formatCurrency, CurrencyType } from '../../core/types/currency';
import { PlayerAvatar } from '../hud/PlayerAvatar';
import { EmptyState } from '../ui/EmptyState';
import { Badge } from '../ui/Badge';

export interface PlayerPortfolioModalProps {
  player: PlayerState;
  allProperties: Record<number, PropertyOwnershipState>;
  currency?: CurrencyType;
  isOpen: boolean;
  onClose: () => void;
  onSelectSpace?: (spaceIndex: number) => void;
}

const COLOR_BAR: Record<string, string> = {
  BROWN: '#8b5a32',
  LIGHT_BLUE: '#38bdf8',
  PINK: '#f43f5e',
  ORANGE: '#f97316',
  RED: '#ef4444',
  YELLOW: '#eab308',
  GREEN: '#10b981',
  DARK_BLUE: '#2563eb',
};

export const PlayerPortfolioModal: React.FC<PlayerPortfolioModalProps> = ({
  player,
  allProperties,
  currency = 'GOLD',
  isOpen,
  onClose,
  onSelectSpace,
}) => {
  if (!isOpen) return null;

  const preset = getPlayerPreset(player.id);

  // Find all owned spaces
  const ownedSpaces: { space: BoardSpaceData; ownership: PropertyOwnershipState }[] = [];
  let totalPropertyLandValue = 0;
  let totalBuildingsValue = 0;

  VIETNAMESE_BOARD_SPACES.forEach((space) => {
    const prop = allProperties[space.index];
    if (prop?.ownerId === player.id) {
      ownedSpaces.push({ space, ownership: prop });
      totalPropertyLandValue += space.price ?? 0;
      if (space.colorGroup && prop.houses > 0) {
        // approx building value
        totalBuildingsValue += prop.houses * (space.colorGroup === 'BROWN' || space.colorGroup === 'LIGHT_BLUE' ? 50 : 100);
      }
    }
  });

  const totalNetWorth = player.cash + totalPropertyLandValue + totalBuildingsValue;

  return (
    <div
      className="portfolio-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 select-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Tài sản của ${player.name}`}
      style={{ background: 'rgba(2, 6, 23, 0.82)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="portfolio-modal-card relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Player Info */}
        <div
          className="portfolio-modal-header relative flex items-center justify-between px-5 py-4 border-b border-white/10"
          style={{
            background: `linear-gradient(135deg, ${preset.colorHex}22, rgba(15, 23, 42, 0.95))`,
          }}
        >
          <div className="portfolio-player-copy flex items-center gap-3">
            <PlayerAvatar playerId={player.id} size={46} showGlow />
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg font-black text-white uppercase tracking-wide"
                  style={{ fontFamily: 'Baloo 2, cursive' }}
                >
                  {player.name}
                </h2>
                {player.inJail && <Badge variant="rose" icon={<ShieldAlert size={12} />}>Trong tù</Badge>}
              </div>
              <div className="portfolio-summary flex items-center gap-2 mt-0.5 text-xs text-slate-300">
                <span className="text-amber-300 font-extrabold flex items-center gap-1">
                  <Landmark size={12} /> {formatCurrency(player.cash, currency)} tiền mặt
                </span>
                <span>·</span>
                <span className="text-emerald-300 font-bold">
                  Tổng tài sản: {formatCurrency(totalNetWorth, currency)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Đóng bảng tài sản"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
            <span>Danh mục bất động sản ({ownedSpaces.length})</span>
            <span>Giá trị & Nhà</span>
          </div>

          {ownedSpaces.length === 0 ? (
            /* Empty State per user guidelines */
            <EmptyState
              icon={<Home size={32} />}
              title="Chưa sở hữu bất động sản nào"
              description="Hãy đổ xúc xắc và mua đất khi dừng chân để bắt đầu xây dựng đế chế tài chính của bạn!"
              actionText="Đóng"
              onAction={onClose}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ownedSpaces.map(({ space, ownership }) => {
                const colorBar = space.colorGroup ? COLOR_BAR[space.colorGroup] : '#64748b';
                return (
                  <div
                    key={space.index}
                    onClick={() => {
                      if (onSelectSpace) {
                        onSelectSpace(space.index);
                        onClose();
                      }
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-xl bg-slate-800/80 p-2.5 border border-slate-700/80 hover:border-amber-400/60 hover:bg-slate-750 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-9 w-2 rounded-full shrink-0 shadow-sm"
                        style={{ background: colorBar }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                          {space.name}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">
                          Ô số {space.index} · {formatCurrency(space.price, currency)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {ownership.houses > 0 && ownership.houses < 5 && (
                        <span className="flex items-center text-xs font-black text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                          🏠 x{ownership.houses}
                        </span>
                      )}
                      {ownership.houses >= 5 && (
                        <span className="flex items-center text-xs font-black text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded-md border border-amber-500/30">
                          🏨 KS
                        </span>
                      )}
                      {ownership.isMortgaged && (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded-md">
                          Thế chấp
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
