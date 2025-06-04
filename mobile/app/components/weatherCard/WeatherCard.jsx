import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './styles';

export default function WeatherCard() {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hoje = new Date();
  const terceiroDiaIndex = (hoje.getDay() + 2) % 7;
  const terceiroDiaNome = diasSemana[terceiroDiaIndex];

  const forecast = [
    { day: 'Hoje', description: 'Céu limpo', max: 37, min: 28, icon: '☀️' },
    { day: 'Amanhã', description: 'Trovoada', max: 35, min: 28, icon: '🌩️' },
    { day: terceiroDiaNome, description: 'Nublado', max: 35, min: 28, icon: '⛅' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Previsões</Text>
      {forecast.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.day}>{item.day}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.temp}>{item.max}° / {item.min}°</Text>
        </View>
      ))}
    </View>
  );
}

