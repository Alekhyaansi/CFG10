const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionForSaathiController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// WQC posts question
router.post('/', protect, restrictTo('WQC'), questionController.postQuestion);

// Saathi answers question
router.post('/answer/:questionId', protect, restrictTo('Saathi'), questionController.answerQuestion);

// Get all questions asked by the logged-in WQC
router.get('/my', protect, restrictTo('WQC'), questionController.getMyQuestions);

// Get all questions from mentees for Saathi
router.get('/mentees', protect, restrictTo('Saathi'), questionController.getMenteeQuestions);


module.exports = router;
