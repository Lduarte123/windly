import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import MainSection from "../components/mainSection/MainSection";
import MainStats from "../components/mainStats/MainStats";
import WeatherCard from "../components/weatherCard/WeatherCard";
import StatsCard from "../components/statsCard/StatsCard";
import {
  Thermometer,
  Wind,
  Cloud,
} from "lucide-react-native";
import { useTheme } from "../components/ThemeContext";
import getStyles from "../components/styles";
import api from "../api/api";
import { getUserCity } from "../api/getUserCity";
import DiasSemChuvaCheckbox from "../components/diasSemChuva/DiasSemChuvaCheckbox";
import { Video } from "expo-av";
import ErrorModal from "../components/errorModal/ErrorModal";
import { useConfig } from "../components/configContext";
import formatWind from "../utils/convertWind";
import WeatherBackgroundWrapper from "../components/background/Background";
import ThermalGauge from "../components/gauge/Gauge";
import HumidityGauge from "../components/humidty/Humidity";
import HourlySlider from "../components/dayCard/dayCard";

export default function App() {
  const { dark } = useTheme();
  const styles = getStyles(dark);
  const { config } = useConfig();

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
        if (!data || !data.temperature || !data.weatherMain) {
          throw new Error("Dados de clima não encontrados para esta cidade.");
        }

        setWeatherData(data);
        setDesc(data.description || "");
        setTemp(Math.round(data.temperature))
      } catch (error) {
        setErrorMsg(error.message || "Erro desconhecido");
        setShowErrorModal(true);
        setCity("Erro ao obter cidade");
        setDesc("Erro ao obter clima");
        setTemp("--");
      }
    }

    fetchWeather();
  }, [config.wind_unit]);

  // Loading até clima + gráfico carregarem
  if ((!weatherData) && !errorMsg) {
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
        <Text style={styles.loadingText}>Carregando clima...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <ErrorModal visible={true} message={errorMsg} dark={dark} />
      </View>
    );
  }

  return (
    <>
      <ErrorModal
        visible={showErrorModal}
        message={errorMsg}
        onClose={() => setShowErrorModal(false)}
      />

      <WeatherBackgroundWrapper
        weatherData={weatherData}
        headerContent={
          <MainSection>
            <MainStats city={city} desc={desc} temp={temp} />
          </MainSection>
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <WeatherCard city={city} />
          <HourlySlider city={city}/>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <StatsCard
              titulo="Sensação"
              desc="Sensação térmica"
              stats={
                weatherData.feelsLike !== undefined &&
                weatherData.feelsLike !== null
                  ? `${weatherData.feelsLike}°`
                  : "--"
              }
              icon={<ThermalGauge value={weatherData.feelsLike} />}
            />
            <StatsCard
              titulo="Umidade"
              desc="Umidade relativa"
              stats={
                weatherData.humidity !== undefined &&
                weatherData.humidity !== null
                  ? `${weatherData.humidity}%`
                  : "--"
              }
              icon={<HumidityGauge value={weatherData.humidity} />}
            />
            <StatsCard
              titulo="Vento"
              desc="Velocidade do vento"
              stats={
                weatherData.windSpeed !== undefined &&
                weatherData.windSpeed !== null
                  ? formatWind(weatherData.windSpeed, config.wind_unit)
                  : "--"
              }
              icon={<Wind color="#fff" size={40} />}
            />
            <StatsCard
              titulo="Nuvens"
              desc="Cobertura de nuvens"
              stats={
                weatherData.cloudiness !== undefined &&
                weatherData.cloudiness !== null
                  ? `${weatherData.cloudiness}%`
                  : "--"
              }
              icon={<Cloud color="#fff" size={40} />}
            />
            <StatsCard
              titulo="Nascer do Sol"
              desc="Horário do nascer do sol"
              stats={weatherData.sunrise ? weatherData.sunrise : "--"}
              icon={<Cloud color="#fff" size={40} />}
            />
            <StatsCard
              titulo="Pôr do Sol"
              desc="Horário do pôr do sol"
              stats={weatherData.sunset ? weatherData.sunset : "--"}
              icon={<Cloud color="#fff" size={40} />}
            />
          </View>

          <DiasSemChuvaCheckbox />
        </ScrollView>
      </WeatherBackgroundWrapper>
    </>
  );
}
