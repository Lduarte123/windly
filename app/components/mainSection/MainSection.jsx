import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

export default function MainSection({ children }) {
  return (
    <LinearGradient
      colors={['#2D6BFD', '#229BC3']}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}
