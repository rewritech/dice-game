const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // 편의상 *로 했지만 보안상 문제 있음
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

let rooms = [
  // { id: 1, title: '초보방 아무나', memberCount: 1, memberLimit: MEMBER_LIMIT, map: [[5, 6, 3, 6, 4, 1, 1, 1, 3, 3],[4, 3, 1, 4, 5, 1, 3, 5, 2, 1],[2, 1, 4, 2, 4, 4, 2, 3, 1, 3],[6, 1, 5, 3, 6, 5, 5, 4, 4, 1],[2, 1, 5, 1, 4, 4, 6, 1, 4, 6],[5, 3, 2, 1, 5, 6, 4, 4, 6, 1],[6, 1, 5, 4, 5, 3, 2, 4, 6, 6],[1, 6, 4, 2, 2, 5, 2, 3, 2, 5],[4, 4, 1, 3, 1, 6, 5, 5, 1, 5],[5, 6, 4, 2, 6, 3, 2, 3, 5, 3]] },
  // { id: 2, title: '님만 오면 출발', memberCount: 3, memberLimit: MEMBER_LIMIT, map: [[3, 1, 6, 4, 1, 1, 2, 2, 2, 4],[4, 1, 3, 6, 1, 5, 2, 3, 3, 4],[3, 2, 5, 1, 6, 5, 2, 3, 1, 4],[6, 3, 1, 2, 6, 6, 5, 2, 3, 6],[6, 4, 2, 3, 3, 5, 2, 3, 4, 5],[4, 3, 2, 5, 1, 3, 2, 2, 4, 6],[2, 4, 1, 2, 6, 1, 1, 4, 6, 1],[6, 1, 2, 6, 4, 2, 5, 2, 6, 6],[2, 5, 6, 2, 4, 1, 3, 2, 3, 3], [2, 1, 2, 1, 4, 1, 5, 4, 3, 5]] },
  // { id: 3, title: '초고수만 ㄱㄱ', memberCount: 4, memberLimit: MEMBER_LIMIT, map: [[2, 5, 2, 4, 3, 1, 3, 3, 1, 2],[1, 2, 6, 1, 6, 5, 3, 3, 1, 6],[3, 3, 5, 3, 3, 5, 4, 3, 6, 5],[5, 6, 4, 4, 5, 2, 4, 6, 4, 4],[5, 3, 2, 1, 1, 5, 6, 6, 5, 3],[4, 1, 6, 1, 1, 1, 6, 2, 1, 3],[5, 6, 3, 2, 2, 5, 2, 4, 5, 4],[3, 4, 3, 4, 3, 5, 1, 6, 5, 3],[6, 5, 2, 3, 6, 6, 2, 5, 1, 4], [2, 3, 6, 3, 4, 4, 5, 4, 1, 5]] },
];

io.on('connection', (socket) => {
  console.log(`[${new Date()}]: user socket connected`);
  console.log(rooms)
  /**
   * room join 할때
   * room.player.push
   * 인원제한
   * */
  /**
   * room leave 할때
   * room.player.splice(index, 1)
   * 방이 0명이면 방 삭제
   * */
  /**
   * room 정보변경 할때
   * 셔플
   * 카드 제출
   * 말 이동
   * 게임종료
   * 채팅?
   * */
  /**
   * room reload 할때
   * */

  socket.on('new-map', (msg) => {
    socket.broadcast.emit("new-map-broadcast", msg);
  })

  socket.on('disconnect', function () {
    console.log(`[${new Date()}]: user socket disconnected`);
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
  for (const player in newRoom.players) {
    newRoom.players[player].roomId = newRoom.id;
  }
  rooms.push(newRoom);
  res.send(JSON.stringify(newRoom));
});

 /**
 * PUT room
 * 방 수정
 * join, shuffle,
 */
// app.put('/rooms/:id', function(req, res) {
//   console.log(`[${new Date()}]: PUT rooms/${req.params.id}`);
//   const resBody = JSON.parse(req.body);
//   for (const player in resBody.players) {
//     player.roomId = resBody.id;
//   }

//   const targetRoom = rooms.find((room) => Number(room.id) === Number(req.params.id));
//   const index = rooms.indexOf(targetRoom);
//   if (index > -1) rooms[index] = resBody;
//   res.end();
// });

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
 * DELETE room/:id
 * 방 떠나기 -> 방 정보 삭제
 */
// app.delete('/rooms/:id', function(req, res) {
//   console.log(`[${new Date()}]: DELETE rooms/${req.params.id}`);
//   const targetRoom = rooms.find((room) => Number(room.id) === Number(req.params.id));
//   targetRoom.memberCount = targetRoom.memberCount - 1;
//   const index = rooms.indexOf(targetRoom);
//   if (index > -1 && targetRoom.memberCount === 0) rooms.splice(index, 1);
//   res.end();
// });

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
