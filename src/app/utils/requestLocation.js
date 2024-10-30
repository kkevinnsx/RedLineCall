import { getCookie, setCookie } from 'cookies-next';

export const watchLocation = (setError, updateLocation) => {
    if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 1); // 1 dia de expiração
                
                setCookie('latitude', latitude, { expires: expirationDate });
                setCookie('longitude', longitude, { expires: expirationDate });
                
                updateLocation({ latitude, longitude });
            },
            (error) => {
                console.error('Erro ao obter a localização:', error);
                setError('Permissão para acessar a localização foi negada.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
        
        return watchId; // Retorna o ID do watch
    } else {
        setError('Geolocalização não é suportada pelo navegador.');
    }
};

export const setInitialLocation = async (setError, updateLocation) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 1); // 1 dia de expiração
                
                setCookie('latitude', latitude, { expires: expirationDate });
                setCookie('longitude', longitude, { expires: expirationDate });

                // Atualiza localização inicial no banco de dados
                await updateLocation({ latitude, longitude });
            },
            (error) => {
                console.error('Erro ao obter a localização:', error);
                setError('Permissão para acessar a localização foi negada.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    } else {
        setError('Geolocalização não é suportada pelo navegador.');
    }
};