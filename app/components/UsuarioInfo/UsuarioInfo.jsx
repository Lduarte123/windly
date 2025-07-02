import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import { useAuth } from '../authContext/AuthContext';

export default function UsuarioInfo({ user, textColor }) {
  const { dark } = useTheme();
  const styles = getStyles(dark);
  const { logout, setUser } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    setLoading(true);
    try {
      // Chame sua API para atualizar o nome do usuário aqui
      // Exemplo fictício:
      // await api.put('/user', { name: novoNome });
      setUser({ ...user, name: novoNome });
      setEditModalVisible(false);
      Alert.alert("Sucesso", "Nome atualizado!");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
    setLoading(false);
  };

  const handleExcluirConta = async () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // Chame sua API para excluir a conta aqui
              // await api.delete('/user');
              logout();
              Alert.alert("Conta excluída", "Sua conta foi removida.");
            } catch (err) {
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          }
        }
      ]
    );
  };

  if (!user) return null;

  return (
    <>
      <View style={[styles.section, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
        <View>
          <Text style={[styles.label, { color: textColor, fontSize: 16 }]}>Usuário</Text>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: "bold" }}>{user?.name}</Text>
          <Text style={{ color: "#888", fontSize: 14 }}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={() => setEditModalVisible(true)}>
          <Feather name="edit-2" size={20} color="#2D6BFD" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContainer}>
            <Text style={styles.editModalTitle}>Editar nome</Text>
            <TextInput
              style={styles.editModalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Novo nome"
              placeholderTextColor={dark ? "#ECEDEE" : "#888"}
            />

            <View style={styles.editModalTopActions}>
              <TouchableOpacity style={styles.editModalIconButton} onPress={handleExcluirConta}>
                <Feather name="trash-2" size={22} color="#E53935" />
                <Text style={styles.editModalIconText}>Excluir conta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editModalIconButton} onPress={logout}>
                <Feather name="log-out" size={22} color="#E53935" />
                <Text style={styles.editModalIconText}>Logout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={[styles.editModalActionButton, styles.editModalCancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.editModalCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editModalActionButton, styles.editModalSaveButton]}
                onPress={handleSalvar}
                disabled={loading}
              >
                <Text style={styles.editModalSave}>{loading ? "Salvando..." : "Salvar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}