import React, { useState } from "react";
import { ScrollView, Text, View, ActivityIndicator, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "../../components/searchBar/SearchBar";
import CidadeCard from "../../components/cidadeCard/CidadeCard";
import styles from "../../components/styles";

const OPENWEATHER_API_KEY = "69b60137458925882b3d327be216c401";

export default function Cidades() {
  const [search, setSearch] = useState("");
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const adicionarCidade = async () => {
    const cidadeBusca = search.trim(); // remove espaços antes e depois
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
        if (!cidades.includes(nomeCidade)) setCidades([...cidades, nomeCidade]);
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

  const removerCidade = (cidade) => setCidades(cidades.filter((c) => c !== cidade));

  return (
    <View style={styles.cidadesContainer}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Adicionar cidade..."
        onSubmitEditing={adicionarCidade}
      />
      <Text style={styles.titulo}>
          Minhas cidades
        </Text>
      {loading && <ActivityIndicator color="#2D6BFD" style={styles.loading} />}
      {!!erro && <Text style={styles.erro}>{erro}</Text>}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {cidades.length === 0 ? (
          <Text style={styles.vazio}>
            Nenhuma cidade adicionada.
          </Text>
        ) : (
          cidades.map((cidade) => (
            <CidadeCard
              key={cidade}
              cidade={cidade}
              onRemover={() => removerCidade(cidade)}
              onPress={() => router.push(`/cidades/${encodeURIComponent(cidade)}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
