"use client";

import styles from "../styles/admControl.module.css";
import NavBar from "../components/navAdm";
import MaskedInput, { Masks } from "@/app/masks/maskedInputs";
import { useForm } from 'react-hook-form';

export default function admControl (){
    const { handleSubmit, register } = useForm({ mode: 'onSubmit' });
    
    const onSubmit = async (data) => {
        try {
            await createPoliceCar(data);
        } catch (error) {
            console.error
        }
    }

    return (
    <div>
        <div>
            <h1 className={styles.text}>ADMINISTRAÇÃO</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formCad}>
            <label className={styles.cadText}>CEP da DP</label>
            <MaskedInput
                mask={Masks.cep}
                className={styles.cadInputs}
                placeholder='Código Postal'
                id="cep"
                name="cep"
                required={true}
            />
            <label className={styles.cadText}>N° da DP</label>
            <input 
                type='text' 
                placeholder="Número" 
                className={styles.cadInputs}
            />
            <label className={styles.cadText}>Modelo da viatura</label>
            <input 
                type='text' 
                placeholder="Modelo da Viatura" 
                className={styles.cadInputs}
            />
            <label className={styles.cadText}>Placa da Viatura</label>
            <input 
                type='text'
                placeholder="Placa da viatura"
                className={styles.cadInputs}
            />
            <label className={styles.cadText}>Qual o policial responsável?</label>
            <select name="policeList" className={styles.cadInputs}> 
                <option value='example01'>Example01</option>
                <option value='example02'>Example02</option>
                <option value='example03'>Example03</option>
            </select>
        </form>
        <NavBar/>
    </div>
    )
}