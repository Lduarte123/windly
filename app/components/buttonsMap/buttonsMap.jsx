import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Moon, Thermometer, Wind, Cloudy, CloudRainWind, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from '../ThemeContext';

const ButtonsMap = ({ onFilterChange }) => {
  const { dark } = useTheme();
  
  const [filters, setFilters] = useState({
    ventos: true,
    nuvens: true,
    temperatura: true,
    precipitacao: true,
    temaEscuro: dark
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(200))[0];

  // Sincronizar tema do sistema com filtro temaEscuro
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      temaEscuro: dark
    }));
  }, [dark]);

  const toggleFilter = (filterName) => {
    const newFilters = {
      ...filters,
      [filterName]: !filters[filterName]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? 200 : 0;
    setSidebarVisible(!sidebarVisible);
    
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const filterButtons = [
    { key: 'ventos', icon: Wind },
    { key: 'nuvens', icon: Cloudy },
    { key: 'temperatura', icon: Thermometer },
    { key: 'precipitacao', icon: CloudRainWind },
    { key: 'temaEscuro', icon: Moon }
  ];

  return (
    <View style={styles.container}>
      {/* Botão de seta para toggle do sidebar */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={toggleSidebar}
      >
        {sidebarVisible ? (
          <ChevronLeft size={24} color={filters.temaEscuro ? "#FFFFFF" : "#333333"} />
        ) : (
          <ChevronRight size={24} color={filters.temaEscuro ? "#FFFFFF" : "#333333"} />
        )}
      </TouchableOpacity>

      {/* Sidebar com botões */}
      <Animated.View 
        style={[
          styles.sidebar,
          { 
            transform: [{ translateX: slideAnim }],
            backgroundColor: dark ? 'rgba(31, 34, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)'
          }
        ]}
      >
        {filterButtons.map((button) => (
          <TouchableOpacity
            key={button.key}
            style={[
              styles.button,
              filters[button.key] ? styles.buttonActive : styles.buttonInactive
            ]}
            onPress={() => toggleFilter(button.key)}
          >
            <button.icon 
              size={20} 
              color={filters[button.key] ? '#FFFFFF' : '#333333'} 
            />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    zIndex: 1001,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 25,
    width: 50,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  buttonInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default ButtonsMap;
