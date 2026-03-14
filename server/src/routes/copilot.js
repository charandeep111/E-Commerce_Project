const express = require('express');
const router = express.Router();
const { recommendBundle } = require('../controllers/copilotController');

router.post('/recommend', recommendBundle);

module.exports = router;
