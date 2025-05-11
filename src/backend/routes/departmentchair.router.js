const express = require('express');
const router = express.Router();
const departmentChairController = require('../controllers/departmentchair.controller');

// Get all department chairs
router.get('/', departmentChairController.getAllDepartmentChairs);

// Get department chair by ID
router.get('/:id', departmentChairController.getDepartmentChairById);

// Create new department chair
router.post('/', departmentChairController.createDepartmentChair);

// Update department chair
router.put('/:id', departmentChairController.updateDepartmentChair);

// Delete department chair
router.delete('/:id', departmentChairController.deleteDepartmentChair);

module.exports = router; 