const express = require('express');
const router = express.Router();
const saathiController = require('../controllers/saathiController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// WQC chooses a Saathi
router.post('/choose/:saathiId', protect, restrictTo('WQC'), saathiController.chooseSaathi);

module.exports = router;
