// routes/weatherRoutes.js
const { Router } = require('express');
const PrevisaoController = require('../controllers/previsaoController');

const router = Router();

router.get('/:city', PrevisaoController.getWeather);

module.exports = router;
