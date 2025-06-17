import React, { useState } from "react";
import { ScrollView, Text, View, Switch, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";
import useLogout from "../logout"; // ✅ Importa o hook corretamente

export default function Configuracoes() {
  const { dark, toggleTheme } = useTheme();
  const styles = getStyles(dark);
  const logout = useLogout(); // ✅ Usa o hook para obter a função de logout

  const backgroundColor = dark ? "#151718" : "#fff";
  const textColor = dark ? "#ECEDEE" : "#11181C";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleAbout = () => {
    Alert.alert("Sobre o App", "Windly App\nVersão 1.0.0\nDesenvolvido por Você");
  };

  const handlePrivacy = () => {
    Alert.alert("Privacidade", "Suas informações estão protegidas de acordo com nossa política de privacidade.");
  };

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor }]}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.configContainer}>
        <Text style={[styles.title, { color: textColor }]}>
          Configurações
        </Text>

        {/* Tema */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: textColor }]}>Tema escuro</Text>
          <Switch
            value={dark}
            onValueChange={toggleTheme}
            thumbColor={dark ? "#2D6BFD" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#2D6BFD" }}
          />
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: textColor }]}>Notificações</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            thumbColor={notificationsEnabled ? "#2D6BFD" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#2D6BFD" }}
          />
        </View>

        {/* Sobre */}
        <TouchableOpacity style={styles.section} onPress={handleAbout}>
          <Text style={[styles.label, { color: textColor }]}>Sobre</Text>
          <Text style={{ color: "#2D6BFD", fontWeight: "600" }}>Ver</Text>
        </TouchableOpacity>

        {/* Privacidade */}
        <TouchableOpacity style={styles.section} onPress={handlePrivacy}>
          <Text style={[styles.label, { color: textColor }]}>Privacidade</Text>
          <Text style={{ color: "#2D6BFD", fontWeight: "600" }}>Ver</Text>
        </TouchableOpacity>

        {/* 🔴 Botão de Logout */}
        <TouchableOpacity style={styles.section} onPress={logout}>
          <Text style={[styles.label, { color: textColor }]}>Sair</Text>
          <Text style={{ color: "#E53935", fontWeight: "600" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
