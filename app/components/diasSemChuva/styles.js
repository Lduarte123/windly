import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#fff",      // Fundo branco do card
    borderRadius: 12,             // Bordas arredondadas
    padding: 18,                  // Espaçamento interno
    shadowColor: "#000",          // Sombra para Android/iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,                 // Sombra para Android
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#2784DF",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2784DF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#2784DF",
  },
  label: {
    color: "#2784DF",
    fontWeight: "bold",
  },
  labelChecked: {
    color: "#fff",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#2784DF",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});