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
  const rooms = await Room.find({ deleted: false }, { map: 0 }).populate('players');
  res.json(rooms);
});

/**
 * POST rooms
 * 새로운 방 만들기
 */
router.post('/rooms', async (req, res) => {
  console.log(`[${new Date()}]: POST rooms`);
  const roomCount = await Room.countDocuments();
  const newRoom = new Room({ _id: roomCount + 1, deleted: false, ...req.body });
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
  const roomInPlayer = await Room.findOne({ _id: req.params.id, deleted: false, players: { $in: req.body._id } });
  if (!roomInPlayer) {
    await Room.updateOne({ _id: req.params.id }, { $push: { players: req.body._id } });
    await Player.updateOne({ _id: req.body._id }, { $set: { _roomId: req.params.id } });
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
  const room = await Room.findOne({ _id: req.params.id, deleted: false }).populate('players');
  res.json(room);
});

/**
 * DELETE rooms/:id
 * 방 삭제
 */
router.delete('/rooms/:id', async (req, res) => {
  console.log(`[${new Date()}]: DELETE rooms/${req.params.id}`);
  await Room.updateOne({ _id: req.params.id }, { $set: { deleted: true } });
  res.json(`deleted room ${req.params.id}`);
});

/**
 * GET player/:id
 * 특정 플레이어 정보 가져오기
 */
router.get('/players/:id', async (req, res) => {
  console.log(`[${new Date()}]: GET player/${req.params.id}`);
  const player = await Player.findOne({ _id: req.params.id });
  res.json(player);
});

/**
 * POST players
 * 플레이어 추가하기
 */
router.post('/players', async (req, res) => {
  console.log(`[${new Date()}]: POST players ${req.body._roomId}`);

  const newPlayer = new Player(req.body);
  await newPlayer.save();
  res.json(newPlayer);
});

/**
 * PUT players
 * 플레이어 이름 변경하기
 */
router.put('/players/:id', async (req, res) => {
  console.log(`[${new Date()}]: PUT players ${req.body._roomId}`);
  await Player.updateOne({ _id: req.params.id }, { $set: { name: req.body.name } });
  const player = await Player.findOne({ _id: req.params.id })
  res.json(player);
});

/**
 * DELETE players/:id
 * 플레이어 삭제
 */
router.delete('/players/:id', async (req, res) => {
  console.log(`[${new Date()}]: DELETE players/${req.params.id}`);
  await Player.deleteOne({ _id: req.params.id });
  res.json(`deleted players ${req.params.id}`);
});

module.exports = router;