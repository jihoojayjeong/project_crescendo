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
  uniqueId: { 
    type:String, 
    unique: true, 
    required : true}
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
