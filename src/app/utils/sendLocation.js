"use client";

import { useEffect, useState, useCallback } from "react";

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
    const [error, setError] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [statusChat, setStatusChat] = useState(true); 

    const updateLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (statusChat) {
                        setLocation({ latitude, longitude });
                        sendLocation({ latitude, longitude });
                    } else {
                        setLocation({ latitude: null, longitude: null });
                        sendLocation({ latitude: null, longitude: null });
                    }
                },
                (err) => {
                    console.error('Erro ao obter localização:', err);
                    setError(err);
                }
            );
        }
    }, [statusChat]);

    const startSendingLocation = useCallback(() => {
        if (!intervalId) {
            updateLocation(); 
            const id = setInterval(updateLocation, 5000); 
            setIntervalId(id);
        }
    }, [intervalId, updateLocation]);

    const stopSendingLocation = useCallback(() => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [intervalId]);

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    useEffect(() => {
        if (!statusChat) {
            setLocation({ latitude: null, longitude: null });
            sendLocation({ latitude: null, longitude: null });
        }
    }, [statusChat]);
    
    return { location, error, startSendingLocation, stopSendingLocation, setStatusChat };
};

export default useSendLocation;
