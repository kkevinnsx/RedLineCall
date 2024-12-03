"use client";

import { useEffect, useState } from 'react';
import styles from '../styles/map.module.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchRouteData } from '../utils/fetchRoute';
import { getRoute } from '../utils/osrmService';
import { pusherClient } from '../lib/pusherClient'; // Importar o Pusher configurado

const MapComponent = ({ selectedViatura, userId }) => {
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [viaturaMarker, setViaturaMarker] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const apiKey = "v1.public.eyJqdGkiOiJhNGEzNTExNC0wZTRiLTQyMTQtODc0Yi04NjVlYmU4YmZkNjEifQcPjWmkAW5H-JWfsVszyNT9smPR6I9UkUHjEamYsxUbwTmkzESulX1aj_Y2IIKHnE8nUj27x0Rl6SMpB9_pO08BMC-WDmDnLtWHi1ENkmr9FuzWuUnc-FOSEqSBH9BdgUgQi2LarOS0n7QIeCWWgSvrTyaj35a1nm84orqC7U6e9V963cWaP-hNhXOKf5F008UYaKK1ADQPDdVXbaOHDQiwbxJMOlvjBom-ZAimgxb2caOwdUCjo3_yKmbACEW7ygyOU46Z9ZljiwsJRrO_LVnZH0R7NcddhX9nhdorJp9CgJeIVu03Xn21WfHOfk36Nc1vhGPRcZA-y34nCTQmzV8.ZWU0ZWIzMTktMWRhNi00Mzg0LTllMzYtNzlmMDU3MjRmYTkx";
  const mapName = "word";
  const region = "us-east-1"; 

  const fetchOcorrencias = async () => {
    try {
      const response = await fetch('/api/ocorrencias');
      const data = await response.json();
  
      console.log('Resposta da API:', data);
  
      if (data.viatura && data.usuario) {
        console.log('Viatura encontrada:', data.viatura);
        console.log('Usuário encontrado:', data.usuario);
  
        const viaturaCoords = { latitude: data.viatura.latitude, longitude: data.viatura.longitude };
        const usuarioCoords = { latitude: data.usuario.latitude, longitude: data.usuario.longitude };
        
        await updateRouteOnMap(viaturaCoords, usuarioCoords);
      } else {
        console.error('Erro: Dados não encontrados na resposta', data);
      }
  
      if (!response.ok) {
        throw new Error('Erro ao buscar ocorrências');
      }
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
    }
  };
  
  const initMap = ({ latitude, longitude }) => {
    if (!latitude || !longitude) {
      console.error('Coordenadas inválidas para inicializar o mapa.');
      return;
    }

    const newMap = new maplibregl.Map({
      container: "map",
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: [longitude, latitude],
      zoom: 17,
    });

    newMap.on('load', () => {
      setMap(newMap);
      const userElement = document.createElement('div');
      userElement.className = styles.userElement;
      const viaturaElement = document.createElement('div');
      viaturaElement.className = styles.viaturaElement;
      const newViaturaMarker = new maplibregl.Marker({ element: viaturaElement })
        .setLngLat([longitude, latitude])
        .addTo(newMap);
      setViaturaMarker(newViaturaMarker);

      newMap.addControl(new maplibregl.NavigationControl(), "top-left");

    });

    return () => newMap.remove();
  };

  function getUserId(user) {
    if (!user || !user.id) {
      console.error("ID do usuário inválido:", user);
      return null;
    }
    return user.id;
  }  

  const updateLocations = async () => {
    try {
      const id = getUserId({ id: userId }); 
      if (!userId) {
        console.warn("ID do usuário está vazio ou indefinido.");
        return;
      }
  
      const routeData = await fetchRouteData(userId);
      setLocations(routeData.locations);
    } catch (error) {
      console.error("Erro ao atualizar as localizações no mapa:", error);
    }
  };
  
  const updateUserLocation = ({ latitude, longitude }) => {
    if (map && userMarker) {
      userMarker.setLngLat([longitude, latitude]);
      map.setCenter([longitude, latitude]);
    }
  };
  

  const updateViaturaLocation = (coordinates) => {
    if (!coordinates) {
      setRouteCoordinates(null);
      return;
    }

    if (map && coordinates) {
      if (!viaturaMarker) {
        const viaturaElement = document.createElement('div');
        viaturaElement.className = styles.viaturaElement;
        const newViaturaMarker = new maplibregl.Marker({ element: viaturaElement })
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .addTo(map);
        setViaturaMarker(newViaturaMarker);
      } else {
        viaturaMarker.setLngLat([coordinates.longitude, coordinates.latitude]);
      }
    }
  };

  const updateRouteOnMap = async (viaturaCoords, usuarioCoords) => {
    try {
      const route = await getRoute(viaturaCoords, usuarioCoords);
  
      if (map && route) {
        const routeGeoJson = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        };
  
        if (map.getLayer('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }
  
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: routeGeoJson,
          },
          paint: {
            'line-color': 'rgba(26, 110, 219, 0.699)',
            'line-width': 6,
          },
        });
  
        map.setCenter([viaturaCoords.longitude, viaturaCoords.latitude]);
  
        const viaturaElement = document.createElement('div');
        viaturaElement.className = styles.viaturaMarker; 
  
        new maplibregl.Marker({ element: viaturaElement })
          .setLngLat([viaturaCoords.longitude, viaturaCoords.latitude])
          .addTo(map);
  
        console.log('Marcador da viatura adicionado na posição:', viaturaCoords);
  
        const userElement = document.createElement('div');
        userElement.className = styles.userMarker; 
  
        new maplibregl.Marker({ element: userElement })
          .setLngLat([usuarioCoords.longitude, usuarioCoords.latitude])
          .addTo(map);
  
        console.log('Marcador do usuário adicionado na posição:', usuarioCoords);
      }
    } catch (error) {
      console.error('Erro ao traçar a rota:', error);
    }
  };  
  
  const watchLocation = (setError, callback) => {
    return navigator.geolocation.watchPosition(
      (position) => callback(position.coords),
      (error) => setError(error.message),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    const watchId = watchLocation(setError, async (location) => {
      const { latitude, longitude } = location;

      if (!map) {
        initMap({ latitude, longitude });
      } else {
        updateUserLocation({ latitude, longitude });
      }

      if (selectedViatura) {
        const ocorrencias = await fetchOcorrencias(); 
        if (ocorrencias) {
          console.log('Ocorrência recebida:', ocorrencias);
        }
      }
    });

    const channel = pusherClient.subscribe('vehicle-location');
    channel.bind('update-location', (data) => {
      if (data && data.viatura) {
        updateViaturaLocation(data.viatura);
      }
      if (data.usuario) {
        updateUserLocation(data.usuario);
      }
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      pusherClient.unsubscribe('vehicle-location');
    };
  }, [selectedViatura, map]);

  return (
    <div>
      <div id="map" className={styles.map} />
      {error && <p>{error}</p>}
    </div>
  );
};

export default MapComponent;
