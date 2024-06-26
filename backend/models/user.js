const mongoose = require('mongoose');

// user model or schema 
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  studentPid: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// create a user model
const User = mongoose.model('User', userSchema);

module.exports = User;
