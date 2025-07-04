import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
    marginHorizontal: 0,
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  hourBlock: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    width: 70,
    height: 100,
  },
  wind: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#fff',
    marginTop: 6,
  },
});
