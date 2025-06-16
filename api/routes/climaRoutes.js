// routes/weatherRoutes.js
const { Router } = require('express');
const PrevisaoController = require('../controllers/climaController');

const router = Router();

router.get('/:city', PrevisaoController.getWeather);

module.exports = router;
