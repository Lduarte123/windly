import React, { useState, useEffect } from "react";
import useLogout from "../logout";
import { ScrollView, Text, View, Switch, TouchableOpacity, Alert, Platform, Modal, TextInput } from "react-native";
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from '../../components/authContext/AuthContext';
import { useRouter } from "expo-router"; // Adicione esta linha
import RNPickerSelect from "react-native-picker-select";
import { useConfig } from "../../components/configContext";
import api from "../../api/api"; // ajuste o caminho conforme seu projeto

export default function Configuracoes() {
  const { dark, toggleTheme } = useTheme();
  const styles = getStyles(dark);
  const logout = useLogout();
  const { user, setUser } = useAuth(); // Pega o usuário logado
  const router = useRouter(); // Para navegação
  const { config, setConfig } = useConfig();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      if (user?.id) {
        try {
          const res = await api.get(`/user-config/${user.id}`);
          setConfig(res.data);
        } catch (e) {
          // Se não existir, pode criar aqui se quiser
        }
      }
    }
    fetchConfig();
  }, [user?.id]);

  const backgroundColor = dark ? "#151718" : "#fff";
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const cardBackground = dark ? "#1F2223" : "#F1F1F1";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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

  const handleSalvarNome = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/users/${user.id}`, { name: novoNome, email: user.email });
      setUser(res.data); // <-- Atualiza com o retorno do backend!
      setEditModalVisible(false);
      Alert.alert("Sucesso", "Nome atualizado!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
    setLoading(false);
  };

  const handleExcluirConta = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/users/${user.id}`);
              logout();
            } catch (e) {
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }} // <-- paddingBottom maior
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.configContainer}>
        <Text
          style={[styles.configTitle, { color: textColor, marginBottom: 20 }]}
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
          </View>
        )}

        {/* Privacidade */}
        <TouchableOpacity style={styles.section} onPress={handlePrivacy}>
          <Text style={[styles.label, { color: textColor }]}>Privacidade</Text>
          <Text style={{ color: "#2D6BFD", fontWeight: "600" }}>Ver</Text>
        </TouchableOpacity>

        {/* Unidade de Temperatura */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: textColor }]}>Temperatura</Text>
          <RNPickerSelect
            value={config.temp_unit}
            onValueChange={value => updateConfig({ temp_unit: value })}
            items={[
              { label: "Celsius (°C)", value: "C" },
              { label: "Fahrenheit (°F)", value: "F" }
            ]}
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: { color: textColor, height: 48, fontSize: 16, paddingLeft: 8 },
              inputAndroid: { color: textColor, height: 48, fontSize: 16, paddingLeft: 8 },
              placeholder: { color: "#888" }
            }}
            placeholder={{}}
          />
        </View>

        {/* Unidade de Vento */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: textColor }]}>Unidade do Vento</Text>
          <RNPickerSelect
            value={config.wind_unit}
            onValueChange={value => updateConfig({ wind_unit: value })}
            items={[
              { label: "m/s", value: "m/s" },
              { label: "km/h", value: "km/h" },
              { label: "mph", value: "mph" }
            ]}
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: { color: textColor, height: 48, fontSize: 16, paddingLeft: 8 },
              inputAndroid: { color: textColor, height: 48, fontSize: 16, paddingLeft: 8 },
              placeholder: { color: "#888" }
            }}
            placeholder={{}}
          />
        </View>

        {/* Informações do Usuário */}
        {!user ? (
          <TouchableOpacity
            style={styles.section}
            onPress={() => router.replace("login")}
          >
            <Text style={[styles.label, { color: textColor }]}>Entrar</Text>
            <Text style={{ color: "#2D6BFD", fontWeight: "600" }}>Login</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.section, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
            <View>
              <Text style={[styles.label, { color: textColor, fontSize: 16 }]}>Usuário</Text>
              <Text style={{ color: textColor, fontSize: 18, fontWeight: "bold" }}>{user?.name}</Text>
              <Text style={{ color: "#888", fontSize: 14 }}>{user?.email}</Text>
            </View>
            <TouchableOpacity onPress={() => { setNovoNome(user.name); setEditModalVisible(true); }}>
              <Feather name="edit-2" size={20} color="#2D6BFD" />
            </TouchableOpacity>
          </View>
        )}

        {/* Modal para edição de nome */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.editModalOverlay}>
            <View style={styles.editModalContainer}>
              <Text style={styles.editModalTitle}>Editar nome</Text>
              <TextInput
                style={styles.editModalInput}
                value={novoNome}
                onChangeText={setNovoNome}
                placeholder="Novo nome"
                placeholderTextColor={dark ? "#ECEDEE" : "#888"}
              />

              {/* Botões de Excluir e Logout, alinhados à direita e mais acima */}
              <View style={styles.editModalTopActions}>
                <TouchableOpacity style={styles.editModalIconButton} onPress={handleExcluirConta}>
                  <Feather name="trash-2" size={22} color="#E53935" />
                  <Text style={styles.editModalIconText}>Excluir conta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editModalIconButton} onPress={logout}>
                  <Feather name="log-out" size={22} color="#E53935" />
                  <Text style={styles.editModalIconText}>Logout</Text>
                </TouchableOpacity>
              </View>

              {/* Botões de Salvar e Cancelar, em destaque na base */}
              <View style={styles.editModalActions}>
                <TouchableOpacity
                  style={[styles.editModalActionButton, styles.editModalCancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.editModalCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editModalActionButton, styles.editModalSaveButton]}
                  onPress={async () => {
                    setLoading(true);
                    try {
                      await api.put(`/users/${user.id}`, { name: novoNome, email: user.email });
                      setUser({ ...user, name: novoNome });
                      setEditModalVisible(false);
                      Alert.alert("Sucesso", "Nome atualizado!");
                    } catch (e) {
                      Alert.alert("Erro", "Não foi possível atualizar o nome.");
                    }
                    setLoading(false);
                  }}
                  disabled={loading}
                >
                  <Text style={styles.editModalSave}>{loading ? "Salvando..." : "Salvar"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
