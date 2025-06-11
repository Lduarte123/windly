import { StyleSheet } from "react-native";

const light = {
  background: "#fff",
  text: "#11181C",
};

const dark = {
  background: "#151718",
  text: "#ECEDEE",
};

export default function getStyles(isDark) {
  const theme = isDark ? dark : light;

  return StyleSheet.create({
    config: {
      width: "100%",
      height: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#2784DF",
      borderRadius: 5,
    },
    fontConfig: {
      color: "white",
      fontWeight: "bold",
      fontSize: 20,
      marginTop: 10,
    },
    container: {
      flex: 1,
    },
    whiteSection: {
      backgroundColor: "#fff",
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24,
      padding: 16,
      paddingBottom: 110,
    },
    cidadesContainer: {
      flex: 1,
      backgroundColor: "#F2F2F2",
      paddingTop: 24,
    },
    loading: {
      marginTop: 8,
    },
    erro: {
      color: "#E53935",
      alignSelf: "center",
      marginTop: 8,
    },
    scroll: {
      flex: 1,
      marginTop: 24,
      paddingBottom: 200,
    },
    titulo: {
      fontWeight: "bold",
      fontSize: 18,
      marginLeft: 24,
      marginBottom: 8,
    },
    vazio: {
      color: "#888",
      alignSelf: "center",
      marginTop: 32,
    },
    backContainer: {
      alignItems: "center",
      marginTop: 6,
      marginLeft: 12,
      backgroundColor: "#fff",
      width: 25, // Corrigido de string para número
      borderRadius: 100,
    },
    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 16,
    },
  });
}
