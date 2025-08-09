import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dotenv from 'dotenv'

dotenv.config()
const API_URL = process.dotenv.API_URL

const api = axios.create({
  baseURL: `${API_URL}/api`,
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