import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'

const app = express()
const server = http.Server(app)
const io = new Server(server)
const port = process.env.PORT || 3000
const dirname = path.resolve()

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200') // 편의상 *로 했지만 보안상 문제 있음
  res.header(
    'Access-Control-Allow-Methods',
    'GET, PUT, POST, DELETE, HEAD, OPTIONS'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(express.static(path.join(dirname, 'dist/dice-map')))
app.set('port', port)

server.listen(port, () => {
  console.log(`started on port: ${port}`)
})

function getLastRoomId(targetRooms) {
  return targetRooms.length > 0 ? targetRooms[targetRooms.length - 1].id : 0
}

// { id: 1, title: '초보방 아무나', players: 1, playerLimit: 2, map: [[5, 6, 3, 6, 4, 1, 1, 1, 3, 3],[4, 3, 1, 4, 5, 1, 3, 5, 2, 1],[2, 1, 4, 2, 4, 4, 2, 3, 1, 3],[6, 1, 5, 3, 6, 5, 5, 4, 4, 1],[2, 1, 5, 1, 4, 4, 6, 1, 4, 6],[5, 3, 2, 1, 5, 6, 4, 4, 6, 1],[6, 1, 5, 4, 5, 3, 2, 4, 6, 6],[1, 6, 4, 2, 2, 5, 2, 3, 2, 5],[4, 4, 1, 3, 1, 6, 5, 5, 1, 5],[5, 6, 4, 2, 6, 3, 2, 3, 5, 3]] },
const rooms = []

io.of('/api/dice-map-room').on('connection', (socket) => {
  console.log(`[${new Date()}]: user socket connected`)
  /**
   * room join 할때
   * room.player.push
   * 인원제한
   * */
  socket.on('join-room', (player) => {
    try {
      console.log(`[${new Date()}]: room join`)
      console.log(player)
      // websocket room 연결
      socket.join(`room-${player.roomId}`)

      // rooms에 players 추가
      const targetRoom = rooms.find(
        (r) => Number(r.id) === Number(player.roomId)
      )
      const index = rooms.indexOf(targetRoom)

      socket
        .in(`room-${player.roomId}`)
        .emit(`changeRoomInfo-${player.roomId}`, rooms[index])
    } catch (e) {
      console.error(`error: ${e}`)
    }
  })

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
      console.log(`[${new Date()}]: room shuffle`)
      // 서버의 room을 갱신
      const targetRoom = rooms.find((r) => Number(r.id) === Number(room.id))
      const index = rooms.indexOf(targetRoom)
      if (index > -1) {
        rooms[index] = room

        // 방안의 사람들의 room을 갱신
        socket.in(`room-${room.id}`).emit(`changeRoomInfo-${room.id}`, room)
      }
    } catch (e) {
      console.error(`error: ${e}`)
    }
  })

  /**
   * room leave 할때
   * room.player.splice(index, 1)
   * 방이 0명이면 방 삭제
   * */
  socket.on('leave', (player) => {
    try {
      console.log(`[${new Date()}]: room leave`)
      console.log(player)
      const targetRoom = rooms.find(
        (r) => Number(r.id) === Number(player.roomId)
      )
      const index = rooms.indexOf(targetRoom)

      // 서버의 rooms에서 삭제
      if (index > -1) {
        const targetPlayer = rooms[index].players.find(
          (p) => Number(p.id) === Number(player.id)
        )
        const targetPlayerIndex = rooms[index].players.indexOf(targetPlayer)

        if (targetPlayerIndex > -1) {
          rooms[index].players.splice(targetPlayerIndex, 1)
          socket
            .in(`room-${player.roomId}`)
            .emit(`changeRoomInfo-${player.roomId}`, rooms[index])
        }

        if (rooms[index].players.length === 0) {
          rooms.splice(index, 1)
        }
      }

      // 웹소켓 룸에서 나옴
      socket.leave(`room-${player.id}`)
    } catch (e) {
      console.error(`error: ${e}`)
    } finally {
      socket.disconnect(true)
    }
  })

  socket.on('disconnect', () => {
    console.log(`[${new Date()}]: user socket disconnected`)
  })

  socket.on('error', () => {
    console.log(`[${new Date()}]: error`)
  })
})

/**
 * GET rooms
 * 전체 방 리스트 가져오기
 */
app.get('/api/rooms', (req, res) => {
  console.log(`[${new Date()}]: GET rooms`)
  res.send(JSON.stringify(rooms))
})

/**
 * POST room
 * 새로운 방 만들기
 */
app.post('/api/rooms', (req, res) => {
  console.log(`[${new Date()}]: POST rooms`)
  const newRoom = req.body
  newRoom.id = getLastRoomId(rooms) + 1
  rooms.push(newRoom)
  res.send(JSON.stringify(newRoom))
})

/**
 * GET room/:id
 * 방 정보 가져오기
 */
app.get('/api/rooms/:id', (req, res) => {
  console.log(`[${new Date()}]: GET rooms/${req.params.id}`)
  const targetRoom = rooms.find(
    (room) => Number(room.id) === Number(req.params.id)
  )
  res.send(JSON.stringify(targetRoom))
})

/**
 * POST rooms/:roomId/players
 * 특정 방의 플레이어 추가하기
 */
app.post('/api/players', (req, res) => {
  const newPlayer = req.body

  console.log(`[${new Date()}]: POST room ${newPlayer.roomId} players`)
  const targetRoom = rooms.find(
    (room) => Number(room.id) === Number(newPlayer.roomId)
  )
  const index = rooms.indexOf(targetRoom)

  newPlayer.id = new Date().getTime()

  if (index > -1) {
    rooms[index].players.push(newPlayer)
  }

  res.send(JSON.stringify(newPlayer))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(dirname, 'dist/dice-map/index.html'))
})
