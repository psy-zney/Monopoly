import { GameAction, GameState } from '../engine/types/game.js';
import { createInitialGameState, reduceGameState } from '../engine/reducer.js';

export interface RoomPlayer {
  playerId: number;
  name: string;
  socketId: string;
  sessionToken: string;
  connected: boolean;
  disconnectedAt: number | null;
}

export interface GameRoom {
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
  players: Array<Pick<RoomPlayer, 'playerId' | 'name' | 'connected'>>;
  gameState: GameState;
}

const ROOM_TTL_MS = 1000 * 60 * 60 * 6;
const RECONNECT_WINDOW_MS = 1000 * 60;

function generateRoomCode(existingCodes: Set<string>) {
  let code = '';
  do {
    code = `MONO-${Math.floor(10 + Math.random() * 90)}`;
  } while (existingCodes.has(code));
  return code;
}

function generateSessionToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export class RoomManager {
  private readonly rooms = new Map<string, GameRoom>();

  createRoom(socketId: string, playerName: string, playerCount = 6) {
    this.cleanup();
    const maxPlayers = Math.max(2, Math.min(6, playerCount));
    const roomCode = generateRoomCode(new Set(this.rooms.keys()));
    const gameState = {
      ...createInitialGameState(maxPlayers),
      roomCode,
    };
    gameState.players = gameState.players.map((player, index) =>
      index === 0 ? { ...player, name: playerName || player.name } : player
    );

    const room: GameRoom = {
      roomCode,
      gameState,
      players: [
        {
          playerId: 1,
          name: playerName || gameState.players[0].name,
          socketId,
          sessionToken: generateSessionToken(),
          connected: true,
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

  joinRoom(roomCode: string, socketId: string, playerName: string, sessionToken?: string) {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) throw new Error('Room not found.');

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

    if (room.players.length >= room.maxPlayers) throw new Error('Room is full.');

    const playerId = room.players.length + 1;
    const fallbackName = room.gameState.players[playerId - 1]?.name ?? `Player ${playerId}`;
    const name = playerName || fallbackName;
    room.players.push({
      playerId,
      name,
      socketId,
      sessionToken: generateSessionToken(),
      connected: true,
      disconnectedAt: null,
    });
    room.gameState = {
      ...room.gameState,
      players: room.gameState.players.map((player) =>
        player.id === playerId ? { ...player, name } : player
      ),
    };
    room.updatedAt = Date.now();
    return room;
  }

  leaveBySocket(socketId: string) {
    for (const room of this.rooms.values()) {
      const player = room.players.find((candidate) => candidate.socketId === socketId);
      if (player) {
        player.connected = false;
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

  applyAction(roomCode: string, action: GameAction) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error('Room not found.');
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
      playerId: currentPlayer?.playerId,
      sessionToken: currentPlayer?.sessionToken,
      players: room.players.map(({ playerId, name, connected }) => ({ playerId, name, connected })),
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
