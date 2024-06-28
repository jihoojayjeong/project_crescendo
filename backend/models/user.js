const mongoose = require('mongoose');

// user model or schema 
const userSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  name: { type: String }, 
  email: { type: String, required: false, unique: true },
  isFirstLogin: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now }
});

// create a user model
const User = mongoose.model('User', userSchema);

module.exports = User;
