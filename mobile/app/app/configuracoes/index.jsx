import React, { useState } from "react";
import { ScrollView, Text, View, Switch, TouchableOpacity, Alert, Platform, } from "react-native";
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";
import Feather from "react-native-vector-icons/Feather"; // ícones

export default function Configuracoes() {
  const { dark, toggleTheme } = useTheme();
  const styles = getStyles(dark);

  const backgroundColor = dark ? "#151718" : "#fff";
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const cardBackground = dark ? "#1F2223" : "#F1F1F1";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const showAlert = (message) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert(message);
    }
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    showAlert(newValue ? "Notificações ativadas" : "Notificações desativadas");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.configContainer}>
        <Text
          style={[styles.title, { color: textColor, marginBottom: 20 }]}
        >
          Configurações
        </Text>

        {/* Tema escuro */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="moon" size={18} color={textColor} />
            <Text style={[styles.label, { color: textColor }]}>
              Tema escuro
            </Text>
          </View>
          <Switch
            value={dark}
            onValueChange={toggleTheme}
            thumbColor={dark ? "#2D6BFD" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#2D6BFD" }}
          />
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="bell" size={18} color={textColor} />
            <Text style={[styles.label, { color: textColor }]}>
              Notificações
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            thumbColor={notificationsEnabled ? "#2D6BFD" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#2D6BFD" }}
          />
        </View>

        {/* Sobre */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="info" size={18} color={textColor} />
            <Text style={[styles.label, { color: textColor }]}>Sobre</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAbout(!showAbout)}>
            <Text style={{ color: "#2D6BFD", fontWeight: "600" }}>
              {showAbout ? "Ocultar" : "Ver"}
            </Text>
          </TouchableOpacity>
        </View>
        {showAbout && (
          <View
            style={{
              backgroundColor: cardBackground,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: dark ? "#333" : "#ccc",
            }}
          >
            <Text style={{ color: textColor }}>Windly App</Text>
            <Text style={{ color: textColor }}>Versão 1.0.0</Text>
            <Text style={{ color: textColor }}>Desenvolvido por Você</Text>
          </View>
        )}

        {/* Privacidade */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="lock" size={18} color={textColor} />
            <Text style={[styles.label, { color: textColor }]}>
              Privacidade
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowPrivacy(!showPrivacy)}>
            <Text style={{ color: "#2D6BFD", fontWeight: "600" }}>
              {showPrivacy ? "Ocultar" : "Ver"}
            </Text>
          </TouchableOpacity>
        </View>
        {showPrivacy && (
          <View
            style={{
              backgroundColor: cardBackground,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: dark ? "#333" : "#ccc",
            }}
          >
            <Text style={{ color: textColor }}>
              Suas informações estão protegidas de acordo com nossa política de
              privacidade.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
