'use client';

import { useEffect, useState } from "react";
import styles from "../styles/SOSbutton.module.css";
import { toast } from "react-toastify";
import { socket } from "../lib/socket"; // Importa a instância centralizada do WebSocket
import useSendLocation from "../utils/sendLocation";

export default function SOSbutton() {
  const [loading, setLoading] = useState(false);
  const [statusChat, setStatusChat] = useState(false);
  const { startSendingLocation, stopSendingLocation } = useSendLocation();

  useEffect(() => {
    if (!socket) return;

    // Escuta o evento de conexão do WebSocket
    socket.on("connect", () => {
      console.log("Conectado ao servidor WebSocket");
    });

    return () => {
      socket.off("connect"); // Remove o listener ao desmontar o componente
    };
  }, []);

  const UserActiveSOS = async () => {
    setLoading(true);
    try {
      // Faz uma requisição para buscar as viaturas disponíveis
      const viaturasResponse = await fetch("/api/getVehicles");

      if (!viaturasResponse.ok) {
        throw new Error(`Erro ao buscar viaturas: ${viaturasResponse.status}`);
      }

      const viaturas = await viaturasResponse.json();

      // Verifica se há viaturas disponíveis
      if (viaturas.length === 0) {
        toast.warn("Nenhuma viatura disponível no momento. Por favor, ligue para o 190");

        // Atualiza o status do usuário se não houver viaturas
        await fetch("/api/updateUserStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statusChat: false, statusOcor: false }),
        });

        return; // Sai da função
      }

      // Ativa o SOS e atualiza o status do usuário
      const response = await fetch("/api/userActiveSOS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Erro ao ativar SOS: ${response.status}`);
      }

      const data = await response.json();
      setStatusChat(data.statusChat);

      // Emite um evento SOS via WebSocket
      socket.emit("sos", { message: "SOS ativado", userId: data.userId, location: data.location });

      toast.success("SOS ativado com sucesso!");
    } catch (error) {
      console.error("Erro ao ativar SOS", error);
      toast.error("Erro ao ativar o SOS!");
    } finally {
      setLoading(false);
    }
  };

  // Controle de envio de localização com base no status do chat
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
        onClick={UserActiveSOS}
        disabled={loading}
      >
        <h1 className={styles.sosText}>
          {loading ? "....." : "S.O.S"}
        </h1>
      </button>
    </div>
  );
}
