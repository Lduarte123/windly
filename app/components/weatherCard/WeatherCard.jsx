import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import api from '../../api/api';
import { useConfig } from "../configContext";
import { convertTemp } from "../../utils/convertTemp";

function getWeekDayName(dateString) {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const date = new Date(dateString);
  return dias[date.getDay()];
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getWeatherIcon(main, size = 22, color = "#fff") {
  if (main === "Rain") return <MaterialCommunityIcons name="weather-rainy" size={size} color={color} />;
  if (main === "Thunderstorm") return <MaterialCommunityIcons name="weather-lightning" size={size} color={color} />;
  if (main === "Clouds") return <MaterialCommunityIcons name="weather-cloudy" size={size} color={color} />;
  if (main === "Clear") return <MaterialCommunityIcons name="weather-sunny" size={size} color={color} />;
  return <MaterialCommunityIcons name="weather-partly-cloudy" size={size} color={color} />;
}

function TempBar({ min, max, temp }) {
  let percent = 0.5;
  if (max !== min) {
    percent = (temp - min) / (max - min);
    percent = Math.max(0, Math.min(percent, 1));
  }
  const [barWidth, setBarWidth] = React.useState(0);

  return (
    <View style={styles.tempBarContainer}>
      <Text style={styles.tempBarText}>{parseInt(min)}°</Text>
      <View
        style={styles.tempBar}
        onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
      >
        <LinearGradient
          colors={['#4fc3f7', '#ffd54f', '#e57373']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tempBarGradient}
        />
        {barWidth > 0 && (
          <View
            style={[
              styles.tempBarMarker,
              { left: barWidth * percent - 6 }
            ]}
          />
        )}
      </View>
      <Text style={styles.tempBarText}>{parseInt(max)}°</Text>
    </View>
  );
}

export default function WeatherCard({ city }) {
  const { config } = useConfig();
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
        <View style={{ height: 8 }} />
        {[0, 1, 2].map((_, idx) => (
          <View key={idx} style={[styles.row, { opacity: 0.5 }]}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#ffffff33", marginRight: 8 }} />
            <View style={{ width: 60, height: 16, borderRadius: 8, backgroundColor: "#ffffff33", marginRight: 8 }} />
            <View style={{ flex: 1, height: 16, borderRadius: 8, backgroundColor: "#ffffff33", marginRight: 8 }} />
            <View style={{ width: 60, height: 16, borderRadius: 8, backgroundColor: "#ffffff33" }} />
          </View>
        ))}
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
          <View style={styles.iconDay}>
            {getWeatherIcon(item.weatherMain, 22)}
            <View style={{ width: 8 }} />
            <Text style={styles.day}>
              {index === 0
                ? "Hoje"
                : index === 1
                  ? "Amanhã"
                  : getWeekDayName(item.date || item.dt_txt)}
            </Text>
          </View>
          <Text style={styles.desc}>{capitalize(item.description)}</Text>
          <TempBar
            min={convertTemp(item.temp_min, config.temp_unit)}
            max={convertTemp(item.temp_max, config.temp_unit)}
            temp={convertTemp(item.temp, config.temp_unit)}
          />
        </View>
      ))}
    </View>
  );
}

