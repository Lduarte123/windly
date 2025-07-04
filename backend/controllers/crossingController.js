const CrossingService = require('../services/crossingService');
const {
  formatDailyClimateHistory,
  formatHourlyWeather,
  formatMonthlyPrecipitation,
  formatDailyPrecipitationProbability
} = require('../utils/responseFormatter');

async function getDailyClimateHistory(req, res) {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'Parâmetro city é obrigatório' });

  try {
    const rawData = await CrossingService.fetchWeatherData(city, 7);
    if (rawData.error) return res.status(404).json({ error: rawData.error });

    const formatted = formatDailyClimateHistory(rawData);
    return res.json(formatted);
  } catch (error) {
    console.error('Erro no histórico climático:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function getTodayHourlyWeather(req, res) {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'Parâmetro city é obrigatório' });

  try {
    const rawData = await CrossingService.fetchWeatherData(city, 1);
    if (rawData.error) return res.status(404).json({ error: rawData.error });

    const formatted = formatHourlyWeather(rawData);
    return res.json(formatted);
  } catch (error) {
    console.error('Erro no clima por hora:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function getMonthlyPrecipitation(req, res) {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'Parâmetro city é obrigatório' });

  try {
    const rawData = await CrossingService.fetchWeatherData(city, 30);
    if (rawData.error) return res.status(404).json({ error: rawData.error });

    const formatted = formatMonthlyPrecipitation(rawData);
    return res.json(formatted);
  } catch (error) {
    console.error('Erro na precipitação mensal:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function getTodayPrecipProbability(req, res) {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'Parâmetro city é obrigatório' });

  try {
    const rawData = await CrossingService.fetchWeatherData(city, 1);
    if (rawData.error) return res.status(404).json({ error: rawData.error });

    const formatted = formatDailyPrecipitationProbability(rawData);
    const todayStr = new Date().toISOString().split('T')[0];

    const today = formatted.find(day => day.date === todayStr) || {
      date: todayStr,
      precipProbability: null
    };

    return res.json(today);
  } catch (error) {
    console.error('Erro na probabilidade de chuva:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  getDailyClimateHistory,
  getTodayHourlyWeather,
  getMonthlyPrecipitation,
  getTodayPrecipProbability
};
