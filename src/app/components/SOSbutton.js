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

    const sendInitialLocation = async () => {
        if (!userLocation) return;

        try {
            await fetch('/api/updateLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                }),
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
            // 1 - Enviar localização inicial do usuário
            await sendInitialLocation();

            // 2 - Acionar APIs relacionadas ao SOS
            console.log("Chamando APIs para buscar viaturas e status do chat");
            const response = await fetch('/api/sosButton', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                }),
            });

            const text = await response.text();
            if (!response.ok) {
                throw new Error(`HTTP ERROR! status: ${response.status}`);
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                throw new Error('Resposta não é JSON');
            }

            // 3 - Atualizar statusChat baseado na resposta da API
            if (data.statusChat !== undefined) {
                toast.success('Status do chat atualizado com sucesso!');
                setStatusChat(data.statusChat);
            } else {
                throw new Error('Status não retornado pela API');
            }

            // 4 - Iniciar/Parar envio de localização periódico com base no status do chat
            if (data.statusChat) {
                startSendingLocation();
            } else {
                stopSendingLocation();
            }
        } catch (error) {
            console.error("Erro ao atualizar o chatStatus:", error.message);
            toast.error("Erro ao atualizar o status do chat!");
            console.error('Erro ao ativar SOS:', error.message);
            toast.error('Erro ao ativar o SOS!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsersLocation = async () => {
            try {
                console.log("Buscando localização do usuário");
                const response = await fetch('/api/getUsersLocation');
                if (!response.ok) {
                    throw new Error(`Erro ao obter localizações: ${response.status}`);
                }
                const data = await response.json();
                setUserLocation(data.userLocation);
            } catch (error) {
                console.error('Erro ao obter a localização:', error.message);
                toast.error('Erro ao obter as localizações');
            }
        };
        fetchUsersLocation();
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
