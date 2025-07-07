import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';

const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 horas

export default function PrecipitationProbabilityCard({ city }) {
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [scale] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!city || city === "Carregando...") {
      setLoading(false);
      return;
    }

    async function loadFromCache() {
      try {
        const cached = await AsyncStorage.getItem(`precipProb_${city}`);
        if (cached) {
          const { timestamp, value } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setProbability(value);
            setLoading(false);
            return true;
          }
        }
        return false;
      } catch {
        return false;
      }
    }

    async function fetchProbability() {
      setLoading(true);
      try {
        const res = await api.get(`/clima/precipitation-probability?city=${city}`);
        if (res.data?.precipProbability !== undefined) {
          const value = parseFloat(res.data.precipProbability.toFixed(1));
          setProbability(value);
          await AsyncStorage.setItem(
            `precipProb_${city}`,
            JSON.stringify({ timestamp: Date.now(), value })
          );
        } else {
          setErro("Dados inválidos.");
        }
      } catch (err) {
        console.log("Erro:", err);
        setErro("Erro ao carregar probabilidade.");
      } finally {
        setLoading(false);
      }
    }

    (async () => {
      const fromCache = await loadFromCache();
      if (!fromCache) await fetchProbability();
    })();
  }, [city]);

  useEffect(() => {
    if (probability !== null) {
      Animated.timing(scale, {
        toValue: probability / 100,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
    }
  }, [probability]);

  if (loading) return null;
  if (erro || probability === null) {
    return <Text style={styles.error}>{erro}</Text>;
  }

  const fillWidth = scale.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="weather-pouring" size={24} color="#fff" />
        <Text style={styles.title}>Probabilidade de chuva</Text>
      </View>

      <Text style={styles.valueText}>{probability}%</Text>

      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { width: fillWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 60, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  valueText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  barBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#42A5F5',
  },
  error: {
    color: '#ff5555',
    textAlign: 'center',
    padding: 20,
  },
});
