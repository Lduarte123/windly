import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, Text, View, ActivityIndicator, Keyboard, SafeAreaView, Platform, StatusBar } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../../components/searchBar/SearchBar";
import CidadeCard from "../../components/cidadeCard/CidadeCard";
import { useTheme } from "../../components/ThemeContext";
import api from '../../api/api';
import { useAuth } from '../../components/authContext/AuthContext';
import styles from "../../components/styles";
import { Ionicons } from '@expo/vector-icons';

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
  const themeStyles = styles(dark);
  const backgroundColor = dark ? '#151718' : '#fff';
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const vazioColor = dark ? "#ECEDEE" : "#888";
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        navigation.replace('login');
      }
    }, [user])
  );

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get(`/cidades-favoritas?usuario_id=${user.id}`)
        .then(res => setCidades(res.data)) // Agora cidades é um array de objetos {id, nome, usuario_id}
        .catch(() => setCidades([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      api.get(`/user-config/${user.id}`)
        .then(res => setNotificationsEnabled(res.data.notifications_enabled));
    }
  }, [user]);

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
          const resPost = await api.post('/cidades-favoritas', { nome: nomeCidade, usuario_id: user.id });
          setCidades([...cidades, resPost.data.data]);
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

  const removerCidade = async (cidadeId) => {
    try {
      await api.delete(`/cidades-favoritas/${cidadeId}`);
      setCidades(cidades.filter((c) => c.id !== cidadeId));
    } catch {
      setErro("Erro ao remover cidade.");
    }
  };

  const handleCidadePress = (cidade) => {
    if (!user || navegando) return;
    setNavegando(true);
    router.push(`/cidades/${encodeURIComponent(cidade)}`);
    setTimeout(() => setNavegando(false), 1200);
  };

  const handleToggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await api.put(`/users/${user.id}/config`, { notifications_enabled: newValue });
  };

  return (
    <SafeAreaView style={[
      themeStyles.container,
      { backgroundColor, flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
    ]}>
      <View style={themeStyles.cidadesHeader}>
        <Ionicons
          name="location-outline"
          size={28}
          color="#2D6BFD"
          style={themeStyles.cidadesHeaderIcon}
        />
        <Text style={[themeStyles.cidadesHeaderTitle,{ color: textColor }]}>Minhas cidades </Text>
      </View>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Adicionar cidade..."
        onSubmitEditing={adicionarCidade}
        style={themeStyles.searchBar}
      />
      {loading && <ActivityIndicator color="#2D6BFD" style={themeStyles.loading} />}
      {!!erro && <Text style={themeStyles.erro}>{erro}</Text>}

      <ScrollView
        style={themeStyles.cidadesScroll}
        contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {cidades.length === 0 ? (
          <Text style={themeStyles.cidadesVazio}>
            Nenhuma cidade adicionada.
          </Text>
        ) : (
          cidades.map((cidadeObj) => (
            <CidadeCard
              key={cidadeObj.id}
              cidade={cidadeObj.nome}
              onRemover={() => removerCidade(cidadeObj.id)}
              onPress={() => handleCidadePress(cidadeObj.nome)}
              disabled={navegando || !user}
              dark={dark}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
