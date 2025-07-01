// controllers/weatherController.js
const PrevisaoService = require('../services/climaService');
const { formatResponse } = require('../utils/responseFormatter');

class PrevisaoController {
  static async getWeather(req, res, next) {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: 'Cidade é obrigatória' });
    }

    try {
      const weatherData = await PrevisaoService.getWeather(city);

      // Verifica se o retorno contém um erro
      if (weatherData.error) {
        return res.status(404).json({ error: weatherData.error });
      }

      const formattedData = formatResponse(weatherData);
      return res.json(formattedData);
    } catch (error) {
      next(error); // Passa o erro para o middleware de erro
    }
  }
}

module.exports = PrevisaoController;
