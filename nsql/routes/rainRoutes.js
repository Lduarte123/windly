const express = require('express');
const router = express.Router();
const rainController = require('../controllers/rainController');

router.post('/rain', rainController.createRain);
router.get('/rain', rainController.getRains);
router.put('/rain/:id', rainController.updateRain);
router.delete('/rain/:id', rainController.deleteRain);
router.get('/rain/last7days', rainController.getLast7Days);
router.post('/rain/reset', rainController.resetDiasSemChuva);

module.exports = router;
