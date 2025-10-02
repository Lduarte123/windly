import axios from "axios";

const apiAI = axios.create({
  baseURL: "http://192.168.1.9:8000",

});

export default apiAI;