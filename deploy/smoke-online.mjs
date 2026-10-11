import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../client/package.json', import.meta.url));
const { io } = require('socket.io-client');
const url = process.argv[2] || 'https://beatsync-server.zney295.id.vn';
const path = process.argv[3] || '/monopoly/socket.io';
const clients = [];

function waitFor(socket, event, predicate = () => true) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => fail(new Error(`Timed out: ${event}`)), 12000);
    function cleanup() {
      clearTimeout(timer);
      socket.off(event, received);
      socket.off('room_error', fail);
      socket.off('connect_error', fail);
    }
    function fail(error) { cleanup(); reject(error instanceof Error ? error : new Error(error.message)); }
    function received(payload) { if (predicate(payload)) { cleanup(); resolve(payload); } }
    socket.on(event, received);
    socket.on('room_error', fail);
    socket.on('connect_error', fail);
  });
}

async function connect(transport) {
  const socket = io(url, { path, autoConnect: false, reconnection: false, transports: [transport], extraHeaders: { Origin: 'https://monopoly.vercel.app' } });
  clients.push(socket);
  const connected = waitFor(socket, 'connect');
  socket.connect();
  await connected;
  return socket;
}

try {
  const host = await connect('websocket');
  const created = waitFor(host, 'room_state');
  host.emit('create_room', { playerName: 'Deploy check 1', avatarId: 1, playerCount: 5 });
  const room = await created;
  for (let id = 2; id <= 5; id++) {
    const guest = await connect(id === 2 ? 'polling' : 'websocket');
    const joined = waitFor(guest, 'room_state', (snapshot) => snapshot.players.filter((player) => player.connected).length === id);
    guest.emit('join_room', { roomCode: room.roomCode, playerName: `Deploy check ${id}`, avatarId: id });
    const snapshot = await joined;
    assert.equal(snapshot.playerId, id);
  }
  for (const socket of clients) {
    const ready = waitFor(socket,'room_state',snapshot => snapshot.players.find(p => p.playerId === snapshot.playerId)?.ready);
    socket.emit('room_ready', { roomCode: room.roomCode, ready: true }); await ready;
  }
  const started = clients.map(socket => waitFor(socket,'room_state',snapshot => snapshot.status === 'PLAYING'));
  host.emit('room_start', { roomCode: room.roomCode }); await Promise.all(started);
  const message = clients.map(socket => waitFor(socket,'room_state',snapshot => snapshot.messages.at(-1)?.text === 'QA chat'));
  host.emit('room_chat', { roomCode: room.roomCode, text: 'QA chat' }); await Promise.all(message);
  const thrown = clients.map(socket => waitFor(socket,'room_thrown'));
  host.emit('room_throw', { roomCode: room.roomCode, targetId:2,prop:'EGG' }); const effects=await Promise.all(thrown);
  assert.ok(effects.every(effect=>effect.sourceId===1&&effect.targetId===2&&effect.prop==='EGG'));
  const broadcasts = clients.map((socket) => waitFor(socket, 'game_state'));
  host.emit('game_action', { roomCode: room.roomCode, action: { type: 'ROLL_DICE' } });
  const states = await Promise.all(broadcasts);
  assert.equal(states[0].gameState.hasRolled, true);
  for (const state of states) assert.deepEqual(state.gameState, states[0].gameState);
  console.log('PASS: HTTPS, 5 players, WebSocket + polling, ready/start, chat, throwing props, and synchronized game state.');
} finally {
  for (const socket of clients) socket.disconnect();
}
