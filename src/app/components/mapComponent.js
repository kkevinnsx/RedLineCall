"use client";

import { useEffect, useState } from 'react';
import styles from '../styles/map.module.css'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { requestLocation } from '../api/mapLocation/route'

const MapComponent = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    requestLocation(setError).then(({latitude, longitude}) => {
      const apiKey = "v1.public.eyJqdGkiOiJhNGEzNTExNC0wZTRiLTQyMTQtODc0Yi04NjVlYmU4YmZkNjEifQcPjWmkAW5H-JWfsVszyNT9smPR6I9UkUHjEamYsxUbwTmkzESulX1aj_Y2IIKHnE8nUj27x0Rl6SMpB9_pO08BMC-WDmDnLtWHi1ENkmr9FuzWuUnc-FOSEqSBH9BdgUgQi2LarOS0n7QIeCWWgSvrTyaj35a1nm84orqC7U6e9V963cWaP-hNhXOKf5F008UYaKK1ADQPDdVXbaOHDQiwbxJMOlvjBom-ZAimgxb2caOwdUCjo3_yKmbACEW7ygyOU46Z9ZljiwsJRrO_LVnZH0R7NcddhX9nhdorJp9CgJeIVu03Xn21WfHOfk36Nc1vhGPRcZA-y34nCTQmzV8.ZWU0ZWIzMTktMWRhNi00Mzg0LTllMzYtNzlmMDU3MjRmYTkx";
      const mapName = "word";
      const region = "us-east-1";

      const map = new maplibregl.Map({
      container: "map",
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: [longitude, latitude],
      zoom: 17,
    });

    // cria o carrin
    const carElement = document.createElement('div');
    carElement.className = styles.carElement;

    // adiciona o carrin
    const Marker = new maplibregl.Marker({element: carElement})
      .setLngLat([longitude, latitude])
      .addTo(map);

    const adjustMarkerSize = () => {
      const zoom = map.getZoom();
      const size = 75 * (zoom / 17)
      carElement.style.width  = `${size}px`;
      carElement.style.height = `${size}px`;
    }

    map.on('zoom', adjustMarkerSize)
    map.addControl(new maplibregl.NavigationControl(), "top-left");

      return () => {
        map.off('zoom', adjustMarkerSize);
        map.remove(); 
      };
    }).catch((error) =>{
      console.error(error);
    });
    }, []);
  return <div id="map" className={styles.map}/>;
};

export default MapComponent;
