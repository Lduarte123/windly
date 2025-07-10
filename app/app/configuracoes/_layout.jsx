// app/configuracoes/_layout.jsx
import { Stack } from "expo-router";

export default function ConfiguracoesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Se quiser um header automático, mude para true
      }}
    />
  );
}
