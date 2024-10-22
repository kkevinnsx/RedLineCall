export const getRoute = async (userLocation, viaturaLocation, map) => {
    const url = `http://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${viaturaLocation.longitude},${viaturaLocation.latitude}?overview=full&geometries=geojson`;
    
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
  };
  