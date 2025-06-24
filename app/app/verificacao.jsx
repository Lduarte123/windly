import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
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
      const res = await api.post('/auth/verify-2fa', {
        email,
        code
      });

      const { token, user } = res.data;

      await login({ user, token });

      Alert.alert("✅ Sucesso", "Login autorizado");
      router.replace('/cidades');
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Código inválido ou expirado");
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <Text style={[styles.mainTitle, { color: dark ? "#ECEDEE" : "#003366" }]}>Verificação</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={code}
          onChangeText={setCode}
          placeholder="Código de 6 dígitos"
          placeholderTextColor={dark ? "#000" : "#888"}
        />

        <TouchableOpacity
          style={[styles.botao, loading && { opacity: 0.6 }]}
          onPress={verificarCodigo}
          disabled={loading}
        >
          <Text style={styles.botaoTexto}>
            {loading ? "Verificando..." : "Verificar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('login')}>
          <Text style={styles.link}>Voltar para login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
