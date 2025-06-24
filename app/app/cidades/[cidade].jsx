import { useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import MainSection from "../../components/mainSection/MainSection";
import MainStats from "../../components/mainStats/MainStats";
import WeatherCard from "../../components/weatherCard/WeatherCard";
import StatsCard from "../../components/statsCard/StatsCard";
import { Ionicons } from '@expo/vector-icons';
import { Thermometer, Droplets, Gauge, Wind, Eye, Cloud } from 'lucide-react-native';
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";
import api from "../../api/api";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from '../../components/authContext/AuthContext';
import { useFocusEffect } from "@react-navigation/native";
import { useConfig } from "../../components/configContext";
import formatWind from "../../utils/convertWind";

export const options = {
  tabBarButton: () => null,
};

export default function CidadeDetalhe() {
  const { cidade } = useLocalSearchParams();
  const { dark } = useTheme();
  const styles = getStyles(dark);
  const navigation = useNavigation();
  const { user, loading: authLoading } = useAuth();
  const { config } = useConfig();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setErro("");
      try {
        const response = await api.get(`/clima_atual/${cidade}`);
        setWeatherData(response.data);
      } catch (error) {
        setErro("Erro ao buscar dados da cidade.");
      }
      setLoading(false);
    }
    if (cidade) fetchWeather();
  }, [cidade]);

  useFocusEffect(
    useCallback(() => {
      if (authLoading) return; 
      if (!user) {
        navigation.replace('login');
      }
    }, [user, authLoading])
  );

  const whiteSectionStyle = [
    styles.whiteSection,
    dark && { backgroundColor: "#23272a" }
  ];
  const textColor = dark ? "#ECEDEE" : "#11181C";

  if (authLoading) {
    return null;
  }

  if (loading) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MainSection>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <MainStats city={cidade} desc="Carregando..." temp="--"/>
        </MainSection>
        <ActivityIndicator style={{ margin: 32 }} color="#2D6BFD" />
      </ScrollView>
    );
  }

  if (erro || !weatherData) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MainSection>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <MainStats city={cidade} desc="Erro" temp="--"/>
        </MainSection>
        <View style={{ padding: 20 }}>
          <Text style={{ color: "red" }}>{erro || "Erro ao carregar dados"}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <MainSection>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <MainStats city={weatherData.city || cidade} desc={weatherData.description} temp={Math.round(weatherData.temperature)}/>
      </MainSection>
      <ScrollView style={whiteSectionStyle}>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 16, color: textColor }}>
          {weatherData.city || cidade}
        </Text>
        <WeatherCard city={weatherData.city || cidade} />
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
                ? formatWind(weatherData.windSpeed, config.wind_unit)
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
  );
}