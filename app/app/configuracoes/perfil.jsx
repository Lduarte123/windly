// app/configuracoes/perfil.jsx
import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useAuth } from "../../components/authContext/AuthContext";
import { useTheme } from "../../components/ThemeContext";
import getStyles from "../../components/styles";
import UsuarioInfo from "../../components/UsuarioInfo/UsuarioInfo";
import { useRouter } from "expo-router";
import Feather from "react-native-vector-icons/Feather";

export default function Perfil() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const styles = getStyles(dark);
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const backgroundColor = dark ? "#151718" : "#fff";
  const router = useRouter();
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 12,
              padding: 4,
              borderRadius: 20,
              backgroundColor: dark ? "#23272a" : "#f1f1f1",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="arrow-left" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.configTitle, { color: textColor }]}>Perfil</Text>
        </View>

        <UsuarioInfo user={user} textColor={textColor} />
      </View>
    </ScrollView>
  );
}
