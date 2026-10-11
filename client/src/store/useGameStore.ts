import { create, type StateCreator } from 'zustand';
import { GameState, GameAction } from '../core/types/game';
import { createInitialGameState, reduceGameState } from '../core/engine/reducer';
import { disconnectSocket, getSocket, RoomPlayer, RoomSnapshot } from '../net/socketClient';
import { CurrencyType } from '../core/types/currency';

export interface OnlineState {
  status: "LOBBY" | "PLAYING"; hostId: number | null; maxPlayers: number; messages: RoomSnapshot["messages"];
  thrown: { id: number; sourceId: number; targetId: number; prop: string } | null; pingMs: number | null;
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
  resetGame: (
    playerCount?: number,
    firstPlayerName?: string,
    firstPlayerAvatarId?: number,
    startingCash?: number,
    currency?: CurrencyType,
    roomCode?: string
  ) => void;
  connectSocket: () => void;
  createOnlineRoom: (playerName: string, avatarId: number, playerCount?: number) => void;
  joinOnlineRoom: (roomCode: string, playerName: string, avatarId: number) => void;
  leaveOnlineRoom: () => void;
  setReady: (ready: boolean) => void;
  startOnlineRoom: () => void;
  sendChat: (text: string) => void;
  throwProp: (targetId: number, prop: string) => void;
}

const initialOnlineState: OnlineState = {
  status: "LOBBY", hostId: null, maxPlayers: 6, messages: [], thrown: null, pingMs: null,
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
  socket.on('connect_error', () => {
    set((state) => ({ online: { ...state.online, connected: false, error: 'Không thể kết nối phòng chơi. Kiểm tra mạng rồi thử lại.' } }));
  });
  socket.on('room_state', (snapshot) => {
    set((state) => ({
      gameState: { ...snapshot.gameState, selectedSpaceIndex: state.online.roomCode === snapshot.roomCode ? state.gameState.selectedSpaceIndex : null },
      online: {
        ...state.online,
        connected: socket.connected,
        roomCode: snapshot.roomCode,
        playerId: snapshot.playerId ?? state.online.playerId,
        sessionToken: snapshot.sessionToken ?? state.online.sessionToken,
        players: snapshot.players,
        status: snapshot.status, hostId: snapshot.hostId, maxPlayers: snapshot.maxPlayers, messages: snapshot.messages,
        error: null,
      },
    }));
  });
  socket.on('game_state', (payload) => {
    set((state) => ({
      gameState: { ...payload.gameState, selectedSpaceIndex: state.gameState.selectedSpaceIndex },
      online: { ...state.online, roomCode: payload.roomCode, error: null },
    }));
  });
  socket.on('room_thrown', thrown => set(state => ({ online: { ...state.online, thrown } })));
  const ping = () => { const start = performance.now(); if (socket.connected) socket.timeout(3000).emit('connection_ping', (error: Error | null) => { if (!error) set(state => ({ online: { ...state.online, pingMs: Math.round(performance.now() - start) } })); }); };
  let pingTimer: ReturnType<typeof setInterval> | undefined;
  socket.on('connect', () => { if (pingTimer) clearInterval(pingTimer); ping(); pingTimer = setInterval(ping,10000); });
  socket.on('disconnect', () => { if (pingTimer) clearInterval(pingTimer); pingTimer = undefined; });
  socket.on('room_error', (payload) => {
    set((state) => ({ online: { ...state.online, error: payload.message } }));
  });
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createInitialGameState(6),
  online: initialOnlineState,
  dispatch: (action: GameAction) => {
    // Inspecting a tile belongs to this screen, even while playing online.
    if (action.type === 'SELECT_SPACE') {
      set((state) => ({ gameState: { ...state.gameState, selectedSpaceIndex: action.spaceIndex } }));
      return;
    }
    const { online } = get();
    if (online.roomCode) {
      if (online.status !== 'PLAYING') return;
      getSocket().emit('game_action', { roomCode: online.roomCode, action });
      return;
    }

    set((state) => ({
      gameState: reduceGameState(state.gameState, action),
    }));
  },
  resetGame: (
    playerCount = 6,
    firstPlayerName?: string,
    firstPlayerAvatarId?: number,
    startingCash = 1500,
    currency: CurrencyType = 'GOLD',
    roomCode = 'LOCAL-88'
  ) =>
    set({
      gameState: createInitialGameState(
        playerCount,
        firstPlayerAvatarId,
        firstPlayerName,
        startingCash,
        currency,
        roomCode
      ),
      online: initialOnlineState,
    }),
  connectSocket: () => {
    registerSocketHandlers(set);
    const socket = getSocket();
    if (!socket.connected) socket.connect();
  },
  createOnlineRoom: (playerName: string, avatarId: number, playerCount = 6) => {
    set((state) => ({ online: { ...state.online, error: null } }));
    get().connectSocket();
    getSocket().emit('create_room', { playerName, avatarId, playerCount });
  },
  joinOnlineRoom: (roomCode: string, playerName: string, avatarId: number) => {
    set((state) => ({ online: { ...state.online, error: null } }));
    get().connectSocket();
    getSocket().emit('join_room', {
      roomCode: roomCode.trim().toUpperCase(),
      playerName,
      avatarId,
      sessionToken: get().online.sessionToken ?? undefined,
    });
  },
  setReady: ready => { const code = get().online.roomCode; if (code) getSocket().emit('room_ready', { roomCode: code, ready }); },
  startOnlineRoom: () => { const code = get().online.roomCode; if (code) getSocket().emit('room_start', { roomCode: code }); },
  sendChat: text => { const code = get().online.roomCode; if (code) getSocket().emit('room_chat', { roomCode: code, text }); },
  throwProp: (targetId, prop) => { const code = get().online.roomCode; if (code) getSocket().emit('room_throw', { roomCode: code, targetId, prop }); },
  leaveOnlineRoom: () => {
    const roomCode = get().online.roomCode;
    if (roomCode) {
      getSocket().emit('leave_room', { roomCode });
    }
    disconnectSocket();
    handlersRegistered = false;
    set({ online: initialOnlineState, gameState: createInitialGameState(6) });
  },
}));
