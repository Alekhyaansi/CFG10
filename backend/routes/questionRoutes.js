//questions under each course
const express = require('express');
const router = express.Router();
const {askQuestion ,getQuestionsForCourse, answerQuestion} = require('../controllers/questionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');



router.post('/post', protect, restrictTo('WQC'), askQuestion);
router.get('/:courseId', protect, restrictTo('WQC', 'Trainer', 'Admin'), getQuestionsForCourse);
router.post('/:questionId/answer', protect, restrictTo('Trainer'), answerQuestion);

module.exports = router;
