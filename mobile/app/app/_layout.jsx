import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import { AuthProvider } from '../components/authContext/AuthContext';
import { ConfigProvider } from '../components/configContext';

function ThemedTabs() {
  const { dark } = useTheme();

  const backgroundColor = dark ? '#151718' : '#fff';
  const textColor = dark ? '#ECEDEE' : '#11181C';

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2D6BFD',
          tabBarInactiveTintColor: '#ccc',
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            elevation: 5,
            backgroundColor,
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            height: 80,
            paddingBottom: 10,
            paddingTop: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity activeOpacity={0.7} {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="cidades"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="location-outline" size={24} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity activeOpacity={0.7} {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="configuracoes/index"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity activeOpacity={0.7} {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            // NÃO use `href` aqui
            tabBarButton: () => null, // isso esconde completamente o botão da Tab Bar
            tabBarItemStyle: { display: 'none' }, // opcional: oculta a tab bar se for necessário
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            // NÃO use `href` aqui
            tabBarButton: () => null, // isso esconde completamente o botão da Tab Bar
            tabBarItemStyle: { display: 'none' }, // opcional: oculta a tab bar se for necessário
          }}
        />
        <Tabs.Screen
          name="logout"
          options={{
            // NÃO use `href` aqui
            tabBarButton: () => null, // isso esconde completamente o botão da Tab Bar
            tabBarItemStyle: { display: 'none' }, // opcional: oculta a tab bar se for necessário
          }}
        />

      </Tabs>
    </View>
  );
}

// CORRIGIDO: Agora estamos retornando o ThemedTabs dentro do ThemeProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <ThemeProvider>
          <ThemedTabs />
        </ThemeProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}
