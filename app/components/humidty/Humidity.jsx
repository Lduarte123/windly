import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HumidityGauge({ value = 50 }) {
  const size = 40;
  const strokeWidth = 4;
  const radius = (size / 2) - strokeWidth / 2;
  const center = size / 2;

  const totalAngle = 240; // Arco incompleto (tipo velocímetro)
  const startAngle = 150;
  const fillAngle = (value / 100) * totalAngle;

  const toRadians = (deg) => (deg * Math.PI) / 180;

  const getArcPath = (startDeg, sweepDeg) => {
    const start = {
      x: center + radius * Math.cos(toRadians(startDeg)),
      y: center + radius * Math.sin(toRadians(startDeg)),
    };
    const end = {
      x: center + radius * Math.cos(toRadians(startDeg + sweepDeg)),
      y: center + radius * Math.sin(toRadians(startDeg + sweepDeg)),
    };

    const largeArcFlag = sweepDeg > 180 ? 1 : 0;
    return `M${start.x},${start.y} A${radius},${radius} 0 ${largeArcFlag} 1 ${end.x},${end.y}`;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Arco de fundo (cinza claro) */}
          <Path
            d={getArcPath(startAngle, totalAngle)}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Arco azul proporcional */}
          <Path
            d={getArcPath(startAngle, fillAngle)}
            stroke="#00BFFF"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </G>
      </Svg>

      {/* Ícone centralizado */}
      <View style={styles.iconOverlay}>
        <MaterialCommunityIcons name="water" size={18} color="#00BFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
