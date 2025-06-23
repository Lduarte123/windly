import React from "react";
import { View, Text } from "react-native";
import { useConfig } from "../configContext";
import { convertTemp } from "../../utils/convertTemp";
import styles from "./styles";

export default function StatsCard({ titulo, desc, stats, icon }) {
  const { config } = useConfig();

  let value = stats;
  if (titulo.toLowerCase().includes("sensação") || titulo.toLowerCase().includes("temperatura")) {
    const num = typeof stats === "string" ? parseFloat(stats) : stats;
    value = convertTemp(num, config.temp_unit) + "°";
  }

  return (
    <View style={styles.container}>
      <View style={styles.topLeft}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.stats}>{value}</Text>
      </View>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
    </View>
  );
}
