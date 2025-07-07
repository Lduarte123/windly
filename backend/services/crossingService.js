const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.CROSSING_API_KEY;

class CrossingService {
  // Requisição base (últimos 30 dias até hoje)
  static async fetchWeatherData(city, daysBack = 14) {
    try {
      const cityQuery = city.trim();
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];

      const startDate = new Date();
      startDate.setDate(today.getDate() - daysBack);
      const startStr = startDate.toISOString().split('T')[0];

      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(cityQuery)}/${startStr}/${endDate}?unitGroup=metric&key=${apiKey}&contentType=json`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o clima:', error.response ? error.response.data : error.message);

      if (error.response?.status === 404) {
        return { error: 'Cidade não encontrada' };
      }

      return { error: 'Erro ao buscar o clima: ' + error.message };
    }
  }

  // 1. Histórico climático (últimos 7 dias)
  static async getDailyClimateHistory(city) {
    const data = await this.fetchWeatherData(city, 7);
    if (data.error) return data;

    return data.days.map(day => ({
      date: day.datetime,
      tempMin: day.tempmin,
      tempMax: day.tempmax,
      conditions: day.conditions
    }));
  }

  // 2. Clima hora a hora de hoje
  static async getTodayHourlyWeather(city) {
    const data = await this.fetchWeatherData(city, 1);
    if (data.error) return data;

    const todayStr = new Date().toISOString().split('T')[0];
    const today = data.days.find(d => d.datetime === todayStr);
    if (!today) return { error: 'Dados de hoje não encontrados' };

    return today.hours.map(hour => ({
      datetime: `${today.datetime} ${hour.datetime.slice(0, 5)}`,
      temp: hour.temp,
      conditions: hour.conditions
    }));
  }

  // 3. Quantidade de chuva por mês (últimos 30 dias)
  static async getMonthlyPrecipitation(city) {
    const data = await this.fetchWeatherData(city, 30);
    if (data.error) return data;

    const monthly = {};

    data.days.forEach(day => {
      const [year, month] = day.datetime.split('-');
      const key = `${year}-${month}`;
      monthly[key] = (monthly[key] || 0) + (day.precip || 0);
    });

    return Object.entries(monthly).map(([month, precip]) => ({
      month,
      precip: parseFloat(precip.toFixed(2))
    }));
  }

  // 4. Probabilidade de chuva hoje
  static async getTodayPrecipProbability(city) {
    const data = await this.fetchWeatherData(city, 1);
    if (data.error) return data;

    const todayStr = new Date().toISOString().split('T')[0];
    const today = data.days.find(d => d.datetime === todayStr);
    if (!today) return { error: 'Dados de hoje não encontrados' };

    return {
      date: today.datetime,
      precipProbability: today.precipprob
    };
  }
}

module.exports = CrossingService;
