import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { G, Path, Line, Circle } from "react-native-svg";

export default function ThermalGauge({ value = 30, min = 0, max = 43 }) {
  const size = 40;
  const strokeWidth = 6;
  const center = size / 2;
  const radius = center - strokeWidth / 2;

  const toRadians = (deg) => (deg * Math.PI) / 180;

  const getArcPath = (startAngle, sweepAngle) => {
    const start = {
      x: center + radius * Math.cos(toRadians(startAngle)),
      y: center + radius * Math.sin(toRadians(startAngle)),
    };
    const end = {
      x: center + radius * Math.cos(toRadians(startAngle + sweepAngle)),
      y: center + radius * Math.sin(toRadians(startAngle + sweepAngle)),
    };
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    return `M${start.x},${start.y} A${radius},${radius} 0 ${largeArcFlag} 1 ${end.x},${end.y}`;
  };

  const totalAngle = 240;
  const startGaugeAngle = 150;

  const clamped = Math.max(min, Math.min(value, max));
  const angle = ((clamped - min) / (max - min)) * totalAngle;
  const angleDeg = angle + startGaugeAngle;

  const needleLength = radius - 2;
  const needleX = center + needleLength * Math.cos(toRadians(angleDeg));
  const needleY = center + needleLength * Math.sin(toRadians(angleDeg));

  const gap = 2;

  // Novos ângulos
  const blueSweep = 103.6 - gap;
  const greenSweep = 60 - gap;
  const orangeSweep = 76.4 - gap;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Azul: 0–18 */}
          <Path
            d={getArcPath(startGaugeAngle, blueSweep)}
            stroke="#00BFFF"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Verde: 19–29 */}
          <Path
            d={getArcPath(startGaugeAngle + blueSweep + gap, greenSweep)}
            stroke="#00FF7F"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Laranja: 30–43 */}
          <Path
            d={getArcPath(startGaugeAngle + blueSweep + greenSweep + gap * 2, orangeSweep)}
            stroke="#FFA500"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Agulha */}
          <Line
            x1={center}
            y1={center}
            x2={needleX}
            y2={needleY}
            stroke="white"
            strokeWidth={1.5}
          />
          <Circle cx={center} cy={center} r={2} fill="white" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
