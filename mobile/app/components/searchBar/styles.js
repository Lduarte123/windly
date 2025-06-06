import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    margin: Constants.statusBarHeight,
    alignSelf: 'center'
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: '#000',
  },
});
