const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = mongoose.Schema({
  _id: Number,
  title: String,
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  playerLimit: Number,
  map: [[]],
});

module.exports = mongoose.model('Room', RoomSchema);