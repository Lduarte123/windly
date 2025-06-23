import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { useRouter } from "expo-router";
import getStyles from '../components/styles'; // <== FUNÇÃO!

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const styles = getStyles(false); // false = tema claro

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
        await login({ user: response.data.user, token });
        Alert.alert('Sucesso', 'Cadastro realizado!');
        router.replace('index'); // ou 'cidades', se preferir
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
     
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
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
  );
}