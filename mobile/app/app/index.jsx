import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Animated, Easing } from "react-native";
import MainSection from "../components/mainSection/MainSection";
import MainStats from "../components/mainStats/MainStats";
import WeatherCard from "../components/weatherCard/WeatherCard";
import StatsCard from "../components/statsCard/StatsCard";
import { Thermometer, Droplets, Gauge, Wind, Eye, Cloud } from 'lucide-react-native';
import { useTheme } from "../components/ThemeContext";
import getStyles from "../components/styles";
import api from "../api/api";
import { getUserCity } from "../api/getUserCity";
import { Video } from 'expo-av';
import ErrorModal from "../components/errorModal/ErrorModal";

export default function App() {
  const { dark } = useTheme();
  const styles = getStyles(dark);

  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Carregando...");
  const [desc, setDesc] = useState("");
  const [temp, setTemp] = useState("--");
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const userCity = await getUserCity();
        setCity(userCity);

        const response = await api.get(`/clima_atual/${userCity}`);
        const data = response.data;

        // Checagem para o novo formato
        if (!data || !data.temperature || !data.weatherMain) {
          throw new Error("Dados de clima não encontrados para esta cidade.");
        }

        setWeatherData(data);
        setDesc(data.description || "");
        setTemp(Math.round(data.temperature));
      } catch (error) {
        setErrorMsg(error.message || "Erro desconhecido");
        setShowErrorModal(true); // Mostra o modal
        setCity("Erro ao obter cidade");
        setDesc("Erro ao obter clima");
        setTemp("--");
      }
    }
    fetchWeather();
  }, []);


  if (!weatherData && !errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Video
          source={require("../assets/wind.mp4")}
          style={styles.loadingGif}
          resizeMode="cover"
          isLooping
          shouldPlay
          isMuted
        />
        <Text style={styles.loadingText}>
          Carregando clima...
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <ErrorModal
          visible={true}
          message={errorMsg}
          dark={dark}
        />
      </View>
    );
  }

  const whiteSectionStyle = [
    styles.whiteSection,
    dark && { backgroundColor: "#23272a" }
  ];

  return (
    <>
      <ErrorModal
        visible={showErrorModal}
        message={errorMsg}
        onClose={() => setShowErrorModal(false)}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MainSection>
          <MainStats city={city} desc={desc} temp={temp}/>
        </MainSection>
        <ScrollView style={whiteSectionStyle}>
          <WeatherCard city={city} />

          <View style={styles.statsContainer}>
            <StatsCard
              titulo="Sensação"
              desc="Sensação térmica"
              stats={
                weatherData.feelsLike !== undefined && weatherData.feelsLike !== null
                  ? `${weatherData.feelsLike}°`
                  : "--"
              }
              icon={<Thermometer color="#fff" size={26} />}
            />
            <StatsCard
              titulo="Umidade"
              desc="Umidade relativa"
              stats={
                weatherData.humidity !== undefined && weatherData.humidity !== null
                  ? `${weatherData.humidity}%`
                  : "--"
              }
              icon={<Droplets color="#fff" size={26} />}
            />
            <StatsCard
              titulo="Pressão"
              desc="Pressão atmosférica"
              stats={
                weatherData.pressure !== undefined && weatherData.pressure !== null
                  ? `${weatherData.pressure} hPa`
                  : "--"
              }
              icon={<Gauge color="#fff" size={26} />}
            />
            <StatsCard
              titulo="Vento"
              desc="Velocidade do vento"
              stats={
                weatherData.windSpeed !== undefined && weatherData.windSpeed !== null
                  ? `${weatherData.windSpeed} m/s`
                  : "--"
              }
              icon={<Wind color="#fff" size={26} />}
            />
            <StatsCard
              titulo="Visibilidade"
              desc="Visibilidade"
              stats={
                weatherData.visibility !== undefined && weatherData.visibility !== null
                  ? `${(weatherData.visibility / 1000).toFixed(1)} km`
                  : "--"
              }
              icon={<Eye color="#fff" size={26} />}
            />
            <StatsCard
              titulo="Nuvens"
              desc="Cobertura de nuvens"
              stats={
                weatherData.cloudiness !== undefined && weatherData.cloudiness !== null
                  ? `${weatherData.cloudiness}%`
                  : "--"
              }
              icon={<Cloud color="#fff" size={26} />}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </>
  );
}