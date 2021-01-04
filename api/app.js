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
async function broadcastRoom (socket, roomId) {
  const room = await Room.findOne({ _id: roomId, deleted: false }).populate('players');
  io.of("/dice-map-room").to(`room-${roomId}`).emit(`changeRoomInfo-${roomId}`, room);
}
async function broadcastRoomMessage (socket, roomId) {
  const messages = await Message.find({ _roomId: roomId });
  io.of("/dice-map-room").to(`room-${roomId}`).emit(`chat-room-${roomId}`, messages);
}
async function broadcastSystemMessage (socket, roomId, content) {
  const message = new Message({ _roomId: roomId, _playerId: null, playerName: 'System', sendedAt: new Date(), content });
  await message.save();
  // Socket room 갱신
  broadcastRoomMessage(socket, roomId);
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
      broadcastRoom(socket, player._roomId);
      broadcastSystemMessage(socket, player._roomId, `${player.name}님이 참가하셨습니다.`);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('shuffle-map', async (shuffledRoom) => {
    try {
      console.log(`[${new Date()}]: room shuffle`);
      // DB room 갱신
      await Room.updateOne({ _id: shuffledRoom._id }, { $set: { map: shuffledRoom.map } });
      // Socket room 갱신
      broadcastRoom(socket, shuffledRoom._id);
      broadcastSystemMessage(socket, shuffledRoom._id, '맵이 변경되었습니다.');
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('select-piece', async (player) => {
    try {
      console.log(`[${new Date()}]: select-piece`);
      // DB room 갱신
      await Player.updateOne({ _id: player._id }, {
        $set: {
          piece: player.piece,
          coordinates: player.coordinates,
          initialCoordinates: player.initialCoordinates
        }
      });
      // Socket room 갱신
      broadcastRoom(socket, player._roomId);
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
      await Room.updateOne({ _id: room._id }, { $set: { status: room.status, playerLimit: room.playerLimit, cardDeck: room.cardDeck } });
      await Player.updateOne({ _id: player._id }, { $set: { cards: player.cards } });
      // Socket room 갱신
      broadcastRoom(socket, room._id);
      broadcastSystemMessage(socket, room._id, '게임을 시작합니다.');
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
      await Player.updateOne({ _id: player._id }, { $set: { coordinates: player.coordinates, cards: player.cards } });

      // 카드 분배
      // unused에 카드가 2장 미만이면 used의 카드를 다시 가져온다.
      if (room.cardDeck.unused.length < 2) {
        room.cardDeck.unused = room.cardDeck.unused.concat(room.cardDeck.used)
        room.cardDeck.used = []
      }
      const newCards = room.cardDeck.unused.splice(0, 2)
      await Player.updateOne({ _id: room.currentPlayer }, { $push: { cards: newCards } });
      await Room.updateOne({ _id: room._id }, {
        $set: {
          currentPlayer: room.currentPlayer,
          cardDeck: room.cardDeck
        }
      });
      const newCurrentPlayer = await Player.findOne({ _id: room.currentPlayer })
      // Socket room 갱신
      broadcastRoom(socket, room._id);
      broadcastSystemMessage(socket, room._id, `${player.name}님의 턴이 종료되었습니다.<br/>${newCurrentPlayer.name}님의 턴입니다.`);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('leave', async (player) => {
    try {
      console.log(`[${new Date()}]: room leave`);
      console.log(player);
      // DB 업데이트
      await Room.updateOne({ _id: player._roomId }, { $pull: { players: player._id } });

      const room = await Room.findOne({ _id: player._roomId, deleted: false }, { map: 0 })
      // WAIT 상태에서 방장이 나가면 다음사람을 방장으로 선정
      if (room && String(room.currentPlayer) === player._id && room.status === 'WAIT' && room.players > 0) {
        await Room.updateOne({ _id: player._roomId }, { $set: { currentPlayer: room.players[0]._id } });
      }

      // player가 없으면 삭제한다.
      if (room && room.players.length < 1) {
        await Room.updateOne({ _id: player._roomId }, { $set: { deleted: true } });
        // messages 삭제
        await Message.deleteMany({ _roomId: player._roomId })
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

      if(player._roomId > 0) {
        // Socket room 갱신
        broadcastRoom(socket, player._roomId);
        broadcastSystemMessage(socket, player._roomId, `${player.name}님이 떠나셨습니다.`);
        // 웹소켓 룸에서 나옴
        socket.leave(`room-${player._roomId}`);
      }
    } catch (e) {
      console.error(`error: ${e}`);
    } finally {
      socket.disconnect(true);
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
      broadcastRoomMessage(socket, message._roomId);
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
