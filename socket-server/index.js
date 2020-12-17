const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // 편의상 *로 했지만 보안상 문제 있음
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('[' + new Date() + ']: user connected');

  socket.on('new-map', (msg) => {
    socket.broadcast.emit("new-map-broadcast", msg);
  })
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

const MEMBER_LIMIT = 4
let rooms = [
  { id: 1, title: '초보방 아무나', memberCount: 1, memberLimit: MEMBER_LIMIT, map: [[5, 6, 3, 6, 4, 1, 1, 1, 3, 3],[4, 3, 1, 4, 5, 1, 3, 5, 2, 1],[2, 1, 4, 2, 4, 4, 2, 3, 1, 3],[6, 1, 5, 3, 6, 5, 5, 4, 4, 1],[2, 1, 5, 1, 4, 4, 6, 1, 4, 6],[5, 3, 2, 1, 5, 6, 4, 4, 6, 1],[6, 1, 5, 4, 5, 3, 2, 4, 6, 6],[1, 6, 4, 2, 2, 5, 2, 3, 2, 5],[4, 4, 1, 3, 1, 6, 5, 5, 1, 5],[5, 6, 4, 2, 6, 3, 2, 3, 5, 3]] },
  { id: 2, title: '님만 오면 출발', memberCount: 3, memberLimit: MEMBER_LIMIT, map: [[3, 1, 6, 4, 1, 1, 2, 2, 2, 4],[4, 1, 3, 6, 1, 5, 2, 3, 3, 4],[3, 2, 5, 1, 6, 5, 2, 3, 1, 4],[6, 3, 1, 2, 6, 6, 5, 2, 3, 6],[6, 4, 2, 3, 3, 5, 2, 3, 4, 5],[4, 3, 2, 5, 1, 3, 2, 2, 4, 6],[2, 4, 1, 2, 6, 1, 1, 4, 6, 1],[6, 1, 2, 6, 4, 2, 5, 2, 6, 6],[2, 5, 6, 2, 4, 1, 3, 2, 3, 3], [2, 1, 2, 1, 4, 1, 5, 4, 3, 5]] },
  { id: 3, title: '초고수만 ㄱㄱ', memberCount: 4, memberLimit: MEMBER_LIMIT, map: [[2, 5, 2, 4, 3, 1, 3, 3, 1, 2],[1, 2, 6, 1, 6, 5, 3, 3, 1, 6],[3, 3, 5, 3, 3, 5, 4, 3, 6, 5],[5, 6, 4, 4, 5, 2, 4, 6, 4, 4],[5, 3, 2, 1, 1, 5, 6, 6, 5, 3],[4, 1, 6, 1, 1, 1, 6, 2, 1, 3],[5, 6, 3, 2, 2, 5, 2, 4, 5, 4],[3, 4, 3, 4, 3, 5, 1, 6, 5, 3],[6, 5, 2, 3, 6, 6, 2, 5, 1, 4], [2, 3, 6, 3, 4, 4, 5, 4, 1, 5]] },
];

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
  const resBody = JSON.parse(req.body);
  resBody.id = rooms.length;
  resBody.memberLimit = MEMBER_LIMIT;
  rooms.push(resBody);
  res.end();
});

 /**
 * PUT room
 * 방 수정
 */
app.put('/rooms/:id', function(req, res) {
  console.log(`[${new Date()}]: PUT rooms/${req.params.id}`);
  const resBody = JSON.parse(req.body);
  const targetRoom = rooms.find((room) => Number(room.id) === Number(req.params.id));
  const index = rooms.indexOf(targetRoom);
  if (index > -1) rooms[index] = resBody;
  res.end();
});

/**
 * GET room/:id
 * 방 정보 가져오기
 */
app.get('/rooms/:id', function(req, res) {
  console.log(`[${new Date()}]: GET room/${req.params.id}`);
  const targetRoom = rooms.find((room) => Number(room.id) === Number(req.params.id));
  res.send(JSON.stringify(targetRoom));
});

 /**
 * DELETE room/:id
 * 방 떠나기 -> 방 정보 삭제
 */
app.delete('/rooms/:id', function(req, res) {
  const targetRoom = rooms.find((room) => Number(room.id) === Number(req.params.id));
  const index = rooms.indexOf(targetRoom);
  if (index > -1) rooms.splice(index, 1);
  res.end();
});

// TODO
// 기존에 만들어진 방에 들어온 경우 그 방의 맵을 표시한다.
// socket.io의 rooms를 이용하여 각 방 별로 유저 접속
// rooms 인원 제한
