import React from "react";
import styles from './styles';
import { View } from "react-native";

export default function MainSection({ children }) {
  return (
    <View
      style={styles.mainsection}
    >
      {children}
    </View>
  );
}
