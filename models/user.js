const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  initial: {
    type: String,
    required: true,
  },
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;