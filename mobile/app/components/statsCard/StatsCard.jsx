import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

export default function StatsCard({ titulo, desc, stats, icon }) {
  return (
    <View style={styles.container}>
      <View style={styles.topLeft}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.stats}>{stats}</Text>
      </View>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
    </View>
  );
}
