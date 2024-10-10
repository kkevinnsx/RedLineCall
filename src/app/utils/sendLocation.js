"use client";

import { useEffect, useState, useCallback } from "react";
import { watchLocation } from "./requestLocation";

const sendLocation = async ({ latitude, longitude }) => {
    try { 
        await fetch('/api/updateLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
        });
    } catch (error) {
        console.error('Erro ao enviar localização', error);
    }
};

const useSendLocation = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    const [watchId, setWatchId] = useState(null);

    const startSendingLocation = useCallback(() => {
        if (!watchId) {
            const id = watchLocation(setError, (newLocation) => {
                const { latitude, longitude } = newLocation;
                setLocation({ latitude, longitude });
                sendLocation({ latitude, longitude });
            });
            setWatchId(id);
        }
    }, [watchId]);

    const stopSendingLocation = useCallback(() => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
    }, [watchId]);

    useEffect(() => {
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);
    
    return { location, error, startSendingLocation, stopSendingLocation };
};

export default useSendLocation;
