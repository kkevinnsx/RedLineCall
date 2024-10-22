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

        // Verifica se a geolocalização é suportada pelo navegador
        if (!navigator.geolocation) {
            setError("Geolocalização não é suportada pelo seu navegador.");
            setLoading(false);
            return;
        }

        // Obtém a localização do usuário
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Envia requisição POST para a API com a localização e o ID da viatura
                const response = await fetch('/api/startVigilance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: viatura.id,
                        latitude,
                        longitude,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: status ${response.status}`);
                }

                const data = await response.json();

                // Atualiza o status se a resposta da API for válida
                if (data.status !== undefined) {
                    setStatus(data.status);
                } else {
                    throw new Error('A API não retornou o status corretamente');
                }
            } catch (error) {
                console.error("Erro ao atualizar o status da viatura", error);
                setError("Erro ao atualizar o status. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        }, (geoError) => {
            // Tratamento de erro caso a geolocalização falhe
            console.error("Erro ao obter a localização:", geoError);
            setError("Não foi possível obter a localização. Verifique as permissões e tente novamente.");
            setLoading(false);
        });
    };

    const buttonClass = status ? styles.btnAtivo : styles.btnDesativo;
    const buttonText = loading ? 'Atualizando...' : (status ? 'Em vigilância' : 'Iniciar vigilância');

    return (
        <div>
            <button
                type="button"
                onClick={changeStatus}
                className={buttonClass}
                disabled={loading} // Desabilita o botão enquanto o status está sendo atualizado
            >
                <span className={styles.buttonText}>{buttonText}</span>
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe a mensagem de erro, se houver */}
        </div>
    );
}
