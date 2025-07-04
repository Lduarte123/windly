import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { G, Text as SvgText } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { scaleBand } from 'd3-scale';
import api from '../../api/api';
import { useConfig } from "../configContext";
import styles from './styles';

const CACHE_EXPIRATION_MS = 5 * 60 * 60 * 1000; // 5 horas

export default function HourlySlider({ city, onLoaded = () => {} }) {
  const { config } = useConfig();
  const [hourlyData, setHourlyData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || city === "Carregando...") {
      onLoaded();
      setLoading(false);
      return;
    }

    async function loadFromCache() {
      try {
        const cacheKey = `hourlyData_${city}`;
        const cacheRaw = await AsyncStorage.getItem(cacheKey);
        if (cacheRaw) {
          const cache = JSON.parse(cacheRaw);
          const now = Date.now();
          if (now - cache.timestamp < CACHE_EXPIRATION_MS) {
            setHourlyData(cache.data);
            setLoading(false);
            onLoaded();
            return true; // cache válido
          }
        }
        return false; // cache inválido ou inexistente
      } catch {
        return false;
      }
    }

    async function fetchHourly() {
      setLoading(true);
      try {
        const res = await api.get(`/clima/hourly-weather?city=${city}`);
        if (res.data && Array.isArray(res.data)) {
          const dadosFiltrados = res.data.slice(0, 24);
          const hasValidData = dadosFiltrados.some(item => typeof item.temp === 'number');
          if (hasValidData) {
            setHourlyData(dadosFiltrados);
            setError(null);
            // salva no cache
            await AsyncStorage.setItem(
              `hourlyData_${city}`,
              JSON.stringify({ data: dadosFiltrados, timestamp: Date.now() })
            );
          } else {
            setHourlyData([]);
            setError(null);
          }
        } else {
          setHourlyData([]);
          setError(null);
        }
      } catch (err) {
        console.log("Erro ao carregar dados horários", err);
        setError(null);
        setHourlyData([]);
      } finally {
        setLoading(false);
        onLoaded();
      }
    }

    (async () => {
      const loadedFromCache = await loadFromCache();
      if (!loadedFromCache) {
        await fetchHourly();
      }
    })();

  }, [city]);

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Carregando temperaturas...</Text>
      </View>
    );
  }

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (hourlyData.length === 0) return null;

  const temps = hourlyData.map(item => {
    const temp = Math.round(item?.temp || 0);
    return isNaN(temp) ? 0 : temp;
  });

  const labels = hourlyData.map(item => {
    try {
      const date = new Date(item.datetime);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Fortaleza"
      });
    } catch {
      return "00:00";
    }
  });

  const Decorator = ({ x, y, data }) => (
    <G>
      {data.map((value, index) => (
        <SvgText
          key={index}
          x={x(index)}
          y={y(value) - 10}
          fontSize={10}
          fill="#fff"
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {value}°
        </SvgText>
      ))}
    </G>
  );

  const chartWidth = 48 * temps.length;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Temperatura por hora</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View>
          <LineChart
            style={{ height: 150, width: chartWidth }}
            data={temps}
            svg={{ stroke: '#FFB300', strokeWidth: 3 }}
            contentInset={{ top: 30, bottom: 40, left: 20, right: 20 }}
            curve={shape.curveNatural}
          >
            <Decorator />
          </LineChart>
          <View
            style={{
              flexDirection: 'row',
              width: chartWidth,
              justifyContent: 'space-between',
              paddingTop: 8,
            }}
          >
            {hourlyData.map((item, index) => {
              const cond = item.conditions?.toLowerCase() || '';
              let iconName = "weather-partly-cloudy";

              if (cond.includes("rain")) iconName = "weather-rainy";
              else if (cond.includes("clear")) iconName = "weather-sunny";
              else if (cond.includes("cloud") && !cond.includes("partially")) iconName = "weather-cloudy";
              else if (cond.includes("partially")) iconName = "weather-partly-cloudy";
              else if (cond.includes("thunderstorm")) iconName = "weather-lightning";

              const hour = labels[index];

              return (
                <View key={index} style={{ alignItems: 'center', width: 48 }}>
                  <MaterialCommunityIcons name={iconName} size={20} color="#fff" />
                  <Text style={styles.timeText}>{hour}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
