// app/configuracoes/index.jsx
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import RNPickerSelect from "react-native-picker-select";

import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";
import { useAuth } from "../../components/authContext/AuthContext";
import { useConfig } from "../../components/configContext";
import api from "../../api/api";

export default function Configuracoes() {
  const { dark, toggleTheme } = useTheme();
  const styles = getStyles(dark);
  const { user } = useAuth();
  const router = useRouter();
  const { config, setConfig } = useConfig();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const showAlert = (message) => {
    if (Platform.OS === "web") window.alert(message);
    else Alert.alert(message);
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    showAlert(newValue ? "Notificações ativadas" : "Notificações desativadas");
  };

  const updateConfig = (newConfig) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      if (user?.id) api.put(`/user-config/${user.id}`, updated).catch(() => {});
      return updated;
    });
  };

  return (
    <>
      {/* Stack sem header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Conteúdo da tela */}
      <View style={{ flex: 1, backgroundColor }}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header interno */}
          <View style={localStyles.headerRow}>
            <Text style={[styles.configTitle, { color: textColor }]}>
              Configurações
            </Text>
            <TouchableOpacity
              style={localStyles.profileButton}
              onPress={() => {
                if (!user) router.push("/login");
                else router.push("/configuracoes/perfil");
              }}
            >
              <Feather name="user" size={26} color="#2D6BFD" />
            </TouchableOpacity>
          </View>

          {/* Tema Escuro */}
          <View style={styles.section}>
            <View style={localStyles.row}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Feather name="moon" size={18} color={textColor} />
                <Text style={[styles.label, { color: textColor }]}>Tema escuro</Text>
              </View>
              <Switch
                value={dark}
                onValueChange={toggleTheme}
                thumbColor={dark ? "#2D6BFD" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#2D6BFD" }}
              />
            </View>
          </View>

          {/* Notificações */}
          <View style={styles.section}>
            <View style={localStyles.row}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Feather name="bell" size={18} color={textColor} />
                <Text style={[styles.label, { color: textColor }]}>Notificações</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                thumbColor={notificationsEnabled ? "#2D6BFD" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#2D6BFD" }}
              />
            </View>
          </View>

          {/* Divisor */}
          <View
            style={{
              height: 1,
              backgroundColor: dark ? "#333" : "#DDD",
              marginVertical: 16,
            }}
          />

          {/* Sobre */}
          <TouchableOpacity
            style={styles.section}
            onPress={() => router.push("/configuracoes/sobre")}
          >
            <View style={localStyles.row}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Feather name="info" size={18} color={textColor} />
                <Text style={[styles.label, { color: textColor }]}>Sobre</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#888" />
            </View>
          </TouchableOpacity>

          {/* Privacidade */}
          <TouchableOpacity
            style={styles.section}
            onPress={() => router.push("/configuracoes/privacidade")}
          >
            <View style={localStyles.row}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Feather name="lock" size={18} color={textColor} />
                <Text style={[styles.label, { color: textColor }]}>Privacidade</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#888" />
            </View>
          </TouchableOpacity>

          {/* Configurações adicionais */}
          {/* Temperatura */}
          <View style={styles.section}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Feather name="thermometer" size={18} color={textColor} />
              <Text style={[styles.label, { color: textColor }]}>Temperatura</Text>
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
                  backgroundColor: dark ? "#1E1F22" : "#F5F5F5",
                  borderRadius: 12,
                },
                inputAndroid: {
                  color: textColor,
                  height: 48,
                  fontSize: 16,
                  paddingLeft: 8,
                  backgroundColor: dark ? "#1E1F22" : "#F5F5F5",
                  borderRadius: 12,
                },
                placeholder: { color: "#888" },
              }}
              placeholder={{}}
            />
          </View>

          {/* Unidade do Vento */}
          <View style={styles.section}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Feather name="wind" size={18} color={textColor} />
              <Text style={[styles.label, { color: textColor }]}>Unidade do Vento</Text>
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
                  backgroundColor: dark ? "#1E1F22" : "#F5F5F5",
                  borderRadius: 12,
                },
                inputAndroid: {
                  color: textColor,
                  height: 48,
                  fontSize: 16,
                  paddingLeft: 8,
                  backgroundColor: dark ? "#1E1F22" : "#F5F5F5",
                  borderRadius: 12,
                },
                placeholder: { color: "#888" },
              }}
              placeholder={{}}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop:50
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
});
