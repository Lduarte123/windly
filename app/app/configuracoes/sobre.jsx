import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { useTheme } from "../../components/ThemeContext"; // use o contexto do app

export default function Sobre() {
  const { dark } = useTheme(); // pega o tema do app

  const backgroundColor = dark ? "#151718" : "#fff";
  const textColor = dark ? "#f5f5f5" : "#222";
  const linkColor = "#2D6BFD";

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch(() => alert("Não foi possível abrir o link"));
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: textColor }]}>Windly App</Text>
      <Text style={[styles.text, { color: textColor }]}>Versão 1.0.0</Text>

      <Text style={[styles.subtitle, { color: textColor }]}>Desenvolvido por:</Text>
      <Text style={[styles.text, { color: textColor }]}>Equipe App Windly</Text>

      <Text style={[styles.subtitle, { color: textColor }]}>Contato:</Text>
      <TouchableOpacity onPress={() => handleLinkPress("mailto:contato@windly.com")}>
        <Text style={[styles.link, { color: linkColor }]}>contato@windly.com</Text>
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: textColor }]}>Site:</Text>
      <TouchableOpacity onPress={() => handleLinkPress("https://www.windly.com")}>
        <Text style={[styles.link, { color: linkColor }]}>www.windly.com</Text>
      </TouchableOpacity>

      <Text style={[styles.footer, { color: textColor }]}>
        Agradecemos por usar o Windly App!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    marginTop:30,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  link: {
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  footer: {
    marginTop:30,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 30,
    fontStyle: "italic",
  },
});
