const common = require('./common');
const Room = require('../models/Room');
const Player = require('../models/Player');

const leave = async function (io, player) {
  console.log(`[${new Date().toISOString()}]: room leave ${player._id}`);

  // 1. room의 player를 내보냄
  await Room.updateOne({ _id: player._roomId }, { $pull: { players: player._id } });
  const room = await Room.findOne({ _id: player._roomId }, { map: 0 })

  if (!!room && room.status === 'WAIT') {
    if (room.players.length === 0) {
      // 4. 대기방 0명인 경유 삭제한다.
      common.deleteRoom(room)
    } else {
      // 2. 대기방에서 방장이 나가면 방장 교체
      await Room.updateOne({ _id: player._roomId }, { $set: { currentPlayer: room.players[0]._id } });
    }
  } else {
    if (room.players.length < 2) {
      // 5. 게임중 1명 남게 되면 방 삭제한다.
      common.deleteRoom(room)
    } else {
      // 6. 게임중 떠나면 playerLimit가 줄어든다.
      await Room.updateOne({ _id: player._roomId }, { $set: { playerLimit: room.players.length } });
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

module.exports = {
  leave,
};
