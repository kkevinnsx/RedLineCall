'use client';

import { useEffect, useState } from "react";
import styles from "../styles/SOSbutton.module.css";
import { toast } from "react-toastify";
import useSendLocation from "../utils/sendLocation";

export default function SOSbutton({ setCurrentStep, setTimer }) {
  const [loading, setLoading] = useState(false);
  const [statusChat, setStatusChat] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [message, setMessage] = useState("");
  const { startSendingLocation, stopSendingLocation } = useSendLocation();

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocalização não suportada pelo navegador.";
      
      toast.error(errorMsg);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude && longitude) {
          setUserLocation({ latitude, longitude });
          console.log("Localização obtida:", { latitude, longitude });
        } else {
          console.error("Latitude ou longitude inválidas:", { latitude, longitude });
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        const errorMsg = "Erro ao obter localização. Verifique as permissões.";
        
        toast.error(errorMsg);
      }
    );
  };

  const sendInitialLocation = async () => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      const errorMsg = "Localização indisponível. Verifique permissões.";
      
      toast.error(errorMsg);
      return;
    }

    try {
      const response = await fetch("/api/updateLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userLocation),
      });

      if (!response.ok) {
        const errorMsg = `Erro ao atualizar localização: ${response.status}`;
        
        toast.error(errorMsg);
      } else {
        const data = await response.json();
        console.log("Localização atualizada com sucesso:", data);
      }
    } catch (error) {
      console.error("Erro ao enviar localização inicial", error);
      const errorMsg = "Erro ao enviar localização inicial.";
      
      toast.error(errorMsg);
    }
  };

  const UserActiveSOS = async () => {
    setLoading(true);
    setCurrentStep("loading");
    setTimer(0);

    const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
    }, 1000);

    setTimeout(async () => {
        try {
            if (!userLocation || userLocation.latitude === null || userLocation.longitude === null) {
                const errorMsg = "Localização indisponível. Verifique permissões.";
                
                toast.error(errorMsg);
                return;
            }

            await sendInitialLocation();

            const response = await fetch("/api/sosButton", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userLocation),
            });

            const data = await response.json();

            if (response.ok) {
                const successMsg = data.message || "SOS enviado com sucesso!";
                setMessage(successMsg);
                toast.success(successMsg);

                if (successMsg === "SOS enviado com sucesso!") {
                    setStatusChat(true);
                    startSendingLocation();
                }
            } else {
                const errorMsg = data.message || `Erro: ${response.status}`;
                
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error("Erro ao ativar SOS:", error.message);
            const errorMsg = "Erro ao ativar o SOS!";
            
            toast.error(errorMsg);
        }
    }, 2000);

    setTimeout(() => {
        clearInterval(interval);
        setCurrentStep("Inicial");
    }, 4500);
};

  useEffect(() => {
    if (userLocation) {
      sendInitialLocation();
    }
  }, [userLocation]);

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div>
      <button
        type="button"
        className={styles.sosButton}
        onClick={UserActiveSOS}
        disabled={loading}
      >
        <h1 className={styles.sosText}>
          S.O.S
        </h1>
      </button>
      <div className={styles.messageContainer}>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
