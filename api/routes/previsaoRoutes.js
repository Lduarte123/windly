const express = require('express');
const PrevisaoController = require('../controllers/previsaoController');

const router = express.Router();

router.get('/forecast/:city', PrevisaoController.getForecast);

module.exports = router;