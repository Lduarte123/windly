import React from "react";
import { View, ScrollView, Text, Platform, StatusBar } from "react-native";
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";

export default function MapaMeteorologico() {
  const { dark } = useTheme();
  const styles = getStyles(dark);
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const backgroundColor = dark ? "#151718" : "#fff";
  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{
        padding: 16,
        paddingTop: statusBarHeight + 16,
        paddingBottom: 80,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.configContainer}>
        <Text style={[styles.configTitle, { color: textColor }]}>
          Mapa Meteorológico
        </Text>
        {/* Conteúdo do mapa meteorológico aqui */}
      </View>
    </ScrollView>
  );
}