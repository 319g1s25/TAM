const express = require('express');
const router = express.Router();
const controller = require('../controllers/ta-assignment.controller');

router.post('/auto', controller.autoAssignTAs);

module.exports = router;
