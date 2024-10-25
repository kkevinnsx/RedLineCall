import { toast } from 'react-toastify';
import Pusher from '../../modules/auth/services/pusher';

/**
@param { number } vehicleLatitude
@param { number } vehicleLongitude 
@param { number } userLatitude
@param { number } userLongitude
@returns {Promise<object>}
*/
export async function fetchRoute(vehicleLatitude, vehicleLongitude, userLatitude, userLongitude) {
    const baseUrl = `http://router.project-osrm.org/route/v1/driving/`;
    const coordinates = `${vehicleLongitude},${vehicleLatitude};${userLongitude},${userLatitude}`;
    const url = `${baseUrl}${coordinates}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar rota. Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];

            // Atualiza a rota no Pusher
            fetch('/api/updateRoute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ route }), // Envia a nova rota
            });

            return route;
        } else {
            throw new Error('Nenhuma rota encontrada.');
        }
    } catch (error) {
        console.error('Erro ao buscar a rota', error);
        toast.error('Erro ao buscar a rota. Por favor, tente novamente.');
        return null;
    }
}
