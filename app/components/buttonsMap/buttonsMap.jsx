import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Moon, Thermometer, Wind, Cloudy } from "lucide-react-native";

const ButtonsMap = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    ventos: true,
    nuvens: true,
    temperatura: true,
    temaEscuro: true
  });

  const toggleFilter = (filterName) => {
    const newFilters = {
      ...filters,
      [filterName]: !filters[filterName]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const filterButtons = [
    { key: 'ventos', icon: Wind },
    { key: 'nuvens', icon: Cloudy },
    { key: 'temperatura', icon: Thermometer },
    { key: 'temaEscuro', icon: Moon }
  ];

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1000,
    flexDirection: 'column',
    gap: 8,
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
