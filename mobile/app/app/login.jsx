import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { useAuth } from '../components/authContext/AuthContext';
import { useRouter } from "expo-router";
import getStyles from '../components/styles'; // <== FUNÇÃO!

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();
  
  const styles = getStyles(false); // aqui você define se é modo escuro ou claro

  useEffect(() => {
    if (user) {
      router.replace('index');
    }
  }, [user]);

  async function handleLogin() {
    setLoading(true);
    try {
      const response = await api.get(`/users?email=${email}`);
      const users = response.data;
      const userData = Array.isArray(users) ? users[0] : users;
      if (userData && userData.password === password) {
        await login(userData);
        Alert.alert('Bem-vindo!', `Olá, ${userData.name}`);
      } else {
        Alert.alert('Erro', 'E-mail ou senha inválidos.');
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
