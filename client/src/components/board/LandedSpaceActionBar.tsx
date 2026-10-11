import React from 'react';
import { ShoppingCart, Gavel, Info } from 'lucide-react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { PlayerState } from '../../core/types/game';
import { formatCurrency, CurrencyType } from '../../core/types/currency';
import { Button } from '../ui/Button';

export interface LandedSpaceActionBarProps {
  space: BoardSpaceData;
  activePlayer: PlayerState;
  currency?: CurrencyType;
  onBuy: () => void;
  onAuction: () => void;
  onInspect: () => void;
}

export const LandedSpaceActionBar: React.FC<LandedSpaceActionBarProps> = ({
  space,
  activePlayer,
  currency = 'GOLD',
  onBuy,
  onAuction,
  onInspect,
}) => {
  const price = space.price ?? 0;
  const canAfford = activePlayer.cash >= price;

  return (
    <div
      className="landed-action-bar pointer-events-auto flex w-full flex-col gap-1.5 rounded-xl border border-amber-400/70 bg-[#133d30] p-2 text-white shadow-lg"
      role="region"
      aria-label="Hành động tại ô đất vừa dừng chân"
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <span className="block text-[9px] font-black uppercase tracking-wider text-amber-300">Có thể mua</span>
            <span className="block truncate text-xs font-black text-white">
              {space.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs font-extrabold text-amber-300">
            {formatCurrency(price, currency)}
          </span>
        </div>
      </div>

      {/* Action Row - 1 Clear Primary Action */}
      <div className="flex items-center gap-1.5">
        {/* PRIMARY ACTION: Buy now */}
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          disabled={!canAfford}
          onClick={onBuy}
          icon={<ShoppingCart size={16} />}
        >
          {canAfford ? 'Mua đất' : 'Không đủ tiền'}
        </Button>

        {/* SECONDARY ACTION: Auction */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onAuction}
          icon={<Gavel size={15} />}
          title="Mở đấu giá cho tất cả người chơi"
        >
          Đấu giá
        </Button>

        {/* DETAILS: Inspect Deed */}
        <button
          type="button"
          onClick={onInspect}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
          title="Xem chi tiết thẻ quyền sở hữu"
          aria-label="Xem chi tiết thẻ quyền sở hữu"
        >
          <Info size={16} />
        </button>
      </div>

      {!canAfford && (
        <div className="text-[10px] font-bold text-rose-200 text-center">
          Cần thêm {formatCurrency(price - activePlayer.cash, currency)} · Có thể đấu giá
        </div>
      )}
    </div>
  );
};
