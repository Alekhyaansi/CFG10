// models/Wqc.js
const mongoose = require('mongoose');

const wqcSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  batchId: { type: String }, // example: 'BATCH-001'
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // links to trainer User
  preAssessmentScore: Number,
  postAssessmentScore: Number,
  sessionProgress: { type: Number, default: 0 },
  courseCodes: [String],
  unlockedResources: [String],
  journeyLog: [String],
  isTrainerCandidate: { type: Boolean, default: false },
  completedSessions: [
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedAt: { type: Date, default: Date.now }
  }
],
sessionProgress: {
  type: Number,
  default: 0
},
resourcesUnlocked: {
  type: [Number], // values like [3, 6, 9]
  default: []
},
}, { timestamps: true });

module.exports = mongoose.model('WQC', wqcSchema);
