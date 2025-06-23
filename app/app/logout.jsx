// logout.js
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../components/authContext/AuthContext";

export default function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  return () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("login");
          },
        },
      ]
    );
  };
}
