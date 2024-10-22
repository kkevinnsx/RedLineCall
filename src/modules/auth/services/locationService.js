import { getDistance } from "geolib";

/**
@param   {Array}  availableViaturas
@param   {number} userLatitude
@param   {number} userLongitude
@returns {Array} 
*/

export const calculateDistance = (availableViaturas, userLatitude, userLongitude) => {
    const userLocation = {latitude: userLatitude, longitude: userLongitude};

    const viaturasDistances = availableViaturas.map(viatura => {
        const distance = getDistance(
            userLocation,
            { latitude: viatura.latitude, longitude: viatura.longitude}
        );

        return{...viatura, distance};
    });

    return viaturasDistances.sort((a, b) => a.distance - b.distance)
}
