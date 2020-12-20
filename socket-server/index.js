const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // 편의상 *로 했지만 보안상 문제 있음
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

// { id: 1, title: '초보방 아무나', players: 1, playerLimit: 2, map: [[5, 6, 3, 6, 4, 1, 1, 1, 3, 3],[4, 3, 1, 4, 5, 1, 3, 5, 2, 1],[2, 1, 4, 2, 4, 4, 2, 3, 1, 3],[6, 1, 5, 3, 6, 5, 5, 4, 4, 1],[2, 1, 5, 1, 4, 4, 6, 1, 4, 6],[5, 3, 2, 1, 5, 6, 4, 4, 6, 1],[6, 1, 5, 4, 5, 3, 2, 4, 6, 6],[1, 6, 4, 2, 2, 5, 2, 3, 2, 5],[4, 4, 1, 3, 1, 6, 5, 5, 1, 5],[5, 6, 4, 2, 6, 3, 2, 3, 5, 3]] },
let rooms = [];

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
      console.log(player)
      // websocket room 연결
      socket.join(`room-${player.roomId}`);

      // rooms에 players 추가
      const targetRoom = rooms.find((r) => Number(r.id) === Number(player.roomId));
      const index = rooms.indexOf(targetRoom);

      socket.in(`room-${player.roomId}`).emit(`changeRoomInfo-${player.roomId}`, rooms[index]);
    } catch (e) {
      console.error(`error: ${e}`)
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
        rooms[index] = room;

        // 방안의 사람들의 room을 갱신
        socket.in(`room-${room.id}`).emit(`changeRoomInfo-${room.id}`, room);
      }
    } catch (e) {
      console.error(`error: ${e}`)
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
      console.log(player)
      const targetRoom = rooms.find((r) => Number(r.id) === Number(player.roomId));
      const index = rooms.indexOf(targetRoom);

      // 서버의 rooms에서 삭제
      if (index > -1) {
        const targetPlayer = rooms[index].players.find((p) => Number(p.id) === Number(player.id));
        const targetPlayerIndex = rooms[index].players.indexOf(targetPlayer);

        if (targetPlayerIndex > -1) {
          rooms[index].players.splice(targetPlayerIndex, 1);
          socket.in(`room-${player.roomId}`).emit(`changeRoomInfo-${player.roomId}`, rooms[index]);
        }

        if (rooms[index].players.length === 0) {
          rooms.splice(index, 1);
        }
      }

      // 웹소켓 룸에서 나옴
      socket.leave(`room-${player.id}`)
    } catch (e) {
      console.error(`error: ${e}`)
    }
  });

  socket.on('disconnect', function () {
    console.log(`[${new Date()}]: user socket disconnected`);
  });

  socket.on('error', function () {
    console.log(`[${new Date()}]: error`);
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

/**
 * GET rooms
 * 전체 방 리스트 가져오기
 */
app.get('/rooms', function(req, res) {
  console.log(`[${new Date()}]: GET rooms`);
  res.send(JSON.stringify(rooms));
});

 /**
 * POST room
 * 새로운 방 만들기
 */
app.post('/rooms', function(req, res) {
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
app.get('/rooms/:id', function(req, res) {
  console.log(`[${new Date()}]: GET rooms/${req.params.id}`);
  const targetRoom = rooms.find((room) => Number(room.id) === Number(req.params.id));
  res.send(JSON.stringify(targetRoom));
});

 /**
 * POST rooms/:roomId/players
 * 특정 방의 플레이어 추가하기
 */
app.post('/players', function(req, res) {
  const newPlayer = req.body;

  console.log(`[${new Date()}]: POST room ${newPlayer.roomId} players`);
  const targetRoom = rooms.find((room) => Number(room.id) === Number(newPlayer.roomId));
  const index = rooms.indexOf(targetRoom);

  newPlayer.id = new Date().getTime();

  if (index > -1) {
    rooms[index].players.push(newPlayer);
  }

  res.send(JSON.stringify(newPlayer));
});

// functions =========================================================
function getLastRoomId(targetRooms) {
  return targetRooms.length > 0 ? targetRooms[targetRooms.length - 1].id : 0;
}

// TODO
// 기존에 만들어진 방에 들어온 경우 그 방의 맵을 표시한다.
// socket.io의 rooms를 이용하여 각 방 별로 유저 접속
// rooms 인원 제한

// 화면 리로드했을 때 같은 사람이면 인원 + 1 하지 않고 표시만 하기
// 방떠날때 인원 - 1 하기
// 방에 들어왔을 때 인원 + 1 하기
