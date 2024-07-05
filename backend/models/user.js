const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  role: { type: String},
  name: { type: String }, 
  email: { type: String, required: false, unique: true },
  isFirstLogin: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
