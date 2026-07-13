import { Server, Socket } from 'socket.io';
import { GameAction } from '../engine/types/game.js';
import { RoomManager } from '../rooms/RoomManager.js';

interface CreateRoomPayload {
  playerName: string;
  playerCount?: number;
}

interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
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
        const room = roomManager.createRoom(socket.id, payload.playerName, payload.playerCount);
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
          payload.sessionToken
        );
        socket.join(room.roomCode);
        emitRoomState(io, roomManager, room.roomCode);
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : 'Could not join room.');
      }
    });

    socket.on('game_action', (payload: GameActionPayload) => {
      try {
        const room = roomManager.applyAction(payload.roomCode, payload.action);
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
