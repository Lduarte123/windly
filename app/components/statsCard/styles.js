import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 5;
const CARDS_PER_ROW = 2;

const cardWidth = (width - CARD_MARGIN * 2 * CARDS_PER_ROW - 20) / CARDS_PER_ROW;

export default StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardWidth - 20,
    backgroundColor: "rgba(10, 10, 10, 0.2)",
    borderRadius: 18,
    marginBottom: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative",
    overflow: "hidden",
  },
  topLeft: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  titulo: {
    fontSize: 14,
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
