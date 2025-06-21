// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  sessionNumber: { type: Number, required: true }, // 1 to 9
  title: { type: String, required: true },
  description: String,
  videoUrl: String, // Can be YouTube, Vimeo or S3
  resources: [String], // Extra PDFs, docs, etc.
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin ID
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
