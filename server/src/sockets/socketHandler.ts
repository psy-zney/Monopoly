import { Server, Socket } from 'socket.io';
import { GameAction } from '../engine/types/game.js';
import { RoomManager } from '../rooms/RoomManager.js';

interface CreateRoomPayload {
  playerName: string;
  avatarId: number;
  playerCount?: number;
}

interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
  avatarId: number;
  sessionToken?: string;
}

interface GameActionPayload {
  roomCode: string;
  action: GameAction;
}

interface LeaveRoomPayload {
  roomCode: string;
}

function emitRoomState(io: Server, roomManager: RoomManager, roomCode: string) {
  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  for (const player of room.players) {
    io.to(player.socketId).emit('room_state', roomManager.makeSnapshot(room, player.socketId));
  }
}

function emitSocketError(socket: Socket, message: string) {
  socket.emit('room_error', { message });
}

export function registerSocketHandlers(io: Server, roomManager = new RoomManager()) {
  io.on('connection', (socket) => {
    socket.on('create_room', (payload: CreateRoomPayload) => {
      try {
        const room = roomManager.createRoom(socket.id, payload.playerName, payload.avatarId, payload.playerCount);
        socket.join(room.roomCode);
        socket.emit('room_state', roomManager.makeSnapshot(room, socket.id));
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : 'Could not create room.');
      }
    });

    socket.on('join_room', (payload: JoinRoomPayload) => {
      try {
        const room = roomManager.joinRoom(
          payload.roomCode,
          socket.id,
          payload.playerName,
          payload.avatarId,
          payload.sessionToken
        );
        socket.join(room.roomCode);
        emitRoomState(io, roomManager, room.roomCode);
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : 'Could not join room.');
      }
    });

    const lastSocial = { chat: 0, throw: 0 };
    socket.on('room_ready', (payload: { roomCode: string; ready: boolean }) => {
      try { const room = roomManager.setReady(payload.roomCode, socket.id, payload.ready); emitRoomState(io, roomManager, room.roomCode); }
      catch (error) { emitSocketError(socket, error instanceof Error ? error.message : 'Không thể sẵn sàng.'); }
    });
    socket.on('room_start', (payload: { roomCode: string }) => {
      try { const room = roomManager.startRoom(payload.roomCode, socket.id); emitRoomState(io, roomManager, room.roomCode); }
      catch (error) { emitSocketError(socket, error instanceof Error ? error.message : 'Không thể bắt đầu.'); }
    });
    socket.on('room_chat', (payload: { roomCode: string; text: string }) => {
      try {
        if (Date.now() - lastSocial.chat < 600) throw new Error('Chờ một chút trước khi gửi tiếp.');
        const room = roomManager.addChat(payload.roomCode, socket.id, payload.text);
        lastSocial.chat = Date.now(); emitRoomState(io, roomManager, room.roomCode);
      } catch (error) { emitSocketError(socket, error instanceof Error ? error.message : 'Không thể gửi tin nhắn.'); }
    });
    socket.on('room_throw', (payload: { roomCode: string; targetId: number; prop: string }) => {
      try {
        const room = roomManager.requireMember(payload.roomCode, socket.id);
        const source = room.players.find(p => p.socketId === socket.id)!;
        if (!['EGG','BOMB','ROCK'].includes(payload.prop) || !room.players.some(p => p.playerId === payload.targetId && p.connected) || source.playerId === payload.targetId) throw new Error('Không thể ném đồ.');
        if (Date.now() - lastSocial.throw < 1500) throw new Error('Chờ một chút trước khi ném tiếp.');
        lastSocial.throw = Date.now();
        io.to(room.roomCode).emit('room_thrown', { id: Date.now(), sourceId: source.playerId, targetId: payload.targetId, prop: payload.prop });
      } catch (error) { emitSocketError(socket, error instanceof Error ? error.message : 'Không thể ném đồ.'); }
    });
    socket.on('connection_ping', (ack: () => void) => { if (typeof ack === 'function') ack(); });

    socket.on('game_action', (payload: GameActionPayload) => {
      try {
        const room = roomManager.applyAction(payload.roomCode, payload.action, socket.id);
        io.to(room.roomCode).emit('game_state', {
          roomCode: room.roomCode,
          gameState: room.gameState,
        });
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : 'Could not apply action.');
      }
    });

    socket.on('leave_room', (payload: LeaveRoomPayload) => {
      socket.leave(payload.roomCode);
      const room = roomManager.leaveBySocket(socket.id);
      if (room) emitRoomState(io, roomManager, room.roomCode);
    });

    socket.on('disconnect', () => {
      const room = roomManager.leaveBySocket(socket.id);
      if (room) emitRoomState(io, roomManager, room.roomCode);
    });
  });
}
