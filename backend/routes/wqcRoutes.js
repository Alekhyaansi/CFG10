const express = require('express');
const router = express.Router();
const wqcController = require('../controllers/wqcController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.use(restrictTo('WQC'));


router.get('/all-courses',wqcController.getAllCourses);
router.get('/dashboard', protect, restrictTo('WQC'), wqcController.getMyDashboard);
router.patch('/complete/:courseId', protect, restrictTo('WQC'), wqcController.completeCourse);
router.get('/resources', protect, restrictTo('WQC'), wqcController.getUnlockedResources);


module.exports = router;