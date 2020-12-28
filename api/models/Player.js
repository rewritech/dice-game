const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  _roomId : { type: Number, ref: 'Room' },
  name: String,
});

module.exports = mongoose.model('Player', PlayerSchema);