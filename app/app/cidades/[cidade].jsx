import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  Thermometer,
  Droplets,
  CloudFog,
  Sunrise,
  Sunset,
  Wind,
  Cloud,
} from "lucide-react-native";

import WeatherCard from "../../components/weatherCard/WeatherCard";
import StatsCard from "../../components/statsCard/StatsCard";
import { useTheme } from "../../components/ThemeContext";
import { useAuth } from "../../components/authContext/AuthContext";
import { useConfig } from "../../components/configContext";
import api from "../../api/api";
import formatWind from "../../utils/convertWind";
import { convertTemp } from "../../utils/convertTemp";
import HourlySlider from "../../components/dayCard/dayCard";
import ThermalGauge from "../../components/gauge/Gauge";
import HumidityGauge from "../../components/humidty/Humidity";
import MonthlyRainChart from "../../components/monthlyRainChart/MonthlyRainChart";
import PrecipitationProbabilityCard from "../../components/precipitationProbabilityCard/PrecipitationProbabilityCard";

export const options = {
  tabBarButton: () => null,
};

export default function CidadeDetalhe() {
  const { cidade } = useLocalSearchParams();
  const { dark } = useTheme();
  const navigation = useNavigation();
  const { user, loading: authLoading } = useAuth();
  const { config } = useConfig();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const styles = createStyles(dark);
  const textColor = dark ? "#ECEDEE" : "#11181C";

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
  }, [cidade, config.temp_unit]);

  useFocusEffect(
    useCallback(() => {
      if (authLoading) return;
      if (!user) {
        navigation.replace("login");
      }
    }, [user, authLoading])
  );

  if (authLoading) return null;

  if (loading) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumo climático</Text>
        </View>
        <ActivityIndicator style={{ margin: 32 }} color="#FFF" />
      </ScrollView>
    );
  }

  if (erro || !weatherData) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumo climático</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ color: "red" }}>
            {erro || "Erro ao carregar dados"}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumo climático</Text>
      </View>

      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <Text style={styles.cityDesc}>{weatherData.city || cidade}</Text>
          <Text style={styles.cityDescSub}>{weatherData.description}</Text>
        </View>

        <View style={styles.headerBottomRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.temperature}>
              {convertTemp(weatherData.temperature, config.temp_unit) + "°"}
            </Text>
          </View>

          <View style={styles.rightColumn}>
            {/* Visibilidade */}
            <View style={styles.infoRow}>
              <CloudFog color="#FFF" size={20} />
              <Text style={styles.label}>Visibilidade:</Text>
              <Text style={styles.value}>
                {weatherData.visibility !== undefined
                  ? ((weatherData.visibility / 10000) * 100).toFixed(0) + "%"
                  : "--"}
              </Text>
            </View>

            {/* Sensação térmica */}
            <View style={styles.infoRow}>
              <Thermometer color="#FFF" size={20} />
              <Text style={styles.label}>Sensação:</Text>
              <Text style={styles.value}>
                {convertTemp(weatherData.feelsLike, config.temp_unit) + "°"}
              </Text>
            </View>

            {/* Umidade */}
            <View style={styles.infoRow}>
              <Droplets color="#FFF" size={20} />
              <Text style={styles.label}>Umidade:</Text>
              <Text style={styles.value}>{weatherData.humidity + "%"}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.whiteSection}>
        <WeatherCard city={weatherData.city || cidade} />
        <HourlySlider
          city={weatherData.city || cidade}
          overrideColors={{
            background: 'rgba(30, 60, 255, 0.2)',
            text: dark ? '#eee' : '#fff',
          }}
          lineColor="#fff"
        />
        <MonthlyRainChart city={weatherData.city || cidade} />

        <View style={styles.statsContainer}>
          <StatsCard
            titulo="Sensação"
            desc="Sensação térmica"
            stats={
              weatherData.feelsLike !== undefined
                ? weatherData.feelsLike + "°"
                : "--"
            }
            icon={<ThermalGauge value={weatherData.feelsLike} />}
          />
          <StatsCard
            titulo="Umidade"
            desc="Umidade relativa"
            stats={
              weatherData.humidity !== undefined
                ? weatherData.humidity + "%"
                : "--"
            }
            icon={<HumidityGauge value={weatherData.humidity} />}
          />
          <StatsCard
            titulo="Vento"
            desc="Velocidade do vento"
            stats={
              weatherData.windSpeed !== undefined
                ? formatWind(weatherData.windSpeed, config.wind_unit)
                : "--"
            }
            icon={<Wind color="#fff" size={40} />}
          />
          <StatsCard
            titulo="Nuvens"
            desc="Cobertura de nuvens"
            stats={
              weatherData.cloudiness !== undefined
                ? weatherData.cloudiness + "%"
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
          <PrecipitationProbabilityCard city={weatherData.city || cidade} />
        </View>
      </ScrollView>
    </ScrollView>
  );
}

function createStyles(isDark) {
  const theme = {
    background: isDark ? "#151718" : "#fff",
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 50,
      paddingHorizontal: 16,
      marginBottom: 24,
      gap: 12,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#ECEDEE" : "#11181C",
    },
    whiteSection: {
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24,
      padding: 16,
      paddingBottom: 110,
    },
    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    headerCard: {
      backgroundColor: '#4287f5',
      padding: 24,
      borderRadius: 20,
      marginHorizontal: 16,
      marginBottom: 12,
    },
    headerTopRow: {
      marginBottom: 12,
    },
    cityDesc: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ECEDEE",
    },
    cityDescSub: {
      fontSize: 12,
      fontWeight: "400",
      color: "#ECEDEE",
    },
    headerBottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    leftColumn: {
      flex: 1,
    },
    rightColumn: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "flex-start",
    },
    temperature: {
      fontSize: 48,
      color: "#fff",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    label: {
      color: "#ECEDEE",
      fontSize: 12,
    },
    value: {
      color: "#ECEDEE",
      fontSize: 14,
      fontWeight: "600",
    },
  });
}
