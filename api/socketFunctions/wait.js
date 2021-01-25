const common = require('./common');
const Room = require('../models/Room');
const Player = require('../models/Player');

const joinRoom = async function (io, socket, player) {
  console.log(`[${new Date().toISOString()}]: room-${player._roomId} join`);
  await Player.updateOne({ _id: player._id }, {
    $set: {
      _roomId: player._roomId,
      coordinates: null,
      initialCoordinates: null,
      cards: [],
      piece: {icon: []},
      killedPlayer: 0,
      life: 3
    }
  });
  const newPlayer = await Player.findOne({ _id: player._id })
  socket.join(`room-${player._roomId}`);
  common.broadcastRoom(io, player._roomId);
  common.broadcastSystemMessage(io, player._roomId, 'success', common.joinMsg([newPlayer.name, 'joinRoomMessage']));
}

const shuffleMap = async function (io, shuffledRoom) {
  console.log(`[${new Date().toISOString()}]: room shuffle`);
  await Room.updateOne({ _id: shuffledRoom._id }, { $set: { map: shuffledRoom.map } });
  common.broadcastRoom(io, shuffledRoom._id);
  common.broadcastSystemMessage(io, shuffledRoom._id, 'success', 'shuffleMapMessage');
}

const selectPiece = async function (io, player) {
  console.log(`[${new Date().toISOString()}]: select-piece`);
  await Player.updateOne({ _id: player._id }, { $set: player });
  common.broadcastRoom(io, player._roomId);
}

const gameStart = async function (io, socket, room) {
  console.log(`[${new Date().toISOString()}]: game-start`);

  room.players.forEach(async (p) => {
    await Player.updateOne({ _id: p._id }, { $set: p });
  })

  // DB room 갱신
  await Room.updateOne({ _id: room._id }, { $set: room });
  // Socket room 갱신
  common.broadcastRoomWithoutMe(socket, room._id, `start-game-${room._id}`);
  common.broadcastSystemMessage(io, room._id, 'success', 'gameStartMessage');
}

module.exports = {
  joinRoom,
  shuffleMap,
  selectPiece,
  gameStart,
};
