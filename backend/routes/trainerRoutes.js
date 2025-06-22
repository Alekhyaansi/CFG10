const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const trainerController = require('../controllers/trainerController');

router.use(protect);
router.use(restrictTo('Trainer'));


router.get('/dashboard', trainerController.getTrainerDashboard);
module.exports = router;
