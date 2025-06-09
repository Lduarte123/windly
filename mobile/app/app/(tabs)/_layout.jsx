import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function Layout() {
  return (
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
          backgroundColor: '#fff',
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
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
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
          tabBarLabel: 'Cidades',
          tabBarIcon: ({ color, size }) => (
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
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity activeOpacity={0.7} {...props} />
          ),
        }}
      />
    </Tabs>
  );
}
