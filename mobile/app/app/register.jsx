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
    setLoading(true);
    try {
      await api.post('/users', { name, email, password });
      setLoading(false);
      Alert.alert('Sucesso', 'Cadastro realizado!');
      router.replace('Login');
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
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
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
        <Button
          title={loading ? "Cadastrando..." : "Cadastrar"}
          onPress={handleRegister}
          disabled={loading}
        />
        <TouchableOpacity onPress={() => router.replace('login')}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}