const express = require('express');
const router = express.Router();
const wqcController = require('../controllers/wqcController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.use(restrictTo('WQC'));

router.get('/AllCourses',wqcController.getAllCourses);

module.exports = router;