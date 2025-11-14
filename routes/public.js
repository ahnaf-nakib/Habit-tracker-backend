const express = require('express');
const router = express.Router();
const HabitController = require('../controllers/habitController');
;

// GET /api/public-habits - Fetch all habits where isPublic is true (Unprotected)
router.get('/public-habits', HabitController.getPublicHabits);

module.exports = router;