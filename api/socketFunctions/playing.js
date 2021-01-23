const common = require('./common');
const Room = require('../models/Room');
const Player = require('../models/Player');

const ADD_DECK = 2

const getNextPlayer = function (room) {
  const { players, currentPlayer } = room
  const index = players.findIndex((p) => p._id === currentPlayer) + 1
  const nextIndex = index === players.length ? 0 : index
  return players[nextIndex]._id
}

const distributeCard = function (room) {
  // unused에 카드가 2장 미만이면 used의 카드를 다시 가져온다.
  if (room.cardDeck.unused.length < ADD_DECK) {
    room.cardDeck.unused = room.cardDeck.unused.concat(room.cardDeck.used)
    room.cardDeck.used = []
  }

  const nextPlayer = room.players.find((p) => p._id === room.currentPlayer)
  const newCards = room.cardDeck.unused.splice(0, ADD_DECK)
  newCards.reverse()
  newCards.forEach((c) => nextPlayer.cards.unshift(c))
}

const changeTurn = async function (io, value) {
  console.log(`[${new Date().toISOString()}]: change-turn`);
  const { room, player, aniConfig } = value

  // 1. 사용한 카드 가져오기
  const prevRoom = await Room.findOne({ _id: room._id, deleted: false });
  const usedCard = room.cardDeck.used.slice(prevRoom.cardDeck.used.length).join(', ')

  // 2. currentPlayer 변경
  room.currentPlayer = getNextPlayer(room)

  // 3. 카드 분배
  distributeCard(room)

  // DB room 갱신
  // 지금유저
  await Player.updateOne({ _id: player._id }, { $set: player });

  // 다음유저
  const nextPlayer = room.players.find((p) => p._id === room.currentPlayer)
  await Player.updateOne({ _id: room.currentPlayer }, { $set: nextPlayer });

  // cardDeck
  await Room.updateOne({ _id: room._id }, { $set: room });
  // Socket room 갱신
  const newRoom = await Room.findOne({ _id: room._id, deleted: false }).populate('players');
  io.of("/dice-map-room").to(`room-${room._id}`).emit(`change-turn-${room._id}`, { room: newRoom, aniConfig });

  common.broadcastSystemMessage(io, room._id, 'success', common.joinMsg([player.name, 'changeTurnMessage1', usedCard, 'changeTurnMessage2', 'changeTurnMessage3', nextPlayer.name, 'changeTurnMessage4']));
}

const catchPlayer = async function (io, player) {
  console.log(`[${new Date().toISOString()}]: catch-player`);
  await Player.updateOne({ _id: player._id }, { $set: player });
  common.broadcastSystemMessage(io, player._roomId, 'danger', common.joinMsg([player.name, 'catchedMessage']));
}

module.exports = {
  changeTurn,
  catchPlayer,
};
