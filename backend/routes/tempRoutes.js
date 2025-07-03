const express = require('express');
const router = express.Router();
const tempController = require('../controllers/tempController'); // ajuste o caminho

router.get('/temp', tempController.getWeather);

module.exports = router;
