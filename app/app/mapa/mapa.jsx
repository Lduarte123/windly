import React, { useState } from "react";
import { View } from "react-native";
import MapaMeteorologico from "../../components/mapaMeteorologico/mapaMeteorologico";
import ButtonsMap from "../../components/buttonsMap/buttonsMap";

export default function MapaScreen() {
  const [filters, setFilters] = useState({
    ventos: true,
    nuvens: true,
    temperatura: true,
    temaEscuro: true
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapaMeteorologico filters={filters} />
      <ButtonsMap onFilterChange={handleFilterChange} />
    </View>
  );
}