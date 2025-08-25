import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';
import api from '../api/api';
import { useRouter } from "expo-router";
import getStyles from '../components/styles';
import { useTheme } from "../components/ThemeContext";

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dark } = useTheme();
  const styles = getStyles(dark);

  async function handleRegister() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users', { name, email, password });
      if (response.data.token && response.data.user) {
        Alert.alert('Sucesso', 'Cadastro realizado!');
        router.replace('index');
      } else {
        Alert.alert('Sucesso', 'Cadastro realizado!');
        router.replace('login');
      }
    } catch (e) {
      Alert.alert('Erro', `O ${email} já está em uso!`);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <View style={styles.registerFormWrapper}>
          
          {/* LOGO + TÍTULO IGUAL AO LOGIN */}
          <View style={styles.logoTitleContainer}>
            <Image source={require('../../app/assets/logo.png')} style={styles.logo} />
            <Text style={[styles.mainTitle, { color: dark ? "#ECEDEE" : "#003366"}]}>
              Windly
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={dark ? "#fff" : "#888"}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor={dark ? "#fff" : "#888"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={dark ? "#fff" : "#888"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.botao, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.botaoTexto}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('login')}>
            <Text style={styles.link}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
