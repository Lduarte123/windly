import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../../components/ThemeContext"; // 👈 aproveitando seu hook

export default function Privacidade() {
  const { dark } = useTheme();

  const backgroundColor = dark ? "#151718" : "#fff";
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const buttonBackground = dark ? "#2D6BFD" : "#2D6BFD"; // azul consistente
  const buttonTextColor = "#fff";

  const handleAuthorization = () => {
    Alert.alert(
      "Autorização",
      "Você autorizou o uso de suas informações de acordo com a política de privacidade."
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[styles.title, { color: textColor }]}
          accessibilityRole="header"
        >
          Política de Privacidade
        </Text>

        <Text style={[styles.text, { color: textColor }]}>
          Suas informações estão protegidas de acordo com nossa política de
          privacidade.
        </Text>

        <Text style={[styles.text, { color: textColor }]}>
          Nós coletamos dados apenas para melhorar a experiência do usuário,
          respeitando todas as normas aplicáveis. Em nenhuma hipótese vendemos
          ou compartilhamos seus dados com terceiros sem o seu consentimento.
        </Text>

        {Platform.OS === "web" && (
          <Text
            style={[styles.text, { color: textColor, fontStyle: "italic", marginTop: 10 }]}
          >
            Última atualização: 23/09/2025
          </Text>
        )}

        {/* Botão de autorização */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBackground }]}
          onPress={handleAuthorization}
        >
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            Autorizar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    marginTop:30,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  button: {
    marginTop: 50,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
