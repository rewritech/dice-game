const Room = require('../models/Room');
const Player = require('../models/Player');
const Message = require('../models/Message');

const ADD_DECK = 2

const broadcastRoom = async function (io, roomId, key=`changeRoomInfo-${roomId}`) {
  const room = await Room.findOne({ _id: roomId, deleted: false }).populate('players');
  io.of("/dice-map-room").to(`room-${roomId}`).emit(key, room);
}

const broadcastRoomWithoutMe = async function (socket, roomId, key=`changeRoomInfo-${roomId}`) {
  const room = await Room.findOne({ _id: roomId, deleted: false }).populate('players');
  socket.in(`room-${roomId}`).emit(key, room);
}

const broadcastRoomMessage = async function (io, roomId) {
  const messages = await Message.find({ _roomId: roomId });
  io.of("/dice-map-room").to(`room-${roomId}`).emit(`chat-room-${roomId}`, messages);
}

const broadcastSystemMessage = async function  (io, roomId, systemMsgStatus, content) {
  const message = new Message({ _roomId: roomId, _playerId: null, playerName: 'System', systemMsgStatus: systemMsgStatus, sendedAt: new Date(), content });
  await message.save();
  // Socket room 갱신
  await broadcastRoomMessage(io, roomId);
}

const joinMsg = function (arr) {
  return arr.join('&')
}

const refreshRooms = async function (socket) {
  const rooms = await Room.find({ status: { $ne: 'END' }, deleted: false }, { __v: 0, map: 0, currentPlayer: 0, cardDeck: 0, deleted: 0 }).populate('players');
  rooms.forEach((r) => r.players = new Array(r.players.length))
  socket.broadcast.emit("refresh-rooms", rooms)
}

const deleteRoom = async function (room) {
  await Player.updateMany({ _roomId: room._id }, {
    $set: {
      _roomId: 0,
      coordinates: null,
      initialCoordinates: null,
      cards: [],
      piece: {icon: []},
      killedPlayer: 0,
      life: 3
    }
  })
  await Room.updateOne({ _id: room._id }, { $set: { deleted: true } });
  await Message.deleteMany({ _roomId: room._id })
}

const sendMessage = async function (io, message) {
  console.log(`[${new Date().toISOString()}]: send-message-${message._playerId}`);
  const player = await Player.findOne({ _id: message._playerId })
  const newMessage = new Message({ playerName: player.name, sendedAt: new Date(), ...message });
  await newMessage.save();
  await broadcastRoomMessage(io, message._roomId);
}


const getNextIndex = function(index, limit) {
  return index === limit ? 0 : index
}

const getNextPlayer = function (room) {
  const { players, currentPlayer } = room
  const index = players.findIndex((p) => p._id === currentPlayer) + 1

  // 미사용카드가 없는 경우, 카드를 가지고 있는 플레이어를 찾는다.
  let nextIndex = getNextIndex(index, players.length)
  if (room.cardDeck.unused.length === 0) {
    while (players[nextIndex].cards.length === 0) {
      nextIndex = getNextIndex(nextIndex + 1, players.length)
    }
  }

  return players[nextIndex]._id
}

const distributeCard = function (room) {
  // unused에 카드가 2장 미만이면 used의 카드를 다시 가져온다.
  if (room.mode === 'INFINITY' && room.cardDeck.unused.length < ADD_DECK) {
    room.cardDeck.unused = room.cardDeck.unused.concat(room.cardDeck.used)
    room.cardDeck.used = []
  }
  const nextPlayer = room.players.find((p) => p._id === room.currentPlayer)
  const newCards = room.cardDeck.unused.splice(0, ADD_DECK)
  newCards.reverse()
  newCards.forEach((c) => nextPlayer.cards.unshift(c))
}

const changeTurn = async function (io, value) {
  const { room, player, aniConfig } = value
  console.log(`[${new Date().toISOString()}]: change-turn-${room?._id} ${player?._id}`);

  // 2. currentPlayer 변경
  room.currentPlayer = getNextPlayer(room)

  // 3. 카드 분배
  distributeCard(room)
  if (room.mode === 'LIMITED' && room.cardDeck.unused.length === 0) {
    const prevMsg = await Message.findOne({ _roomId: room._id, content: 'usedAllCardsMessage' })
    if (!prevMsg) {
      await broadcastSystemMessage(io, room._id, 'info', 'usedAllCardsMessage');
    }
  }

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
}

module.exports = {
  broadcastRoom,
  broadcastRoomWithoutMe,
  broadcastRoomMessage,
  broadcastSystemMessage,
  joinMsg,
  refreshRooms,
  deleteRoom,
  sendMessage,
  changeTurn,
};
