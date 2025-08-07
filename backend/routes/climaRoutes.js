const { Router } = require('express');
const ClimaController = require('../controllers/climaController');

const router = Router();

router.get('/:city', ClimaController.getWeather);

module.exports = router;
