import React from "react";
import { View, Text, Image } from "react-native";
import getStyles from "../styles"; // Importa a função de estilos

export default function ErrorModal({ visible, dark = false }) {
  if (!visible) return null;

  const styles = getStyles(dark);

  const iconSource = require("../../assets/cloud.png")

  return (
    <View
      style={[
        styles.errorModal,
        {
          backgroundColor: "#23272a62",
          borderColor: "#23272a62",
        },
      ]}
    >
      <Image
        source={iconSource}
        style={{ width: 56, height: 56, marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text style={[styles.errorModalTitle, { color: "white" }]}>Erro</Text>
      <Text style={[styles.errorModalMessage, { color: "white" }]}>
        Não foi possível obter informações do clima, por favor tente novamente mais tarde.
      </Text>
    </View>
  );
}