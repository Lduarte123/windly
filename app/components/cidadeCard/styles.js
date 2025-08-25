import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: "#EEEEEE",
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardTime: {
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardWeather: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardTemp: {
    fontSize: 24,
    color: "#FFFFFF",
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  icon: {
    marginRight: 16,
  },
  cardError: {
    color: "#F66",
    marginTop: 4,
    fontSize: 14,
  },
});
