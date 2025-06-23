const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

class PrevisaoService {
  static async getForecast(city) {
    const apiKey = process.env.OPENWEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const response = await axios.get(url);
      const list = response.data.list;

      const daily = {};
      list.forEach(item => {
        const [date, hour] = item.dt_txt.split(' ');
        if (
          !daily[date] ||
          Math.abs(parseInt(hour.split(':')[0]) - 12) < Math.abs(parseInt(daily[date].hour.split(':')[0]) - 12)
        ) {
          daily[date] = { ...item, hour };
        }
      });
      return Object.entries(daily).map(([date, item]) => ({
        date,
        ...item
      }));
    } catch (error) {
      return { error: 'Erro ao buscar previsão do tempo' };
    }
  }
}

module.exports = PrevisaoService;