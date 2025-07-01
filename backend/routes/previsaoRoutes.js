const express = require('express');
const PrevisaoController = require('../api/controllers/previsaoController');

const router = express.Router();

router.get('/forecast/:city', PrevisaoController.getForecast);

module.exports = router;