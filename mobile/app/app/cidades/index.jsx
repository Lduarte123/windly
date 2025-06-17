import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, Text, View, ActivityIndicator, Keyboard } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../../components/searchBar/SearchBar";
import CidadeCard from "../../components/cidadeCard/CidadeCard";
import { useTheme } from "../../components/ThemeContext";
import api from '../../api/api';
import { useAuth } from '../../components/authContext/AuthContext';
import styles from "../../components/styles";

const OPENWEATHER_API_KEY = "69b60137458925882b3d327be216c401";

export default function Cidades() {
  const [search, setSearch] = useState("");
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [navegando, setNavegando] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const { dark } = useTheme();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const backgroundColor = dark ? '#151718' : '#F2F2F2';
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const vazioColor = dark ? "#ECEDEE" : "#888";

  // Redireciona para login se não estiver logado
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        navigation.replace('login');
      }
    }, [user])
  );

  // Busca cidades favoritas do backend ao carregar
  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get(`/cidades-favoritas?usuario_id=${user.id}`)
        .then(res => setCidades(res.data)) // Agora cidades é um array de objetos {id, nome, usuario_id}
        .catch(() => setCidades([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Busca configurações do usuário (exemplo: notificações)
  useEffect(() => {
    if (user) {
      api.get(`/users/${user.id}/config`)
        .then(res => setNotificationsEnabled(res.data.notifications_enabled));
    }
  }, [user]);

  // Adiciona cidade favorita
  const adicionarCidade = async () => {
    const cidadeBusca = search.trim();
    if (!cidadeBusca) return;
    setErro("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidadeBusca)}&appid=${OPENWEATHER_API_KEY}&lang=pt_br`
      );
      const data = await res.json();
      if (data.cod === 200) {
        const nomeCidade = `${data.name}, ${data.sys.country}`.trim();
        if (!cidades.includes(nomeCidade)) {
          // Salva no backend
          const resPost = await api.post('/cidades-favoritas', { nome: nomeCidade, usuario_id: user.id });
          setCidades([...cidades, resPost.data.data]); // Adiciona o objeto completo retornado pelo backend
        }
        setSearch("");
        Keyboard.dismiss();
      } else {
        setErro("Cidade não encontrada.");
      }
    } catch {
      setErro("Erro ao buscar cidade.");
    }
    setLoading(false);
  };

  // Remove cidade favorita
  const removerCidade = async (cidadeId) => {
    try {
      await api.delete(`/cidades-favoritas/${cidadeId}`);
      setCidades(cidades.filter((c) => c.id !== cidadeId));
    } catch {
      setErro("Erro ao remover cidade.");
    }
  };

  // Navega para detalhes da cidade
  const handleCidadePress = (cidade) => {
    if (!user || navegando) return;
    setNavegando(true);
    router.push(`/cidades/${encodeURIComponent(cidade)}`);
    setTimeout(() => setNavegando(false), 1200);
  };

  // Altera configuração de notificações
  const handleToggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await api.put(`/users/${user.id}/config`, { notifications_enabled: newValue });
  };

  return (
    <View style={[styles.cidadesContainer, { backgroundColor }]}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Adicionar cidade..."
        onSubmitEditing={adicionarCidade}
      />
      <Text style={[styles.titulo, { color: textColor }]}>
        Minhas cidades
      </Text>
      {loading && <ActivityIndicator color="#2D6BFD" style={styles.loading} />}
      {!!erro && <Text style={styles.erro}>{erro}</Text>}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {cidades.length === 0 ? (
          <Text style={[styles.vazio, { color: vazioColor }]}>
            Nenhuma cidade adicionada.
          </Text>
        ) : (
          console.log(cidades),
          cidades.map((cidadeObj) => (
            <CidadeCard
              key={cidadeObj.id}
              cidade={cidadeObj.nome}
              onRemover={() => removerCidade(cidadeObj.id)}
              onPress={() => handleCidadePress(cidadeObj.nome)}
              disabled={navegando || !user}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
