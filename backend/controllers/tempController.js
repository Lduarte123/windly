const CrossingService = require('../services/crossingService'); // ajuste o caminho
const { formatVisualCrossingHourly } = require('../utils/responseFormatter')
async function getWeather(req, res) {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'Parâmetro city é obrigatório' });
  }

  try {
    const weatherData = await CrossingService.getWeather(city);

    if (weatherData.error) {
      return res.status(404).json({ error: weatherData.error });
    }

    const formatted = formatVisualCrossingHourly(weatherData);

    return res.json(formatted);
  } catch (error) {
    console.error('Erro no controller:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  getWeather,
};
