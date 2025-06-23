import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { useAuth } from '../components/authContext/AuthContext';
import { useRouter } from "expo-router";
import getStyles from '../components/styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const styles = getStyles(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/'); // ou 'cidades'
    }
  }, [user, authLoading]);

 async function handleLogin() {
  setLoading(true);
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // O backend só vai retornar uma mensagem tipo:
    // { message: "Código 2FA enviado por e-mail" }
    if (response.data.message.includes("Código")) {
      Alert.alert('Código enviado', response.data.message);

      // Envia o usuário para a tela de verificação passando o e-mail
      router.replace({
        pathname: '/verificacao',
        params: { email }
      });
    } else {
      Alert.alert('Erro', 'Resposta inesperada do servidor.');
    }
  } catch (e) {
    Alert.alert('Erro', e.response?.data?.error || 'Não foi possível fazer login.');
  }
  setLoading(false);
}

  return (
    <View style={styles.container}>
  <Text style={styles.mainTitle}>Entrar</Text>

  <TextInput
    style={styles.input}
    placeholder="E-mail"
    placeholderTextColor="#888"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
  />
  <TextInput
    style={styles.input}
    placeholder="Senha"
    placeholderTextColor="#888"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
  />

  <TouchableOpacity
    style={[styles.botao, loading && { opacity: 0.6 }]}
    onPress={handleLogin}
    disabled={loading}
  >
    <Text style={styles.botaoTexto}>
      {loading ? "Entrando..." : "Entrar"}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.replace('register')}>
    <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
  </TouchableOpacity>
</View>
  )
}