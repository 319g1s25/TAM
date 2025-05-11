const express = require('express');
const router = express.Router();
const taController = require('../controllers/ta.controller');

router.get('/', (req, res) => {
  const { role, userId } = req.query;
  if (role && userId) {
    return taController.getAllTAsByRole(req, res);
  } else {
    return taController.getAllTAs(req, res);
  }
});

router.get('/:id', taController.getTAById);
router.post('/', taController.createTA);
router.put('/:id', taController.updateTA);
router.delete('/:id', taController.deleteTA);

module.exports = router;
