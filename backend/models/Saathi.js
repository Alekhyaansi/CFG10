// models/Saathi.js
const mongoose = require('mongoose');

const saathiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  expertiseAreas: [String],
  mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxMentees: { type: Number, default: 15 },
  currentMentees: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Saathi', saathiSchema);
