"use client";

import { useEffect, useState } from "react";
import { calculateDistance } from "../../modules/auth/services/locationService";

const ViaturasList = ({ availableViaturas, userLatitude, userLongitude}) => {
    const [sortedViaturas, setSortedViaturas] = useState([]);

    useEffect(()=> {
        if (availableViaturas.length > 0 && userLatitude && userLongitude){
            const sorted = calculateDistance(availableViaturas, userLatitude, userLongitude);
            setSortedViaturas(sorted);
        }
    }, [availableViaturas, userLatitude, userLongitude]);

    return (
        <div>
            <h2>
                Viaturas disponiveis:
            </h2>

            <ul>
                {sortedViaturas.map(viatura => (
                    <li key={viatura.id}>
                        {viatura.name} - distance: {viatura.distance} metros
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ViaturasList;