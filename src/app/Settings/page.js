"use client";

import styles from "../styles/settings.module.css";
import NavBar from "../components/nav";
import { BiSolidUserCircle } from "react-icons/bi";
import { BiHistory } from "react-icons/bi";
import { BiSolidInfoCircle } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { BiSolidTrash } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import LogoutButton from "../components/LogoutButton";
import { useForm, useFormContext } from 'react-hook-form';
import React, { useState, useEffect } from "react";
import MaskedInput, { Masks } from "../masks/maskedInputs";
import axios from "axios";

export default  function Settings (){
    let [currentStep, setCurrentStep] = useState('inicial');
    const [userFullName, setUserFullName] = useState(null);
    const [error, setError] = useState(null);
    const { register, handleSubmit, getValues, setValue, formState: { errors, isValid }, trigger } = useForm({ mode: 'onChange' });

    const fetchUserFullName = async () => {
        try {
            const res = await fetch('/api/getUser');
            const data = await res.json();
            if(res.ok){
                setUserFullName(data.fullName)
            } else {
                setError(data.error || 'Erro desconhecido');
            }
        } catch (erro) {
            setError('Erro ao buscar informações do usuário');
        }
    }

    useEffect(() => {
        fetchUserFullName();
    }, []);

    const initialButton = async () => {
        if(typeof currentStep === 'string'){
            handleStepChange(currentStep = 'inicial')
        }
    }

    const historyButton = async () => {
        if(typeof currentStep === 'string') {
            handleStepChange(currentStep = 'historico')
        }
    }

    const informationButton = async () => {
        if(typeof currentStep === 'string'){
            handleStepChange(currentStep = 'informacao')
        }
    }

    const changeEmail = async () => {
        if(typeof currentStep === 'string'){
            handleStepChange(currentStep = 'email')
        }
    }

    const changePassword = async () => {
        if(typeof currentStep === 'string')
            handleStepChange(currentStep = 'senha')
    }

    const changeAdress = async () => {
        if(typeof currentStep === 'string')
            handleStepChange(currentStep = 'endereco')
    }

    const userTermsButton = async () => {
        if(typeof currentStep === 'string'){
            handleStepChange(currentStep = 'termosUsuario')
        }
    }

    const desconectButton = async () => {
        if(typeof currentStep === 'string'){
            handleStepChange(currentStep = 'desconectar')
        }
    }

    const deleteButton = async () => {
        if(typeof currentStep === 'string'){
            handleStepChange(currentStep = 'deletar')
        }
    }

    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
    }

    const adressByCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data && !response.data.erro) {
                setValue('street', response.data.logradouro);
                setValue('city',   response.data.localidade);
                setValue('state',  response.data.uf);
            } else {
                console.error('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
        }
    };

return (
    <>
    <div className={styles.leftContainer}>
        <div className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                {error ? error : `Usuario: ${userFullName}`}
            </h1>
            <BiUserCircle className={styles.headerIcon} /> 
        </div>

        <div className={styles.settingBox}>

            <div className={styles.historyBox}>
                <button
                    type='button'
                    onClick={historyButton}
                    disabled={currentStep == 'historico'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <BiHistory className={styles.boxIcons} />
                        <p className={styles.boxText}>
                            Histórico de Ocorrências
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>

            <div className={styles.userInfoBox}>
                <button
                    type='button'
                    onClick={informationButton}
                    disabled={currentStep == 'informacao'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <BiSolidInfoCircle className={styles.boxIcons}/>
                        <p className={styles.boxText}>
                            Editar Informações Pessoais
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>

            <div className={styles.userTermsBox}>
                <button
                    type='button'
                    onClick={userTermsButton}
                    disabled={currentStep == 'termosUsuario'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <BiSolidUserCircle className={styles.boxIcons}/>
                        <p className={styles.boxText}>
                            Termos de Uso
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>

            <div className={styles.desconectBox}>
                <button
                    type='button'
                    onClick={desconectButton}
                    disabled={currentStep == 'desconectar'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <BiLogOut className={styles.boxIcons}/>
                        <p className={styles.boxText}>
                            Desconectar
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                    </button>
            </div>

            <div className={styles.deleteBox}>
                <button
                    type='button'
                    onClick={deleteButton}
                    disabled={currentStep == 'deletar'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <BiSolidTrash className={styles.boxIcons}/>
                        <p className={styles.boxText}>
                            Apagar a conta
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>
        </div>
    </div>
    <div className={styles.rightContainer}>
        {currentStep === 'inicial' && (
            <>
                <p className={styles.boxOptionInitial}>Selecione uma opção</p>
                <div className={styles.lockCircle}>
                    <FaLock className={styles.boxLock}/>
                </div>
            </>
        )}

        {currentStep === 'historico' && (
            <>
                <p className={styles.boxOption}>Histórico de Ocorrêncais</p>
                <table className={styles.tableHistory}>
                    <th className={styles.tableTitle}>
                        <p className={styles.titleMessage}>Últimas ocorrências</p>
                    </th>
                    <tr className={styles.trBox}>

                    </tr>
                    <td className={styles.tdBox}>

                    </td>
                </table>
            </>
        )}

        {currentStep === 'informacao' && (
            <>
                <p className={styles.boxOption}>Alterar Informações Pessoais</p>
                <div className={styles.boxEmail}>
                    <button
                        type='button'
                        onClick={changeEmail}
                        className={styles.boxNavigation}
                    >
                        <p className={styles.navigationText}>Alterar Email</p>
                        <div className={styles.navigationCircle}>
                            <AiOutlineMail className={styles.navigationIcons}/>
                        </div>
                    </button>
                </div>

                <div className={styles.boxEmail}>
                    <button
                        type='button'
                        onClick={changePassword}
                        className={styles.boxNavigation}
                    >
                        <p className={styles.navigationText}>Alterar Senha</p>
                        <div className={styles.navigationCircle}>
                            <AiOutlineMail className={styles.navigationIcons}/>
                        </div>
                    </button>
                </div>

                <div className={styles.boxEmail}>
                    <button
                        type='button'
                        onClick={changeAdress}
                        className={styles.boxNavigation}
                    >
                        <p className={styles.navigationText}>Alterar Endereco</p>
                        <div className={styles.navigationCircle}>
                            <AiOutlineMail className={styles.navigationIcons}/>
                        </div>
                    </button>
                </div>
            </>
        )}

        {currentStep === 'email' && (
            <>
                <form>
                    <p className={styles.boxOption}>Alterar Email</p>
                    <label className={styles.changeInfo}>Digite o email atual: </label>
                    <input 
                        type="email"
                        placeholder="Email atual"
                        className={styles.inputChange}
                        id="email"
                        name="email"
                    />
                    
                    <label className={styles.changeInfo}>Digite o novo email: </label>
                    <input 
                        type="email"
                        placeholder="Novo email"
                        className={styles.inputChange}
                        id="email"
                        name="email"
                    />
                </form>
            </>
        )}

        {currentStep === 'senha' && (
            <>
                <form>
                    <p className={styles.boxOption}>Alterar a senha</p>

                    <label className={styles.changeInfo}>Confirme o seu CPF: </label>
                    <MaskedInput
                        mask={Masks.cpf}
                        className={styles.inputChange}
                        placeholder='Digite o seu CPF'
                        id="cpf"
                        name="cpf"
                        {...register('cpf', { required: "CPF is required" })}
                        required={true}
                    />

                    <label className={styles.changeInfo}>Digite a nova senha: </label>
                        <input 
                            type="password"
                            placeholder="Nova senha"
                            id="password"
                            name="password"
                            className={styles.inputChange}
                        />
                    
                    <label className={styles.changeInfo}>Confirme a nova senha: </label>
                        <input 
                            type="password" 
                            placeholder="Nova senha"
                            id="password"
                            name="password"
                            className={styles.inputChange}
                        />

                </form>
            </>
        )}

        {currentStep === 'endereco' && (
            <>
            <form>
                <p className={styles.boxOption}>Alterar o endereco</p>
                    <label className={styles.changeInfo}>CEP</label>
                        <MaskedInput
                            mask={Masks.cep}
                            className={styles.inputChange}
                            placeholder='Código Postal'
                            id="cep"
                            name="cep"
                            {...register('cep', { required: "CEP is required" })}
                            required={true}
                            onChange={(e) => {
                                const cep = e.target.value.replace(/\D/g, '');
                                setValue('cep', e.target.value);
                                if (cep.length === 8) { 
                                    adressByCep(cep);
                                }
                            }}
                        />

                        <label className={styles.changeInfo}>Estado</label>
                        <input
                            type="text"
                            className={styles.inputChange}
                            id="state"
                            name="state"
                            {...register("state")}
                            readOnly
                            required={true}
                        />
                        <label className={styles.changeInfo}>Cidade</label>
                        <input
                            type="text"
                            className={styles.inputChange}
                            id="city"
                            name="city"
                            {...register("city")}
                            readOnly
                            required={true}
                        />
                        <label className={styles.changeInfo}>Rua</label>
                        <input
                            type="text"
                            className={styles.inputChange}
                            id="street"
                            name="street"
                            {...register("street")}
                            readOnly
                            required={true}
                        />
                        <label className={styles.changeInfo}>Número da Casa</label>
                        <input
                            type="text"
                            className={styles.inputChange}
                            id="number"
                            name="number"
                            {...register("number", { required: "number is required" })}
                            required={true}
                        />
            </form>
            </>
        )}

        {currentStep == 'termosUsuario' && (
            <>
                <p className={styles.boxOption}> Termos de usuário</p>
                <p className={styles.userTermsText}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo ipsum magni 
                   deserunt modi id amet mollitia vitae explicabo recusandae, iusto adipisci 
                   eum optio saepe magnam aspernatur. Molestiae impedit eius mollitia!
                </p>
            </>
        )}

        {currentStep == 'desconectar' && (
            <>
                <p className={styles.boxOption}> Deseja desconectar?</p>
                <button
                    type="button"
                    onClick={initialButton}
                    className={styles.desconectButtonOne}
                >
                <p className={styles.desconectText}>Cancelar</p>
                </button>

                <LogoutButton className={styles.desconectButtonTwo}/>
            </>
        )}

        {currentStep == 'deletar' && (
            <>
                <p className={styles.boxOption}>Tem certeza que deseja apagar a conta?</p>
                <p className={styles.boxSubTitle}>Seus dados não poderão ser recuperados depois!</p>
                <button
                    type="button"
                    onClick={initialButton}
                    className={styles.desconectButtonOne}
                >
                <p className={styles.desconectText}>Cancelar</p>
                </button>
                
                <button
                    type="button"
                    className={styles.desconectButtonTwo}
                >
                </button>
            </>
        )}
    </div>
    <NavBar />
    </>
    )
}
