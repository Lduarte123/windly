import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
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
        // await login({ user: response.data.user, token }); // descomente se usar login automático
        Alert.alert('Sucesso', 'Cadastro realizado!');
        router.replace('index');
      } else {
        setLoading(false);
        Alert.alert('Sucesso', 'Cadastro realizado!');
        router.replace('login');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Erro', `O ${email} já está em uso!`);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <View style={styles.registerFormWrapper}>
          <Text style={[styles.registerMainTitle, { color: dark ? "#ECEDEE" : "#003366" }]}>Cadastro</Text>

          <TextInput
            style={styles.registerInput}
            placeholder="Nome"
            placeholderTextColor={dark ? "#000" : "#888"}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.registerInput}
            placeholder="E-mail"
            placeholderTextColor={dark ? "#000" : "#888"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.registerInput}
            placeholder="Senha"
            placeholderTextColor={dark ? "#000" : "#888"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.registerBotao, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerBotaoTexto}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('login')}>
            <Text style={styles.registerLink}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}