// controllers/weatherController.js
import PrevisaoService from '../services/previsaoService.js';
import { formatResponse } from '../utils/responseFormatter.js';

class PrevisaoController {
  static async getWeather(req, res, next) {
    const { city } = req.params;

    try {
      const weatherData = await PrevisaoService.getWeather(city);
      const formattedData = formatResponse(weatherData);
      return res.json(formattedData);
    } catch (error) {
      next(error); // Passa o erro para o middleware de erro
    }
  }
}

export default PrevisaoController;
