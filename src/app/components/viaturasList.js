"use client";

import { useEffect, useState } from "react";
import { calculateDistance } from "../../modules/auth/services/locationService";

const ViaturasList = ({ availableViaturas, userLatitude, userLongitude, onAcceptCall }) => {
  const [sortedViaturas, setSortedViaturas] = useState([]);

  useEffect(() => {
    if (availableViaturas.length > 0 && userLatitude && userLongitude) {
      const sorted = calculateDistance(availableViaturas, userLatitude, userLongitude);
      setSortedViaturas(sorted);

      const nearestViatura = sorted[0];
      const acceptCall = window.confirm(`A viatura ${nearestViatura.name} está a ${nearestViatura.distance} metros. Deseja atender o chamado?`);
      if (acceptCall) {
        onAcceptCall(nearestViatura);
      }
    }
  }, [availableViaturas, userLatitude, userLongitude, onAcceptCall]);

  return (
    <div>
      <h2>Viaturas disponíveis:</h2>
      <ul>
        {sortedViaturas.map((viatura) => (
          <li key={viatura.id}>
            {viatura.name} - Distância: {viatura.distance} metros
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViaturasList;
