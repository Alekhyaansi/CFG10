// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const WQC = require('../models/Wqc');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, location, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    // 1. Create user (default role: WQC if not passed)
    const user = await User.create({
      name,
      email,
      phone,
      location,
      password: hashed,
      role: role || 'WQC',
      roleHistory: [{ role: role || 'WQC' }]
    });

    // 2. If trainer, create trainer schema
    if (role === 'Trainer') {
      await Trainer.create({
        userId: user._id,
        certified: true, 
        trainerCourseCompleted: true,
        batchesHandled: [],
        currentBatchSize: 0,
        maxPerBatch: 25
      });
    }

    // 3. If WQC, assign trainer (auto batching)
    if (!role || role === 'WQC') {
      const trainers = await Trainer.find({ certified: true }).sort('currentBatchSize');

      if (!trainers.length) {
        return res.status(400).json({ message: 'No available trainers found. Please try later.' });
      }

      let assignedTrainer = trainers.find(t => t.currentBatchSize < t.maxPerBatch);

      if (!assignedTrainer) {
        // rotate back to first trainer if all full
        assignedTrainer = trainers[0];
        assignedTrainer.currentBatchSize = 0; // reset counter if you want rotation
      }

      const batchId = `BATCH-${(assignedTrainer.batchesHandled.length + 1).toString().padStart(3, '3')}`;

      // Update trainer
      assignedTrainer.batchesHandled.push(batchId);
      assignedTrainer.currentBatchSize += 1;
      await assignedTrainer.save();

      // Create WQC
      await WQC.create({
        userId: user._id,
        trainerId: assignedTrainer.userId,
        batchId,
        preAssessmentScore: null,
        postAssessmentScore: null,
        sessionProgress: 0,
        courseCodes: [],
        unlockedResources: [],
        journeyLog: [],
        isTrainerCandidate: false
      });
    }

    const token = generateToken(user);
    res.status(201).json({ user: { id: user._id, name: user.name, role: user.role }, token });

  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('❌ User not found');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Password mismatch');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log(token);
      res.status(200).json({ user, token });
  
    } catch (err) {
      console.error('💥 Login error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  };
