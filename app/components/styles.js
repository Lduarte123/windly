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
      backgroundColor: theme.background,
    },

    whiteSection: {
      backgroundColor: "white",
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
      marginTop: 100,
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
      width: 25,
      borderRadius: 100,
    },

    backButton: {
      position: "absolute",
      top: 50,
      left: 16,
      zIndex: 10,
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 6,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },

    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 16,
    },

    configContainer: {
      borderRadius: 12,
      padding: 20,
      gap: 24,
      marginTop: 40,
    },

    configTitle: {
      fontSize: 24,
      fontWeight: "bold",
    },

    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderRadius: 12,
      backgroundColor: isDark ? "#23272a" : "#fff",
      marginBottom: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },

    label: {
      fontSize: 18,
    },
    mainContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: "#ffffff",
    },
    mainTitle: {
      fontSize: 26,
      marginBottom: 24,
      textAlign: "center",
      color: "#003366",
      fontWeight: "600",
      marginTop: "50%"
    },

    input: {
      borderWidth: 1,
      borderColor: "#007bff",
      backgroundColor: "#f0f8ff",
      borderRadius: 10,
      padding: 12,
      marginBottom: 8,
      color: "#003366",
      width: 350,
      alignSelf: 'center',
    },
    link: {
      color: "#007bff",
      marginTop: 16,
      textAlign: "center",
      fontWeight: "500",
      borderRadius: 10,
    },
    botao: {
      backgroundColor: "#2784DF",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12,
      width: 350,
      alignSelf: 'center',
    },

    botaoTexto: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },

    errorModal: {
      position: "absolute",
      top: '30%',
      alignSelf: "center",
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 28,
      alignItems: "center",
      width: 320,
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      zIndex: 999,
    },
    errorModalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 6,
    },
    errorModalMessage: {
      fontSize: 15,
      textAlign: "center",
    },
    cidadesHeader: {
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "left",
      marginTop: 24,
    },
    cidadesHeaderIcon: {
      marginRight: 8,
    },
    cidadesHeaderTitle: {
      fontSize: 26,
      fontWeight: "bold",
    },
    cidadesScroll: {
      flex: 1,
      marginTop: 4,
      paddingBottom: 90,
      paddingHorizontal: 0,
    },
    cidadesVazio: {
      color: isDark ? "#ECEDEE" : "#888",
      fontSize: 18,
      marginTop: 48,
      alignSelf: "center",
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: isDark ? "#151718" : "#fff",
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 32,
      fontSize: 22,
      color: isDark ? "#ECEDEE" : "#11181C",
      fontWeight: "bold",
    },
    loadingGif: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: "#e0f7fa",
    },
    errorContainer: {
      flex: 1,
      backgroundColor: isDark ? "#151718" : "#fff",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    registerFormWrapper: {
      marginTop: "40%",
      paddingHorizontal: 24,
    },
    registerMainTitle: {
      fontSize: 26,
      marginBottom: 24,
      textAlign: "center",
      color: "#003366",
      fontWeight: "600",
    },
    registerInput: {
      borderWidth: 1,
      borderColor: "#007bff",
      backgroundColor: "#f0f8ff",
      borderRadius: 10,
      padding: 12,
      marginBottom: 8,
      color: "#003366",
      width: "100%",
      alignSelf: 'center',
    },
    registerLink: {
      color: "#007bff",
      marginTop: 16,
      textAlign: "center",
      fontWeight: "500",
      borderRadius: 10,
    },
    registerBotao: {
      backgroundColor: "#2784DF",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12,
      width: "100%",
      alignSelf: 'center',
    },
    registerBotaoTexto: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    editModalOverlay: {
      flex: 1,
      backgroundColor: "#0008",
      justifyContent: "center",
      alignItems: "center",
    },
    editModalContainer: {
      backgroundColor: isDark ? "#23272a" : "#fff",
      padding: 24,
      borderRadius: 12,
      width: "80%",
    },
    editModalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#ECEDEE" : "#003366",
      marginBottom: 12,
    },
    editModalInput: {
      borderWidth: 1,
      borderColor: "#2D6BFD",
      borderRadius: 8,
      padding: 10,
      marginBottom: 16,
      color: isDark ? "#ECEDEE" : "#003366",
      backgroundColor: isDark ? "#151718" : "#f0f8ff",
    },
    editModalError: {
      color: "#E53935",
      marginBottom: 8,
    },
    editModalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    editModalCancel: {
      color: "#888",
      marginRight: 16,
    },
    editModalSave: {
      color: "#2D6BFD",
      fontWeight: "bold",
    },
  });
}
