function formatWind(speedMs, windUnit) {
  if (windUnit === "km/h") return `${(speedMs * 3.6).toFixed(1)} km/h`;
  if (windUnit === "mph") return `${(speedMs * 2.23694).toFixed(1)} mph`;
  return `${speedMs.toFixed(1)} m/s`;
}

export default formatWind;