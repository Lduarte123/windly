import { Stack } from "expo-router";

export default function ConfiguracoesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Configurações" }} />
      <Stack.Screen name="sobre" options={{ title: "Sobre o App" }} />
      <Stack.Screen name="privacidade" options={{ title: "Privacidade" }} />
    </Stack>
  );
}
