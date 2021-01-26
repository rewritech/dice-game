const common = require('./common');
const end = require('./end');
const Room = require('../models/Room');
const Player = require('../models/Player');
const Message = require('../models/Message');

const DICE = 6
const CARD_SET = 20
const TOTAL_CARDS = DICE * CARD_SET
const GAME_OVER_CONDITION_KILLED = 5
const GAME_OVER_CONDITION_LIFE = 0

// 말 이동 애니메이션
const moveAnimate = function (coordinates, moveTo) {
  const moveCoord = [moveTo[1] - coordinates[1], moveTo[0] - coordinates[0]]
  return {
    value: 'move',
    params: { x: 100 * moveCoord[0], y: 100 * moveCoord[1] },
    target: [coordinates[0], coordinates[1]],
  }
}

const compare = function (soruce, target) {
  return JSON.stringify(soruce) === JSON.stringify(target)
}

const catchPlayer = async function (io, player) {
  console.log(`[${new Date().toISOString()}]: catch-player-${player?._roomId} ${player?._id}`);
  await Player.updateOne({ _id: player._id }, { $set: player });
  await common.broadcastSystemMessage(io, player._roomId, 'danger', common.joinMsg([player.name, 'catchedMessage']));
}

// move
// - 카드 제출했습니다. + 애니메이션
// - catch
//   - 잡혔습니다.
// - change turn || game over
const move = async function (io, value) {
  const { moveTo, room, player } = value
  console.log(`[${new Date().toISOString()}]: move-${room?._id} ${player?._id}`);

  // ====== 이동 ======
  // 제출 카드 가져오기
  const prevRoom = await Room.findOne({ _id: room._id, deleted: false });
  const usedCard = room.cardDeck.used.slice(prevRoom.cardDeck.used.length).join(', ')
  // 애니메이션 좌표 계산하기
  const aniConfig = moveAnimate(moveTo, player.coordinates)
  // DB 갱신
  player.coordinates = moveTo
  // 카드 제출 메세지
  await common.broadcastSystemMessage(io, room._id, 'success', common.joinMsg([player.name, 'changeTurnMessage1', usedCard, 'changeTurnMessage2']));

  // ====== catch 판별 ======
  // 메세지 + DB갱신
  const catchedIndex = room.players.findIndex((p) => compare(p.coordinates, moveTo) && p._id !== player._id)
  let endGame = false
  if (catchedIndex > -1) {
    // 잡힌 유저의 라이프 감소
    room.players[catchedIndex].life -= 1
    // 잡힌 유저 좌표 초기화
    room.players[catchedIndex].coordinates = room.players[catchedIndex].initialCoordinates
    player.killedPlayer += 1
    // 게임종료 판단
    endGame = player.killedPlayer === GAME_OVER_CONDITION_KILLED || room.players[catchedIndex].life === GAME_OVER_CONDITION_LIFE
    await catchPlayer(io, room.players[catchedIndex])
  }

  if (room.cardDeck.used.length === TOTAL_CARDS) {
    endGame = true
  }

  // ====== 게임 종료 판별 ======
  if (endGame) {
    room.status = 'END'
    await end.endGame(io, { room, player, aniConfig })
  } else {
    await common.changeTurn(io, { room, player, aniConfig })
  }
}

module.exports = {
  move,
};
