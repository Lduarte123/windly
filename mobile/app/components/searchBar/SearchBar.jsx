import React from "react";
import { View, TextInput } from "react-native";
import { Feather } from '@expo/vector-icons';
import styles from "./styles";
import { useTheme } from "../ThemeContext";

export default function SearchBar({ value, onChangeText, placeholder = "Pesquisar...", onSubmitEditing }) {
  const { dark } = useTheme();

  return (
    <View style={[
      styles.container,
      dark && { backgroundColor: "#23272a" }
    ]}>
      <Feather name="search" size={20} color={dark ? "#ECEDEE" : "#000"} style={styles.icon} />
      <TextInput
        style={[
          styles.input,
          dark && { color: "#ECEDEE" }
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={dark ? "#ECEDEE" : "#000"}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

