const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({
  _roomId : { type: Number, ref: 'Room' },
  _playerId : { type: Schema.Types.ObjectId, ref: 'Player' },
  playerName: String,
  content: String,
  sendedAt: Date,
});

module.exports = mongoose.model('Message', MessageSchema);