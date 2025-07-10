import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 10, 0.2)",
    borderRadius: 12,             // Bordas arredondadas
    padding: 18,                  // Espaçamento interno              // Sombra para Android
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#ffffff",
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: "#fff",
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