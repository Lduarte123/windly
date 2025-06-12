// services/weatherService.js
import axios from 'axios';
import { apiKey, baseUrl } from '../config/openWeatherConfig.js';

class PrevisaoService {
  static async getWeather(city) {
    try {
      const response = await axios.get(baseUrl, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',  // Temperatura em Celsius
          lang: 'pt_br'     // Para retornar em português
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar o clima: ' + error.message);
    }
  }
}

export default PrevisaoService;
