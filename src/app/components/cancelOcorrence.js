"use client";
import { useState } from "react";
import styles from '../styles/cancelButton.module.css';

const CancelOccurrenceButton = ({ viatura, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancelOccurrence = async () => {
    setLoading(true);
    setError(null);
    try {
      // Faz a requisição para atualizar os dados da viatura e do usuário
      const response = await fetch("/api/cancelOccurrence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ viaturaId: viatura.id }), // Envia o ID da viatura
      });
      if (!response.ok) {
        throw new Error("Erro ao cancelar ocorrência.");
      }
      // Callback para limpar a rota no mapa (passado pela página)
      onCancel();
    } catch (error) {
      console.error("Erro ao cancelar a ocorrência:", error);
      setError("Erro ao cancelar a ocorrência.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cancelButtonContainer}>
      <button
        className={styles.cancelButton}
        onClick={handleCancelOccurrence}
        disabled={loading}
      >
        {loading ? "Cancelando..." : "Cancelar Ocorrência"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default CancelOccurrenceButton;
