import React from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { useTheme } from "../../../components/ThemeContext";
import getStyles from "../../../components/styles";

export default function OutraTela() {
  const { dark, toggleTheme } = useTheme();
  const styles = getStyles(dark);
  const backgroundColor = dark ? '#151718' : '#fff';

  return (
    <ScrollView style={{ flex: 1, backgroundColor }}>
      <View style={styles.config}>
        <Text style={styles.fontConfig}>Configurações</Text>
        <Button
          title={dark ? "Usar tema claro" : "Usar tema escuro"}
          onPress={toggleTheme}
        />
      </View>
    </ScrollView>
  );
}