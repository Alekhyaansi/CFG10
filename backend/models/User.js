// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  location: {
    type: String,// [longitude, latitude]
      required: true,
      trim:true,
  },    
  password: { type: String, required: true }, // hashed
  role: {
    type: String,
    enum: ['WQC', 'Saathi', 'Trainer', 'Admin'],
    default: 'WQC',
  },
  roleHistory: [
    {
      role: { type: String },
      at: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
