// components/animatedWeatherIcon/AnimatedWeatherIcon.jsx
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Wind, Cloud, Sunrise, Sunset, Thermometer } from "lucide-react-native";

export default function AnimatedWeatherIcon({ type, color = "#fff", size = 40 }) {
  const anim = useSharedValue(0);

  useEffect(() => {
    let toValue = 10;
    let duration = 2000;

    if (type === "wind") {
      toValue = 15;
      duration = 800;
    }

    anim.value = withRepeat(
      withTiming(toValue, { duration }),
      -1,
      true // vai e volta
    );
  }, []);

  const style = useAnimatedStyle(() => {
    if (type === "wind") {
      return { transform: [{ rotate: `${anim.value}deg` }] };
    }
    if (type === "cloud") {
      return { transform: [{ translateY: anim.value / 2 }] };
    }
    if (type === "sunrise" || type === "sunset") {
      return { transform: [{ translateY: anim.value / 3 }] };
    }
    if (type === "thermometer") {
      return { transform: [{ scale: 1 + anim.value * 0.01 }] };
    }
    return {};
  });

  const renderIcon = () => {
    switch (type) {
      case "wind":
        return <Wind size={size} color={color} />;
      case "cloud":
        return <Cloud size={size} color={color} />;
      case "sunrise":
        return <Sunrise size={size} color={color} />;
      case "sunset":
        return <Sunset size={size} color={color} />;
      case "thermometer":
        return <Thermometer size={size} color={color} />;
      default:
        return null;
    }
  };

  return <Animated.View style={style}>{renderIcon()}</Animated.View>;
}
