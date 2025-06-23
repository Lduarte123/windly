import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.85,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.94)",
    backdropFilter: "blur(10px)", // apenas web
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  title: {
    fontSize: 28,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#ccc",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#000",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4fc3f7",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
