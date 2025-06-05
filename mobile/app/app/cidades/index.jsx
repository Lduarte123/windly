import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../../components/styles";
import SearchBar from "../../components/searchBar/SearchBar";
import CidadeCard from "../../components/cidadeCard/CidadeCard";

const OPENWEATHER_API_KEY = "69b60137458925882b3d327be216c401";

export default function Cidades() {
  const [search, setSearch] = useState("");
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const adicionarCidade = async () => {
    if (!search.trim()) return;
    setErro("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          search
        )}&appid=${OPENWEATHER_API_KEY}&lang=pt_br`
      );
      const data = await res.json();
      if (data.cod === 200) {
        const nomeCidade = `${data.name}, ${data.sys.country}`;
        if (!cidades.includes(nomeCidade)) {
          setCidades([...cidades, nomeCidade]);
        }
        setSearch("");
        Keyboard.dismiss();
      } else {
        setErro("Cidade não encontrada.");
      }
    } catch (e) {
      setErro("Erro ao buscar cidade.");
    }
    setLoading(false);
  };

  const removerCidade = (cidade) => {
    setCidades(cidades.filter((c) => c !== cidade));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
      <View style={{ marginTop: 24, marginBottom: 8 }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Adicionar cidade..."
          onSubmitEditing={adicionarCidade}
        />
        {loading && (
          <ActivityIndicator color="#2D6BFD" style={{ marginTop: 8 }} />
        )}
        {erro ? (
          <Text style={{ color: "#E53935", alignSelf: "center", marginTop: 8 }}>
            {erro}
          </Text>
        ) : null}
      </View>

      <ScrollView style={{ flex: 1, marginTop: 24 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginLeft: 24,
            marginBottom: 8,
          }}
        >
          Minhas cidades
        </Text>
        {cidades.length === 0 && (
          <Text
            style={{
              color: "#888",
              alignSelf: "center",
              marginTop: 32,
            }}
          >
            Nenhuma cidade adicionada.
          </Text>
        )}
        {cidades.map((cidade) => (
          <CidadeCard
            key={cidade}
            cidade={cidade}
            onRemover={() => removerCidade(cidade)}
            onPress={() => router.push(`/cidades/${encodeURIComponent(cidade)}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
