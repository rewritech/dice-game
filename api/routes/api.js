const express = require('express');
const router = express.Router();
const rooms = require('../room').rooms;

function getLastRoomId(targetRooms) {
  return targetRooms.length > 0 ? targetRooms[targetRooms.length - 1].id : 0;
}

/**
 * GET rooms
 * 전체 방 리스트 가져오기
 */
router.get('/rooms', (req, res) => {
  console.log(`[${new Date()}]: GET rooms`);
  res.send(JSON.stringify(rooms));
});

/**
 * POST room
 * 새로운 방 만들기
 */
router.post('/rooms', (req, res) => {
  console.log(`[${new Date()}]: POST rooms`);
  const newRoom = req.body;
  newRoom.id = getLastRoomId(rooms) + 1;
  rooms.push(newRoom);
  res.send(JSON.stringify(newRoom));
});

/**
 * GET room/:id
 * 방 정보 가져오기
 */
router.get('/rooms/:id', (req, res) => {
  console.log(`[${new Date()}]: GET rooms/${req.params.id}`);
  const targetRoom = rooms.find(
    (room) => Number(room.id) === Number(req.params.id)
  );
  res.send(JSON.stringify(targetRoom));
});

/**
 * POST rooms/:roomId/players
 * 특정 방의 플레이어 추가하기
 */
router.post('/players', (req, res) => {
  const newPlayer = req.body;

  console.log(`[${new Date()}]: POST room ${newPlayer.roomId} players`);
  const targetRoom = rooms.find(
    (room) => Number(room.id) === Number(newPlayer.roomId)
  );
  const index = rooms.indexOf(targetRoom);

  newPlayer.id = new Date().getTime();

  if (index > -1) {
    rooms[index].players.push(newPlayer);
  }

  res.send(JSON.stringify(newPlayer));
});

module.exports = router;