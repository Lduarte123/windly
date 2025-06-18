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
      router.replace('cidades');
    }
  }, [user, authLoading]);

  async function handleLogin() {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      if (token && userData) {
        await login({ user: userData, token });
        Alert.alert('Bem-vindo!', `Olá, ${userData.name}`);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível fazer login.');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => router.replace('register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}