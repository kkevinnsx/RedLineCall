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
  const [userMarker, setUserMarker] = useState(null); // Marcador do usuário
  const [viaturaMarker, setViaturaMarker] = useState(null); // Marcador da viatura

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

      // Cria o elemento visual do marcador do usuário
      const userElement = document.createElement('div');
      userElement.className = styles.userElement; // Estilo visual para o marcador do usuário

      const newUserMarker = new maplibregl.Marker({ element: userElement })
        .setLngLat([longitude, latitude])
        .addTo(newMap);

      setUserMarker(newUserMarker);

      // Adiciona controle de navegação
      newMap.addControl(new maplibregl.NavigationControl(), "top-left");

      return () => {
        newMap.remove();
      };
    };

    // Atualiza a posição do marcador do usuário
    const updateUserLocation = ({ latitude, longitude }) => {
      if (map && userMarker) {
        userMarker.setLngLat([longitude, latitude]);
        map.setCenter([longitude, latitude]);
      }
    };

    // Atualiza a posição do marcador da viatura
    const updateViaturaLocation = (viaturaLocation) => {
      if (map && viaturaLocation) {
        if (!viaturaMarker) {
          // Cria o marcador da viatura se ainda não existir
          const viaturaElement = document.createElement('div');
          viaturaElement.className = styles.viaturaElement; // Estilo visual para o marcador da viatura

          const newViaturaMarker = new maplibregl.Marker({ element: viaturaElement })
            .setLngLat([viaturaLocation.longitude, viaturaLocation.latitude])
            .addTo(map);

          setViaturaMarker(newViaturaMarker);
        } else {
          // Atualiza a localização da viatura
          viaturaMarker.setLngLat([viaturaLocation.longitude, viaturaLocation.latitude]);
        }
      }
    };

    // Observa a localização do usuário e inicializa o mapa ou atualiza a localização
    const watchId = watchLocation(setError, (location) => {
      const { latitude, longitude } = location;

      if (!map) {
        initMap({ latitude, longitude });
      } else {
        updateUserLocation({ latitude, longitude });
      }

      // Traçar rota se a viatura foi selecionada
      if (selectedViatura) {
        const viaturaLocation = {
          latitude: selectedViatura.latitude,
          longitude: selectedViatura.longitude,
        };
        updateViaturaLocation(viaturaLocation);
        getRoute({ latitude, longitude }, viaturaLocation, map);
      }
    });

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map, userMarker, viaturaMarker, selectedViatura]);

  return <div id="map" className={styles.map} />;
};

export default MapComponent;
