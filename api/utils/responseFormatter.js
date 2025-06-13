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