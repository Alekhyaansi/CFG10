const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // WQC
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Saathi (optional)
  answerText: { type: String },
  isAnswered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('QuestionForSaathi', questionSchema);
