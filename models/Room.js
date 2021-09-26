const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Room', roomSchema);
