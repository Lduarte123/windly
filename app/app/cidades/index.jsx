import React, { useState, useCallback, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../../components/searchBar/SearchBar";
import CidadeCard from "../../components/cidadeCard/CidadeCard";
import { useTheme } from "../../components/ThemeContext";
import api from "../../api/api";
import { useAuth } from "../../components/authContext/AuthContext";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useConfig } from "../../components/configContext";

const OPENWEATHER_API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY;

export default function Cidades() {
  const [search, setSearch] = useState("");
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [navegando, setNavegando] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [cidadeEditando, setCidadeEditando] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [nomesCidades, setNomesCidades] = useState([]);

  const navigation = useNavigation();
  const router = useRouter();
  const { dark } = useTheme();
  const themeStyles = styles(dark);
  const backgroundColor = dark ? "#151718" : "#fff";
  const textColor = dark ? "#ECEDEE" : "#11181C";
  const vazioColor = dark ? "#ECEDEE" : "#888";
  const { user } = useAuth();
  const { config } = useConfig();

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
      }
    }, [user])
  );

  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .get(`/cidades-favoritas/usuario/${user.id}`)
        .then((res) => {
          setCidades(res.data);
          const nomes = res.data.map((c) => c.nome.trim().toLowerCase());
          setNomesCidades(nomes);
        })
        .catch(() => {
          setCidades([]);
          setNomesCidades([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const adicionarCidade = async () => {
    const cidadeBusca = search.trim();
    if (!cidadeBusca) return;
    setErro("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cidadeBusca
        )}&appid=${OPENWEATHER_API_KEY}&lang=pt_br`
      );
      const data = await res.json();
      if (data.cod === 200) {
        const nomeCidade = `${data.name}, ${data.sys.country}`.trim();
        const nomeNormalizado = nomeCidade.toLowerCase();
        if (!nomesCidades.includes(nomeNormalizado)) {
          const resPost = await api.post("/cidades-favoritas", {
            nome: nomeCidade,
            usuario_id: user.id,
          });
          setCidades([...cidades, resPost.data.data]);
          setNomesCidades([...nomesCidades, nomeNormalizado]);
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
      await api.delete(`/cidades-favoritas/${cidadeId}`, {
        data: { usuario_id: user.id },
      });
      const cidadeRemovida = cidades.find((c) => c.id === cidadeId);
      const nomeRemovido = cidadeRemovida?.nome?.toLowerCase();
      setCidades(cidades.filter((c) => c.id !== cidadeId));
      setNomesCidades(nomesCidades.filter((n) => n !== nomeRemovido));
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

  const abrirModalEdicao = (cidadeObj) => {
    setCidadeEditando(cidadeObj);
    setNovoNome(cidadeObj.nome);
    setEditModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[
        themeStyles.container,
        {
          backgroundColor,
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <View style={themeStyles.cidadesHeader}>
        <Ionicons
          name="location-outline"
          size={28}
          color="#2D6BFD"
          style={themeStyles.cidadesHeaderIcon}
        />
        <Text style={[themeStyles.cidadesHeaderTitle, { color: textColor }]}>
          Minhas cidades{" "}
        </Text>
      </View>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Adicionar cidade..."
        onSubmitEditing={adicionarCidade}
        style={themeStyles.searchBar}
      />
      {loading && (
        <ActivityIndicator color="#2D6BFD" style={themeStyles.loading} />
      )}
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
              onEditar={() => abrirModalEdicao(cidadeObj)}
              onPress={() => handleCidadePress(cidadeObj.nome)}
              disabled={navegando || !user}
            />
          ))
        )}
      </ScrollView>

      {editModalVisible && (
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={themeStyles.editModalOverlay}>
            <View style={themeStyles.editModalContainer}>
              <Text style={themeStyles.editModalTitle}>Editar cidade</Text>
              <TextInput
                style={themeStyles.editModalInput}
                value={novoNome}
                onChangeText={setNovoNome}
                placeholder="Novo nome da cidade"
                placeholderTextColor={dark ? "#ECEDEE" : "#888"}
              />
              {!!erro && (
                <Text style={themeStyles.editModalError}>{erro}</Text>
              )}
              <View style={themeStyles.editModalActions}>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={themeStyles.editModalCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setErro("");
                    setLoading(true);
                    try {
                      const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                          novoNome.trim()
                        )}&appid=${OPENWEATHER_API_KEY}&lang=pt_br`
                      );
                      const data = await res.json();
                      if (data.cod === 200) {
                        const nomeCidade = `${data.name}, ${data.sys.country}`.trim();
                        const nomeNormalizado = nomeCidade.toLowerCase();
                        if (
                          !nomesCidades.includes(nomeNormalizado) ||
                          nomeNormalizado === cidadeEditando.nome.toLowerCase()
                        ) {
                          await api.put(
                            `/cidades-favoritas/${cidadeEditando.id}`,
                            { nome: nomeCidade, usuario_id: user.id }
                          );
                          setCidades(
                            cidades.map((c) =>
                              c.id === cidadeEditando.id
                                ? { ...c, nome: nomeCidade }
                                : c
                            )
                          );
                          setNomesCidades((prev) =>
                            prev.map((n) =>
                              n === cidadeEditando.nome.toLowerCase()
                                ? nomeNormalizado
                                : n
                            )
                          );
                          setEditModalVisible(false);
                        } else {
                          setErro("Cidade já adicionada.");
                        }
                      } else {
                        setErro("Cidade não encontrada.");
                      }
                    } catch {
                      setErro("Erro ao editar cidade.");
                    }
                    setLoading(false);
                  }}
                >
                  <Text style={themeStyles.editModalSave}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
