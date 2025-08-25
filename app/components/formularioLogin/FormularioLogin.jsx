import React, { useState } from "react";
import { Text, TextInput, View, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";

export default function FormularioLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
  if (!email || !senha) {
    Alert.alert("Erro", "Preencha todos os campos");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email:email, password: senha }),
    });

    if (response.ok) {
      const data = await response.json();
      Alert.alert("Sucesso", `Bem-vindo, ${data.name}!`);
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } else {
      const error = await response.json();
      Alert.alert("Erro", error.message || "Credenciais inválidas");
    }
  } catch (error) {
    Alert.alert("Erro", "Não foi possível conectar ao servidor");
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
