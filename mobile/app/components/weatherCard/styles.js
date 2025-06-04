import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: '#2784DF',
    margin: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  day: {
    color: '#fff',
    width: 70,
  },
  desc: {
    color: '#fff',
    flex: 1,
  },
  temp: {
    color: '#fff',
    fontWeight: '600',
  },
});
