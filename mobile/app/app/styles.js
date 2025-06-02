import { StyleSheet } from 'react-native';

export const tabBarStyles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#a3cef1', // azul claro suave
    height: 50,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    position: 'absolute',  // para ficar flutuando
    left: 0,
    right: 0,
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Sombras para Android
    elevation: 5,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
