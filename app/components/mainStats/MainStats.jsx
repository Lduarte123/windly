import React from "react";
import styles from './styles';
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useConfig } from "../configContext";
import { convertTemp } from "../../utils/convertTemp";

function getWeatherIcon(desc, size = 48) {
  const d = desc.toLowerCase();
  if (d.includes("chuva")) return <MaterialCommunityIcons name="weather-rainy" color="#fff" size={size} />;
  if (d.includes("nublado") || d.includes("algumas nuvens")) return <MaterialCommunityIcons name="weather-cloudy" color="#fff" size={size} />;
  if (d.includes("neve")) return <MaterialCommunityIcons name="weather-snowy" color="#fff" size={size} />;
  if (d.includes("garoa")) return <MaterialCommunityIcons name="weather-partly-rainy" color="#fff" size={size} />;
  if (d.includes("tempestade")) return <MaterialCommunityIcons name="weather-lightning" color="#fff" size={size} />;
  if (d.includes("limpo") || d.includes("ensolarado")) return <MaterialCommunityIcons name="weather-sunny" color="#fff" size={size} />;
  return <MaterialCommunityIcons name="weather-partly-cloudy" color="#fff" size={size} />;
}

function getDateTimeString() {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const now = new Date();
  const diaSemana = dias[now.getDay()];
  const dia = now.getDate();
  const mes = meses[now.getMonth()];
  const hora = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  return `${diaSemana}, ${dia} ${mes} | ${hora}:${min}`;
}

export default function MainStats({ city = "", temp = "", desc = "" }) {
  const { config } = useConfig();
  const tempValue = convertTemp(temp, config.temp_unit);

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.dateTime}>{getDateTimeString()}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.temp}>{tempValue}º</Text>
        <View style={styles.iconWrapper}>
          {getWeatherIcon(desc, 32)}
          <Text style={styles.description}>{desc} </Text>
        </View>
      </View>
    </View>
  );
}