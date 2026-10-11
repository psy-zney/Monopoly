import React from 'react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { PlayerState } from '../../core/types/game';
import { getPlayerPreset } from '../../core/types/playerTokens';
import { formatCurrency, CurrencyType } from '../../core/types/currency';
import { PlayerAvatar } from '../hud/PlayerAvatar';

interface AuctionState {
  isOpen: boolean;
  spaceIndex: number | null;
  highestBid: number;
  highestBidderId: number | null;
}

export interface AuctionModalProps {
  space: BoardSpaceData;
  players: PlayerState[];
  auctionState: AuctionState;
  currency?: CurrencyType;
  onBid: (playerId: number, bidAmount: number) => void;
  onPass: (playerId: number) => void;
  onFinalize: () => void;
}

export const AuctionModal: React.FC<AuctionModalProps> = ({
  space,
  players,
  auctionState,
  currency = 'GOLD',
  onBid,
  onPass,
  onFinalize,
}) => {
  const currentBid = auctionState.highestBid;
  const topBidder = auctionState.highestBidderId
    ? players.find((p) => p.id === auctionState.highestBidderId)
    : null;

  const topPreset = topBidder
    ? getPlayerPreset(topBidder.id)
    : null;

  return (
    <div
      className="auction-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Đấu giá ${space.name}`}
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="auction-modal-card w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #18181b 0%, #09090b 100%)',
          border: '2px solid rgba(240,180,41,0.4)',
          boxShadow: '0 0 80px rgba(240,180,41,0.2), 0 40px 80px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.6), rgba(180,30,20,0.5))',
            borderBottom: '1px solid rgba(240,180,41,0.2)',
          }}
        >
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-200 mb-1">
            🔨 Đấu Giá Công Khai
          </div>
          <h2
            className="text-xl font-black text-white uppercase"
            style={{ fontFamily: 'Baloo 2, cursive' }}
          >
            {space.name}
          </h2>
          <div className="text-xs text-yellow-300 font-bold mt-1">
            Giá niêm yết: {formatCurrency(space.price, currency)}
          </div>
        </div>

        {/* Current highest bid */}
        <div className="px-6 py-4 text-center bg-slate-950/40">
          <div className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">
            Mức Giá Trả Cao Nhất
          </div>
          <div
            className="text-4xl font-black"
            style={{ color: '#f0b429', fontFamily: 'Baloo 2, cursive' }}
          >
            {formatCurrency(currentBid, currency)}
          </div>
          {topBidder && topPreset && (
            <div
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
              style={{
                background: `${topPreset.colorHex}25`,
                color: topPreset.colorHex,
                border: `1px solid ${topPreset.colorHex}55`,
              }}
            >
              <PlayerAvatar playerId={topBidder.id} size={20} />
              <span>{topBidder.name}</span>
            </div>
          )}
          {!topBidder && (
            <div className="mt-1 text-xs text-white/40 font-bold">
              Chưa có ai ra giá
            </div>
          )}
        </div>

        {/* Player bid rows */}
        <div
          className="auction-player-list px-4 py-3 space-y-2 max-h-60 overflow-y-auto"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {players.filter(p => !p.isBankrupt).map((player) => {
            const preset = getPlayerPreset(player.id);
            const isHighestBidder = player.id === auctionState.highestBidderId;
            return (
              <div
                key={player.id}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-2xl transition-all"
                style={{
                  background: isHighestBidder
                    ? `${preset.colorHex}22`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isHighestBidder ? preset.colorHex + '66' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <PlayerAvatar playerId={player.id} size={30} showGlow={isHighestBidder} />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate max-w-[100px]">{player.name}</div>
                    <div className="text-[10px] text-emerald-400 font-bold">{formatCurrency(player.cash, currency)}</div>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {[10, 50].map((increment) => (
                    <button
                      key={increment}
                      type="button"
                      disabled={player.cash < currentBid + increment}
                      onClick={() => onBid(player.id, currentBid + increment)}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                      style={{
                        background: increment === 10
                          ? preset.colorHex
                          : '#dc2626',
                        color: '#fff',
                      }}
                    >
                      +{increment}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => onPass(player.id)}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 bg-slate-800 text-slate-400 hover:text-white"
                  >
                    Bỏ
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Finalize footer */}
        <div
          className="px-5 pb-5 pt-3 bg-slate-950"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            type="button"
            disabled={!topBidder}
            onClick={onFinalize}
            className="w-full py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-30"
            style={{
              background: topBidder
                ? 'linear-gradient(135deg, #f0b429, #d97706)'
                : 'rgba(255,255,255,0.05)',
              color: topBidder ? '#1a0a00' : '#fff',
              boxShadow: topBidder ? '0 4px 20px rgba(240,180,41,0.5)' : 'none',
            }}
          >
            🎉 Chốt Quyền Sở Hữu: {formatCurrency(currentBid, currency)}
          </button>
        </div>
      </div>
    </div>
  );
};
