const app = require('express')();
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

// TODO
// 기존에 만들어진 방에 들어온 경우 그 방의 맵을 표시한다.
// socket.io의 rooms를 이용하여 각 방 별로 유저 접속
// rooms 인원 제한
