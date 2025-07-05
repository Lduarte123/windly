import { StyleSheet } from "react-native";

const light = {
  background: "#EAF6FF",    // Céu claro
  text: "#11181C",
  card: "#FFFFFF",          // Cartão branco
  accent: "#2784DF",        // Azul principal
  border: "#D6EAF8",
};

const dark = {
  background: "#0E1B2C",    // Céu noite
  text: "#ECEDEE",
  card: "#152B40",          // Cartão noite
  accent: "#6EB5FF",        // Azul neon
  border: "#223B56",
};

export default function getStyles(isDark) {
  const theme = isDark ? dark : light;

  return StyleSheet.create({
    config: {
      width: "100%",
      height: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accent,
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
      backgroundColor: isDark ? "#23272a" : "#fff",
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
      borderRadius: 16,
      padding: 20,
      gap: 24,
      marginTop: 40,
    },

    configTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.accent,
      letterSpacing: 0.5,
    },

    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderRadius: 16,
      backgroundColor: theme.card,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },

    label: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 6,
      letterSpacing: 0.3,
    },

    userName: {
      color: theme.text,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 2,
      letterSpacing: 0.5,
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
      marginBottom: 100,
      textAlign: "center",
      color: "#003366",
      fontWeight: "600",
      marginTop: "50%",
      
    },
    input: {
      borderWidth: 0,
      borderColor: "#007bff",
      backgroundColor: isDark ? "#404040" : "#f0f0f0",
      borderRadius: 5,
      padding: 12,
      marginBottom: 12,
      color: "#003366",
      width: 350,
      alignSelf: 'center',
      margin:5,
      
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

    userEmail: {
      color: isDark ? "#A0A8B7" : "#666",
      fontSize: 15,
      fontWeight: "400",
    },

    editButton: {
      padding: 8,
      borderRadius: 24,
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },

    // Modal overlay para escurecer fundo e centralizar modal
    editModalOverlay: {
      flex: 1,
      backgroundColor: "#0009",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },

    // Container do modal
    editModalContainer: {
      backgroundColor: isDark ? "#1E2A40" : "#fff",
      borderRadius: 16,
      width: "100%",
      maxWidth: 360,
      paddingVertical: 28,
      paddingHorizontal: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 10,
    },

    editModalTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? "#E1E6F0" : "#003366",
      marginBottom: 16,
      textAlign: "center",
      letterSpacing: 0.4,
    },

    editModalInput: {
      borderWidth: 1.5,
      borderColor: theme.accent,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 24,
      fontSize: 18,
      color: isDark ? "#ECEDEE" : "#003366",
      backgroundColor: isDark ? "#15202B" : "#F0F8FF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },

    editModalTopActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
      paddingHorizontal: 8,
    },

    editModalIconButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: "transparent",
    },

    editModalIconText: {
      color: "#E53935",
      fontWeight: "700",
      marginLeft: 10,
      fontSize: 16,
    },

    editModalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 20,
    },

    editModalActionButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 16,
      borderRadius: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    },

    editModalCancelButton: {
      backgroundColor: isDark ? "#394B67" : "#ECEDEE",
    },

    editModalSaveButton: {
      backgroundColor: theme.accent,
    },

    editModalCancel: {
      color: isDark ? "#B0B8C1" : "#888",
      fontWeight: "700",
      fontSize: 17,
    },

    editModalSave: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 17,
    },

    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
    },

    backgroundOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    logo: {
  width: 80,
  height: 100,
  resizeMode: 'contain',
    },

logoTitleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  marginTop: '50%',
  left: "25%",
  marginBottom: 40,
},

mainTitle: {
  fontSize: 26,
  fontWeight: "600",
},


    
  });
}
