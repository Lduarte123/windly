import { StyleSheet, Dimensions } from "react-native";
import Constants from 'expo-constants';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    minHeight: height * 0.35,
    paddingTop: Constants.statusBarHeight,
  },
  mainsaction: {
    color: 'transparent',
  }
});