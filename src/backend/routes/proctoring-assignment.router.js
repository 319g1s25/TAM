const express = require('express');
const router = express.Router();
const controller = require('../controllers/proctoring-assignment.controller');

router.get('/:examId/tas', controller.getAssignedTAs);
router.post('/:examId/assign', controller.assignProctors);
router.post('/:examId/auto', controller.autoAssignProctors);
router.get('/count/:examId', controller.getAssignedProctorCount);
router.get('/ta/:taId', controller.getTAProctorings);

module.exports = router;
