import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { useConfig } from "../configContext";

function getWeatherIcon(main, size = 22, color = "#fff") {
  switch (main) {
    case "Rain":
      return <MaterialCommunityIcons name="weather-rainy" size={size} color={color} />;
    case "Thunderstorm":
      return <MaterialCommunityIcons name="weather-lightning" size={size} color={color} />;
    case "Clouds":
      return <MaterialCommunityIcons name="weather-cloudy" size={size} color={color} />;
    case "Clear":
      return <MaterialCommunityIcons name="weather-sunny" size={size} color={color} />;
    default:
      return <MaterialCommunityIcons name="weather-partly-cloudy" size={size} color={color} />;
  }
}

function formatTime(unixTime) {
  const date = new Date(unixTime * 1000);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HourlySlider({ city }) {
  const { config } = useConfig();
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHourly() {
      setLoading(true);
      try {
        const res = await api.get(`/clima/climate-history?city=${city}`);
        setHourlyData(res.data.slice(0, 10)); // limita a 10 horas para visualização
      } catch (err) {
        console.log("Erro ao carregar dados horários", err);
      }
      setLoading(false);
    }
    if (city) fetchHourly();
  }, [city]);

  if (loading || hourlyData.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Clima por hora</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hourlyData.map((item, idx) => (
          <View key={idx} style={styles.hourBlock}>
            <Text style={styles.wind}>{parseFloat(item.wind_speed).toFixed(1)} km/h</Text>
            {getWeatherIcon(item.weather[0].main, 24)}
            <Text style={styles.time}>{formatTime(item.dt)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
