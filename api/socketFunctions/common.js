const Room = require('../models/Room');
const Player = require('../models/Player');
const Message = require('../models/Message');

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
  const rooms = await Room.find({ status: 'WAIT', deleted: false }, { __v: 0, map: 0, currentPlayer: 0, cardDeck: 0, deleted: 0 }).populate('players');
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

module.exports = {
  broadcastRoom,
  broadcastRoomWithoutMe,
  broadcastRoomMessage,
  broadcastSystemMessage,
  joinMsg,
  refreshRooms,
  deleteRoom,
  sendMessage,
};
