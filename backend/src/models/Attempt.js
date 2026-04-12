const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedOption: {
      type: Number,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
attemptSchema.index({ studentId: 1 });
attemptSchema.index({ quizId: 1 });
attemptSchema.index({ studentId: 1, quizId: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
