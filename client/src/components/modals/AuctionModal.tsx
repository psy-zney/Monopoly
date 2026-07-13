import React, { useState } from 'react';
import { BoardSpaceData } from '../../core/constants/vietnameseBoardData';
import { PlayerState } from '../../core/types/game';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';

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
  onBid: (playerId: number, bidAmount: number) => void;
  onPass: (playerId: number) => void;
  onFinalize: () => void;
}

export const AuctionModal: React.FC<AuctionModalProps> = ({
  space,
  players,
  auctionState,
  onBid,
  onPass,
  onFinalize,
}) => {
  const currentBid = auctionState.highestBid;
  const topBidder = auctionState.highestBidderId
    ? players.find((p) => p.id === auctionState.highestBidderId)
    : null;

  const topPreset = topBidder
    ? SIX_PLAYER_PRESETS.find((p) => p.id === topBidder.id)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #1a0a00 0%, #120800 100%)',
          border: '2px solid rgba(240,180,41,0.4)',
          boxShadow: '0 0 80px rgba(240,180,41,0.2), 0 40px 80px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.5), rgba(180,30,20,0.4))',
            borderBottom: '1px solid rgba(240,180,41,0.2)',
          }}
        >
          <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
            🔨 Đấu Giá Công Khai
          </div>
          <h2
            className="text-xl font-black text-white uppercase"
            style={{ fontFamily: 'Baloo 2, cursive' }}
          >
            {space.name}
          </h2>
          <div className="text-xs text-yellow-400/70 font-bold mt-1">
            Giá niêm yết: ${space.price}
          </div>
        </div>

        {/* Current highest bid */}
        <div className="px-6 py-4 text-center">
          <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">
            Mức Giá Cao Nhất
          </div>
          <div
            className="text-4xl font-black"
            style={{ color: '#f0b429', fontFamily: 'Baloo 2, cursive' }}
          >
            ${currentBid}
          </div>
          {topBidder && topPreset && (
            <div
              className="mt-1.5 inline-block px-3 py-1 rounded-full text-[10px] font-black"
              style={{
                background: `${topPreset.colorHex}22`,
                color: topPreset.colorHex,
                border: `1px solid ${topPreset.colorHex}44`,
              }}
            >
              {topPreset.shortLabel} · {topBidder.name}
            </div>
          )}
          {!topBidder && (
            <div className="mt-1 text-[10px] text-white/30 font-bold">
              Chưa có ai ra giá
            </div>
          )}
        </div>

        {/* Player bid rows */}
        <div
          className="px-4 pb-3 space-y-2 max-h-56 overflow-y-auto"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {players.filter(p => !p.isBankrupt).map((player) => {
            const preset = SIX_PLAYER_PRESETS.find((p) => p.id === player.id) ?? SIX_PLAYER_PRESETS[0];
            const isHighestBidder = player.id === auctionState.highestBidderId;
            return (
              <div
                key={player.id}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: isHighestBidder
                    ? `${preset.colorHex}22`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isHighestBidder ? preset.colorHex + '55' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                    style={{ background: preset.colorHex }}
                  >
                    {preset.shortLabel}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/80">{player.name}</div>
                    <div className="text-[9px] text-green-400 font-bold">${player.cash}</div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {[10, 50].map((increment) => (
                    <button
                      key={increment}
                      disabled={player.cash < currentBid + increment}
                      onClick={() => onBid(player.id, currentBid + increment)}
                      className="px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background: increment === 10
                          ? `${preset.colorHex}cc`
                          : '#dc2626',
                        color: '#fff',
                      }}
                    >
                      +${increment}
                    </button>
                  ))}
                  <button
                    onClick={() => onPass(player.id)}
                    className="px-2 py-1 rounded-lg text-[9px] font-bold transition-all active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      color: 'rgba(255,255,255,0.4)',
                    }}
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
          className="px-4 pb-4 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            disabled={!topBidder}
            onClick={onFinalize}
            className="w-full py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-30"
            style={{
              background: topBidder
                ? 'linear-gradient(135deg, #f0b429, #d97706)'
                : 'rgba(255,255,255,0.05)',
              color: topBidder ? '#1a0a00' : '#fff',
              boxShadow: topBidder ? '0 4px 20px rgba(240,180,41,0.5)' : 'none',
            }}
          >
            🎉 Chốt Giá ${currentBid}
          </button>
        </div>
      </div>
    </div>
  );
};
