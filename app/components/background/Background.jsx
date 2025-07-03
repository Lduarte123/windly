import React, { useRef } from "react";
import {
  View,
  Dimensions,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function WeatherBackgroundWrapper({
  weatherData = {},
  children,
  headerContent,
}) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const isDayTime = () => {
    if (!weatherData || !weatherData.dt || !weatherData.sys) return true;
    const now = weatherData.dt;
    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;
    return now >= sunrise && now < sunset;
  };

  const getBackgroundImage = () => {
    if (!weatherData || !weatherData.weatherMain)
      return require("../../assets/status/ceu_limpo.jpg");

    const main = weatherData.weatherMain.toLowerCase();
    const day = isDayTime();

    switch (main) {
      case "clear":
        return day
          ? require("../../assets/status/ceu_limpo.jpg")
          : require("../../assets/status/ceu_limpo_noite.jpg");

      case "clouds":
        return day
          ? require("../../assets/status/nublado.jpg")
          : require("../../assets/status/nublado_noite.jpg");

      case "rain":
      case "drizzle":
        return day
          ? require("../../assets/status/chuvendo.jpg")
          : require("../../assets/status/chuva_noite.jpg");

      case "thunderstorm":
        return require("../../assets/status/tempestade.jpg");

      case "snow":
        return require("../../assets/status/nevando.jpg");

      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog":
      case "sand":
      case "ash":
      case "squall":
      case "tornado":
        return day
          ? require("../../assets/status/nublado.jpg")
          : require("../../assets/status/nublado_noite.jpg");

      default:
        return require("../../assets/status/ceu_limpo.jpg");
    }
  };

  // Função que retorna a cor base do fundo para cada clima
  const getBackgroundColor = () => {
    if (!weatherData || !weatherData.weatherMain) 
      return "#4A90E2";

    const main = weatherData.weatherMain.toLowerCase();
    const day = isDayTime();


    switch (main) {
    case "clear":
      return day ? "#167aab" : "#0D1B2A"; // azul claro dia, azul escuro noite
    case "clouds":
      return day ? "#8E9AAF" : "#2C3E50";
    case "rain":
    case "drizzle":
      return day ? "#5F7C8A" : "#1B263B";
    case "thunderstorm":
      return "#3B3B3B";
    case "snow":
      return "#D7E6F0";
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
    case "sand":
    case "ash":
    case "squall":
    case "tornado":
      return day ? "#778899" : "#36454F";
    default:
      console.warn("⚠️ CAIU NO DEFAULT DO BACKGROUND COLOR:", main);
      return "#4A90E2";
  }
};

  const backgroundColor = getBackgroundColor();

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [180, 300],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Gradiente opacity animado com scroll (para transição suave)
  const gradientOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar translucent backgroundColor="transparent" />

      <Animated.View
        style={[styles.imageBackgroundWrapper, { opacity: imageOpacity }]}
      >
        <ImageBackground
          source={getBackgroundImage()}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <Animated.View style={[styles.headerOverlay, { opacity: headerOpacity }]}>
            {headerContent}
          </Animated.View>
        </ImageBackground>
      </Animated.View>

      {/* Gradiente com cor dinâmica */}
      <Animated.View
        pointerEvents="none"
        style={[styles.fadeOut, { opacity: 1 }]}
      >
        <LinearGradient
  colors={[
    backgroundColor + "00",  // cor transparente
    backgroundColor + "CC",  // cor semi-opaca (~80%)
    backgroundColor + "FF",  // cor opaca total (sem transparência)
  ]}
  locations={[0, 0.7, 1]}
  style={StyleSheet.absoluteFill}
/>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ zIndex: 2 }}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackgroundWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.6,
    zIndex: 0,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  fadeOut: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.6 - 150,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: SCREEN_HEIGHT * 0.6,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerOverlay: {
    paddingTop: Platform.OS === "android" ? 80 : 100,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
