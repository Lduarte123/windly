import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_PADDING = 16;
const CARDS_PER_ROW = 2;

const cardWidth = (width - CARD_PADDING * 2 - CARD_MARGIN * 2 * CARDS_PER_ROW) / CARDS_PER_ROW;

export default StyleSheet.create({
  container: {
    width: cardWidth,
    height: 120,
    backgroundColor: "#2784DF",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    margin: CARD_MARGIN,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  icon: {
    fontSize: 26,
    marginBottom: 4,
    color: "#fff",
  },
  titulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  desc: {
    fontSize: 11,
    color: "#e0f7fa",
    marginBottom: 4,
    textAlign: "center",
  },
  stats: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});