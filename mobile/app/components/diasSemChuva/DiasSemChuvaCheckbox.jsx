import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import api from "../../api/api";
import styles from "./styles";
import { useTheme } from "../ThemeContext"; // Importa o hook de tema

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function DiasSemChuvaCheckbox() {
  const [dias, setDias] = useState([false, false, false, false, false, false, false]);
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme(); // Usa o tema

  const toggleDia = (index) => {
    const novosDias = [...dias];
    novosDias[index] = !novosDias[index];
    setDias(novosDias);
  };

  const salvarDias = async () => {
    setLoading(true);
    try {
      await api.post("/rain", { diasSemChuva: dias });
      Alert.alert("Sucesso", "Dias sem chuva salvos!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar.");
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
    dark && checked && { color: "#23272a" }, // texto escuro no checkbox claro
    dark && !checked && { color: "#fff" },   // texto branco no checkbox escuro
  ];
  const checkboxStyle = (checked) => [
    styles.checkbox,
    checked && styles.checked,
    dark && !checked && { backgroundColor: "#23272a", borderColor: "#fff" },
    dark && checked && { backgroundColor: "#fff", borderColor: "#fff" },
  ];

  return (
    <View style={wrapperStyle}>
      <Text style={[styles.titulo, dark && { color: "#fff" }]}>Dias sem chuva</Text>
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
      <TouchableOpacity style={styles.button} onPress={salvarDias} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar"}</Text>
      </TouchableOpacity>
    </View>
  );
}