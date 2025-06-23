import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import apiNsql from "../../api/apiNsql";
import styles from "./styles";
import { useTheme } from "../ThemeContext";

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function DiasSemChuvaCheckbox() {
  const [dias, setDias] = useState([false, false, false, false, false, false, false]);
  const [loading, setLoading] = useState(false);
  const [rainId, setRainId] = useState(null); // Para atualizar registro existente
  const { dark } = useTheme();

  // Buscar estado salvo ao montar
  useEffect(() => {
    async function fetchDias() {
      try {
        const res = await apiNsql.get("/rain");
        if (res.data && res.data.length > 0) {
          const ultimo = res.data[res.data.length - 1];
          setDias(ultimo.diasSemChuva || [false, false, false, false, false, false, false]);
          setRainId(ultimo._id);
        }
      } catch (e) {
        // Pode ignorar erro silenciosamente
      }
    }
    fetchDias();
  }, []);

  const toggleDia = (index) => {
    const novosDias = [...dias];
    novosDias[index] = !novosDias[index];
    setDias(novosDias);
  };

  // Salvar dias no backend
  const salvarDias = async () => {
    setLoading(true);
    try {
      if (rainId) {
        // Atualiza registro existente
        await apiNsql.put(`/rain/${rainId}`, { chuva: false, diasSemChuva: dias });
      } else {
        // Cria novo registro
        const res = await apiNsql.post("/rain", { chuva: false, diasSemChuva: dias });
        setRainId(res.data._id);
      }
      Alert.alert("Salvo", "Dias sem chuva salvos no backend!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar no backend.");
    }
    setLoading(false);
  };

  // Resetar dias no backend
  const resetarDias = async () => {
    setDias([false, false, false, false, false, false, false]);
    setLoading(true);
    try {
      const res = await apiNsql.post("/rain/reset");
      setRainId(res.data._id); // Atualiza ID do registro resetado/criado
      Alert.alert("Resetado", "Dias sem chuva resetados!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível resetar no backend.");
    }
    setLoading(false);
  };

  // Estilos dinâmicos para tema escuro
  const wrapperStyle = [
    styles.wrapper,
    dark && { backgroundColor: "#23272a", shadowColor: "#000" }
  ];
  const labelStyle = (checked) => [
    styles.label,
    checked && styles.labelChecked,
    dark && checked && { color: "#23272a" },
    dark && !checked && { color: "#fff" },
  ];
  const checkboxStyle = (checked) => [
    styles.checkbox,
    checked && styles.checked,
    dark && !checked && { backgroundColor: "#23272a", borderColor: "#fff" },
    dark && checked && { backgroundColor: "#fff", borderColor: "#fff" },
  ];

  return (
    <View style={wrapperStyle}>
      <Text style={[styles.titulo, dark && { color: "#fff" }]}>Chuvas na Semana</Text>
      <View style={styles.container}>
        {diasSemana.map((dia, idx) => (
          <TouchableOpacity
            key={dia}
            style={checkboxStyle(dias[idx])}
            onPress={() => toggleDia(idx)}
            activeOpacity={0.7}
          >
            <Text style={labelStyle(dias[idx])}>{dia}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity style={styles.button} onPress={salvarDias} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#888" }]}
          onPress={resetarDias}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Resetar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}