import React from "react";
import { WebView } from "react-native-webview";

const createLeafletHTML = (filters) => `
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
      
       /* Estilo personalizado para a camada de precipitação - tema claro (azul) */
       .precipitation-layer {
         filter: contrast(9.0) saturate(10.5) brightness(0.8) hue-rotate(700deg);
         mix-blend-mode: multiply;
       }
       
       /* Contraste roxo-violeta para tema escuro */
       .dark-theme .precipitation-layer {
         filter: contrast(9.2) saturate(10.5) brightness(5.2) hue-rotate(370deg);
         mix-blend-mode: screen;
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

       // Aplicar classe de tema ao body
       if (${filters.temaEscuro}) {
         document.body.classList.add('dark-theme');
       } else {
         document.body.classList.remove('dark-theme');
       }

       // Mapa base (tema escuro ou claro)
      const baseLayer = L.tileLayer('${filters.temaEscuro ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}', {
        attribution: '© OpenStreetMap, © CartoDB'
      }).addTo(map);

      // Camada de nuvens
      const cloudsLayer = L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=69b60137458925882b3d327be216c401', {
        opacity: 0.7
      });

      // Camada de temperatura
      const tempLayer = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=69b60137458925882b3d327be216c401', {
        opacity: 0.4
      });

      // Camada de precipitação
      const precipLayer = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=69b60137458925882b3d327be216c401', {
        opacity: 0.9,
        className: 'precipitation-layer'
      });

      // Adicionar camadas baseado nos filtros
      if (${filters.nuvens}) {
        map.addLayer(cloudsLayer);
      }
      
      if (${filters.temperatura}) {
        map.addLayer(tempLayer);
      }

      if (${filters.precipitacao}) {
        map.addLayer(precipLayer);
      }

      // Dados de vento reais (via GitHub) - apenas se filtro de ventos estiver ativo
      if (${filters.ventos}) {
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
      }
    </script>
  </body>
  </html>
`;
// ODKEOOED
export default function MapaMeteorologico({ filters = { ventos: true, nuvens: true, temperatura: true, precipitacao: true, temaEscuro: true } }) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: createLeafletHTML(filters) }}
      style={{ flex: 1 }}
    />
  );
}
