import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import styles from "./styles";

export default function SearchBar({ value, onChangeText, placeholder = "Pesquisar..." }) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#fff" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#fff"
      />
    </View>
  );
}

