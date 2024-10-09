"use client";

import styles from "../styles/policeHome.module.css";
import NavBar from "../components/navPolice";
import Location from "../components/locationComponent";
import MapComponent from '../components/mapComponent';
import StartButton from "../components/startButton";
import { useEffect, useState } from "react";

export default function policeHomePage() {
    const [viatura, setViatura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        const fetchViatura = async () => {
            try {
                const response = await fetch('/api/startVigilance');
                if(!response.ok){
                    throw new Error(`Erro ao buscar viatura: ${response.status}`);
                }

                const data = await response.json();
                if(data.length > 0){
                    setViatura(data[0]);
                } else {
                    throw new Error ('Usuario não encontrado')
                }
            } catch (crash){
                console.log(crash);
                setError('Usuario não encontrado.');
            } finally {
                setLoading(false)
            }
        };
    
        fetchViatura();
    }, []);

    const handleStatusChange = (newStatus) => {
        setViatura((prevViatura) =>({
            ...prevViatura,
            status: newStatus,
        }))
    };

    const loadingMessage = "Carregando informações da viatura...";

    return (
        <>
            <Location />

            <p className={styles.carName}>{loading ? loadingMessage : null}</p>

            {viatura && (
                <>
                    <p className={styles.carName}>
                        Viatura N°: {viatura.numeroViatura } | Você está {viatura.status ? 'online' : 'offline'}
                    </p>
                    <p className={styles.vigilance}>
                        {viatura.status ? 'Deseja parar vigilância?' : 'Deseja iniciar vigilância?'}
                    </p>
                    <StartButton viatura={viatura} onStatusChange={handleStatusChange} />
                </>
            )}
            <MapComponent />
            <NavBar/>
        </>
    );
}
