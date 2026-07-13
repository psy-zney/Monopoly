import React from 'react';
import { PlayerState } from '../../core/types/game';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';
import { DoraemonAvatar } from './DoraemonAvatar';

export interface PlayerHUDProps {
  players: PlayerState[];
  activePlayerIndex: number;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ players, activePlayerIndex }) => {
  return (
    <div className="w-full max-w-[950px] mx-auto mb-3 grid grid-cols-3 md:grid-cols-6 gap-2">
      {Array.from({ length: 6 }).map((_, idx) => {
        const player = players[idx];

        if (!player) {
          return (
            <div
              key={`empty-top-${idx}`}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border-2 border-dashed border-amber-400/70 bg-amber-50/50 select-none"
            >
              <div className="w-7 h-7 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-700 font-black text-xs shrink-0 bg-white">
                +
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black text-amber-900 uppercase">Ghế #{idx + 1}</div>
                <div className="text-[8px] font-bold text-amber-600">Trống ●</div>
              </div>
            </div>
          );
        }

        const preset = SIX_PLAYER_PRESETS.find((p) => p.id === player.id) ?? SIX_PLAYER_PRESETS[0];
        const isActive = idx === activePlayerIndex;

        return (
          <div
            key={player.id}
            className="relative flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-200"
            style={{
              background: isActive ? `${preset.colorHex}18` : '#fff',
              border: isActive ? `2px solid ${preset.colorHex}` : '2px solid #e2d9b0',
              boxShadow: isActive ? `0 2px 12px ${preset.colorHex}44` : '0 1px 4px rgba(0,0,0,0.08)',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
              opacity: player.isBankrupt ? 0.4 : 1,
            }}
          >
            {/* Avatar */}
            <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden border border-slate-300">
              <DoraemonAvatar playerId={player.id} size={28} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-black truncate"
                style={{ color: isActive ? preset.colorHex : '#444' }}
              >
                {player.name}
              </div>
              <div
                className="text-sm font-black"
                style={{
                  color: player.cash > 500 ? '#16a34a' : player.cash > 200 ? '#d97706' : '#dc2626',
                }}
              >
                ${player.cash.toLocaleString()}
              </div>
              {(player.taxDebt ?? 0) > 0 && (
                <div className="text-[8px] font-black text-red-600">
                  Nợ ${player.taxDebt} · {player.taxDebtRounds}/3
                </div>
              )}
            </div>

            {isActive && (
              <div
                className="absolute top-0.5 right-1 text-[7px] font-black px-1 py-0.5 rounded uppercase"
                style={{ background: preset.colorHex, color: '#fff' }}
              >
                Lượt
              </div>
            )}

            {player.isBankrupt && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl text-[9px] font-black text-red-500">
                PHÁ SẢN
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export interface PlayerSeatCardProps {
  player: PlayerState;
  isActive: boolean;
}

export const PlayerSeatCard: React.FC<PlayerSeatCardProps> = ({ player, isActive }) => {
  const preset = SIX_PLAYER_PRESETS.find((p) => p.id === player.id) ?? SIX_PLAYER_PRESETS[0];

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{
        opacity: player.isBankrupt ? 0.35 : 1,
      }}
    >
      {/* Circle Avatar Wrapper */}
      <div
        className={`relative rounded-full p-[2px] transition-all duration-300 ${isActive ? 'ring-pulse scale-105' : ''}`}
        style={{
          background: `radial-gradient(circle, ${preset.colorHex} 60%, #fff 100%)`,
          boxShadow: isActive
            ? `0 0 20px ${preset.colorHex}aa, 0 4px 12px rgba(0,0,0,0.3)`
            : '0 4px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div className="rounded-full overflow-hidden border border-slate-700 bg-white w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
          <DoraemonAvatar playerId={player.id} size={64} />
        </div>

        {/* Turn Active Badge */}
        {isActive && (
          <div
            className="absolute -top-1 -right-1 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              border: '1px solid #fff',
            }}
          >
            Lượt
          </div>
        )}
      </div>

      {/* Info labels */}
      <div className="mt-1.5 flex flex-col items-center">
        {/* Name pill */}
        <div
          className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow border"
          style={{
            background: 'rgba(0,0,0,0.85)',
            borderColor: preset.colorHex,
          }}
        >
          {player.name}
        </div>
        {/* Cash amount */}
        <div
          className="text-xs font-black mt-0.5 drop-shadow-sm text-center"
          style={{
            color: player.cash > 500 ? '#16a34a' : player.cash > 200 ? '#d97706' : '#dc2626',
          }}
        >
          ${player.cash.toLocaleString()}
        </div>
        {(player.taxDebt ?? 0) > 0 && (
          <div className="mt-0.5 rounded bg-red-50 px-1.5 py-0.5 text-[8px] font-black text-red-600">
            Nợ thuế ${player.taxDebt} · {player.taxDebtRounds}/3
          </div>
        )}
      </div>
    </div>
  );
};

export interface EmptySeatCardProps {
  seatIndex: number;
  onClick: () => void;
}

export const EmptySeatCard: React.FC<EmptySeatCardProps> = ({ seatIndex, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center select-none cursor-pointer group transition-all duration-300 hover:scale-110"
      title="Bấm để mở phòng chờ / thêm người chơi"
    >
      {/* Pure Circular Empty Slot */}
      <div className="relative rounded-full p-[3px] border-2 border-dashed border-amber-500/80 group-hover:border-amber-400 bg-amber-100/60 group-hover:bg-amber-300/60 transition-all shadow-md">
        <div className="rounded-full w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center bg-white/90 border border-amber-400/50 text-amber-800 group-hover:text-amber-950">
          <span className="text-2xl font-black leading-none">+</span>
          <span className="text-[9px] font-black uppercase tracking-tighter mt-0.5">TRỐNG</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-[8px] font-black text-amber-300 uppercase whitespace-nowrap shadow">
          Ghế #{seatIndex + 1}
        </div>
      </div>
    </div>
  );
};


