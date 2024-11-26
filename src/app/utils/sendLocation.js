"use client";

import { useState, useCallback } from "react";

const sendLocation = async ({ latitude, longitude }) => {
    try {
        // Verifique se os valores são válidos
        if (!latitude || !longitude) {
            console.error('Latitude ou longitude inválidas:', { latitude, longitude });
            return; // Não envie requisição com valores inválidos
        }

        console.log('Enviando localização:', { latitude, longitude }); // Debug
        const response = await fetch('/api/updateLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
        });

        if (!response.ok) {
            console.error('Erro ao enviar localização:', await response.json());
            throw new Error('Falha ao enviar localização.');
        }

        console.log('Localização enviada com sucesso.');
    } catch (error) {
        console.error('Erro ao enviar localização:', error);
    }
};


const useSendLocation = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [intervalId, setIntervalId] = useState(null);

    const updateLocation = useCallback(async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
    
                    if (!latitude || !longitude) {
                        console.error('Coordenadas inválidas recebidas:', { latitude, longitude });
                        return;
                    }
    
                    console.log('Localização atual obtida:', { latitude, longitude }); // Debug
                    setLocation({ latitude, longitude }); // Salva no estado
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            console.error('Geolocalização não é suportada pelo navegador.');
        }
    }, []);
    

    const startSendingLocation = useCallback(() => {
        if (!intervalId) {
            const id = setInterval(async () => {
                await updateLocation(); 
                sendLocation(location);
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
