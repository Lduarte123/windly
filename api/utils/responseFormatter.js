export function formatResponse(weatherData) {
  return {
    city: weatherData.name,
    temperature: weatherData.main.temp,
    weatherMain: weatherData.weather[0].main,
    description: weatherData.weather[0].description,
    windSpeed: weatherData.wind.speed,
    humidity: weatherData.main.humidity,
  };
}

export function formatForecastResponse(forecastData) {
  return forecastData.map(item => ({
    date: item.date,
    temperature: item.main.temp,
    weatherMain: item.weather[0].main,
    description: item.weather[0].description,
    windSpeed: item.wind.speed,
    humidity: item.main.humidity,
  }));
}