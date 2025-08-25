import React, { useRef } from "react";
import {
  View,
  Dimensions,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import tzLookup from "tz-lookup";
import { utcToZonedTime } from "date-fns-tz";
import { useTheme } from "../ThemeContext"


const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function WeatherBackgroundWrapper({
  weatherData = {},
  children,
  headerContent,
  loading = false,
  onRefresh = () => {},
}) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const { dark } = useTheme();

  // Converte string "HH:MM" para minutos do dia
  const timeStringToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  const getCityLocalMinutes = () => {
    if (!weatherData.lat || !weatherData.lon) {
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
    }

    try {
      const timezone = tzLookup(weatherData.lat, weatherData.lon);
      const now = new Date();
      const cityDate = utcToZonedTime(now, timezone);
      return cityDate.getHours() * 60 + cityDate.getMinutes();
    } catch (error) {
      console.warn("Erro ao calcular timezone:", error);
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
    }
  };

  const isDayTime = () => {
    if (
      !weatherData ||
      !weatherData.sunrise ||
      !weatherData.sunset ||
      !weatherData.lat ||
      !weatherData.lon
    )
      return true;

    const sunriseMinutes = timeStringToMinutes(weatherData.sunrise);
    const sunsetMinutes = timeStringToMinutes(weatherData.sunset);
    if (sunriseMinutes === null || sunsetMinutes === null) return true;

    const nowMinutes = getCityLocalMinutes();
    return nowMinutes >= sunriseMinutes && nowMinutes < sunsetMinutes;
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

      default:
        return day
          ? require("../../assets/status/nublado.jpg")
          : require("../../assets/status/nublado_noite.jpg");
    }
  };

  const getBackgroundColor = () => {
    if (!weatherData || !weatherData.weatherMain) return "#4A90E2";

    const main = weatherData.weatherMain.toLowerCase();
    const day = isDayTime();

    switch (main) {
      case "clear":
        return day ? "#167aab" : "#0D1B2A";
      case "clouds":
        return day ? "#8E9AAF" : "#2C3E50";
      case "rain":
      case "drizzle":
        return day ? "#5F7C8A" : "#1B263B";
      case "thunderstorm":
        return "#3B3B3B";
      case "snow":
        return "#D7E6F0";
      default:
        return day ? "#778899" : "#36454F";
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

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Fundo animado */}
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

      {/* Gradiente */}
      <Animated.View
        pointerEvents="none"
        style={[styles.fadeOut]}
      >
        <LinearGradient
          colors={[backgroundColor + "00", backgroundColor + "CC", backgroundColor + "FF"]}
          locations={[0, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* ScrollView com RefreshControl */}
      <Animated.ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            progressBackgroundColor={dark ? "#333" : "#fff"}
            colors={dark ? ["#66ccff", "#3399ff", "#00aaff"] : ["#2665ee", "#0084ff", "#1471dc"]}
            progressViewOffset={10}
            style={{ marginTop: 5 }}
          />
        }
      >
        {/* Container interno para empurrar os cards visualmente */}
        <View style={{ marginTop: SCREEN_HEIGHT * 0.6, paddingHorizontal: 16, paddingBottom: 100 }}>
          {children}
        </View>
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
  },
  headerOverlay: {
    paddingTop: Platform.OS === "android" ? 80 : 100,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
