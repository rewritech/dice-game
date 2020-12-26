const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Player = require('../models/Player');

/**
 * GET rooms
 * 전체 방 리스트 가져오기
 */
router.get('/rooms', async (req, res) => {
  console.log(`[${new Date()}]: GET rooms`);
  const rooms = await Room.find({}, { map: 0 });
  res.json(rooms);
});

/**
 * POST rooms
 * 새로운 방 만들기
 */
router.post('/rooms', async (req, res) => {
  console.log(`[${new Date()}]: POST rooms`);
  const roomCount = await Room.count();
  const newRoom = new Room({_id: roomCount + 1, ...req.body});
  const savedRoom = await newRoom.save();
  res.json(savedRoom);
});

/**
 * PUT rooms
 * 방에 플레이어 추가하기
 */
router.put('/rooms/:id', async (req, res) => {
  console.log(`[${new Date()}]: PUT add player to room ${req.params.id}`);
  // DB room에 유저 추가(중복체크)
  const roomInPlayer = await Room.find({ _id: req.params.id, players: { $in: req.body._id } });
  if (roomInPlayer) {
    await Room.update({ _id: req.params.id }, { $push: { players: req.body._id } });
  }

  const room = await Room.findById(req.params.id).populate('players');
  res.json(room);
});

/**
 * GET rooms/:id
 * 방 정보 가져오기
 */
router.get('/rooms/:id', async (req, res) => {
  console.log(`[${new Date()}]: GET rooms/${req.params.id}`);
  const room = await Room.findById(req.params.id).populate('players');
  res.json(room);
});

/**
 * DELETE rooms/:id
 * 방 삭제
 */
router.delete('/rooms/:id', async (req, res) => {
  console.log(`[${new Date()}]: DELETE rooms/${req.params.id}`);
  await Room.remove({ _id: req.params.id });
  res.json(`deleted room ${req.params.id}`);
});

/**
 * GET player/:id
 * 특정 플레이어 정보 가져오기
 */
router.get('/players/:id', async (req, res) => {
  console.log(`[${new Date()}]: GET player/${req.params.id}`);
  const player = await Player.findById(req.params.id);
  res.json(player);
});

/**
 * POST players
 * 플레이어 추가하기
 */
router.post('/players', async (req, res) => {
  console.log(`[${new Date()}]: POST room ${req.body._roomId} players`);

  const newPlayer = new Player(req.body);
  await newPlayer.save();
  res.json(newPlayer);
});

module.exports = router;