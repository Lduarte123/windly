const express = require('express');
const router = express.Router();
const crossingController = require('../controllers/crossingController');

router.get('/climate-history', crossingController.getDailyClimateHistory);
router.get('/hourly-weather', crossingController.getTodayHourlyWeather);
router.get('/monthly-precipitation', crossingController.getMonthlyPrecipitation);
router.get('/precipitation-probability', crossingController.getTodayPrecipProbability);

module.exports = router;
