import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

export default function StatsCard({ titulo, desc, stats, icon }) {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <Text style={styles.stats}>{stats}</Text>
    </View>
  );
}
