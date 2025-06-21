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
    margin: CARD_MARGIN,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
    position: "relative",
  },
  topLeft: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  titulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
    textAlign: "left",
  },
  desc: {
    fontSize: 11,
    color: "#e0f7fa",
    marginBottom: 6,
    textAlign: "left",
  },
  stats: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
    textAlign: "left",
  },
  iconWrapper: {
    position: "absolute",
    right: 10,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 34,
    color: "#fff",
  },
});