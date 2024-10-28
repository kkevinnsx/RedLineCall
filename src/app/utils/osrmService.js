import { pusherClient } from '../lib/pusherClient';

export const getRoute = async (userLocation, viaturaLocation, map) => {
  const url = `http://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${viaturaLocation.longitude},${viaturaLocation.latitude}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const routeCoordinates = data.routes[0].geometry.coordinates;
    const routeGeoJSON = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: routeCoordinates,
      },
    };

    if (map && map.getSource) {
      if (map.getSource("route")) {
        map.getSource("route").setData(routeGeoJSON);
      } else {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: routeGeoJSON,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
    } else {
      throw new Error('Map is not initialized properly');
    }

    const channel = pusherClient.subscribe('vehicle-location');
    await fetch('/api/updateRoute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route: routeGeoJSON }),
    });

    channel.bind('update-route', (newRoute) => {
      if (map.getSource("route")) {
        map.getSource("route").setData(newRoute);
      } else {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: newRoute,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
    });
  } catch (error) {
    console.error('Erro ao buscar rota:', error);
  }
};
