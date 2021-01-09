require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http');
const server = http.Server(app);
const socketServer = http.Server(app);
const io = require('socket.io')(socketServer);
const port = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 3001;
const api = require('./routes/api');
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Player = require('./models/Player');
const Message = require('./models/Message');

// ==================== DB ====================
const username = process.env.MONGO_INITDB_ROOT_USERNAME
const pwd = process.env.MONGO_INITDB_ROOT_PASSWORD

const options = {
	useUnifiedTopology : true,
  useNewUrlParser : true,
  useFindAndModify: false
}

mongoose.connect(`mongodb://${username}:${pwd}@db/dice_db?authSource=admin`, options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('DB connection successful'));

// ==================== Server ====================
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 편의상 *로 했지만 보안상 문제 있음
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/api', api);

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

socketServer.listen(socketPort, () => {
  console.log(`started on port: ${socketPort}`);
});

// ==================== socket connect ====================
async function broadcastRoom (roomId) {
  const room = await Room.findOne({ _id: roomId, deleted: false }).populate('players');
  io.of("/dice-map-room").to(`room-${roomId}`).emit(`changeRoomInfo-${roomId}`, room);
}
async function broadcastRoomMessage (roomId) {
  const messages = await Message.find({ _roomId: roomId });
  io.of("/dice-map-room").to(`room-${roomId}`).emit(`chat-room-${roomId}`, messages);
}
async function broadcastSystemMessage (roomId, systemMsgStatus, content) {
  const message = new Message({ _roomId: roomId, _playerId: null, playerName: 'System', systemMsgStatus: systemMsgStatus, sendedAt: new Date(), content });
  await message.save();
  // Socket room 갱신
  broadcastRoomMessage(roomId);
}
function joinMsg(arr) {
  return arr.join('&')
}
async function refreshRooms(socket) {
  const rooms = await Room.find({ deleted: false }, { __v: 0, map: 0, currentPlayer: 0, cardDeck: 0, deleted: 0 }).populate('players');
  rooms.forEach((r) => r.players = new Array(r.players.length))
  socket.broadcast.emit("refresh-rooms", rooms)
}

io.of('/dice-map-room').on('connection', (socket) => {
  console.log(`[${new Date()}]: user socket connected`);

  socket.on('join-room', async (player) => {
    try {
      // console.log(player);
      console.log(`[${new Date()}]: room-${player._roomId} join`);
      // websocket room 연결
      socket.join(`room-${player._roomId}`);
      // Socket room 갱신
      broadcastRoom(player._roomId);
      broadcastSystemMessage(player._roomId, 'success', joinMsg([player.name, 'joinRoomMessage']));
    } catch (e) {
      console.error(`error: ${e}`);
    } finally {
      refreshRooms(socket)
    }
  });

  socket.on('shuffle-map', async (shuffledRoom) => {
    try {
      console.log(`[${new Date()}]: room shuffle`);
      // DB room 갱신
      await Room.updateOne({ _id: shuffledRoom._id }, { $set: { map: shuffledRoom.map } });
      // Socket room 갱신
      broadcastRoom(shuffledRoom._id);
      broadcastSystemMessage(shuffledRoom._id, 'success', 'shuffleMapMessage');
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('select-piece', async (player) => {
    try {
      console.log(`[${new Date()}]: select-piece`);
      // DB room 갱신
      await Player.updateOne({ _id: player._id }, { $set: player });
      // Socket room 갱신
      broadcastRoom(player._roomId);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('game-start', async (room) => {
    try {
      console.log(`[${new Date()}]: game-start`);
      // 카드 분배
      const player = await Player.findOne({ _id: room.currentPlayer })
      const newCards = room.cardDeck.unused.splice(0, 2)
      player.cards = player.cards.concat(newCards)

      // DB room 갱신
      await Room.updateOne({ _id: room._id }, { $set: room });
      await Player.updateOne({ _id: player._id }, { $set: player });
      // Socket room 갱신
      broadcastRoom(room._id);
      broadcastSystemMessage(room._id, 'success', 'gameStartMessage');
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('change-turn', async (value) => {
    try {
      console.log(`[${new Date()}]: change-turn`);
      const room = value.room
      const player = value.player

      // DB room 갱신
      await Player.updateOne({ _id: player._id }, { $set: player });

      // 카드 분배
      // unused에 카드가 2장 미만이면 used의 카드를 다시 가져온다.
      if (room.cardDeck.unused.length < 2) {
        room.cardDeck.unused = room.cardDeck.unused.concat(room.cardDeck.used)
        room.cardDeck.used = []
      }
      const newCards = room.cardDeck.unused.splice(0, 2)
      await Player.updateOne({ _id: room.currentPlayer }, { $push: { cards: newCards } });
      await Room.updateOne({ _id: room._id }, { $set: room });
      const newCurrentPlayer = await Player.findOne({ _id: room.currentPlayer })
      // Socket room 갱신
      broadcastRoom(room._id);
      broadcastSystemMessage(room._id, 'success', joinMsg([player.name, 'changeTurn1Message', newCurrentPlayer.name, 'changeTurn2Message']));
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('catch-player', async (player) => {
    try {
      console.log(`[${new Date()}]: catch-player`);

      await Player.updateOne({ _id: player._id }, { $set: player });

      broadcastSystemMessage(player._roomId, 'danger', joinMsg([player.name, 'catchedMessage']));
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('leave', async (value) => {
    try {
      console.log(`[${new Date()}]: room leave`);
      const player = value.player
      const playerLength = value.room ? value.room.players.length : 1

      // DB 업데이트
      await Room.updateOne({ _id: player._roomId }, { $pull: { players: player._id } });
      const room = await Room.findOne({ _id: player._roomId }, { map: 0 })

      // player가 1명 남거나 없으면 삭제한다.
      if (room && room.players.length <= 1 && room.status !== 'WAIT') {
        await Room.updateOne({ _id: player._roomId }, { $set: { deleted: true } });
        // messages 삭제
        await Message.deleteMany({ _roomId: player._roomId })
      } else if (room && room.players.length > 0 && room.status === 'WAIT') {
        await Room.updateOne({ _id: player._roomId }, { $set: { currentPlayer: room.players[0]._id } });
      } else {
        await Room.updateOne({ _id: player._roomId }, { $set: { playerLimit: playerLength - 1 } });
      }

      await Player.updateOne({ _id: player._id }, {
        $set: {
          _roomId: 0,
          coordinates: null,
          initialCoordinates: null,
          cards: [],
          piece: {icon: []},
          life: 3
        }
      });

      if(player._roomId > 0 && room.players.length > 0) {
        // Socket room 갱신
        broadcastRoom(player._roomId);
        broadcastSystemMessage(player._roomId, 'success', joinMsg([player.name, 'leaveRoomMessage']));
      }
    } catch (e) {
      console.error(`error: ${e}`);
    } finally {
      // 웹소켓 룸에서 나옴
      socket.leave(`room-${value.player._roomId}`);
      refreshRooms(socket)
      // socket.disconnect(true);
    }
  });

  socket.on('send-message', async (message) => {
    try {
      console.log(`[${new Date()}]: send-message`);
      // DB message 등록
      const player = await Player.findOne({ _id: message._playerId })
      const newMessage = new Message({ playerName: player.name, sendedAt: new Date(), ...message });
      await newMessage.save();
      // Socket room 갱신
      broadcastRoomMessage(message._roomId);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[${new Date()}]: user socket disconnected`);
  });

  socket.on('error', () => {
    console.log(`[${new Date()}]: error`);
  });
});
