const express = require('express');
const router = express.Router();
const deansOfficeController = require('../controllers/deansoffice.controller');

// Get all deans office staff
router.get('/', deansOfficeController.getAllDeansOffice);

// Get deans office staff by ID
router.get('/:id', deansOfficeController.getDeansOfficeById);

// Create new deans office staff
router.post('/', deansOfficeController.createDeansOffice);

// Update deans office staff
router.put('/:id', deansOfficeController.updateDeansOffice);

// Delete deans office staff
router.delete('/:id', deansOfficeController.deleteDeansOffice);

module.exports = router; 