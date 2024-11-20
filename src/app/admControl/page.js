"use client";

import NavBar from "../components/navAdm";
import PoliceForm from "../../modules/auth/components/policeForm";
import { createPoliceAccount } from "../../modules/auth/actions/authActions";
import MaskedInput, { Masks } from "../masks/maskedInputs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import styles from "../styles/admControl.module.css";
import { RiAdminFill } from "react-icons/ri";
import { RiPoliceCarFill } from "react-icons/ri";
import { GrUserPolice } from "react-icons/gr";
import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";

export default function AdmControl () {
    let [currentStep, setCurrentStep] = useState('inicial');
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ mode: 'onSubmit' });

    const adressByCep = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data && !data.erro) {
                setValue('street', data.logradouro);
                setValue('city', data.localidade);
                setValue('state', data.uf);
            } else {
                console.error('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
        }
    };

    const onSubmit = async (data) => {
        if (Object.keys(errors).length > 0) {
            const firstError = errors[Object.keys(errors)[0]].message;
            toast.error(firstError);
            return;
        }

        try {
            await createPoliceAccount(data);
            toast.success('Cadastro realizado com sucesso!');
            reset();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao cadastrar policial. Tente novamente.');
        }
    };

    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
    }

    return (
    <>
        <ToastContainer />
        <div className={styles.leftContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.headerText}>ADMINISTRAÇÃO</h1>
                <RiAdminFill className={styles.headerIcons}/>
            </div>

            <div className={styles.admOptions}>
                <button
                    type='button'
                    onClick={() => handleStepChange('copRegistration')}
                    disabled={currentStep === 'copRegistration'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <GrUserPolice className={styles.optionsIcons} />
                        <p className={styles.optionsText}>
                            Cadastrar Policial
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>

            <div className={styles.admOptions}>
                <button
                    type='button'
                    onClick={() => handleStepChange('carRegistration')}
                    disabled={currentStep === 'carRegistration'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <RiPoliceCarFill className={styles.optionsIcons} />
                        <p className={styles.optionsText}>
                            Cadastrar Viatura
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>
        </div>

        <div className={styles.rightContainer}>
            {currentStep === 'inicial' && (
                <>
                    <p className={styles.boxOptionInitial}>Selecione uma Opção</p>
                    <div className={styles.lockCircle}>
                        <FaLock className={styles.boxLock}/>
                    </div>
                </>
            )}

            {currentStep === 'carRegistration' && (
                <PoliceForm/>
            )}

            {currentStep === 'copRegistration' && (
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className={styles.copOption}>Cadastrar Policial</p>
                    <label className={styles.changeInfo}>Nome: </label>
                    <input 
                        type="text"
                        placeholder="Nome completo"
                        id="fullName"
                        name="fullName"
                        className={styles.inputChange}
                        {...register('fullName', {required: "Nome completo é exigido"})}
                    />

                    <label className={styles.changeInfo}>CPF:</label>
                    <MaskedInput
                        mask={Masks.cpf}
                        className={styles.inputChange}
                        placeholder='CPF'
                        id="cpf"
                        name="cpf"
                        {...register('cpf', { required: "CPF é exigido" })}
                    />

                    <label className={styles.changeInfo}>Data de Nascimento:</label>
                    <input
                        type="date"
                        className={styles.inputChange}
                        id="birthDay"
                        name="birthDay"
                        {...register("birthDay", { required: "Data de nascimento é exigida" })}
                    />

                    <label className={styles.changeInfo}>CEP:</label>
                    <MaskedInput
                        mask={Masks.cep}
                        className={styles.inputChange}
                        placeholder='Código Postal'
                        id="cep"
                        name="cep"
                        {...register('cep', { required: "CEP é exigido" })}
                        onChange={(e) => {
                            const cep = e.target.value.replace(/\D/g, '');
                            setValue('cep', e.target.value);
                            if (cep.length === 8) { 
                                adressByCep(cep);
                            }
                        }}
                    />

                    <label className={styles.changeInfo}>Número do Endereço:</label>
                    <input 
                        type="number"
                        placeholder="Número do endereço"
                        id="number"
                        name="number"
                        className={styles.inputChange}
                        {...register('number', {required: "Número da casa é exigido"})}
                    />

                    <label className={styles.changeInfo}>Email: </label>
                    <input 
                        type="email" 
                        placeholder="Email"
                        id="email"
                        name="email"
                        className={styles.inputChange}
                        {...register('email', {required: "Email é exigido"})}
                    />

                    <label className={styles.changeInfo}>Senha: </label>
                    <input 
                        type="password"
                        placeholder="Nova senha"
                        id="password"
                        name="password"
                        className={styles.inputChange}
                        {...register('password', {required: "Senha é exigida"})}
                    />

                    <button type="submit">Cadastrar Policial</button>
                </form>
            </>
            )}
        </div>
        <NavBar />
    </>
    )
}