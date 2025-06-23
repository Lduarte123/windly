import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles"; // Estilos locais

export default function LogoutOption({ onPress }) {
  return (
    <TouchableOpacity style={styles.optionContainer} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.optionText}>Logout</Text>
    </TouchableOpacity>
  );
}