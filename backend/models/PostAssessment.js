// models/PostAssessment.js
const mongoose = require('mongoose');

const postAssessmentSchema = new mongoose.Schema({
  batchId: String,
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [
    {
      questionText: String,
      type: { type: String, enum: ['MCQ', 'Descriptive'], default: 'Descriptive' },
      options: [String], // for MCQ
      correctAnswer: String // optional
    }
  ],
  submissions: [
    {
      wqcId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answers: [String],
      marksGiven: Number,
      reviewed: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('PostAssessment', postAssessmentSchema);
