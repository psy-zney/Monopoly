import React, { useState } from 'react';
import { PlayerState } from '../../core/types/game';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';
import { DoraemonAvatar } from '../hud/DoraemonAvatar';

export interface LobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: PlayerState[];
  roomCode: string;
  onStartNewGame: (playerCount: number, customNames?: string[]) => void;
  onUpdatePlayerName: (name: string) => void;
  currentPlayerName: string;
}

export const LobbyModal: React.FC<LobbyModalProps> = ({
  isOpen,
  onClose,
  players,
  roomCode,
  onStartNewGame,
  onUpdatePlayerName,
  currentPlayerName,
}) => {
  const [nameInput, setNameInput] = useState(currentPlayerName || 'Người Chơi 1');
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<number>(Math.max(2, players.length));
  const [activeTab, setActiveTab] = useState<'lobby' | 'online'>('lobby');

  if (!isOpen) return null;

  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Người Chơi 1';
    onUpdatePlayerName(trimmed);
  };

  const handleStartGame = () => {
    handleSaveName();
    onStartNewGame(selectedPlayerCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-xl shadow">
              🎲
            </div>
            <div>
              <h2
                className="text-lg font-black uppercase tracking-wider text-white"
                style={{ fontFamily: 'Baloo 2, cursive' }}
              >
                Phòng Chờ Ván Đấu
              </h2>
              <p className="text-xs font-bold text-amber-400">
                Mã Phòng: <span className="font-mono text-white">{roomCode}</span> · Luật Cờ Tỷ Phú Miền Nam
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-600 flex items-center justify-center text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Player Name Card */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <label className="block text-xs font-black uppercase tracking-wider text-amber-400 mb-2">
              👤 Tên Nhân Vật Của Bạn
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-white">
                <DoraemonAvatar playerId={1} size={48} />
              </div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleSaveName}
                placeholder="Nhập tên của bạn..."
                className="flex-1 rounded-xl bg-slate-900 border border-slate-600 px-4 py-2.5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                maxLength={20}
              />
              <button
                onClick={handleSaveName}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
              >
                Lưu Tên
              </button>
            </div>
          </div>

          {/* Section 2: Mode & Queue Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
                🪑 Hàng Chờ Bàn Đấu ({selectedPlayerCount}/6 Ghế)
              </h3>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedPlayerCount(count)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                      selectedPlayerCount === count
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {count} Người
                  </button>
                ))}
              </div>
            </div>

            {/* Queue Slots Grid (Always 6 Slots visually: seated users + empty slots) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SIX_PLAYER_PRESETS.slice(0, 6).map((preset, idx) => {
                const isSeated = idx < selectedPlayerCount;
                const seatedPlayer = players[idx];
                const displayName =
                  idx === 0
                    ? nameInput.trim() || 'Người Chơi 1'
                    : seatedPlayer?.name || `Người Chơi ${idx + 1}`;

                if (isSeated) {
                  return (
                    <div
                      key={preset.id}
                      className="relative flex items-center gap-3 p-3 rounded-2xl border transition-all"
                      style={{
                        background: `${preset.colorHex}15`,
                        borderColor: preset.colorHex,
                      }}
                    >
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 bg-white shrink-0" style={{ borderColor: preset.colorHex }}>
                        <DoraemonAvatar playerId={preset.id} size={44} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-white truncate">
                          {displayName}
                        </div>
                        <div
                          className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                          style={{ color: preset.colorHex }}
                        >
                          ● Sẵn Sàng
                        </div>
                      </div>
                    </div>
                  );
                }

                // Empty Seat Slot in Queue
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPlayerCount(Math.max(selectedPlayerCount, idx + 1))}
                    className="flex items-center gap-3 p-3 rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-800/30 hover:border-amber-400/60 hover:bg-slate-800/60 cursor-pointer transition-all group"
                  >
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-amber-400 group-hover:border-amber-400 text-lg transition-colors">
                      +
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                        Ghế Trống #{idx + 1}
                      </div>
                      <div className="text-[10px] text-slate-500 group-hover:text-amber-400 transition-colors">
                        Bấm để mở ghế
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Khởi tạo ngay với <span className="font-black text-white">{selectedPlayerCount} người chơi</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              🚀 Bắt Đầu Ván Đấu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
