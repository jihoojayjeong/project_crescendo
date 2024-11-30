const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
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
    feedbackTemplate: {
        sections: [{
            title: String,
            description: String
        }]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
