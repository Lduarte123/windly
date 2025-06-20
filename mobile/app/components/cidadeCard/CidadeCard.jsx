import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function CidadeCard({ cidade, onRemover, onPress, dark }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: dark ? "#23272a" : "#fff" }
      ]}
    >
      <Text style={{ fontSize: 16, color: dark ? "#ECEDEE" : "#11181C" }}>{cidade}</Text>
      <TouchableOpacity onPress={onRemover}>
        <Text style={[styles.text, { color: "#E53935" }]}>
          Remover
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}