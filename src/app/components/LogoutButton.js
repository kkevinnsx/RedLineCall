"use client";

import styles from '../styles/cancelButton.module.css'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoExitOutline } from "react-icons/io5";

const LogoutButton = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true); 
        try {
            const response = await fetch('/api/logout', { method: 'POST' }); 
            
            if (!response.ok) {
                throw new Error('Erro ao fazer logout. Tente novamente.'); 
            }

            router.push('/LogIn'); 
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleLogout}>
        </button>
    );
};

export default LogoutButton;
