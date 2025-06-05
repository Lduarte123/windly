import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function CidadeCard({ cidade, onRemover, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 24,
        marginBottom: 12,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 16 }}>{cidade}</Text>
      <TouchableOpacity onPress={onRemover}>
        <Text style={{ color: "#E53935", fontSize: 18, marginLeft: 12 }}>
          Remover
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}