const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionForSaathiController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// WQC posts question
router.post('/', protect, restrictTo('WQC'), questionController.postQuestion);

// Saathi answers question
router.post('/answer/:questionId', protect, restrictTo('Saathi'), questionController.answerQuestion);

module.exports = router;
