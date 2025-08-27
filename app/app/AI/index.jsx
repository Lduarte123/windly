import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AIAlerta from "../../components/AI-alerta/AI-alerta";
import { useTheme } from "../../components/ThemeContext";
import { Sparkles } from 'lucide-react-native'
import styles from "../../components/styles";

export default function AIScreen() {
  const { dark } = useTheme();
  const themeStyles = styles(dark);
  const textColor = dark ? "#ECEDEE" : "#11181C";
  
  return (
    <View style={[
      localStyles.container,
      { backgroundColor: dark ? '#151718' : '#f5f5f5' }
    ]}>
      <View style={themeStyles.cidadesHeader}>
        <Sparkles
          size={28}
          color="#2D6BFD"
          style={themeStyles.cidadesHeaderIcon}
        />
        <Text style={[themeStyles.cidadesHeaderTitle, { color: textColor, padding: 10}]}>
          Inteligência Artificial
        </Text>
      </View>
      <AIAlerta />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    alignItems: 'center',
  },
});