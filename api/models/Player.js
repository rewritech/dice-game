const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  _roomId : { type: Number, ref: 'Room' },
  name: String,
}, { capped : true, size:4000,  max : 1000 });

module.exports = mongoose.model('Player', PlayerSchema);