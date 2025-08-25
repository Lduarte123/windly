// components/dayCard/dayCard.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { G, Text as SvgText } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { useConfig } from '../configContext';
import { useTheme } from '../ThemeContext';
import useHourlyStyles from './useHourlyStyles';
import { convertTemp } from '../../utils/convertTemp';

const CACHE_EXPIRATION_MS = 5 * 60 * 60 * 1000; // 5 horas

export default function HourlySlider({ city, overrideColors = {}, lineColor = "#FFB300" }) {
  const { config } = useConfig();
  const { dark } = useTheme();

  const styles = useHourlyStyles({
    isDark: dark,
    backgroundColor: overrideColors.background,
    textColor: overrideColors.text,
  });

  const [hourlyData, setHourlyData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || city === "Carregando...") {
      setLoading(false);
      return;
    }

    let fallbackData = null;

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
            return true;
          } else {
            fallbackData = cache.data;
          }
        }
        return false;
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
            await AsyncStorage.setItem(
              `hourlyData_${city}`,
              JSON.stringify({ data: dadosFiltrados, timestamp: Date.now() })
            );
          } else {
            setHourlyData([]);
            setError("Sem dados válidos");
          }
        } else {
          setHourlyData([]);
          setError("Resposta inválida");
        }
      } catch (err) {
        console.log("Erro ao carregar dados horários", err);
        if (fallbackData) {
          console.warn("Usando cache expirado como fallback.");
          setHourlyData(fallbackData);
          setError(null);
        } else {
          setHourlyData([]);
          setError("Erro ao carregar dados");
        }
      } finally {
        setLoading(false);
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
        <Text style={styles.loading}>Buscando informações do clima...</Text>
      </View>
    );
  }

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (hourlyData.length === 0) return null;

  const temps = hourlyData.map(item => item?.temp ?? 0);

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
      {data.map((value, index) => {
        const displayTemp = Math.round(convertTemp(value, config.temp_unit));

        return (
          <SvgText
            key={index}
            x={x(index)}
            y={y(value) - 10}
            fontSize={10}
            fill={overrideColors.text || '#fff'}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {displayTemp}°{config.temp_unit === 'C' ? 'C' : 'F'}
          </SvgText>
        );
      })}
    </G>
  );

  const chartWidth = 48 * temps.length;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Temperatura por hora ({config.temp_unit === 'F' ? '°F' : '°C'})
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View>
          <LineChart
            style={{ height: 150, width: chartWidth }}
            data={temps}
            svg={{ stroke: lineColor, strokeWidth: 3 }}
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
                <View key={index} style={styles.iconContainer}>
                  <MaterialCommunityIcons name={iconName} size={20} color={overrideColors.text || "#fff"} />
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
