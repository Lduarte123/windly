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
import styles from "./styles";

const OPENWEATHER_API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY;

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

  function getDayPeriod(hour) {
    if (hour >= 6 && hour < 12) return "manha"; // manhã
    if (hour >= 12 && hour < 18) return "tarde"; // tarde
    return "noite"; // noite
  }

  // Função que retorna a imagem correta baseado no clima e horário
  function getBackgroundImage(main, hour, description) {
    const period = getDayPeriod(hour);

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
  }, [cidade]);

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

  const timestampLocal = (weather.dt + weather.timezone) * 1000;
  const localDate = new Date(timestampLocal);
  const hora = localDate.getUTCHours(); // hora local da cidade

  // Escolhe a imagem de fundo baseado no clima e horário
  const bgImage = getBackgroundImage(
    weather.weather[0].main,
    hora,
    weather.weather[0].description
  );

  const temperatura = Math.round(weather.main.temp);
  const descricao = weather.weather[0].description;
  
  const horarioLocal = localDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
            <Text style={styles.cardTime}>Hora local: {horarioLocal}</Text>
          </View>
          <View style={styles.cardWeather}>
            <Text style={styles.cardTemp}>{temperatura}°C</Text>
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
