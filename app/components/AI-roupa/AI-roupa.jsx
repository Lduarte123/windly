import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useConfig } from '../configContext';
import Constants from 'expo-constants';
import { getUserCity } from '../../api/getUserCity';
import api from '../../api/api';

const AIRoupa = () => {
  const { dark } = useTheme();
  const { config } = useConfig();
  const [loading, setLoading] = useState(false);
  const [recomendacao, setRecomendacao] = useState('');
  const [erro, setErro] = useState('');
  const [cidadeAtual, setCidadeAtual] = useState('');
  const [dadosClima, setDadosClima] = useState(null);

  const { width, height } = Dimensions.get('window');
  const containerWidth = width - 32; // 16px de cada lado
  const containerHeight = height * 0.3; // 30% da altura da tela (menor que o AI-alerta)

  const GEMINI_API_KEY = Constants?.expoConfig?.extra?.GEMINI_API_KEY;


  // Buscar cidade atual e dados do clima
  const buscarDadosCidade = async () => {
    try {
      setLoading(true);

      const cidade = await getUserCity();
      setCidadeAtual(cidade);

      const response = await api.get(`/clima_atual/${cidade}`);
      setDadosClima(response.data);
      console.log(response.data)

      // Use os dados do clima diretamente do response, não do state
      const recomendacaoResposta = await gerarRecomendacaoRoupa(cidade, response.data);
      setRecomendacao(recomendacaoResposta?.analise || '')
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
      setErro('Erro ao obter localização');
      setCidadeAtual('Localização não disponível');
    } finally {
      setLoading(false);
    }
  };

  const gerarRecomendacaoRoupa = async (cidade, clima) => {
    try {
      const response = await fetch('http://10.0.30.116:8000/sugerir-roupa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cidade: cidade,
          clima: clima,
        }),
      });

      const recomendacao = await response.json();
      console.log('Recomendação de roupa:', recomendacao);
      return recomendacao;
    } catch (error) {
      console.error('Erro ao gerar recomendação de roupa:', error);

    }
  };


  const tentarNovamente = () => {
    setErro('');
    setRecomendacao('');
    buscarDadosCidade();
  };

  useEffect(() => {
    buscarDadosCidade();
  }, []);

  return (
    <View style={[
      styles.container,
      {
        width: containerWidth,
        height: containerHeight,
        backgroundColor: dark ? '#2a2a2a' : '#ffffff',
      }
    ]}>
      <Text style={[styles.title, { color: dark ? '#0077ffff' : '#0077ffff' }]}>
        Roupa Ideal
      </Text>

      {cidadeAtual && (
        <Text style={[styles.cidadeText, { color: dark ? '#0077ffff' : '#0077ffff', fontSize: 13 }]}>
          {cidadeAtual}
        </Text>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D6BFD" />
          <Text style={[styles.loadingText, { color: dark ? '#cccccc' : '#666666', fontSize: 13, fontFamily: 'monospace', fontWeight: 'bold' }]}>
            Gerando recomendação...
          </Text>
        </View>
      ) : erro ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#ff6b6b' }]}>
            {erro}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={tentarNovamente}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[
          styles.recomendacaoText,
          { color: dark ? '#0000' : '#333333' }
        ]}>
          {recomendacao}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0077ffff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
  },
  title: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 20,
  },
  cidadeText: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2D6BFD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  recomendacaoText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 20,
    flex: 1,
  },
  tempInfo: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.8,
    position: 'absolute',
    bottom: 16,
  },
});

export default AIRoupa;
