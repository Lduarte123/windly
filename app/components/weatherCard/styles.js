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
    alignSelf: 'center',
    width: 10,
    height: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2784DF',
    elevation: 2,
  },
  buttonToggle: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },

  buttonToggleText: {
    color: '#fff',
    fontSize: 16,
  },
});
