import React, { useState, useEffect } from "react";
import useLogout from "../logout";
import { ScrollView, Text, View, Switch, TouchableOpacity, Alert, Platform, StyleSheet } from "react-native";
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from '../../components/authContext/AuthContext';
import { useRouter } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { useConfig } from "../../components/configContext";
import api from "../../api/api";

export default function Configuracoes() {
  const { dark, toggleTheme } = useTheme();
  const styles = getStyles(dark);
  const logout = useLogout();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const { config, setConfig } = useConfig();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      if (user?.id) {
        try {
          const res = await api.get(`/user-config/${user.id}`);
          setConfig(res.data);
        } catch (e) {}
      }
    }
    fetchConfig();
  }, [user?.id]);

  const backgroundColor = dark ? "#151718" : "#fff";
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const cardBackground = dark ? "#1F2223" : "#F1F1F1";

  const handleAbout = () => {
    Alert.alert("Sobre o App", "Windly App\nVersão 1.0.0\nDesenvolvido por Você");
  };

  const handlePrivacy = () => {
    Alert.alert("Privacidade", "Suas informações estão protegidas de acordo com nossa política de privacidade.");
  };

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

  function updateConfig(newConfig) {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      if (user?.id) {
        api.put(`/user-config/${user.id}`, updated).catch(() => {});
      }
      return updated;
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}>
          <View style={[styles.configContainer]}>

            {/* Título e botão de usuário com inicial */}
            <View style={localStyles.headerRow}>
              <Text style={[styles.configTitle, { color: textColor }]}>
                Configurações
              </Text>
              <TouchableOpacity
                style={[localStyles.profileButton, { backgroundColor: "#2D6BFD" }]}
                onPress={() => router.push("/configuracoes/perfil")}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </Text>
              </TouchableOpacity>
            </View>

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
              </View>
            )}

            {/* Privacidade */}
            <TouchableOpacity style={styles.section} onPress={handlePrivacy}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Feather name="lock" size={18} color={textColor} />
                <Text style={[styles.label, { color: textColor }]}>Privacidade</Text>
              </View>
              <Text style={{ color: "#2D6BFD", fontWeight: "600" }}>Ver</Text>
            </TouchableOpacity>

            {/* Unidade de Temperatura */}
            <View style={styles.section}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Feather name="thermometer" size={18} color={textColor} />
                <Text style={[styles.label, { color: textColor }]}>
                  Temperatura
                </Text>
              </View>
              <RNPickerSelect
                value={config.temp_unit}
                onValueChange={(value) => updateConfig({ temp_unit: value })}
                items={[
                  { label: "Celsius (°C)", value: "C" },
                  { label: "Fahrenheit (°F)", value: "F" },
                ]}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    color: textColor,
                    height: 48,
                    fontSize: 16,
                    paddingLeft: 8,
                  },
                  inputAndroid: {
                    color: textColor,
                    height: 48,
                    fontSize: 16,
                    paddingLeft: 8,
                  },
                  placeholder: { color: "#888" },
                }}
                placeholder={{}}
              />
            </View>

            {/* Unidade de Vento */}
            <View style={styles.section}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Feather name="wind" size={18} color={textColor} />
                <Text style={[styles.label, { color: textColor }]}>
                  Unidade do Vento
                </Text>
              </View>
              <RNPickerSelect
                value={config.wind_unit}
                onValueChange={(value) => updateConfig({ wind_unit: value })}
                items={[
                  { label: "m/s", value: "m/s" },
                  { label: "km/h", value: "km/h" },
                  { label: "mph", value: "mph" },
                ]}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    color: textColor,
                    height: 48,
                    fontSize: 16,
                    paddingLeft: 8,
                  },
                  inputAndroid: {
                    color: textColor,
                    height: 48,
                    fontSize: 16,
                    paddingLeft: 8,
                  },
                  placeholder: { color: "#888" },
                }}
                placeholder={{}}
              />
            </View>
          </View>
        </ScrollView>
      </View>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 4,
  },
  profileButton: {
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
