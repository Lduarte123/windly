import React from "react";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import MainSection from "../components/mainSection/MainSection";
import MainStats from "../components/mainStats/MainStats";
import styles from "../components/styles";
import WeatherCard from "../components/weatherCard/WeatherCard";
import StatsCard from "../components/statsCard/StatsCard";

export default function App() {

  const weatherData = {
    humidity: 66,
    feels_like: 34.26,
    pressure: 1012,
    visibility: 10000,
    wind_speed: 7.2,
    wind_deg: 110,
    clouds: 0,
  };

  return (
    <ScrollView style={styles.container}>
      <MainSection>
        <MainStats />
      </MainSection>
      <ScrollView style={styles.whiteSection}>
        <WeatherCard />

        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
          <StatsCard
            titulo="Sensação"
            desc="Sensação térmica"
            stats={`${weatherData.feels_like.toFixed(1)}°`}
            icon="🌡️"
          />
          <StatsCard
            titulo="Umidade"
            desc="Umidade relativa"
            stats={`${weatherData.humidity}%`}
            icon="💧"
          />
          <StatsCard
            titulo="Pressão"
            desc="Pressão atmosférica"
            stats={`${weatherData.pressure} hPa`}
            icon="🌬️"
          />
          <StatsCard
            titulo="Vento"
            desc="Velocidade do vento"
            stats={`${weatherData.wind_speed} m/s`}
            icon="🪁"
          />
          <StatsCard
            titulo="Visibilidade"
            desc="Visibilidade"
            stats={`${weatherData.visibility / 1000} km`}
            icon="👁️"
          />
          <StatsCard
            titulo="Nuvens"
            desc="Cobertura de nuvens"
            stats={`${weatherData.clouds}%`}
            icon="☁️"
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
}