"use client";

import { useState } from "react";
import styles from "../styles/SOSbutton.module.css";
import { toast } from "react-toastify";

export default function SOSbutton() {
    const [loading, setLoading] = useState(false);

    const UserActiveSOS = async () => {
        setLoading(true);
        
        try {
            const response = await fetch('/api/userActiveSOS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    
            if (data.statusChat !== undefined) {
                toast.success('Status do chat atualizado com sucesso!');
            } else {
                throw new Error('Status não retornado pela API');
            }
        } catch (error) {
            console.error("Erro ao atualizar o chatStatus", error);
            toast.error("Erro ao atualizar o status do chat!");
        } finally {
            setLoading(false);
        }
    };
    
    

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
