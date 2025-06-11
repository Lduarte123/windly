import { useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import MainSection from "../../../components/mainSection/MainSection";
import MainStats from "../../../components/mainStats/MainStats";
import WeatherCard from "../../../components/weatherCard/WeatherCard";
import StatsCard from "../../../components/statsCard/StatsCard";
import { Ionicons } from '@expo/vector-icons';
import { Thermometer, Droplets, Gauge, Wind, Eye, Cloud } from 'lucide-react-native';
import styles from "../../../components/styles";

export const options = {
  tabBarButton: () => null,
};

export default function CidadeDetalhe() {
  const { cidade } = useLocalSearchParams();

  const weatherData = {
    humidity: 70,
    feels_like: 32,
    pressure: 1015,
    visibility: 9000,
    wind_speed: 5.5,
    wind_deg: 80,
    clouds: 10,
  };

  const navigation = useNavigation();


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <MainSection>
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <MainStats city={cidade} desc="Nublado" temp="25"/>
      </MainSection>
      <ScrollView style={styles.whiteSection}>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 16 }}>
          {cidade}
        </Text>
        <WeatherCard />
        <View style={styles.statsContainer}>
          <StatsCard
            titulo="Sensação"
            desc="Sensação térmica"
            stats={`${weatherData.feels_like}°`}
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