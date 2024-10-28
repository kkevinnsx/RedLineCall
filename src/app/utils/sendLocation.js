"use client";

import { useState, useCallback } from "react";

const sendLocation = async ({ latitude, longitude }) => {
    try { 
        await fetch('/api/updateLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
        });
        console.log(`Localização enviada: Latitude ${latitude}, Longitude ${longitude}`);
    } catch (error) {
        console.error('Erro ao enviar localização', error);
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
                    setLocation({ latitude, longitude });
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
        }
    }, []);

    const startSendingLocation = useCallback(() => {
        if (!intervalId) {
            const id = setInterval(async () => {
                await updateLocation(); // Atualiza localização antes de enviar
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
