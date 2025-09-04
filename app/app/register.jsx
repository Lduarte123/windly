import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

    if (!name.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos para continuar!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users', { name, email, password });
      Alert.alert('Sucesso', 'Cadastro realizado!');
      router.replace(response.data.token && response.data.user ? 'index' : 'login');
    } catch (e) {
      Alert.alert('Erro', `O ${email} já está em uso!`);
    }
    setLoading(false);
  }

  return (
    <View style={[styles.login1container, { flex: 1 }]}>
      <View style={styles.logoTitleContainer}>
        <View style={styles.rowText}>
          <Text style={styles.login2Text}>Junte-se ao,</Text>
          <Text style={[styles.mainTitle]}>Windly.</Text>
          <Text style={styles.login3Text}>Acompanhe o clima em qualquer lugar!</Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          justifyContent: 'flex-start',
        }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 100 : 80}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.loginForm]}>
          <TextInput
            style={[styles.input, { color: dark ? "#fff" : "#11181C", marginBottom: 15 }]}
            placeholder="Nome"
            placeholderTextColor={dark ? "#fff" : "#888"}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, { color: dark ? "#fff" : "#11181C", marginBottom: 15 }]}
            placeholder="E-mail"
            placeholderTextColor={dark ? "#fff" : "#888"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, { color: dark ? "#fff" : "#11181C", marginBottom: 15 }]}
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
      </KeyboardAwareScrollView>
    </View>
  );
}
