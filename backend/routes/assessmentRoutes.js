const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const assessmentCtrl = require('../controllers/assessmentController');

router.post('/post', protect, restrictTo('Trainer'), assessmentCtrl.createPostAssessment);
router.post('/:assessmentId/submit', protect, restrictTo('WQC'), assessmentCtrl.submitAssessment);
router.post('/:assessmentId/review/:wqcId', protect, restrictTo('Trainer'), assessmentCtrl.reviewSubmission);
router.get('/trainer/assessments', protect, restrictTo('Trainer'), assessmentCtrl.getAssessmentsForTrainer);
module.exports = router;
