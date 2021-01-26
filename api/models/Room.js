const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = mongoose.Schema({
  _id: Number,
  title: String,
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  playerLimit: Number,
  map: [[]],
  currentPlayer: { type: Schema.Types.ObjectId, ref: 'Player' },
  status: String,
  cardDeck: { unused: [], used: [] },
  mode: String,
  deleted: Boolean,
});

module.exports = mongoose.model('Room', RoomSchema);