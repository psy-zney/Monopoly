import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Landmark, Home, ShieldAlert } from 'lucide-react';
import { PlayerState, PropertyOwnershipState } from '../../core/types/game';
import { VIETNAMESE_BOARD_SPACES } from '../../core/constants/vietnameseBoardData';
import { formatCurrency, CurrencyType } from '../../core/types/currency';
import { PlayerAvatar } from './PlayerAvatar';

export interface PlayerColumnProps {
  players: PlayerState[];
  activePlayerId?: number;
  allProperties: Record<number, PropertyOwnershipState>;
  currency?: CurrencyType;
  onSelectPlayer: (player: PlayerState) => void;
  columnSide: 'left' | 'right';
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

export const PlayerColumn: React.FC<PlayerColumnProps> = ({
  players,
  activePlayerId,
  allProperties,
  currency = 'GOLD',
  onSelectPlayer,
  columnSide,
}) => {
  return (
    <aside
      className={`player-column flex flex-col gap-3 py-2 z-20 select-none w-full max-w-[210px] ${
        columnSide === 'left' ? 'items-start' : 'items-end'
      }`}
      aria-label={`Danh sách người chơi cột ${columnSide === 'left' ? 'trái' : 'phải'}`}
    >
      {players.map((player) => {
        const isActive = player.id === activePlayerId;

        // Calculate owned properties summary
        let propertyCount = 0;
        let houseCount = 0;
        const ownedColorGroups = new Set<string>();

        VIETNAMESE_BOARD_SPACES.forEach((space) => {
          const prop = allProperties[space.index];
          if (prop?.ownerId === player.id) {
            propertyCount += 1;
            houseCount += prop.houses;
            if (space.colorGroup) {
              ownedColorGroups.add(space.colorGroup);
            }
          }
        });

        return (
          <motion.button
            type="button"
            layout
            key={player.id}
            onClick={() => onSelectPlayer(player)}
            title={`Chạm để xem chi tiết tài sản của ${player.name}`}
            className={`player-status-card group relative flex w-full flex-col rounded-2xl p-2.5 cursor-pointer backdrop-blur-md transition-all duration-200 active:scale-[0.98] ${
              isActive
                ? 'bg-slate-900/95 border-2 border-amber-400 shadow-xl shadow-amber-500/20'
                : 'bg-slate-900/80 border border-slate-750/80 hover:border-slate-600 hover:bg-slate-850'
            } ${player.isBankrupt ? 'opacity-40 grayscale pointer-events-none' : ''}`}
            animate={{ scale: isActive ? 1.02 : 1 }}
          >
            {/* Active Turn Glow and Crown Pill */}
            {isActive && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950 shadow-md border border-white">
                <Crown size={10} fill="currentColor" /> LƯỢT ĐI
              </div>
            )}

            {/* Top row: Avatar + Name + Cash */}
            <div className="flex items-center gap-2 w-full min-w-0">
              <div className="relative shrink-0">
                <PlayerAvatar playerId={player.id} size={42} showGlow={isActive} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                  {player.name}
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-amber-300 mt-0.5">
                  <Landmark size={12} className="text-amber-400 shrink-0" />
                  <span className="font-mono">{formatCurrency(player.cash, currency)}</span>
                </div>
              </div>
            </div>

            {/* Bottom row: Property & Status indicators */}
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-300">
              <div className="flex items-center gap-1">
                <span className="font-bold flex items-center gap-0.5 text-slate-400">
                  <Home size={11} className="text-emerald-400" /> {propertyCount} ô
                </span>
                {houseCount > 0 && (
                  <span className="font-bold text-amber-300">
                    · 🏠{houseCount}
                  </span>
                )}
              </div>

              {/* Color dots for owned groups */}
              <div className="flex items-center gap-1">
                {Array.from(ownedColorGroups).slice(0, 4).map((group) => (
                  <span
                    key={group}
                    className="h-2 w-2 rounded-full"
                    style={{ background: COLOR_BAR[group] || '#cbd5e1' }}
                    title={`Nhóm màu ${group}`}
                  />
                ))}
                {ownedColorGroups.size > 4 && (
                  <span className="text-[8px] font-bold text-slate-400">+{ownedColorGroups.size - 4}</span>
                )}
              </div>
            </div>

            {/* Status alerts: In Jail or Tax Debt */}
            {player.inJail && (
              <div className="mt-1 flex items-center justify-center gap-1 rounded-md bg-rose-950/60 px-1.5 py-0.5 text-[9px] font-bold text-rose-300 border border-rose-500/30">
                <ShieldAlert size={10} /> Đang ở Tù ({player.jailTurns}/3)
              </div>
            )}

            {(player.taxDebt ?? 0) > 0 && (
              <div className="mt-1 text-center rounded-md bg-amber-950/50 px-1 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                Nợ thuế {formatCurrency(player.taxDebt, currency)}
              </div>
            )}

          </motion.button>
        );
      })}
    </aside>
  );
};
