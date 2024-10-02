import { getCookie, setCookie } from 'cookies-next';

export const requestLocation = (setError) => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1); // 1 dia de expiração

          setCookie('latitude', latitude, { expires: expirationDate });
          setCookie('longitude', longitude, { expires: expirationDate });

          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Erro ao obter a localização:', error);
          setError('Permissão para acessar a localização foi negada.');
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo navegador.');
      reject(new Error('Geolocalização não suportada'));
    }
  });
};
