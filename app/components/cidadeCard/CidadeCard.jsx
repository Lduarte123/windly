import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';

export default function CidadeCard({ cidade, onRemover, onEditar, onPress, dark, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: dark ? "#23272a" : "#fff" }
      ]}
      disabled={disabled}
    >
      <Text style={{ fontSize: 16, color: dark ? "#ECEDEE" : "#11181C", flex: 1 }}>{cidade}</Text>
      <TouchableOpacity onPress={onEditar} style={{ marginHorizontal: 8 }}>
        <Ionicons name="create-outline" size={22} color="#2D6BFD" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemover}>
        <Ionicons name="trash-outline" size={22} color="#E53935" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}