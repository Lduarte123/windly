import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useConfig } from '../configContext';
import Constants from 'expo-constants';
import { getUserCity } from '../../api/getUserCity';

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

  const GEMINI_API_KEY =Constants?.expoConfig?.extra?.GEMINI_API_KEY;


  // Buscar cidade atual e dados do clima
  const buscarDadosCidade = async () => {
    try {
      setLoading(true);
      const cidade = await getUserCity();
      setCidadeAtual(cidade);
      
      // Simular dados do clima (em uma implementação real, viria da API do OpenWeather)
      const climaSimulado = {
        temperatura: 25,
        condicao: 'ensolarado',
        umidade: 60,
        vento: 'leve'
      };
      setDadosClima(climaSimulado);
      
      // Gerar recomendação automaticamente
      await gerarRecomendacaoRoupa(cidade, climaSimulado);
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
      setErro('Erro ao obter localização');
      setCidadeAtual('Localização não disponível');
    } finally {
      setLoading(false);
    }
  };

  const gerarRecomendacaoRoupa = async (cidade, clima) => {
    if (!GEMINI_API_KEY) {
      setErro('Chave da API do Gemini não configurada. Verifique o arquivo .env');
      return;
    }

    try {
      const prompt = `Com base no clima atual de ${cidade}:
      - Temperatura: ${clima.temperatura}°C
      - Condição: ${clima.condicao}
      - Umidade: ${clima.umidade}%
      - Vento: ${clima.vento}
      
      Recomende a roupa ideal para sair hoje em ${cidade}. Seja específico e prático, incluindo:
      - Tipo de roupa (camiseta, calça, etc.)
      - Material recomendado
      - Acessórios se necessário
      - Dicas extras para o clima local
      
      Responda de forma clara e direta em português brasileiro.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const texto = data.candidates[0].content.parts[0].text;
        setRecomendacao(texto);
        setErro('');
      } else if (data.error) {
        throw new Error(data.error.message || 'Erro na API do Gemini');
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro Gemini:', error);
      if (error.message.includes('API key')) {
        setErro('Chave da API inválida. Verifique a configuração.');
      } else if (error.message.includes('quota')) {
        setErro('Limite de uso da API atingido.');
      } else {
        setErro(`Erro ao conectar com a API: ${error.message}`);
      }
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
        borderColor: dark ? '#404040' : '#e0e0e0',
      }
    ]}>
      <Text style={[styles.title, { color: dark ? '#2fb8eeff' : '#7b7bf8ff', fontFamily: 'monospace', fontWeight: 'bold' }]}>
        Roupa Ideal
      </Text>
      
      {cidadeAtual && (
        <Text style={[styles.cidadeText, { color: dark ? '#87ceeb' : '#50ff53ff', fontSize: 13 , fontFamily: 'monospace', fontWeight: 'bold' }]}>
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
          { color: dark ? '#cccccc' : '#333333' }
        ]}>
          {recomendacao}
        </Text>
      )}
      
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
    padding: 20,
  },
  title: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080',
  },
  cidadeText: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#000080',
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
