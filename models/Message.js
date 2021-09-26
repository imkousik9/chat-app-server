const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    message: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
