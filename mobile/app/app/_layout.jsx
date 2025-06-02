import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tabBarStyles } from './styles';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#004aad',  // azul escuro para ativo
        tabBarInactiveTintColor: '#4f6d7a', // azul acinzentado para inativo
        tabBarStyle: tabBarStyles.tabBarStyle,
        tabBarLabelStyle: tabBarStyles.tabBarLabelStyle,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'home') iconName = 'home';
          else if (route.name === 'login') iconName = 'log-in';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="login" options={{ title: 'Login' }} />
    </Tabs>
  );
}
