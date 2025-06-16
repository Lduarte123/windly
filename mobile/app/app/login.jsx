import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login</Text>
      {/* Seu formulário aqui */}
      <Button title="Ir para cadastro" onPress={() => router.push("/cadastro")} />
    </View>
  );
}