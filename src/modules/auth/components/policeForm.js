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
        if (!policeData.cepDP || !policeData.numeroDP || !policeData.numeroViatura ||
            !policeData.modeloViatura || !policeData.placaViatura || !policeData.policeList){
                toast.error('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
        
        if(policeData.policeList === ""){
            toast.error('Por favor, selecione um policial.');
            return;
        }

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
            <h1 className={styles.copOption}>Cadastrar Viatura</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formCad}>
                <label className={styles.changeInfo}>CEP da Delegacia</label>
                <MaskedInput
                    mask={Masks.cep}
                    className={styles.inputChange}
                    placeholder='Código Postal'
                    id="cepDP"
                    name="cepDP"
                    {...register('cepDP')}
                    required={true}
                />
                <label className={styles.changeInfo}>Número da Delegacia</label>
                <input 
                    type='text' 
                    placeholder="Número da Delegacia"
                    id="numeroDP"
                    name="numeroDP"
                    className={styles.cadInputs}
                    {...register('numeroDP')}
                    required={true}
                />
                <label className={styles.changeInfo}>Número da Viatura</label>
                <input 
                    type='text' 
                    id="numeroViatura"
                    name="numeroViatura"
                    placeholder="Número da Viatura" 
                    {...register('numeroViatura')}
                    className={styles.cadInputs}
                    required={true}
                />
                <label className={styles.changeInfo}>Modelo da Viatura</label>
                <input 
                    type='text' 
                    id="modeloViatura"
                    name="modeloViatura"
                    placeholder="Modelo da Viatura" 
                    {...register('modeloViatura')}
                    className={styles.cadInputs}
                    required={true}
                />
                <label className={styles.changeInfo}>Placa da Viatura</label>
                <input 
                    type='text'
                    id="placaViatura"
                    name="placaViatura"
                    placeholder="Placa da Viatura"
                    {...register('placaViatura')}
                    className={styles.cadInputs}
                    required={true}
                />
                <label className={styles.changeInfo}>Qual o Policial Responsável?</label>
                <select {...register("policeList")} className={styles.cadInputs}> 
                    <option value="">Selecione um Policial</option>
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
