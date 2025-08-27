import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useConfig } from '../configContext';

const AIAlerta = () => {
  const { dark } = useTheme();
  const { config } = useConfig();
  
  const { width, height } = Dimensions.get('window');
  const containerWidth = width - 32; // 16px de cada lado
  const containerHeight = height * 0.4; // 40% da altura da tela

  return (
    <View style={[
      styles.container,
      {
        width: containerWidth,
        height: containerHeight,
        backgroundColor: dark ? '#2a2a2a' : '#ffffff',
        borderColor: dark ? '#404040' : '#e0e0e0',
      }
    ]}>
      <Text style={styles.alertLabel}>Alerta</Text>
      <Text style={[
        styles.alertMessage,
        { color: dark ? '#87ceeb' : '#000080' }
      ]}>
        Por enquanto nenhum alerta
      </Text>
      <Text style={[
        styles.tempInfo,
        { color: dark ? '#cccccc' : '#666666' }
      ]}>
        Configurações: {config.temp_unit}° | {config.pressure_unit} | {config.wind_unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 80,
    elevation: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  alertLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  alertMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000080',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 28,
    marginBottom: 20,
  },
  tempInfo: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.8,
  },
});

export default AIAlerta;
