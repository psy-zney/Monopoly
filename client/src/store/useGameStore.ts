import { create, type StateCreator } from 'zustand';
import { GameState, GameAction } from '../core/types/game';
import { createInitialGameState, reduceGameState } from '../core/engine/reducer';
import { disconnectSocket, getSocket, RoomPlayer } from '../net/socketClient';

export interface OnlineState {
  connected: boolean;
  roomCode: string | null;
  playerId: number | null;
  sessionToken: string | null;
  players: RoomPlayer[];
  error: string | null;
}

export interface GameStore {
  gameState: GameState;
  online: OnlineState;
  dispatch: (action: GameAction) => void;
  resetGame: (playerCount?: number) => void;
  connectSocket: () => void;
  createOnlineRoom: (playerName: string, playerCount?: number) => void;
  joinOnlineRoom: (roomCode: string, playerName: string) => void;
  leaveOnlineRoom: () => void;
}

const initialOnlineState: OnlineState = {
  connected: false,
  roomCode: null,
  playerId: null,
  sessionToken: null,
  players: [],
  error: null,
};

let handlersRegistered = false;
type StoreSet = Parameters<StateCreator<GameStore>>[0];

function registerSocketHandlers(set: StoreSet) {
  if (handlersRegistered) return;
  handlersRegistered = true;

  const socket = getSocket();
  socket.on('connect', () => {
    set((state) => ({ online: { ...state.online, connected: true, error: null } }));
  });
  socket.on('disconnect', () => {
    set((state) => ({ online: { ...state.online, connected: false } }));
  });
  socket.on('room_state', (snapshot) => {
    set((state) => ({
      gameState: snapshot.gameState,
      online: {
        ...state.online,
        connected: socket.connected,
        roomCode: snapshot.roomCode,
        playerId: snapshot.playerId ?? state.online.playerId,
        sessionToken: snapshot.sessionToken ?? state.online.sessionToken,
        players: snapshot.players,
        error: null,
      },
    }));
  });
  socket.on('game_state', (payload) => {
    set((state) => ({
      gameState: payload.gameState,
      online: { ...state.online, roomCode: payload.roomCode, error: null },
    }));
  });
  socket.on('room_error', (payload) => {
    set((state) => ({ online: { ...state.online, error: payload.message } }));
  });
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createInitialGameState(6),
  online: initialOnlineState,
  dispatch: (action: GameAction) => {
    const { online } = get();
    if (online.roomCode) {
      getSocket().emit('game_action', { roomCode: online.roomCode, action });
      return;
    }

    set((state) => ({
      gameState: reduceGameState(state.gameState, action),
    }));
  },
  resetGame: (playerCount = 6) =>
    set({
      gameState: createInitialGameState(playerCount),
      online: initialOnlineState,
    }),
  connectSocket: () => {
    registerSocketHandlers(set);
    const socket = getSocket();
    if (!socket.connected) socket.connect();
  },
  createOnlineRoom: (playerName: string, playerCount = 6) => {
    get().connectSocket();
    getSocket().emit('create_room', { playerName, playerCount });
  },
  joinOnlineRoom: (roomCode: string, playerName: string) => {
    get().connectSocket();
    getSocket().emit('join_room', {
      roomCode: roomCode.trim().toUpperCase(),
      playerName,
      sessionToken: get().online.sessionToken ?? undefined,
    });
  },
  leaveOnlineRoom: () => {
    const roomCode = get().online.roomCode;
    if (roomCode) {
      getSocket().emit('leave_room', { roomCode });
    }
    disconnectSocket();
    set({ online: initialOnlineState, gameState: createInitialGameState(6) });
  },
}));
