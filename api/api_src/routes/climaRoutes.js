const { Router } = require('express');
const PrevisaoController = require('../api_src/controllers/climaController');

const router = Router();

router.get('/:city', PrevisaoController.getWeather);

module.exports = router;
