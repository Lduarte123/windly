import axios from "axios";

const apiAI = axios.create({
  baseURL: "http://172.29.112.1:8000",

});

export default apiAI;