import React, { useState } from 'react';
import { OnlineState } from '../../store/useGameStore';

export interface OnlineRoomPanelProps {
  online: OnlineState;
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
  onLeaveRoom: () => void;
}

export const OnlineRoomPanel: React.FC<OnlineRoomPanelProps> = ({
  online,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
}) => {
  const [playerName, setPlayerName] = useState('Player');
  const [roomCode, setRoomCode] = useState('');

  if (online.roomCode) {
    return (
      <div className="max-w-[950px] mx-auto mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-400 bg-emerald-950/70 px-3 py-2 text-sm">
        <div>
          <span className="font-bold text-emerald-200">Online room:</span>{' '}
          <span className="font-mono font-black text-white">{online.roomCode}</span>
          <span className="ml-2 text-emerald-100">
            {online.connected ? 'connected' : 'offline'}
          </span>
        </div>
        <div className="text-xs text-emerald-100">
          {online.players.map((player) => player.name).join(', ')}
        </div>
        <button
          onClick={onLeaveRoom}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-white"
        >
          Leave
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[950px] mx-auto mb-3 grid gap-2 rounded-xl border border-amber-500/60 bg-slate-950/70 p-3 text-sm md:grid-cols-[1fr_1fr_auto_auto]">
      <input
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        placeholder="Player name"
        className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none focus:border-amber-400"
      />
      <input
        value={roomCode}
        onChange={(event) => setRoomCode(event.target.value)}
        placeholder="Room code"
        className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 font-mono text-white outline-none focus:border-amber-400"
      />
      <button
        onClick={() => onCreateRoom(playerName.trim() || 'Player')}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700"
      >
        Create
      </button>
      <button
        onClick={() => onJoinRoom(roomCode, playerName.trim() || 'Player')}
        className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-extrabold text-white hover:bg-amber-600"
      >
        Join
      </button>
      {online.error && (
        <div className="text-xs font-bold text-red-300 md:col-span-4">{online.error}</div>
      )}
    </div>
  );
};
