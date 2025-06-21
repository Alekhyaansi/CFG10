// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // WQC
  batchId: String, // Tie to WQC batch
  questionText: String,
  answers: [
    {
      answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Trainer
      answerText: String,
      at: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
