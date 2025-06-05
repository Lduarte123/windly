import React from "react";
import styles from './styles';
import { View, Text } from "react-native";

export default function MainStats({ city = "", temp = "", desc = "" }) {
  return (
    <View style={styles.container}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.temp}>{temp}º</Text>
      <Text style={styles.description}>{desc}</Text>
      <Text style={styles.brand}>Windly</Text>
    </View>
  );
}