import React from "react";
<<<<<<< HEAD:mobile/app/app/configuracoes/index.jsx
import { Button, ScrollView, Text, View } from "react-native";
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";

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
=======
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import styles from "../../../components/styles";
export default function App(){

    const [search, setSearch] = useState("");

    return(
        <ScrollView>
            <View style={styles.config}>
            <Text style={styles.fontConfig}>Configurações</Text>
            </View>

            <View style={styles.listConfig}>

            </View>
        </ScrollView>
        
    )
>>>>>>> s-dev:mobile/app/app/(tabs)/configuracoes/index.jsx
}