"use client";

import styles from '../styles/401.module.css';
import Link from 'next/link';
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";

export default function error() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
  
    try{
      const response = await fetch('/api/logout', {method: 'POST'});
  
      if(!response.ok){
        throw new Error('Erro ao fazer logout. Tente Novamente.');
      }
      router.push('/LogIn');
    } catch (error) {
      console.error('Erro ao fazer logout: ', error);
      toast.error('Erro ao fazer desconectar')
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className={styles.bgContainer}> 
      <button
        type='button'
        onClick={handleLogout}
        className={styles.buttonDesconect}
      >
        <p>Ir para o Login.</p>
      </button>

      </div>
  );
}
