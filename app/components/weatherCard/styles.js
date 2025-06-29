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
  iconDay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    minWidth: 90,
  },
  day: {
    color: '#fff',
    fontSize: 15,
  },
  desc: {
    color: '#fff',
    flex: 1,
    fontSize: 15,
  },
  tempBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  tempBarText: {
    color: "#fff",
    fontSize: 12,
  },
  tempBar: {
    height: 8,
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: "#fff2",
    justifyContent: 'center',
  },
  tempBarGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
  tempBarMarker: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 16,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2784DF',
    elevation: 2,
  },
});
