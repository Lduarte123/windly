import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import api from '../../api/api';

function getWeekDayName(dateString) {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const date = new Date(dateString);
  return dias[date.getDay()];
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function WeatherCard({ city }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchForecast() {
      setLoading(true);
      setErro("");
      try {
        const response = await api.get(`/weather/forecast/${city}`);
        setForecast(response.data);
      } catch (e) {
        setErro("Erro ao buscar previsão.");
      }
      setLoading(false);
    }
    if (city) fetchForecast();
  }, [city]);

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Previsões</Text>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Previsões</Text>
        <Text style={{ color: "red" }}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Previsões</Text>
      {forecast.slice(0, 3).map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.icon}>
            {item.weatherMain === "Rain" ? "🌧️" :
             item.weatherMain === "Thunderstorm" ? "🌩️" :
             item.weatherMain === "Clouds" ? "⛅" :
             item.weatherMain === "Clear" ? "☀️" : "🌡️"}
          </Text>
          <Text style={styles.day}>
            {index === 0
              ? "Hoje"
              : index === 1
                ? "Amanhã"
                : getWeekDayName(item.date || item.dt_txt)}
          </Text>
          <Text style={styles.desc}>{capitalize(item.description)}</Text>
          <Text style={styles.temp}>
            {item.temp_max !== undefined && item.temp_min !== undefined
              ? `${Number.parseInt(item.temp_max)}° / ${Number.parseInt(item.temp_min)}°`
              : "--"}
          </Text>
        </View>
      ))}
    </View>
  );
}

