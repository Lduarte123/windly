import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../components/authContext/AuthContext';
import api from '../api/api';
import getStyles from '../components/styles';
import { useTheme } from "../components/ThemeContext";

export default function Verificacao() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { dark } = useTheme();
  const styles = getStyles(dark);

  const verificarCodigo = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-2fa', { email, code });

      const { token, user } = res.data;
      await login({ user, token });

      Alert.alert("👋 Seja bem-vindo", `Olá, ${user.name}!`);
      router.replace('/');
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Código inválido ou expirado");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <View style={[styles.registerFormWrapper, { alignItems: "center" }]}>
          {/* TÍTULO PRINCIPAL */}
          <View style={{ marginBottom: 30, alignItems: "center" }}>
            <Text style={[styles.mainTitle, { color: dark ? "#ECEDEE" : "#003366", fontSize: 28 }]}>
              Windly
            </Text>
            <Text style={{ fontSize: 18, color: dark ? "#ECEDEE" : "#555", marginTop: 5 }}>
              Verifique sua conta
            </Text>
          </View>

          {/* INPUT DE CÓDIGO */}
          <TextInput
            style={[styles.input, { textAlign: "center" }]}
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
            placeholder="Código de 6 dígitos"
            placeholderTextColor={dark ? "#fff" : "#888"}
          />

          {/* BOTÃO DE VERIFICAR */}
          <TouchableOpacity
            style={[styles.botao, { marginTop: 20 }, loading && { opacity: 0.6 }]}
            onPress={verificarCodigo}
            disabled={loading}
          >
            <Text style={styles.botaoTexto}>
              {loading ? "Verificando..." : "Verificar"}
            </Text>
          </TouchableOpacity>

          {/* VOLTAR PARA LOGIN */}
          <TouchableOpacity onPress={() => router.replace('login')} style={{ marginTop: 20 }}>
            <Text style={[styles.link, { textAlign: "center" }]}>
              Voltar para login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
