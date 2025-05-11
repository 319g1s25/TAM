const express = require('express');
const router = express.Router();
const controller = require('../controllers/ta-assignment.controller');

// GET all TA-course assignments
router.get('/', controller.getAllAssignments);

// GET all TAs assigned to a specific course
router.get('/course/:courseId', controller.getTAsForCourse);

// GET all courses assigned to a specific TA
router.get('/ta/:taId', controller.getCoursesForTA);

// POST manual assignment of a TA to a course
router.post('/manual', controller.manualAssign);

// DELETE a TA from a course
router.delete('/manual/:courseId/:taId', controller.removeAssignment);

// POST automatic assignment of TAs to courses
router.post('/auto', controller.autoAssignTAs);

module.exports = router;
