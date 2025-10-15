import axios from "axios";

const apiAI = axios.create({
  baseURL: "http://10.0.30.217:8000", // Mantendo o IP de acordo com a configuração atual
});

export default apiAI;
