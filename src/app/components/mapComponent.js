"use client";

import { useEffect, useState } from 'react';
import styles from '../styles/map.module.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { watchLocation } from '../utils/requestLocation';
import { getRoute } from '../utils/osrmService'; 

const MapComponent = ({ selectedViatura }) => {
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Chave da API, nome do mapa e região definidos diretamente
  const apiKey = "v1.public.eyJqdGkiOiJhNGEzNTExNC0wZTRiLTQyMTQtODc0Yi04NjVlYmU4YmZkNjEifQcPjWmkAW5H-JWfsVszyNT9smPR6I9UkUHjEamYsxUbwTmkzESulX1aj_Y2IIKHnE8nUj27x0Rl6SMpB9_pO08BMC-WDmDnLtWHi1ENkmr9FuzWuUnc-FOSEqSBH9BdgUgQi2LarOS0n7QIeCWWgSvrTyaj35a1nm84orqC7U6e9V963cWaP-hNhXOKf5F008UYaKK1ADQPDdVXbaOHDQiwbxJMOlvjBom-ZAimgxb2caOwdUCjo3_yKmbACEW7ygyOU46Z9ZljiwsJRrO_LVnZH0R7NcddhX9nhdorJp9CgJeIVu03Xn21WfHOfk36Nc1vhGPRcZA-y34nCTQmzV8.ZWU0ZWIzMTktMWRhNi00Mzg0LTllMzYtNzlmMDU3MjRmYTkx";
  const mapName = "word";
  const region = "us-east-1";

  useEffect(() => {
    // Inicializa o mapa com a localização do usuário
    const initMap = ({ latitude, longitude }) => {
      const newMap = new maplibregl.Map({
        container: "map",
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
        center: [longitude, latitude],
        zoom: 17,
      });

      setMap(newMap);

      // Cria o elemento visual do marcador
      const carElement = document.createElement('div');
      carElement.className = styles.carElement;

      const newMarker = new maplibregl.Marker({ element: carElement })
        .setLngLat([longitude, latitude])
        .addTo(newMap);

      setMarker(newMarker);

      // Ajusta o tamanho do marcador conforme o zoom
      const adjustMarkerSize = () => {
        const zoom = newMap.getZoom();
        const size = 75 * (zoom / 17);
        carElement.style.width = `${size}px`;
        carElement.style.height = `${size}px`;
      };

      newMap.on('zoom', adjustMarkerSize);
      newMap.addControl(new maplibregl.NavigationControl(), "top-left");

      return () => {
        newMap.off('zoom', adjustMarkerSize);
        newMap.remove();
      };
    };

    // Atualiza a posição do marcador
    const updateLocation = ({ latitude, longitude }) => {
      if (map && marker) {
        marker.setLngLat([longitude, latitude]);
        map.setCenter([longitude, latitude]);
      }
    };

    // Observa a localização do usuário e inicializa o mapa ou atualiza a localização
    const watchId = watchLocation(setError, (location) => {
      const { latitude, longitude } = location;
      if (!map) {
        initMap({ latitude, longitude });
      } else {
        updateLocation({ latitude, longitude });
      }

      // Traçar rota se a viatura foi selecionada
      if (selectedViatura) {
        const viaturaLocation = {
          latitude: selectedViatura.latitude,
          longitude: selectedViatura.longitude,
        };
        getRoute({ latitude, longitude }, viaturaLocation, map);
      }
    });

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map, marker, selectedViatura]);

  return <div id="map" className={styles.map} />;
};

export default MapComponent;
