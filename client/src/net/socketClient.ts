import { io, Socket } from 'socket.io-client';
import { GameAction, GameState } from '../core/types/game';

export interface RoomPlayer {
  playerId: number;
  name: string;
  connected: boolean;
}

export interface RoomSnapshot {
  roomCode: string;
  playerId?: number;
  sessionToken?: string;
  players: RoomPlayer[];
  gameState: GameState;
}

export interface ClientToServerEvents {
  create_room: (payload: { playerName: string; playerCount?: number }) => void;
  join_room: (payload: { roomCode: string; playerName: string; sessionToken?: string }) => void;
  game_action: (payload: { roomCode: string; action: GameAction }) => void;
  leave_room: (payload: { roomCode: string }) => void;
}

export interface ServerToClientEvents {
  room_state: (snapshot: RoomSnapshot) => void;
  game_state: (payload: { roomCode: string; gameState: GameState }) => void;
  room_error: (payload: { message: string }) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket() {
  if (!socket) {
    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    socket = io(url, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
