import React from "react";
import { View, StyleSheet } from "react-native";
import AIAlerta from "../../components/AI-alerta/AI-alerta";
import { useTheme } from "../../components/ThemeContext";

export default function AIScreen() {
  const { dark } = useTheme();
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: dark ? '#151718' : '#f5f5f5' }
    ]}>
      <AIAlerta />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});