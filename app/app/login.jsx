<<<<<<< HEAD:app/app/login.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import api from '../api/api';
import { useAuth } from '../components/authContext/AuthContext';
import { useRouter } from "expo-router";
import getStyles from '../components/styles';
import { useTheme } from "../components/ThemeContext";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { dark } = useTheme();
  const styles = getStyles(dark);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading]);

  async function handleLogin() {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.message.includes("Código")) {
        Alert.alert('Código enviado', response.data.message);
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

      {/* LOGO + TÍTULO LADO A LADO */}
      <View style={styles.logoTitleContainer}>
        <Image source={require('../../app/assets/logo.png')} style={styles.logo} />
        <Text style={[styles.mainTitle, { color: dark ? "#ECEDEE" : "#003366", marginLeft: 12 }]}>
          Windly
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          { color: dark ? "#fff" : "#11181C" } // cor do texto digitado
        ]}
        placeholder="E-mail"
        placeholderTextColor={dark ? "#fff" : "#888"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { color: dark ? "#fff" : "#11181C" } // cor do texto digitado
        ]}
        placeholder="Senha"
        placeholderTextColor={dark ? "#fff" : "#888"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.botao, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={[styles.botaoTexto, { color: dark ? "#ffff" : "#003366" }]}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}