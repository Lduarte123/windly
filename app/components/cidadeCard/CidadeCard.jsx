import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useConfig } from "../configContext";
import { convertTemp } from "../../utils/convertTemp";

import styles from "./styles";

const OPENWEATHER_API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY;



// Função para calcular a hora local correta
function getLocalTime(weatherData) {
  try {
    if (!weatherData || !weatherData.timezone) {
      return "Hora não disponível";
    }

    // O timestamp da API está em UTC
    const utcTimestamp = weatherData.dt;
    
    // O timezone offset está em segundos
    const timezoneOffset = weatherData.timezone;
    
    // Calcular a hora local: UTC + offset
    const localTimestamp = utcTimestamp + timezoneOffset;
    
    // Converter para Date e formatar
    const localDate = new Date(localTimestamp * 1000);
    
    // Formatar a hora no formato HH:mm
    const hours = localDate.getUTCHours().toString().padStart(2, '0');
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Erro ao calcular hora local:", error);
    return "Hora não disponível";
  }
}

// Função para obter o período do dia baseado na hora local
function getDayPeriod(weatherData) {
  try {
    if (!weatherData || !weatherData.timezone) {
      return "noite"; // fallback
    }

    // Usar o mesmo cálculo da hora local
    const utcTimestamp = weatherData.dt;
    const timezoneOffset = weatherData.timezone;
    const localTimestamp = utcTimestamp + timezoneOffset;
    const localDate = new Date(localTimestamp * 1000);
    
    const hour = localDate.getUTCHours();
    
    if (hour >= 6 && hour < 12) return "manha";
    if (hour >= 12 && hour < 18) return "tarde";
    return "noite";
  } catch (error) {
    console.error("Erro ao calcular período do dia:", error);
    return "noite"; // fallback
  }
}

export default function CidadeWeatherCard({
  cidade,
  onPress,
  onRemover,
  onEditar,
  disabled,
}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const { config } = useConfig();

  // Função que retorna a imagem correta baseado no clima e horário
  function getBackgroundImage(main, weatherData) {
    const period = getDayPeriod(weatherData);

    const clima = main.toLowerCase();

    if (clima === "clear") {
      if (period === "manha") return require("../../assets/status/ceu_limpo.jpg");
      if (period === "tarde") return require("../../assets/status/ceu_limpo_tarde.jpg");
      return require("../../assets/status/ceu_limpo_noite.jpg");
    }
    if (clima === "clouds") {
      if (period === "noite") return require("../../assets/status/nublado_noite.jpg");
      return require("../../assets/status/nublado.jpg");
    }
    if (clima === "rain") {
      if (period === "noite") return require("../../assets/status/chuva_noite.jpg");
      return require("../../assets/status/chuvendo.jpg");
    }
    if (clima === "snow") {
      return require("../../assets/status/nevando.jpg");
    }
    if (clima === "thunderstorm") {
      return require("../../assets/status/tempestade.jpg");
    }

    // Caso não caia em nenhum caso, use céu limpo padrão para o período
    if (period === "manha") return require("../../assets/status/ceu_limpo.jpg");
    if (period === "tarde") return require("../../assets/status/ceu_limpo_tarde.jpg");
    return require("../../assets/status/ceu_limpo_noite.jpg");
  }

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            cidade
          )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
        );
        const data = await res.json();
        if (data.cod === 200) {
          setWeather(data);
          setErro(null);
        } else {
          setErro("Erro ao carregar clima.");
        }
      } catch {
        setErro("Erro de conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cidade, config.temp_unit]);

  if (loading) {
    return (
      null
    );
  }

  if (erro) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cidade}</Text>
        <Text style={styles.cardError}>{erro || "Erro ao carregar clima."}</Text>
      </View>
    );
  }

  // Obter a hora local correta usando a nova função
  const horarioLocal = getLocalTime(weather);
  
  // Obter o período do dia para a imagem de fundo
  const periodoDia = getDayPeriod(weather);

  // Escolhe a imagem de fundo baseado no clima e horário
  const bgImage = getBackgroundImage(
    weather.weather[0].main,
    weather
  );

  const temperatura = convertTemp(weather.main.temp, config.temp_unit);
  const descricao = weather.weather[0].description;
  
  // Informações de timezone para debug
  const timezoneOffset = weather.timezone ? `UTC${weather.timezone >= 0 ? '+' : ''}${Math.round(weather.timezone / 3600)}` : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ marginHorizontal: 24, marginBottom: 12, borderRadius: 12, overflow: "hidden" }}
    >
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        style={styles.card}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>{cidade}</Text>
            <Text style={styles.cardDesc}>{descricao}</Text>
            <Text style={styles.cardTime}>
              Hora local: {horarioLocal}
            </Text>
            <Text style={styles.cardTime}>
              {timezoneOffset} • {periodoDia}
            </Text>
          </View>
          <View style={styles.cardWeather}>
            <Text style={styles.cardTemp}>{temperatura}°{config.temp_unit === 'C' ? 'C' : 'F'}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity onPress={onEditar}>
            <Ionicons
              name="pencil"
              size={20}
              color="#2D6BFD"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemover}>
            <Ionicons name="trash-outline" size={20} color="#F66" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
