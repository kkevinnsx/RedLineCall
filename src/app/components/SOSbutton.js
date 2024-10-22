"use client";

import { useEffect, useState } from "react";
import styles from "../styles/SOSbutton.module.css";
import { toast } from "react-toastify";
import useSendLocation from "../utils/sendLocation";

export default function SOSbutton() {
    const [loading, setLoading] = useState(false);
    const [statusChat, setStatusChat] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [vehicleLocation, setVehicleLocation] = useState(null);
    const { startSendingLocation, stopSendingLocation } = useSendLocation();

    const UserActiveSOS = async () => {
        setLoading(true);
        try {
            const viaturasResponse = await fetch('/api/getVehicles');
            
            if (!viaturasResponse.ok) {
                throw new Error(`Erro ao buscar viaturas: ${viaturasResponse.status}`);
            }

            const viaturas = await viaturasResponse.json();

            if (viaturas.length === 0) {
                toast.warn('Nenhuma viatura disponível no momento. Por favor, ligue para o 190');

                // Trata o erro ao atualizar status
                try {
                    await fetch('/api/updateUserStatus', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ statusChat: false, statusOcor: false }),
                    });
                } catch (error) {
                    console.error('Erro ao atualizar o status do usuário:', error);
                    toast.error('Erro ao atualizar o status do usuário');
                }

                return;
            }

            const response = await fetch('/api/userActiveSOS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao ativar SOS: ${response.status}`);
            }

            const data = await response.json();

            if (data.statusChat !== undefined) {
                toast.success('Status do chat atualizado com sucesso!');
                setStatusChat(data.statusChat);
            } else {
                throw new Error('Status não retornado pela API');
            }
        } catch (error) {
            console.error('Erro ao ativar SOS', error);
            toast.error('Erro ao ativar o SOS!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsersLocation = async () => {
            try {
                const response = await fetch('/api/getUsersLocation');
                
                if (!response.ok) {
                    throw new Error(`Erro ao obter localizações: ${response.status}`);
                }

                const data = await response.json();
                setUserLocation(data.userLocation);
                setVehicleLocation(data.vehicleLocation);
            } catch (error) {
                console.error('Erro ao obter a localização', error);
                toast.error('Erro ao obter as localizações');
            }
        };

        fetchUsersLocation();
    }, []);

    const handleClickSOS = async () => {
        await UserActiveSOS();
    };

    useEffect(() => {
        if (statusChat) {
            startSendingLocation();
        } else {
            stopSendingLocation();
        }
    }, [statusChat, startSendingLocation, stopSendingLocation]);

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
