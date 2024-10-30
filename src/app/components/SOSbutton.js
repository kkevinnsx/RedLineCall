'use client';

import { useEffect, useState } from "react";
import styles from "../styles/SOSbutton.module.css";
import { toast } from "react-toastify";
import useSendLocation from "../utils/sendLocation";

export default function SOSbutton() {
    const [loading, setLoading] = useState(false);
    const [statusChat, setStatusChat] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const { startSendingLocation, stopSendingLocation } = useSendLocation();

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocalização não suportada pelo navegador.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Erro ao obter localização:", error);
                toast.error("Erro ao obter localização.");
            }
        );
    };

    const sendInitialLocation = async () => {
        if (!userLocation) return;

        try {
            await fetch('/api/updateLocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userLocation),
            });
            console.log(`Localização inicial enviada: Latitude ${userLocation.latitude}, Longitude ${userLocation.longitude}`);
        } catch (error) {
            console.error('Erro ao enviar localização inicial', error);
            toast.error('Erro ao enviar localização inicial');
        }
    };

    const UserActiveSOS = async () => {
        setLoading(true);
        try {
            if (!userLocation?.latitude || !userLocation?.longitude) {
                toast.error("Localização não disponível. Verifique as permissões.");
                return;
            }

            await sendInitialLocation();
            console.log("Chamando APIs para buscar viaturas e status do chat");

            const response = await fetch('/api/sosButton', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userLocation),
            });

            const text = await response.text();
            if (!response.ok) throw new Error(`HTTP ERROR! status: ${response.status}`);

            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                throw new Error('Resposta não é JSON');
            }

            if (data.statusChat !== undefined) {
                toast.success('Status do chat atualizado com sucesso!');
                setStatusChat(data.statusChat);
            } else {
                throw new Error('Status não retornado pela API');
            }

            if (data.statusChat) {
                startSendingLocation();
            } else {
                stopSendingLocation();
            }
        } catch (error) {
            console.error("Erro ao ativar SOS:", error.message);
            toast.error('Erro ao ativar o SOS!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const handleClickSOS = async () => {
        await UserActiveSOS();
    };

    return (
        <div>
            <button
                type="button"
                className={styles.sosButton}
                onClick={handleClickSOS}
                disabled={loading}
            >
                <h1 className={styles.sosText}>
                    {loading ? "....." : "S.O.S"}
                </h1>
            </button>
        </div>
    );
}
