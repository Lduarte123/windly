import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";
import { useConfig } from "../configContext";
import apiAI from "../../api/apiAI";
import { getUserCity } from '../../api/getUserCity';
import api from '../../api/api';

const AIAlerta = () => {
  const { dark } = useTheme();
  const { config } = useConfig();

  const [alerta, setAlerta] = useState("");
  const [loading, setLoading] = useState(false);
  const [cidadeAtual, setCidadeAtual] = useState('');
  const [dadosClima, setDadosClima] = useState(null);
  const [erro, setErro] = useState('');

  const { width, height } = Dimensions.get("window");
  const containerWidth = width - 32;
  const containerHeight = height * 0.3;

  // Buscar cidade e dados climáticos
  const fetchAlerta = async () => {
    try {
      setLoading(true);
      setErro('');
      setAlerta('');

      // Pegar cidade
      let cidade = await getUserCity();
      if (!cidade) cidade = 'Localização não disponível';
      setCidadeAtual(cidade);

      // Buscar clima
      const climaResponse = await api.get(`/clima_atual/${encodeURIComponent(cidade)}`);
      const climaData = climaResponse.data;
      setDadosClima(climaData);
      console.log('Dados climáticos:', climaData);

      // Gerar alerta com a API AI
      if (climaData) {
        const alertaResposta = await apiAI.post("/alerta-clima", {
          cidade,
          dados_climaticos: climaData,
        });
        console.log('Resposta AI:', alertaResposta.data);
        setAlerta(alertaResposta.data?.alerta || "Nenhum alerta no momento.");
      } else {
        setAlerta("Dados climáticos não disponíveis.");
      }
    } catch (error) {
      console.error("Erro ao buscar alerta climático:", error.message);
      setErro("Erro ao carregar alerta climático.");
      setAlerta('');
    } finally {
      setLoading(false);
    }
  };

  const tentarNovamente = () => {
    fetchAlerta();
  };

  useEffect(() => {
    fetchAlerta();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          width: containerWidth,
          minHeight: containerHeight,
          backgroundColor: dark ? "#2a2a2a" : "#ffffff",
          borderColor: dark ? "#0077ffff" : "#0077ffff",
        },
      ]}
    >
      <Text style={[styles.title, { color: "#0077ffff" }]}>Alerta Climático</Text>

      {cidadeAtual && (
        <Text style={[styles.cidadeText, { color: "#0077ffff", fontSize: 13 }]}>
          {cidadeAtual}
        </Text>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D6BFD" />
          <Text style={[styles.loadingText, { color: dark ? "#cccccc" : "#666666" }]}>
            Carregando alerta...
          </Text>
        </View>
      ) : erro ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#ff6b6b' }]}>{erro}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={tentarNovamente}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.recomendacaoText, { color: dark ? "#ffff" : "#000" }]}>
          {alerta}
        </Text>
      )}

      {!erro && !loading && (
        <Text style={[styles.tempInfo, { color: dark ? "#cccccc" : "#666666" }]}>
          Configurações: {config.temp_unit}° | {config.pressure_unit} | {config.wind_unit}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0077ffff",
    position: "relative",
    marginBottom: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { position: "absolute", top: 16, left: 16, fontSize: 20 },
  cidadeText: { position: 'absolute', top: 16, right: 16, fontSize: 16 },
  loadingContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
  loadingText: { marginTop: 16, fontSize: 16, textAlign: "center" },
  errorContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 20 },
  errorText: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  retryButton: { backgroundColor: '#2D6BFD', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  recomendacaoText: { marginTop: 40, fontSize: 16, paddingHorizontal: 12, lineHeight: 24 },
  tempInfo: { fontSize: 14, fontWeight: "500", textAlign: "center", opacity: 0.8, marginTop: 12 },
});

export default AIAlerta;
