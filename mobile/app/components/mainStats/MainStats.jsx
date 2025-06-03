import React from "react";
import styles from './styles';
import { View, Text } from "react-native";

export default function MainStats() {
  return (
    <View style={styles.container}>
      <Text style={styles.city}>Fortaleza, Brasil</Text>
      <Text style={styles.temp}>29º</Text>
      <Text style={styles.description}>Algumas Nuvens 31º/25º</Text>
      <Text style={styles.brand}>Windly</Text>
    </View>
  );
}