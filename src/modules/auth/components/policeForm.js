"use client";
import styles from "../../../app/styles/admControl.module.css";
import { createPoliceCar } from "../actions/authActions";
import MaskedInput, { Masks } from "../../../app/masks/maskedInputs";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; 

export default function PoliceForm() {
    const { handleSubmit, register, reset } = useForm({ mode: 'onSubmit' }); 
    const [policeList, setPoliceList] = useState([]);
    const router = useRouter(); 

    const fetchPoliceList = async () => {
        try {
            const response = await fetch('/api/policeList');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPoliceList(data);
        } catch (error) {
            console.error("Erro ao buscar a lista de policiais:", error);
        }
    };

    useEffect(() => {
        fetchPoliceList();
    }, []);

    const onSubmit = async (policeData) => {
        try {
            await createPoliceCar({
                ...policeData,
                responsavelId: parseInt(policeData.policeList, 10),
                numeroViatura: parseInt(policeData.numeroViatura),
            });

            toast.success('Cadastro realizado com sucesso!');

            reset(); 

            router.refresh(); 
        } catch (error) {
            console.error(error);
            toast.error('Erro ao cadastrar a viatura.'); 
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1 className={styles.text}>ADMINISTRAÇÃO</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formCad}>
                <label className={styles.cadText}>CEP da DP</label>
                <MaskedInput
                    mask={Masks.cep}
                    className={styles.cadInputs}
                    placeholder='Código Postal'
                    id="cepDP"
                    name="cepDP"
                    {...register('cepDP')}
                    required={true}
                />
                <label className={styles.cadText}>N° da DP</label>
                <input 
                    type='text' 
                    placeholder="Número"
                    id="numeroDP"
                    name="numeroDP"
                    className={styles.cadInputs}
                    {...register('numeroDP')}
                    required={true}
                />
                <label className={styles.cadText}>Número da Viatura</label>
                <input 
                    type='text' 
                    id="numeroViatura"
                    name="numeroViatura"
                    placeholder="Número da Viatura" 
                    {...register('numeroViatura')}
                    className={styles.cadInputs}
                    required={true}
                />
                <label className={styles.cadText}>Modelo da viatura</label>
                <input 
                    type='text' 
                    id="modeloViatura"
                    name="modeloViatura"
                    placeholder="Modelo da Viatura" 
                    {...register('modeloViatura')}
                    className={styles.cadInputs}
                    required={true}
                />
                <label className={styles.cadText}>Placa da Viatura</label>
                <input 
                    type='text'
                    id="placaViatura"
                    name="placaViatura"
                    placeholder="Placa da viatura"
                    {...register('placaViatura')}
                    className={styles.cadInputs}
                    required={true}
                />
                <label className={styles.cadText}>Qual o policial responsável?</label>
                <select {...register("policeList")} className={styles.cadInputs}> 
                    <option value="">Selecione um policial</option>
                    {policeList.map(police => (
                        <option key={police.id} value={police.id}>{police.fullName}</option>
                    ))}
                </select>
                <button className={styles.formButton} type="submit">
                    Cadastrar Viatura
                </button>
            </form>
        </div>
    );
}
