const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  _roomId : { type: Number, ref: 'Room' },
  name: String,
  coordinates: [],
  piece: { icon: [], prefix: String, iconName: String },
  cards: [],
  life: Number,
});

module.exports = mongoose.model('Player', PlayerSchema);