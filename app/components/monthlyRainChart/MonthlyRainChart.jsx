import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-svg-charts';
import { G, Text as SvgText } from 'react-native-svg';
import api from '../../api/api';
import styles from '../dayCard/useHourlyStyles';

const CACHE_EXPIRATION_MS = 6 * 60 * 60 * 1000; // 6 horas

export default function MonthlyRainChart({ city }) {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || city === "Carregando...") {
      setLoading(false);
      return;
    }

    async function loadFromCache() {
      try {
        const cacheKey = `monthlyRain_${city}`;
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
            setData(data.values);
            setLabels(data.labels);
            setLoading(false);
            return true;
          }
        }
        return false;
      } catch {
        return false;
      }
    }

    async function fetchData() {
      setLoading(true);
      try {
        const res = await api.get(`/clima/monthly-precipitation?city=${city}`);
        if (res.data && Array.isArray(res.data)) {
          const valores = res.data.map(d => d.precipitation);
          const datas = res.data.map(d => {
            const dt = new Date(d.date);
            return `${dt.getDate()}/${dt.getMonth() + 1}`;
          });

          setData(valores);
          setLabels(datas);

          await AsyncStorage.setItem(
            `monthlyRain_${city}`,
            JSON.stringify({
              timestamp: Date.now(),
              data: { values: valores, labels: datas },
            })
          );
        } else {
          setError("Dados inválidos");
        }
      } catch (err) {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    (async () => {
      const fromCache = await loadFromCache();
      if (!fromCache) await fetchData();
    })();
  }, [city]);

  const Decorator = ({ x, y, data }) => (
    <G>
      {data.map((value, index) => (
        <SvgText
          key={index}
          x={x(index) + 10}
          y={y(value) - 8}
          fontSize={10}
          fill="#fff"
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {value}mm
        </SvgText>
      ))}
    </G>
  );

  const chartWidth = labels.length * 30;

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Carregando precipitação...</Text>
      </View>
    );
  }

  if (error) return null;
  if (data.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Precipitação (últimos 30 dias)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <BarChart
            style={{ height: 150, width: chartWidth }}
            data={data}
            svg={{ fill: '#00BFFF' }}
            contentInset={{ top: 20, bottom: 20 }}
            spacingInner={0.4}
            spacingOuter={0.2}
          >
            <Decorator />
          </BarChart>
          <View style={{ flexDirection: 'row', width: chartWidth, justifyContent: 'space-between', paddingTop: 8 }}>
            {labels.map((label, index) => (
              <Text key={index} style={styles.timeText}>
                {label}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
