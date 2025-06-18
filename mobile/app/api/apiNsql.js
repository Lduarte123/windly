import axios from "axios";

const apiNsql = axios.create({
  baseURL: "http://10.0.30.176:3005/api",
});

export default apiNsql;