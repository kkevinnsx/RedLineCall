"use client";

import { useState, useCallback } from "react";

const sendLocation = async ({ latitude, longitude }) => {
    try {
        if (!latitude || !longitude) {
            console.error('Latitude ou longitude inválidas:', { latitude, longitude });
            return;
        }

        console.log('Enviando localização:', { latitude, longitude });
        
        const response = await fetch('/api/updateLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao enviar localização:', errorData);
            throw new Error('Falha ao enviar localização.');
        }

        console.log('Localização enviada com sucesso.');
    } catch (error) {
        console.error('Erro ao enviar localização:', error);
    }
};

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('Geolocalização não disponível'));
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (latitude && longitude) {
                    resolve({ latitude, longitude });
                } else {
                    reject(new Error('Latitude ou longitude inválidos'));
                }
            },
            (error) => {
                reject(new Error(`Erro ao obter localização: ${error.message}`));
            }
        );
    });
}

const useSendLocation = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [intervalId, setIntervalId] = useState(null);

    const updateLocation = useCallback(async () => {
        try {
            const { latitude, longitude } = await getCurrentLocation();

            if (!latitude || !longitude) {
                console.error('Coordenadas inválidas recebidas:', { latitude, longitude });
                return;
            }

            console.log('Localização atual obtida:', { latitude, longitude });
            setLocation({ latitude, longitude });
        } catch (error) {
            console.error('Erro ao obter localização:', error);
        }
    }, []);

    const startSendingLocation = useCallback(() => {
        if (!intervalId) {
            const id = setInterval(async () => {
                await updateLocation(); 
                if (location.latitude && location.longitude) {
                    sendLocation(location);
                }
            }, 5000);
            setIntervalId(id);
        }
    }, [intervalId, location, updateLocation]);

    const stopSendingLocation = useCallback(() => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [intervalId]);

    return { location, updateLocation, startSendingLocation, stopSendingLocation };
};

export default useSendLocation;
