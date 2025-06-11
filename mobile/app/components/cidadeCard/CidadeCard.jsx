import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function CidadeCard({ cidade, onRemover, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
    >
      <Text style={{ fontSize: 16 }}>{cidade}</Text>
      <TouchableOpacity onPress={onRemover}>
        <Text style={styles.text}>
          Remover
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}