
const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');

// Log that router is loaded
console.log('Exam router loaded successfully');

// GET all exams
router.get('/', examController.getAllExams);

// GET exam by ID
router.get('/:id', examController.getExamById);

// POST create new exam
router.post('/', examController.createExam);

// PUT update an exam
router.put('/:id', examController.updateExam);

// DELETE an exam
router.delete('/:id', examController.deleteExam);

// GET eligible proctors for an exam
router.get('/:examId/eligible-proctors', examController.getEligibleProctors);

// POST manually assign proctors to an exam
router.post('/:examId/assign-proctors', examController.assignProctors);

// POST automatically assign proctors to an existing exam
router.post('/:examId/auto-assign', examController.autoAssignProctorsToExam);

module.exports = router;
