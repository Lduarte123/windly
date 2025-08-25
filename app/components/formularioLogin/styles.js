import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1E90FF', // Blue background similar to the design
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.85,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#1E90FF",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#666",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    backgroundColor: "white",
    color: "#000",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});