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

// ==================== DB ====================

const options = {
	useUnifiedTopology : true,
  useNewUrlParser : true,
  useFindAndModify: false
}

mongoose.connect('mongodb://db/dice_db', options);

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
  const room = await Room.findById(roomId).populate('players');
  socket.in(`room-${roomId}`).emit(`changeRoomInfo-${roomId}`, room);
}

io.of('/dice-map-room').on('connection', (socket) => {
  console.log(`[${new Date()}]: user socket connected`);

  socket.on('join-room', async (player) => {
    try {
      console.log(player);
      console.log(`[${new Date()}]: room-${player._roomId} join`);
      // websocket room 연결
      socket.join(`room-${player._roomId}`);
      // DB room에 유저 추가(중복체크)
      // const roomInPlayer = await Room.find({ _id: player._roomId, players: { $in: player._id } });
      // if (roomInPlayer) {
      //   await Room.update({ _id: player._roomId }, { $push: { players: player._id } });
      // }
      // Socket room 갱신
      broadcastRoom(socket, player._roomId);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('shuffle-map', async (shuffledRoom) => {
    try {
      console.log(`[${new Date()}]: room shuffle`);
      // DB room 갱신
      await Room.update({ _id: shuffledRoom._id }, { $set: { map: shuffledRoom.map } });
      // Socket room 갱신
      broadcastRoom(socket, shuffledRoom._id);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  socket.on('leave', async (player) => {
    try {
      console.log(`[${new Date()}]: room leave`);
      console.log(player);
      // DB 업데이트
      await Room.update({ _id: player._roomId }, { $pull: { players: player._id } });
      // Socket room 갱신
      broadcastRoom(socket, player._roomId);
      // 웹소켓 룸에서 나옴
      socket.leave(`room-${player._roomId}`);
    } catch (e) {
      console.error(`error: ${e}`);
    } finally {
      socket.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[${new Date()}]: user socket disconnected`);
  });

  socket.on('error', () => {
    console.log(`[${new Date()}]: error`);
  });
});
