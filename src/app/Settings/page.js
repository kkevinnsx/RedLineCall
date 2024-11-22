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
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MaskedInput, { Masks } from "../masks/maskedInputs";
import axios from "axios";

export default  function Settings (){
    let [currentStep, setCurrentStep] = useState('inicial');
    const [userFullName, setUserFullName] = useState(null);
    const [currentEmail, setCurrentEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [message, setMessage]   = useState(""); 
    const [cep, setCep]           = useState("");
    const [number, setNumber]     = useState("");
    const [error, setError]       = useState(null);
    const [ocorrencias, setOcorrencias] = useState([]);
    const { register, handleSubmit, getValues, setValue, formState: { errors, isValid }, trigger } = useForm({ mode: 'onChange' });
        
    const handleDeleteAccount = async () => {
        try{
            const res = await fetch("/api/getUser", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ deleteAccount: true }),
            });

            const data = await res.json();
            
            if(res.ok){
                toast.success("Conta deletada com sucesso!");
                window.location.href = "/";
            } else {
                toast.error(data.error || "Erro ao deletar a conta");
            }
        
        } catch (error) {
            console.error("Erro ao deletar a conta: ", error);
            toast.error("Erro ao deletar a conta");
        }
    };

    const handlePasswordChange = async (data) => {
        const { cpf, newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword) {
            toast.error("As senhas não correspondem");
            return;
        }

        try{
            const res = await fetch("/api/getUser", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cpf, newPassword, confirmPassword}),
            });

            const result = await res.json();

            if(res.ok){
                toast.success("Senha alterada com sucesso!");
                setValue("cpf", "");
                setValue("newPassword", "");
                setValue("confirmPassword", "");
            } else {
                toast.error(result.error || "Erro ao alterar a senha");
            }
        } catch (error) {
            console.error("Erro ao alterar a senha: ", error);
            toast.error("Erro ao alterar a senha.")
        }
    };

        const adressByCep = async (cep) => {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (response.data && !response.data.erro) {
                    setValue('street', response.data.logradouro);
                    setValue('city', response.data.localidade);
                    setValue('state', response.data.uf);
                } else {
                    toast.error('CEP não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar o endereço:', error);
                toast.error("Erro ao buscar endereço.");
            }
        };
    
        const handleAddressChange = async (e) => {
            e.preventDefault();
            const {cep, number} = getValues();
    
            try {
                const res = await fetch("/api/getUser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cep, number }),
                });
    
                const data = await res.json();
    
                if (res.ok) {
                    toast.success("Endereço atualizado com sucesso!");
                    setValue('cep',"");
                    setValue('number',"");
                    setValue('state',"");
                    setValue('city',"");
                    setValue('street',"");
                } else {
                    toast.error(data.error || "Erro ao atualizar o endereço");
                }
            } catch (error) {
                console.error("Erro ao atualizar o endereço:", error);
                toast.error("Erro ao atualizar o endereço.");
            }
        };

    const handleEmailChange = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/getUser", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ currentEmail, newEmail }),
            });

            const data = await res.json();

            if(res.ok) {
                toast.success("E-mail atualizado com sucesso!");
                setCurrentEmail("")
                setNewEmail("")
            } else {
                toast.error(data.error || "Erro ao atualizar o e-mail");
            }
        } catch (error) {
            console.error("Erro ao atualizar o e-mail:", error);
            toast.error("Erro ao atualizar o e-mail.");
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await fetch('/api/getUser');
            const data = await res.json();

            if(res.ok){
                setUserFullName(data.fullName);

                const adressOcorrence = await Promise.all(data.ocorrencias.map(async ocorrencia => {
                    const { latitude, longitude } = ocorrencia.localizacao;
                    const address = await fetchAdressFromCoordinates(latitude, longitude);
                    return {...ocorrencia, address}
                }));

                setOcorrencias(adressOcorrence);
            } else {
                setError(data.error || 'Erro desconhecido');
            }
        } catch (erro) {
            setError('Erro ao buscar informações do usuário');
        }
    }

    const fetchAdressFromCoordinates = async(latitude, longitude) => {
        try{
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();

            const { road, city, state } = data.address;
            const formattedAddress = `${road || ''}, ${city || ''}, ${state || ''}`;

            return formattedAddress.trim().replace(/(^,)|(,$)/g, "")
        } catch (error) {
            console.error("Erro ao buscar endereço: ", error);
            return "Erro ao obter endereço";
        }
    };

    useEffect(() => {
        fetchUserData();
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

    
return (
    <>
    <div className={styles.leftContainer}>
        <div className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                {error ? error : `Bem vindo, ${userFullName}`}
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
                            Apagar a Conta
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
                <p className={styles.boxOptionInitial}>Selecione uma Opção</p>
                <p className={styles.boxOptionSecond}>Para Desbloquear a Página</p>
                <div className={styles.lockCircle}>
                    <FaLock className={styles.boxLock}/>
                </div>
            </>
        )}

        {currentStep === 'historico' && (
            <>
                <p className={styles.boxOption}>Histórico de Ocorrências</p>
                <div className={styles.tableContainer}>
                    <table className={styles.tableHistory}>
                        <thead>
                            <tr className={styles.trBox}>
                                <th>Data:        </th>
                                <th>Motivo:      </th>
                                <th>Localização: </th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbodyBox}>
                            {ocorrencias.map((ocorrencia, index) => (
                                <tr key={index} className={styles.trBox}>
                                    <td className={styles.tdBox}>{new Date(ocorrencia.data).toLocaleDateString()}</td>
                                    <td className={styles.tdBox}>{ocorrencia.motivo}</td>
                                    <td className={styles.tdBox}>{ocorrencia.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {currentStep === 'informacao' && (
            <>
                <p className={styles.boxOption}>Alterar Informações Pessoais</p>
                <div className={styles.setInfoBox}>
                    <div className={styles.boxEmail}>
                        <button
                            type='button'
                            onClick={changeEmail}
                            className={styles.boxNavigation}
                        >
                            <div className={styles.navigationCircle}>
                                <p className={styles.navigationText}>Alterar Email</p>
                                <AiOutlineMail className={styles.navigationIcons}/>
                            </div>
                        </button>
                    </div>

                    <div className={styles.passwordBox}>
                        <button
                            type='button'
                            onClick={changePassword}
                            className={styles.boxNavigation}
                        >
                            <div className={styles.navigationCircle}>
                                <p className={styles.navigationText}>Alterar Senha</p>
                                <AiOutlineMail className={styles.navigationIcons}/>
                            </div>
                        </button>
                    </div>

                    <div className={styles.addressBox}>
                        <button
                            type='button'
                            onClick={changeAdress}
                            className={styles.boxNavigation}
                        >
                            <div className={styles.navigationCircle}>
                                <p className={styles.navigationText}>Alterar Endereço</p>
                                <AiOutlineMail className={styles.navigationIcons}/>
                            </div>
                        </button>
                    </div>
                </div>
            </>
        )}

        {currentStep === 'email' && (
            <>
                <ToastContainer />
                <form onSubmit={handleEmailChange}>
                    <p className={styles.boxOption}>Alterar Email</p>
                    <label className={styles.changeInfo}>Digite o Email Atual: </label>
                    <input 
                        type="email"
                        placeholder="Email Atual"
                        className={styles.inputChange}
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        required
                    />
                    
                    <label className={styles.changeInfo}>Digite o Novo Email: </label>
                    <input 
                        type="email"
                        placeholder="Novo Email"
                        className={styles.inputChange}
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />

                    <button type="submit" className={styles.submitButton}>Atualizar o Email</button>
                </form>

                {message && <p className={styles.message}>{message}</p>}
            </>
        )}

        {currentStep === 'senha' && (
            <>
                <ToastContainer />
                <form onSubmit={handleSubmit(handlePasswordChange)}>
                    <p className={styles.boxOption}>Alterar a Senha</p>

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

                    <label className={styles.changeInfo}>Digite a Nova Senha: </label>
                        <input 
                            type="password"
                            placeholder="Nova Senha"
                            id="newPassword"
                            name="newPassword"
                            className={styles.inputChange}
                            {...register('newPassword', {required: "Nova senha é obrigatoria"})}
                        />
                    
                    <label className={styles.changeInfo}>Confirme a Nova Senha: </label>
                        <input 
                            type="password" 
                            placeholder="Confirme a Nova Senha"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={styles.inputChange}
                            {...register('confirmPassword', {required: "Confirmação de senha é obrigatória"})}
                        />

                    <button type="submit">Atualizar Senha</button>
                </form>
            </>
        )}

        {currentStep === 'endereco' && (
            <>
            <ToastContainer />
            <form onSubmit={handleAddressChange}>
                <p className={styles.boxOption}>Alterar o Endereço</p>
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
                            onChange={(e) => setNumber(e.target.value)}
                            {...register("number", { required: "number is required" })}
                            required={true}
                        />

                        <button type="submit">Atualizar Endereço</button>
            </form>
            </>
        )}

        {currentStep == 'termosUsuario' && (
            <>
                <p className={styles.boxOptionTitle}> Termos de Uso - Red Line Call</p>
                <p className={styles.userTermsText}><p>1. Definições e Descrição do Serviço</p>
                    O Red Line Call é uma plataforma digital que permite a interação entre cidadãos e
                    viaturas policiais, oferecendo serviços como visualização da localização das
                    viaturas, envio de solicitações de ajuda, notificação de ocorrências em tempo real,
                    etc. Nosso objetivo é promover  a segurança pública e a eficiência 
                    no atendimento emergencial, por meio da interação direta com a polícia.
                <p className={styles.boxOptionTitle}>2. Aceitação dos termos</p>    
                <p className={styles.userTermsText}>Ao acessar, navegar ou usar qualquer 
                    funcionalidade do site, você reconhece que leu, entendeu e concorda em estar
                    vinculado a estes termos de uso. Caso não concorde com algum item, você não 
                    deverá utilizar o site.
                </p>
                <p className={styles.boxOptionTitle}>3. </p>
                <p className={styles.userTermsText}> XDDD XDDDD XDDDD </p>
                </p>
            </>
        )}

        {currentStep == 'desconectar' && (
            <>
                <p className={styles.boxOption}> Deseja Desconectar?</p>
                <button
                    type="button"
                    onClick={initialButton}
                    className={styles.desconectButtonOne}
                >
                <p className={styles.desconectText}>Cancelar</p>
                </button>

                <button className={styles.desconectButtonTwo}>
                    <LogoutButton />
                </button>
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
                    onClick={handleDeleteAccount}
                    className={styles.desconectButtonTwo}
                >
                <p className={styles.desconectText}>Apagar a Conta</p>
                </button>
            </>
        )}
    </div>
    <NavBar />
    </>
    )
}