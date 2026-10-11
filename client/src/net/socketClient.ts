import { io, Socket } from 'socket.io-client';
import { GameAction, GameState } from '../core/types/game';

export interface RoomPlayer {
  playerId: number;
  name: string;
  connected: boolean;
  ready: boolean;
}

export interface RoomSnapshot {
  status: "LOBBY" | "PLAYING"; hostId: number; maxPlayers: number;
  messages: Array<{ id: number; playerId: number; name: string; text: string }>;
  roomCode: string;
  playerId?: number;
  sessionToken?: string;
  players: RoomPlayer[];
  gameState: GameState;
}

export interface ClientToServerEvents {
  room_ready: (payload: { roomCode: string; ready: boolean }) => void;
  room_start: (payload: { roomCode: string }) => void;
  room_chat: (payload: { roomCode: string; text: string }) => void;
  room_throw: (payload: { roomCode: string; targetId: number; prop: string }) => void;
  connection_ping: (ack: () => void) => void;
  create_room: (payload: { playerName: string; avatarId: number; playerCount?: number }) => void;
  join_room: (payload: { roomCode: string; playerName: string; avatarId: number; sessionToken?: string }) => void;
  game_action: (payload: { roomCode: string; action: GameAction }) => void;
  leave_room: (payload: { roomCode: string }) => void;
}

export interface ServerToClientEvents {
  room_thrown: (payload: { id: number; sourceId: number; targetId: number; prop: string }) => void;
  room_state: (snapshot: RoomSnapshot) => void;
  game_state: (payload: { roomCode: string; gameState: GameState }) => void;
  room_error: (payload: { message: string }) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket() {
  if (!socket) {
    const url = import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin);
    socket = io(url, {
      autoConnect: false,
      path: import.meta.env.VITE_SOCKET_PATH || '/socket.io',
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
