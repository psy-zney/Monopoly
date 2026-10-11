import { GameAction, GameState } from '../engine/types/game.js';
import { createInitialGameState, reduceGameState } from '../engine/reducer.js';

export interface RoomPlayer {
  playerId: number;
  name: string;
  socketId: string;
  sessionToken: string;
  connected: boolean;
  disconnectedAt: number | null;
  ready: boolean;
}

export interface GameRoom {
  status: "LOBBY" | "PLAYING";
  hostId: number;
  messages: Array<{ id: number; playerId: number; name: string; text: string }>;
  roomCode: string;
  gameState: GameState;
  players: RoomPlayer[];
  maxPlayers: number;
  createdAt: number;
  updatedAt: number;
}

export interface RoomSnapshot {
  roomCode: string;
  playerId?: number;
  sessionToken?: string;
  status: 'LOBBY' | 'PLAYING';
  hostId: number;
  maxPlayers: number;
  messages: GameRoom['messages'];
  players: Array<Pick<RoomPlayer, 'playerId' | 'name' | 'connected' | 'ready'>>;
  gameState: GameState;
}

const ROOM_TTL_MS = 1000 * 60 * 60 * 6;
const RECONNECT_WINDOW_MS = 1000 * 60;

function generateRoomCode(existingCodes: Set<string>) {
  let code = '';
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (existingCodes.has(code));
  return code;
}

function generateSessionToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export class RoomManager {
  private readonly rooms = new Map<string, GameRoom>();

  createRoom(socketId: string, playerName: string, avatarId: number, playerCount = 6) {
    this.cleanup();
    const maxPlayers = Math.max(2, Math.min(6, playerCount));
    const roomCode = generateRoomCode(new Set(this.rooms.keys()));
    const safeAvatarId = Math.max(1, Math.min(6, avatarId || 1));
    const gameState = {
      ...createInitialGameState(maxPlayers, safeAvatarId, playerName),
      roomCode,
    };

    const room: GameRoom = {
      roomCode,
      status: "LOBBY",
      hostId: safeAvatarId,
      messages: [],
      gameState,
      players: [
        {
          playerId: safeAvatarId,
          name: playerName || gameState.players[safeAvatarId - 1].name,
          socketId,
          sessionToken: generateSessionToken(),
          connected: true,
      ready: false,
      disconnectedAt: null,
        },
      ],
      maxPlayers,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  joinRoom(roomCode: string, socketId: string, playerName: string, avatarId: number, sessionToken?: string) {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) throw new Error('Không tìm thấy phòng. Kiểm tra lại mã phòng.');

    const reconnectingPlayer = sessionToken
      ? room.players.find((player) => player.sessionToken === sessionToken)
      : null;

    if (reconnectingPlayer) {
      reconnectingPlayer.socketId = socketId;
      reconnectingPlayer.connected = true;
      reconnectingPlayer.disconnectedAt = null;
      room.updatedAt = Date.now();
      return room;
    }

    if (room.status !== 'LOBBY') throw new Error('Ván chơi đã bắt đầu.');
    if (room.players.length >= room.maxPlayers) throw new Error('Phòng đã đầy. Hãy chọn phòng khác.');
    
    const safeAvatarId = Math.max(1, Math.min(6, avatarId || 1));
    if (room.players.some((p) => p.playerId === safeAvatarId)) {
      throw new Error('Nhân vật này đã có người chọn. Hãy chọn nhân vật khác.');
    }

    const fallbackName = room.gameState.players.find(player => player.id === safeAvatarId)?.name ?? `Người chơi ${safeAvatarId}`;
    const name = playerName || fallbackName;
    const occupiedIds = new Set(room.players.map(player => player.playerId));
    const replacement = room.gameState.players.some(player => player.id === safeAvatarId)
      ? null : room.gameState.players.find(player => !occupiedIds.has(player.id));
    if (!room.gameState.players.some(player => player.id === safeAvatarId) && !replacement) {
      throw new Error('Phòng đã hết chỗ.');
    }
    room.players.push({
      playerId: safeAvatarId,
      name,
      socketId,
      sessionToken: generateSessionToken(),
      connected: true,
      ready: false,
      disconnectedAt: null,
    });
    room.gameState = {
      ...room.gameState,
      players: room.gameState.players.map((player) =>
        player.id === safeAvatarId || player.id === replacement?.id ? { ...player, id: safeAvatarId, name } : player
      ),
      properties: replacement ? Object.fromEntries(Object.entries(room.gameState.properties).map(([index, property]) => [index, property.ownerId === replacement.id ? { ...property, ownerId: safeAvatarId } : property])) : room.gameState.properties,
    };
    room.updatedAt = Date.now();
    return room;
  }

  leaveBySocket(socketId: string) {
    for (const room of this.rooms.values()) {
      const player = room.players.find((candidate) => candidate.socketId === socketId);
      if (player) {
        player.connected = false;
        player.ready = false;
        player.disconnectedAt = Date.now();
        room.updatedAt = Date.now();
        return room;
      }
    }
    return null;
  }

  getRoom(roomCode: string) {
    return this.rooms.get(roomCode.toUpperCase()) ?? null;
  }

  setReady(roomCode: string, socketId: string, ready: boolean) {
    const room = this.requireMember(roomCode, socketId);
    if (room.status !== "LOBBY") throw new Error("Ván chơi đã bắt đầu.");
    room.players.find(p => p.socketId === socketId)!.ready = ready === true;
    return room;
  }

  startRoom(roomCode: string, socketId: string) {
    const room = this.requireMember(roomCode, socketId);
    const member = room.players.find(p => p.socketId === socketId)!;
    if (member.playerId !== room.hostId) throw new Error("Chỉ chủ phòng được bắt đầu.");
    if (room.status !== "LOBBY") throw new Error("Ván chơi đã bắt đầu.");
    const joined = room.players.filter(p => p.connected);
    if (joined.length < 2 || !joined.every(p => p.ready)) throw new Error("Cần từ 2 người và tất cả sẵn sàng.");
    const ids = new Set(joined.map(p => p.playerId));
    room.gameState = { ...room.gameState, players: room.gameState.players.filter(p => ids.has(p.id)), activePlayerIndex: 0 };
    room.status = "PLAYING";
    return room;
  }

  requireMember(roomCode: string, socketId: string) {
    const room = this.getRoom(roomCode);
    if (!room || !room.players.some(p => p.socketId === socketId && p.connected)) throw new Error("Bạn không ở trong phòng này.");
    return room;
  }

  addChat(roomCode: string, socketId: string, text: string) {
    const room = this.requireMember(roomCode, socketId);
    const sender = room.players.find(p => p.socketId === socketId)!;
    const clean = typeof text === "string" ? text.trim().slice(0,240) : "";
    if (!clean) throw new Error("Tin nhắn trống.");
    room.messages.push({ id: (room.messages.at(-1)?.id ?? 0) + 1, playerId: sender.playerId, name: sender.name, text: clean });
    room.messages = room.messages.slice(-50);
    return room;
  }

  applyAction(roomCode: string, action: GameAction, socketId?: string) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error('Room not found.');
    if (room.status !== 'PLAYING') throw new Error('Chủ phòng chưa bắt đầu ván chơi.');
    if (socketId) this.requireMember(roomCode, socketId);
    room.gameState = {
      ...reduceGameState(room.gameState, action),
      roomCode: room.roomCode,
    };
    room.updatedAt = Date.now();
    return room;
  }

  makeSnapshot(room: GameRoom, socketId?: string): RoomSnapshot {
    const currentPlayer = socketId ? room.players.find((player) => player.socketId === socketId) : undefined;
    return {
      roomCode: room.roomCode,
      status: room.status,
      hostId: room.hostId,
      maxPlayers: room.maxPlayers,
      messages: room.messages,
      playerId: currentPlayer?.playerId,
      sessionToken: currentPlayer?.sessionToken,
      players: room.players.map(({ playerId, name, connected, ready }) => ({ playerId, name, connected, ready })),
      gameState: room.gameState,
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [roomCode, room] of this.rooms) {
      const allGone = room.players.every(
        (player) =>
          !player.connected &&
          player.disconnectedAt !== null &&
          now - player.disconnectedAt > RECONNECT_WINDOW_MS
      );
      if (allGone || now - room.updatedAt > ROOM_TTL_MS) {
        this.rooms.delete(roomCode);
      }
    }
  }
}
