const express = require('express');
const router = express.Router();
const { getCourseById } = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');


router.use(protect);
router.use(restrictTo('WQC'));

router.get('/:id', getCourseById);

module.exports = router;
