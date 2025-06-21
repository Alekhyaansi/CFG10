// models/Trainer.js
const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  certified: { type: Boolean, default: false },
  trainerCourseCompleted: { type: Boolean, default: false },
  // models/Trainer.js
batchesHandled: [String], // like ['BATCH-001']
currentBatchSize: { type: Number, default: 0 },
maxPerBatch: { type: Number, default: 25 },

  assessmentsToReview: [
    {
      wqcId: { type: mongoose.Schema.Types.ObjectId, ref: 'WQC' },
      status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
