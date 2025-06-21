import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginTop: '10%',
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    flexDirection: 'coloumn',
    alignItems: 'center',
    justifyContent: 'center',
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  temp: {
    fontSize: 62,
    color: '#fff',
    marginVertical: 8,
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  brand: {
    fontSize: 14,
    color: '#b0c4de',
    letterSpacing: 2,
    marginTop: 8,
  },
  dateTime: {
    color: '#f1f1f1',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 2,
  },
});