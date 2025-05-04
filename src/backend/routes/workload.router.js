const express = require('express');
const router = express.Router();
const workloadController = require('../controllers/workload.controller');

router.post('/', workloadController.createWorkload);
router.get('/', workloadController.getAllWorkloads);
router.get('/ta', workloadController.getWorkloadsByTA);
router.get('/instructor/:instructorId', workloadController.getInstructorWorkloads);
router.delete('/:id', workloadController.deleteWorkload);
router.put('/:id/approve', workloadController.approveWorkloadEntry); // if exists

module.exports = router;
