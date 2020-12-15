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
  // { id: 1, title: '초보방 아무나', memberCount: 1, memberLimit: MEMBER_LIMIT, map: [[], [], [], [], [], [], [], [], [], []] },
  // { id: 2, title: '님만 오면 출발', memberCount: 3, memberLimit: MEMBER_LIMIT, map: [[], [], [], [], [], [], [], [], [], []] },
  // { id: 3, title: '초고수만 ㄱㄱ', memberCount: 4, memberLimit: MEMBER_LIMIT, map: [[], [], [], [], [], [], [], [], [], []] },
];

/**
 * GET rooms
 * 전체 방 리스트 가져오기
 */
app.get('/rooms', function(req, res) {
  res.send(JSON.stringify(rooms));
});

 /**
 * POST room
 * 새로운 방 만들기
 */
app.post('/rooms/:id', function(req, res) {
  const resBody = JSON.parse(req.body);
  resBody.id = rooms.length;
  resBody.memberLimit = MEMBER_LIMIT;
  rooms.push(resBody);
  res.end();
});

/**
 * GET room/:id
 * 방 정보 가져오기
 */
app.get('/rooms/:id', function(req, res) {
  const targetRoom = rooms.find((room) => room.id === req.params.id)
  res.send(JSON.stringify(targetRoom));
});

 /**
 * DELETE room/:id
 * 방 떠나기 -> 방 정보 삭제
 */
app.delete('/rooms/:id', function(req, res) {
  const targetRoom = rooms.find((room) => room.id === req.params.id);
  const index = rooms.indexOf(targetRoom);
  if (index > -1) rooms.splice(index, 1);
  res.end();
});

// TODO
// 기존에 만들어진 방에 들어온 경우 그 방의 맵을 표시한다.
// socket.io의 rooms를 이용하여 각 방 별로 유저 접속
// rooms 인원 제한
