import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen'; // ⬅️ Importado aqui

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // ⏳ Mantenha a splash screen visível
        await SplashScreen.preventAutoHideAsync();

        const savedTheme = await AsyncStorage.getItem("darkMode");
        if (savedTheme !== null) {
          setDark(savedTheme === "true");
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // ✅ Esconda a splash screen quando estiver tudo pronto
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !dark;
    setDark(newTheme);
    await AsyncStorage.setItem("darkMode", newTheme.toString());
  };

  if (!isReady) return null; // Enquanto isso, mantém a splash ativa

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);