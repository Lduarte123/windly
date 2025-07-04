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
    const data = await CrossingService.getDailyClimateHistory(city);
    if (data.error) return res.status(404).json({ error: data.error });

    const formatted = formatDailyClimateHistory({ days: data });
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
    const data = await CrossingService.getTodayHourlyWeather(city);
    if (data.error) return res.status(404).json({ error: data.error });

    // Para reusar formatHourlyWeather, encapsulamos em days:
    const formatted = formatHourlyWeather({ days: [data] });
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
    const data = await CrossingService.getMonthlyPrecipitation(city);
    if (data.error) return res.status(404).json({ error: data.error });

    const formatted = formatMonthlyPrecipitation({ days: data });
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
    const data = await CrossingService.getTodayPrecipProbability(city);
    if (data.error) return res.status(404).json({ error: data.error });

    const todayStr = new Date().toISOString().split('T')[0];
    const formatted = formatDailyPrecipitationProbability({ days: [data] });

    // Buscar apenas o dia atual no array retornado
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
