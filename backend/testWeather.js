require("dotenv").config();
const { getWeatherAlert } = require("./services/weatherService");

console.log("Iniciando teste de clima..."); // ← novo log

(async () => {
  try {
    const alert = await getWeatherAlert("São Paulo");
    if (alert) {
      console.log("Alerta gerado:", alert);
    } else {
      console.log("Nenhum alerta para hoje.");
    }
  } catch (error) {
    console.error("Erro ao testar alerta de clima:", error.message);
  }
})();
