import React, { useState } from "react";
import { Text, TextInput, View, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";

export default function FormularioLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
// hgjkl
    if (email === "leo@gmail.com" && senha === "123") {
      Alert.alert("Sucesso", "Bem-vindes todes");
      setTimeout(() => {
        router.replace("/");
      }, 1000); // tempo em ms
    } else {
      Alert.alert("Erro", "Email ou senha incorretos");
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      blurRadius={4}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
