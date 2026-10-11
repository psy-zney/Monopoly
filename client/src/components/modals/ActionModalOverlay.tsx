import React from 'react';
import { ShoppingCart, Gavel, Building2 } from 'lucide-react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { PlayerState } from '../../core/types/game';
import { formatCurrency, CurrencyType } from '../../core/types/currency';
import { Button } from '../ui/Button';

export interface ActionModalOverlayProps {
  space: BoardSpaceData;
  activePlayer: PlayerState;
  currency?: CurrencyType;
  isOpen: boolean;
  onBuy: () => void;
  onAuction: () => void;
}

const COLOR_HEX: Record<string, string> = {
  BROWN:      '#8b5a32',
  LIGHT_BLUE: '#38bdf8',
  PINK:       '#ec4899',
  ORANGE:     '#f97316',
  RED:        '#ef4444',
  YELLOW:     '#eab308',
  GREEN:      '#10b981',
  DARK_BLUE:  '#2563eb',
};

export const ActionModalOverlay: React.FC<ActionModalOverlayProps> = ({
  space,
  activePlayer,
  currency = 'GOLD',
  isOpen,
  onBuy,
  onAuction,
}) => {
  if (!isOpen) return null;

  const price = space.price ?? 0;
  const canAfford = activePlayer.cash >= price;
  const accentColor = space.colorGroup ? COLOR_HEX[space.colorGroup] : '#f59e0b';

  return (
    <div
      className="action-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-modal-title"
    >
      <div
        className="action-modal-card relative w-full max-w-[360px] rounded-3xl bg-slate-900/95 border-2 border-amber-400/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 0 50px rgba(245, 158, 11, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8)`,
        }}
      >
        {/* ── CARD HEADER: Property Title Deed ── */}
        <div
          className="w-full px-5 pt-5 pb-4 text-center text-white relative"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/80 mb-1">
            <Building2 size={13} /> Ô Đất Trống Vô Chủ
          </div>
          <h2
            id="action-modal-title"
            className="text-xl sm:text-2xl font-black uppercase tracking-wide leading-tight drop-shadow-md"
            style={{ fontFamily: 'Baloo 2, cursive' }}
          >
            {space.name}
          </h2>
          <div className="mt-1 text-xs font-bold text-amber-200">
            Giá mua niêm yết: {formatCurrency(price, currency)}
          </div>
        </div>

        {/* ── BODY: Rent & Decision Details ── */}
        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-750 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5 font-semibold text-slate-300">
              <span>Tiền thuê đất cơ bản:</span>
              <span className="font-bold text-white">{formatCurrency(space.baseRent ?? 10, currency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5 font-semibold text-slate-300">
              <span>Số dư của bạn:</span>
              <span className={`font-bold ${canAfford ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(activePlayer.cash, currency)}
              </span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-slate-300">
              <span>Còn lại sau khi mua:</span>
              <span className="font-bold text-amber-300">
                {canAfford ? formatCurrency(activePlayer.cash - price, currency) : 'Thiếu tiền mặt'}
              </span>
            </div>
          </div>

          {!canAfford && (
            <div className="text-center rounded-xl bg-rose-950/50 p-2 text-xs font-bold text-rose-300 border border-rose-500/30">
              ⚠️ Bạn không đủ tiền mặt để mua. Bạn có thể mở đấu giá cho mọi người!
            </div>
          )}

          {/* ── ACTION BUTTONS: 1 Single Primary CTA ── */}
          <div className="flex flex-col gap-2 pt-1">
            {/* PRIMARY ACTION: Mua đất */}
            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm font-black"
              disabled={!canAfford}
              onClick={onBuy}
              icon={<ShoppingCart size={18} strokeWidth={2.6} />}
            >
              MUA NGAY · {formatCurrency(price, currency)}
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={onAuction}
              icon={<Gavel size={15} />}
            >
              KHÔNG MUA · MỞ ĐẤU GIÁ
            </Button>
          </div>
          <p className="text-center text-[11px] text-slate-400">Không mua sẽ mở đấu giá cho mọi người chơi.</p>
        </div>
      </div>
    </div>
  );
};
