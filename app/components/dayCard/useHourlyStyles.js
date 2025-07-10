// components/dayCard/useHourlyStyles.js
import { StyleSheet } from 'react-native';

export default function useHourlyStyles({ isDark, backgroundColor, textColor }) {
  return StyleSheet.create({
    card: {
      backgroundColor: backgroundColor || 'rgba(10, 10, 10, 0.2)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
    },
    title: {
      color: textColor || '#FFFFFF',
      fontSize: 16,
      marginBottom: 16,
    },
    loading: {
      color: textColor || '#ccc',
      textAlign: 'center',
      padding: 20,
    },
    error: {
      color: '#ff5555',
      textAlign: 'center',
      padding: 20,
    },
    iconContainer: {
      alignItems: 'center',
      width: 48,
    },
    timeText: {
      fontSize: 10,
      color: textColor || "#ccc",
      marginTop: 4,
    },
  });
}
