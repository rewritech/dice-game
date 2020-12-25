const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http');
const server = http.Server(app);
const socketServer = http.Server(app);
const io = require('socket.io')(socketServer);
const port = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 3001;
const rooms = require('./room').rooms;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 편의상 *로 했지만 보안상 문제 있음
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

socketServer.listen(socketPort, () => {
  console.log(`started on port: ${socketPort}`);
});


const api = require('./routes/api');
app.use('/api', api);


io.of('/dice-map-room').on('connection', (socket) => {
  console.log(`[${new Date()}]: user socket connected`);
  /**
   * room join 할때
   * room.player.push
   * 인원제한
   * */
  socket.on('join-room', (player) => {
    try {
      console.log(`[${new Date()}]: room join`);
      console.log(player);
      // websocket room 연결
      socket.join(`room-${player.roomId}`);

      // rooms에 players 추가
      const targetRoom = rooms.find(
        (r) => Number(r.id) === Number(player.roomId)
      );
      const index = rooms.indexOf(targetRoom);

      socket
        .in(`room-${player.roomId}`)
        .emit(`changeRoomInfo-${player.roomId}`, rooms[index]);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  /**
   * room 정보변경 할때
   * 셔플
   * 카드 제출
   * 말 이동
   * 게임종료
   * 채팅?
   * */
  socket.on('shuffle-map', (room) => {
    try {
      console.log(`[${new Date()}]: room shuffle`);
      // 서버의 room을 갱신
      const targetRoom = rooms.find((r) => Number(r.id) === Number(room.id));
      const index = rooms.indexOf(targetRoom);
      if (index > -1) {
        rooms[index] = room

        // 방안의 사람들의 room을 갱신
        socket.in(`room-${room.id}`).emit(`changeRoomInfo-${room.id}`, room);
      }
    } catch (e) {
      console.error(`error: ${e}`);
    }
  });

  /**
   * room leave 할때
   * room.player.splice(index, 1)
   * 방이 0명이면 방 삭제
   * */
  socket.on('leave', (player) => {
    try {
      console.log(`[${new Date()}]: room leave`);
      console.log(player);
      const targetRoom = rooms.find(
        (r) => Number(r.id) === Number(player.roomId)
      );
      const index = rooms.indexOf(targetRoom);

      // 서버의 rooms에서 삭제
      if (index > -1) {
        const targetPlayer = rooms[index].players.find(
          (p) => Number(p.id) === Number(player.id)
        );
        const targetPlayerIndex = rooms[index].players.indexOf(targetPlayer);

        if (targetPlayerIndex > -1) {
          rooms[index].players.splice(targetPlayerIndex, 1);
          socket
            .in(`room-${player.roomId}`)
            .emit(`changeRoomInfo-${player.roomId}`, rooms[index]);
        }

        if (rooms[index].players.length === 0) {
          rooms.splice(index, 1);
        }
      }

      // 웹소켓 룸에서 나옴
      socket.leave(`room-${player.id}`);
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
