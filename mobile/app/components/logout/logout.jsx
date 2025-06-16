import React, { useEffect } from "react";
import { View, Text, ImageBackground, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Aqui você pode limpar AsyncStorage, tokens, etc.
    setTimeout(() => {
      router.replace("/login");
    }, 1500);
  }, []);

  return (
    <ImageBackground style={styles.background} blurRadius={4}>
      <View style={styles.card}>
        <Text style={styles.title}>Saindo...</Text>
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      </View>
    </ImageBackground>
  );
}
