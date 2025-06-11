import React from "react";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import MainSection from "../../components/mainSection/MainSection";
import MainStats from "../../components/mainStats/MainStats";
import styles from "../../components/styles";
import WeatherCard from "../../components/weatherCard/WeatherCard";
import StatsCard from "../../components/statsCard/StatsCard";
import { Thermometer, Droplets, Gauge, Wind, Eye, Cloud } from 'lucide-react-native';
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";

export default function App() {
  const { dark } = useTheme();
  const styles = getStyles(dark);

  const weatherData = {
    humidity: 66,
    feels_like: 34.26,
    pressure: 1012,
    visibility: 10000,
    wind_speed: 7.2,
    wind_deg: 110,
    clouds: 0,
  };

  const whiteSectionStyle = [
    styles.whiteSection,
    dark && { backgroundColor: "#23272a" }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <MainSection>
        <MainStats city="Fortaleza, BR" desc="Algumas nuvens" temp="28"/>
      </MainSection>
      <ScrollView style={whiteSectionStyle}>
        <WeatherCard />

        <View style={styles.statsContainer}>
          <StatsCard
            titulo="Sensação"
            desc="Sensação térmica"
            stats={`${weatherData.feels_like.toFixed(1)}°`}
            icon={<Thermometer color="#fff" size={26} />}
          />
          <StatsCard
            titulo="Umidade"
            desc="Umidade relativa"
            stats={`${weatherData.humidity}%`}
            icon={<Droplets color="#fff" size={26} />}
          />
          <StatsCard
            titulo="Pressão"
            desc="Pressão atmosférica"
            stats={`${weatherData.pressure} hPa`}
            icon={<Gauge color="#fff" size={26} />}
          />
          <StatsCard
            titulo="Vento"
            desc="Velocidade do vento"
            stats={`${weatherData.wind_speed} m/s`}
            icon={<Wind color="#fff" size={26} />}
          />
          <StatsCard
            titulo="Visibilidade"
            desc="Visibilidade"
            stats={`${weatherData.visibility / 1000} km`}
            icon={<Eye color="#fff" size={26} />}
          />
          <StatsCard
            titulo="Nuvens"
            desc="Cobertura de nuvens"
            stats={`${weatherData.clouds}%`}
            icon={<Cloud color="#fff" size={26} />}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
}