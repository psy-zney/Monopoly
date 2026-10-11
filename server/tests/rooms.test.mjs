import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager } from '../dist/rooms/RoomManager.js';

test('a two-player room accepts any unused character', () => {
  const manager = new RoomManager();
  const room = manager.createRoom('host', 'Minh', 1, 2);
  assert.match(room.roomCode, /^\d{6}$/);
  manager.joinRoom(room.roomCode, 'guest', 'Lan', 6);
  assert.deepEqual(room.gameState.players.map(player => [player.id, player.name]), [[1, 'Minh'], [6, 'Lan']]);
  assert.equal(manager.makeSnapshot(room, 'guest').playerId, 6);
  assert.equal(room.gameState.players.length, 2);
});

test('rooms from two to six seats keep all joined characters in the game', () => {
  for (let capacity = 2; capacity <= 6; capacity++) {
    const manager = new RoomManager();
    const room = manager.createRoom('host', 'Host', 6, capacity);
    for (let id = 1; id < capacity; id++) manager.joinRoom(room.roomCode, `guest-${id}`, `Guest ${id}`, id);
    assert.deepEqual(new Set(room.gameState.players.map(player => player.id)), new Set(room.players.map(player => player.playerId)));
    assert.equal(room.gameState.players.length, capacity);
    assert.throws(() => manager.joinRoom(room.roomCode, 'extra', 'Extra', 5), /đã đầy/);
  }
});

test('a duplicate character is rejected without adding a participant', () => {
  const manager = new RoomManager();
  const room = manager.createRoom('host', 'Host', 3, 3);
  assert.throws(() => manager.joinRoom(room.roomCode, 'duplicate', 'Guest', 3), /đã có người chọn/);
  assert.equal(room.players.length, 1);
});

test('only the host starts a ready room, and only joined players enter the game',()=>{
 const manager=new RoomManager(), room=manager.createRoom('host','Minh',1,5);
 manager.joinRoom(room.roomCode,'guest','Lan',6);
 assert.throws(()=>manager.applyAction(room.roomCode,{type:'ROLL_DICE'}),/chưa bắt đầu/);
 assert.throws(()=>manager.startRoom(room.roomCode,'host'),/sẵn sàng/);
 manager.setReady(room.roomCode,'host',true);manager.setReady(room.roomCode,'guest',true);
 assert.throws(()=>manager.startRoom(room.roomCode,'guest'),/Chỉ chủ phòng/);
 manager.startRoom(room.roomCode,'host');
 assert.equal(room.status,'PLAYING');assert.deepEqual(room.gameState.players.map(p=>p.id),[1,6]);
 assert.throws(()=>manager.joinRoom(room.roomCode,'late','Late',2),/đã bắt đầu/);
 assert.throws(()=>manager.applyAction(room.roomCode,{type:'ROLL_DICE'},'stranger'),/không ở/);
});
test('chat is scoped to members, bounded, and contains plain text',()=>{
 const manager=new RoomManager(),room=manager.createRoom('host','Minh',1,2);
 assert.throws(()=>manager.addChat(room.roomCode,'stranger','hello'),/không ở/);
 for(let i=0;i<60;i++)manager.addChat(room.roomCode,'host','x'.repeat(300));
 assert.equal(room.messages.length,50);assert.equal(room.messages[0].text.length,240);
 assert.equal(manager.makeSnapshot(room).messages.at(-1).id,60);
});
