"use client";

import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

const LocationPage = ({ latitude, longitude }) => {
    const [location, setLocation] = useState({ latitude, longitude });
    const [error, setError] = useState(null);

    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 1)
                    //expires: 1 pq expira em 1 dia
                    setCookie('latitude', latitude, { expires: expirationDate });
                    setCookie('longitude', longitude, { expires: expirationDate });

                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Erro ao obter a localização:', error);
                    setError('Permissão para acessar a localização foi negada.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,  // Não usa cache para localização
                }
            );
        } else {
            setError('Geolocalização não é suportada pelo navegador.');
        }
    };

    useEffect(() => {
        if (!latitude || !longitude) {
            requestLocation();
        }
    }, []);

    return (
        <div>
            <h1>Localização do usuário</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : location.latitude && location.longitude ? (
                <div>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            ) : (
                <p>Obtendo a localização...</p>
            )}
        </div>
    );
};

export default LocationPage;
