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
  }],
  groups: [{
    groupNumber: Number,
    name: String,
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  assignments: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  feedbacks: [{
    fromGroup: String,
    toGroup: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
