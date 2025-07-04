import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
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
    if (!novoNome.trim()) {
      Alert.alert("Erro", "O nome não pode ficar vazio.");
      return;
    }
    setLoading(true);
    try {
      setUser({ ...user, name: novoNome });
      setEditModalVisible(false);
      Alert.alert("Sucesso", "Nome atualizado!");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
    setLoading(false);
  };

  const handleExcluirConta = () => {
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
      <View style={styles.section}>
        <View>
          <Text style={styles.label}>Usuário</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditModalVisible(true)}
          activeOpacity={0.8}
          accessibilityLabel="Editar nome"
          accessibilityHint="Abre modal para editar o nome do usuário"
        >
          <Feather name="edit-2" size={20} color="#fff" />
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
              placeholderTextColor={dark ? "#B0B8C1" : "#888"}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSalvar}
              editable={!loading}
            />

            <View style={styles.editModalTopActions}>
              <TouchableOpacity
                style={styles.editModalIconButton}
                onPress={handleExcluirConta}
                disabled={loading}
                accessibilityLabel="Excluir conta"
              >
                <Feather name="trash-2" size={22} color="#E53935" />
                <Text style={styles.editModalIconText}>Excluir conta</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editModalIconButton}
                onPress={logout}
                disabled={loading}
                accessibilityLabel="Logout"
              >
                <Feather name="log-out" size={22} color="#E53935" />
                <Text style={styles.editModalIconText}>Logout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={[styles.editModalActionButton, styles.editModalCancelButton]}
                onPress={() => setEditModalVisible(false)}
                disabled={loading}
                accessibilityLabel="Cancelar edição"
              >
                <Text style={styles.editModalCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.editModalActionButton, styles.editModalSaveButton]}
                onPress={handleSalvar}
                disabled={loading}
                accessibilityLabel="Salvar novo nome"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.editModalSave}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
