const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructor.controller');

// Get all instructors
router.get('/', instructorController.getAllInstructors);

// Get instructor by ID
router.get('/:id', instructorController.getInstructorById);

// Create new instructor
router.post('/', instructorController.createInstructor);

// Update instructor
router.put('/:id', instructorController.updateInstructor);

// Delete instructor
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router; 