const common = require('./common');
const playing = require('./playing');
const Room = require('../models/Room');
const Player = require('../models/Player');

const leave = async function (io, player) {
  console.log(`[${new Date().toISOString()}]: room leave-${player?._roomId} ${player?._id}`);

  // 1. room의 player를 내보냄
  await Room.updateOne({ _id: player._roomId }, { $pull: { players: player._id } });
  const room = await Room.findOne({ _id: player._roomId }).populate('players')

  // 방이 존재한다면
  if (!!room) {
    if (room.status === 'WAIT') {
      // 대기방인 경우
      if (room.players.length === 0) {
        // 4. 0명이면 삭제한다.
        await common.deleteRoom(room)
      } else {
        // 2. 방장이 나가면 방장 교체
        await Room.updateOne({ _id: player._roomId }, { $set: { currentPlayer: room.players[0]._id } });
      }
    } else {
      // 플레이 중인 경우
      if (room.players.length < 2) {
        // 5. 게임중 1명 남게 되면 방 삭제한다.
        await common.deleteRoom(room)
      } else {
        // 내턴이면 턴을 넘긴다
        if (String(room.currentPlayer) === String(player._id)) {
          const val = {
            room,
            player,
            aniConfig: null
          }
          await playing.changeTurn(io, val)
        }

        // 6. 게임중 떠나면 player 카드를 used에 넣는다.
        const used = room.cardDeck.used.concat(player.cards)
        await Room.updateOne({ _id: player._roomId }, { $set: {
          cardDeck: { used },
        }});
      }
    }
  }

  await Player.updateOne({ _id: player._id }, {
    $set: {
      _roomId: 0,
      coordinates: null,
      initialCoordinates: null,
      cards: [],
      piece: {icon: []},
      killedPlayer: 0,
      life: 3
    }
  });

  if(player._roomId > 0 && !!room && room.players.length > 0) {
    // Socket room 갱신
    common.broadcastRoom(io, player._roomId);
    common.broadcastSystemMessage(io, player._roomId, 'success', common.joinMsg([player.name, 'leaveRoomMessage']));
  }
}

const replay = async function (io, room) {
  console.log(`[${new Date().toISOString()}]: replay-${room?._id}`);

  await Room.updateOne({ _id: room._id }, { $set: room });
  await Player.updateMany({ _roomId: room._id }, { $set: {
    coordinates: null,
    initialCoordinates: null,
    cards: [],
    piece: {icon: []},
    life: 3,
    killedPlayer: 0
  }});
  common.broadcastRoom(io, room._id);
}

const endGame = async function (io, value) {
  const { player, room, aniConfig } = value
  console.log(`[${new Date().toISOString()}]: end-game-${room?._id} ${player._id}`);

  // DB room 갱신
  await Room.updateOne({ _id: room._id }, { $set: room });
  await Player.updateOne({ _id: player._id }, { $set: player });

  const newRoom = await Room.findOne({ _id: room._id, deleted: false }).populate('players');
  io.of("/dice-map-room").to(`room-${room._id}`).emit(`end-game-${room._id}`, { room: newRoom, aniConfig });

  common.broadcastSystemMessage(io, room._id, 'warning', 'gameEndMessage');
}

module.exports = {
  leave,
  replay,
  endGame,
};
