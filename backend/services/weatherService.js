// services/weatherService.js
const { getWeatherByCity } = require("../utils/weatherClient");

async function getWeatherAlert(city) {
  const data = await getWeatherByCity(city);

  console.log("Dados brutos da API:", data); // Para verificar o retorno da OpenWeather

  const weatherMain = data.weather[0].main.toLowerCase();
  const temp = data.main.temp; // temperatura em Celsius
  const windSpeed = data.wind?.speed || 0; // velocidade do vento em m/s

  // Checar condições
  if (weatherMain.includes("rain")) {
    return {
      tipo: "chuva",
      mensagem: `Chuva prevista para hoje em ${city}.`
    };
  }

  if (weatherMain.includes("snow")) {
    return {
      tipo: "neve",
      mensagem: `Neve prevista para hoje em ${city}.`
    };
  }

  if (temp >= 35) {
    return {
      tipo: "calor",
      mensagem: `Temperatura muito alta hoje em ${city} (${temp}°C).`
    };
  }

  if (temp <= 10) {
    return {
      tipo: "frio",
      mensagem: `Temperatura muito baixa hoje em ${city} (${temp}°C).`
    };
  }

  if (windSpeed >= 15) {
    return {
      tipo: "vento",
      mensagem: `Ventos fortes hoje em ${city} (${windSpeed} m/s).`
    };
  }

  return null; // nenhuma condição crítica
}

module.exports = { getWeatherAlert };
