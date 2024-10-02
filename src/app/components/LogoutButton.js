"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
        <button onClick={handleLogout} disabled={loading}>
            {loading ? 'Saindo...' : 'LogOut'}
        </button>
    );
};

export default LogoutButton;
