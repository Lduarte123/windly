import React from "react";
import { WebView } from "react-native-webview";

const leafletHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Leaflet Wind Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden; /* Esconde tudo fora do mapa */
        background: #000; /* Fundo preto para a área fora do mapa */
      }
      #map {
        height: 100%;
        width: 100%;
        position: absolute; /* Garante que o mapa ocupe toda a tela */
        top: 0;
        left: 0;
      }
      /* Estilo do controle de zoom conforme solicitado */
      .leaflet-control-zoom {
        left: 50% !important;
        top: 85% !important;
        transform: translateX(-50%);
        right: auto !important;
        bottom: -59em !important;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <!-- Leaflet core -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

    <!-- Leaflet Velocity plugin -->
    <script src="https://unpkg.com/leaflet-velocity/dist/leaflet-velocity.min.js"></script>

    <script>
      var map = L.map('map', {
        zoomControl: true,
        attributionControl: false,
        maxBounds: [
          [-90, -180],
          [90, 180]
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 3, // Limita o zoom mínimo
        maxZoom: 10, // Limita o zoom máximo
        worldCopyJump: true, // Impede o mapa de se deslocar fora dos limites
      }).setView([-23.55, -46.63], 4);

      // Mapa base escuro
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB'
      }).addTo(map);

      // Camada de nuvens
      L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=69b60137458925882b3d327be216c401', {
        opacity: 0.7
      }).addTo(map);

      // Camada de temperatura
      L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=69b60137458925882b3d327be216c401', {
        opacity: 0.4
      }).addTo(map);

      // Dados de vento reais (via GitHub)
      fetch("https://raw.githubusercontent.com/danwild/leaflet-velocity/master/demo/wind-global.json")
        .then(res => res.json())
        .then(data => {
          const velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
              velocityType: "Global Wind",
              position: "bottomleft",
              emptyString: "Sem dados de vento",
              angleConvention: "bearingCW",
              speedUnit: "kt"
            },
            data: data,
            maxVelocity: 15
          });

          map.addLayer(velocityLayer);
        })
        .catch(err => console.error("Erro ao carregar dados de vento:", err));
    </script>
  </body>
  </html>
`;

export default function MapaMeteorologico() {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: leafletHTML }}
      style={{ flex: 1 }}
    />
  );
}
