import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainSection from "../components/mainSection/MainSection";
import MainStats from "../components/mainStats/MainStats";
import WeatherCard from "../components/weatherCard/WeatherCard";
import StatsCard from "../components/statsCard/StatsCard";
import { Thermometer, Wind, Cloud, Sunrise, Sunset } from "lucide-react-native";
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const userCity = await getUserCity();
      setCity(userCity);

      const response = await api.get(`/clima_atual/${userCity}`);
      const data = response.data;

      if (!data || !data.temperature || !data.weatherMain) {
        throw new Error("Dados de clima não encontrados para esta cidade.");
      }

      // Verifica se é dia ou noite
      const now = new Date();
      const nowInSeconds =
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const [sunriseHour, sunriseMin] = data.sunrise.split(":").map(Number);
      const [sunsetHour, sunsetMin] = data.sunset.split(":").map(Number);
      const sunriseInSeconds = sunriseHour * 3600 + sunriseMin * 60;
      const sunsetInSeconds = sunsetHour * 3600 + sunsetMin * 60;
      const isNight = nowInSeconds < sunriseInSeconds || nowInSeconds > sunsetInSeconds;

      data.isNight = isNight;
      setWeatherData(data);
      setDesc(data.description || "");
      setTemp(Math.round(data.temperature));

      // Salva no cache
      await AsyncStorage.setItem("@lastWeatherData", JSON.stringify(data));
      await AsyncStorage.setItem("@lastCity", userCity);
      setErrorMsg("");
    } catch (error) {
      const cachedDataString = await AsyncStorage.getItem("@lastWeatherData");
      const cachedCity = await AsyncStorage.getItem("@lastCity");

      if (cachedDataString && cachedCity) {
        const cachedData = JSON.parse(cachedDataString);
        setWeatherData(cachedData);
        setCity(cachedCity);
        setDesc(cachedData.description || "");
        setTemp(Math.round(cachedData.temperature));
        setErrorMsg("");
      } else {
        setWeatherData(null);
        setErrorMsg(error.message || "Erro desconhecido");
        setShowErrorModal(true);
        setCity("Erro ao obter cidade");
        setDesc("Erro ao obter clima");
        setTemp("--");
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [config.wind_unit, config.temp_unit]);

  const onRefresh = () => {
    fetchWeather();
  };

  return (
    <View style={{ flex: 1 }}>
      <WeatherBackgroundWrapper
        weatherData={weatherData}
        loading={loading && !initialLoading} // refresh loading apenas
        onRefresh={onRefresh}
        headerContent={
          !errorMsg && weatherData ? (
            <MainSection>
              <MainStats city={city} desc={desc} temp={temp} />
            </MainSection>
          ) : null
        }
      >
        {/* Conteúdo principal */}
        {!errorMsg && weatherData && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <WeatherCard city={city} />
            <HourlySlider city={city} />
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
                  weatherData.feelsLike != null ? `${weatherData.feelsLike}°` : "--"
                }
                icon={<ThermalGauge value={weatherData.feelsLike} />}
              />
              <StatsCard
                titulo="Umidade"
                desc="Umidade relativa"
                stats={
                  weatherData.humidity != null ? `${weatherData.humidity}%` : "--"
                }
                icon={<HumidityGauge value={weatherData.humidity} />}
              />
              <StatsCard
                titulo="Vento"
                desc="Velocidade do vento"
                stats={
                  weatherData.windSpeed != null
                    ? formatWind(weatherData.windSpeed, config.wind_unit)
                    : "--"
                }
                icon={<Wind color="#fff" size={40} />}
              />
              <StatsCard
                titulo="Nuvens"
                desc="Cobertura de nuvens"
                stats={
                  weatherData.cloudiness != null
                    ? `${weatherData.cloudiness}%`
                    : "--"
                }
                icon={<Cloud color="#fff" size={40} />}
              />
              <StatsCard
                titulo="Nascer do Sol"
                desc="Horário do nascer do sol"
                stats={weatherData.sunrise || "--"}
                icon={<Sunrise color="#fff" size={40} />}
              />
              <StatsCard
                titulo="Pôr do Sol"
                desc="Horário do pôr do sol"
                stats={weatherData.sunset || "--"}
                icon={<Sunset color="#fff" size={40} />}
              />
            </View>
            <DiasSemChuvaCheckbox />
          </ScrollView>
        )}

        {/* Modal de erro */}
        {errorMsg && !weatherData && <ErrorModal visible={showErrorModal} dark={dark} />}
      </WeatherBackgroundWrapper>

      {/* Loading inicial com vídeo absoluto, independente do layout */}
      {initialLoading && (
        <View
          style={{
            position: "absolute",
            top: "40%", // ajuste para ficar mais pra cima
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Video
            source={require("../assets/wind.mp4")}
            style={{ width: 110, height: 110, borderRadius: 60 }}
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted
          />
        </View>
      )}
    </View>
  );
}
