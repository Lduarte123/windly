import React from "react";
import { View, Text, Image } from "react-native";
import getStyles from "../styles"; // Importa a função de estilos

export default function ErrorModal({ visible, message, dark = false }) {
  if (!visible) return null;

  const styles = getStyles(dark);

  const iconSource = dark
    ? require("../../assets/cloud.png")
    : require("../../assets/cloud_443808.png");

  return (
    <View
      style={[
        styles.errorModal,
        {
          backgroundColor: dark ? "#23272a" : "#fff",
          borderColor: dark ? "#444" : "#eee",
          borderWidth: 1,
        },
      ]}
    >
      <Image
        source={iconSource}
        style={{ width: 56, height: 56, marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text style={[styles.errorModalTitle, { color: "#E53935" }]}>Erro</Text>
      <Text style={[styles.errorModalMessage, { color: dark ? "#ECEDEE" : "#333" }]}>
        {message}
      </Text>
    </View>
  );
}