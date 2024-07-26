const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  term: {
    type: String,
    required: true
  },
  crn: {
    type: String,
    required: true
  },
  uniqueCode: {
    type: String,
    required: true,
    unique: true
  },
  students : [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
