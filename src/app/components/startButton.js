"use client";

import { useState } from "react";
import styles from "../styles/startButton.module.css";

export default function StartButton({ viatura }) {
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(viatura.status);
    const [loading, setLoading] = useState(false);

    const changeStatus = async () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocalização não é suportada pelo seu navegador.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await fetch('/api/startVigilance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: viatura.id,
                        latitude,
                        longitude
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP ERROR! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.status !== undefined) {
                    setStatus(data.status);
                } else {
                    throw new Error('Status não retornado pela API');
                }
            } catch (error) {
                console.error("Erro ao atualizar o status da viatura", error);
                setError("Erro ao atualizar o status. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("Erro ao obter a localização:", error);
            setError("Não foi possível obter a localização. Tente novamente.");
            setLoading(false);
        });
    };

    const buttonClass = status ? styles.btnAtivo : styles.btnDesativo; 
    const buttonText = loading ? 'Atualizando.' : (status ? 'Em vigilância' : 'Iniciar vigilância');

    return (
        <div>
            <button
                type="button"
                onClick={changeStatus}
                className={buttonClass}
                disabled={loading} 
            >
                <span className={styles.buttonText}>{buttonText}</span>
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
