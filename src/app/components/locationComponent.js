"use client";

import { TiLocation } from "react-icons/ti";
import styles from "../styles/location.module.css";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";

const Location = () => {
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        const latitude = getCookie('latitude');
        const longitude = getCookie('longitude');

        if (latitude && longitude) {
            setLocationEnabled(true); 
        } else {
            getUserLocation();
        }
    }, []); 

    const getUserLocation = () => {
        console.log("Solicitando localização...");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCookie('latitude', latitude, { maxAge: 60 * 60 * 24 * 365 });
                    setCookie('longitude', longitude, { maxAge: 60 * 60 * 24 * 365 });
                    setLocationEnabled(true);  
                    console.log("Localização obtida:", position.coords);
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    if (error.code === error.PERMISSION_DENIED) {
                        setPermissionDenied(true); 
                    } else {
                        alert('Erro ao obter localização: ' + error.message);
                    }
                }
            );
        } else {
            alert("Geolocalização não suportada.");
        }
    };

    const handleLocationToggle = () => {
        if (locationEnabled) {
            console.log("Localização já ativada.");
            return;
        }

        if (permissionDenied) {
            alert("Você precisa ativar a permissão de localização nas configurações do navegador.");
        } else {
            getUserLocation();
        }
    };

    return (
        <div className={styles.locationContainer}>
            <TiLocation className={styles.location} onClick={handleLocationToggle} />
            <input
                type="checkbox"
                id="sliderLoc"
                className={styles.input}
                checked={locationEnabled} 
                readOnly 
            />
            <label
                htmlFor="sliderLoc"
                className={styles.slider}
            />
        </div>
    );
};

export default Location;
