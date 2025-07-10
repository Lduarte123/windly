const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class PrevisaoService {
  static async getForecast(city) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const response = await axios.get(url);
      const list = response.data.list;

      // Objeto para acumular dados por dia
      const dailyData = {};

      list.forEach(item => {
        const [date] = item.dt_txt.split(' ');

        if (!dailyData[date]) {
          dailyData[date] = {
            tempSum: 0,
            tempCount: 0,
            tempMinSum: 0,
            tempMaxSum: 0,
            weatherCount: {},
          };
        }

        dailyData[date].tempSum += item.main.temp;
        dailyData[date].tempMinSum += item.main.temp_min;
        dailyData[date].tempMaxSum += item.main.temp_max;
        dailyData[date].tempCount += 1;

        // Contar os status do clima para pegar o mais frequente
        const weatherMain = item.weather[0].main;
        dailyData[date].weatherCount[weatherMain] = (dailyData[date].weatherCount[weatherMain] || 0) + 1;
      });

      // Montar array final com médias e clima mais frequente
      const daily = Object.entries(dailyData).map(([date, data]) => {
        // Achar clima mais frequente do dia
        const mostFrequentWeather = Object.entries(data.weatherCount).reduce((a, b) =>
          b[1] > a[1] ? b : a
        )[0];

        return {
          date,
          temp_avg: data.tempSum / data.tempCount,
          temp_min_avg: data.tempMinSum / data.tempCount,
          temp_max_avg: data.tempMaxSum / data.tempCount,
          weather: mostFrequentWeather,
        };
      });

      return daily;
    } catch (error) {
      return { error: 'Erro ao buscar previsão do tempo' };
    }
  }
}

module.exports = PrevisaoService;
