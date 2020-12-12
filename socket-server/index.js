
// var app = require('express')();
// var http = require('http').Server(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origin: '*',
//     credentials: true
//   }
// });

// app.listen(5678, () => {
//   console.log(`Server connection on  http://127.0.0.1:5678`);  // Server Connnected
// });
// // Socket Layer over Http Server



// // Send Notification API
// app.get('/send-notification', (req, res) => {
//   console.log("aaaaaaaaaaaaa")
//   // res.set({ 'Access-Control-Allow-Origin': '*' });
//   // console.log(req.body)
//   //   const notify = {data: req.body};
//   //   socket.emit('notification', notify); // Updates Live Notification
//     res.send("notify");
// });


// // On every Client Connection
// io.on('connection', socket => {
//     console.log('Socket: client connected');
// });
const express = require('express')
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('user connected');
});

io.on('new-message', (message) => {
  io.emit(message);
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
