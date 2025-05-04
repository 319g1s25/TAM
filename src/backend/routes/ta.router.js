const express = require('express');
const router = express.Router();
const taController = require('../controllers/ta.controller');

router.get('/', taController.getAllTAs);
router.get('/:id', taController.getTAById);
router.post('/', taController.createTA);
router.put('/:id', taController.updateTA);
router.delete('/:id', taController.deleteTA);

module.exports = router;
