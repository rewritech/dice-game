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
