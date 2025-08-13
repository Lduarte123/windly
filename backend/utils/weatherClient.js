// utils/weatherClient.js
const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY; // Chave no .env
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function getWeatherByCity(city, lang = "pt_br") {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric", // Celsius
        lang: lang       // Idioma das descrições
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error.message);
    throw error;
  }
}

module.exports = { getWeatherByCity };
