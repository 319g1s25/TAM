// routes/leaveRequest.router.js
const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leave-request.controller');

router.put('/:id/status', leaveRequestController.updateLeaveRequestStatus);
router.post('/', leaveRequestController.createLeaveRequest);
router.get('/', leaveRequestController.getAllLeaveRequests);

module.exports = router;
