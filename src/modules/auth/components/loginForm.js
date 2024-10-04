"use client";

import styles from '../../../app/styles/LogIn.module.css';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import Link from 'next/link';
import React, { useState } from 'react';
import { loginAcess } from "../actions/authActions";
import { useForm } from "react-hook-form";
import MaskedInput, { Masks } from '../../../app/masks/maskedInputs';
import { useRouter } from 'next/navigation'; 

export default function LoginForm() {
    const { register, handleSubmit } = useForm();
    const [messages, setMessages] = useState('');
    const [alertActive, setAlertActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); 

    const onSubmit = async (data) => {
        setLoading(true);
        setAlertActive(true);
        setMessages('');
        try {
            const result = await loginAcess(data);
            setMessages('Login Efetuado com sucesso!');

            if (result.idPerfil === 'C') {
                router.push('/HomePage');
            } else if (result.idPerfil === 'B') {
                router.push('/policeHomePage');
            } else if (result.idPerfil === 'A'){
                router.push('/admCrud')
            }
        } catch (error) {
            console.error(error);
            setMessages('Login falhou. Tente novamente!');
        } finally {
            setLoading(false);
            setTimeout(() => setAlertActive(false), 3000);
            setTimeout(() => setMessages(''), 3000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${alertActive ? styles.active : ''} ${styles.alert}`}>
                {loading ? 'Carregando...' : messages}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Link href="/" className={styles.link}>
                    <button className={styles.startButton}>
                        <FaArrowAltCircleLeft />
                    </button>
                </Link>
                <p className={styles.title}>
                    Ocorrências e Denúncias
                </p>
                <label className={styles.logTexts}>CPF:</label>
                <MaskedInput
                    mask={Masks.cpf}
                    className={styles.logInputs}
                    placeholder='Digite o seu CPF'
                    id="cpf"
                    name="cpf"
                    {...register('cpf')}
                    required
                />

                <label className={styles.logTexts}>SENHA:</label>
                <input
                    type="password"
                    className={styles.logInputs}
                    placeholder='Digite sua senha'
                    id="password"
                    name="password"
                    {...register('password')}
                    required={true}
                />
                <button type="submit" className={styles.button}>
                    <h4 className={styles.text}>LOGIN</h4>
                </button>
            </form>
        </div>
    );
}