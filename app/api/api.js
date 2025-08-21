import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: `http://192.168.1.2:3000/api`, //troca o ip aqui
  timeout: 10000,
  // IP DA MAQUINA: `http://10.0.30.233:3000/api`,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token"); // ou AsyncStorage.getItem("token") se for React Native
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;