const common = require('./common');
const Room = require('../models/Room');
const Player = require('../models/Player');

const changeTurn = async function (io, socket, value) {
  console.log(`[${new Date()}]: change-turn`);
  const room = value.room
  const player = value.player

  // DB room 갱신
  await Player.updateOne({ _id: player._id }, { $set: player });

  const newCurrentPlayer = await Player.findOne({ _id: room.currentPlayer })
  const nextPlayer = room.players.find((p) => p._id === room.currentPlayer)

  await Player.updateOne({ _id: room.currentPlayer }, { $set: nextPlayer });
  await Room.updateOne({ _id: room._id }, { $set: room });
  // Socket room 갱신
  const newRoom = await Room.findOne({ _id: room._id, deleted: false }).populate('players');
  socket.in(`room-${room._id}`).emit(`change-turn-${room._id}`, { room: newRoom, aniConfig: value.aniConfig});

  common.broadcastSystemMessage(io, room._id, 'success', common.joinMsg([player.name, 'changeTurnMessage1', newCurrentPlayer.name, 'changeTurnMessage2']));
}

const catchPlayer = async function (io, player) {
  console.log(`[${new Date()}]: catch-player`);
  await Player.updateOne({ _id: player._id }, { $set: player });
  common.broadcastSystemMessage(io, player._roomId, 'danger', common.joinMsg([player.name, 'catchedMessage']));
}

module.exports = {
  changeTurn,
  catchPlayer,
};
