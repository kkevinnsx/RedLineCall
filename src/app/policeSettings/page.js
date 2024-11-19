"use client";

import styles from "../styles/copSettings.module.css";
import NavBar from "../components/navPolice";
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

export default function PoliceSettings (){
    let [currentStep, setCurrentStep] = useState('Inicial');
    const [userFullName, setUserFullName] = useState(null);
    const [error, setError]       = useState(null);
    const [enderecos, setEnderecos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ocorrencias, setOcorrencias] = useState([]);
    const { register, handleSubmit, getValues, setValue, formState: { errors, isValid }, trigger } = useForm({ mode: 'onChange' });
    const [message, setMessage]   = useState(""); 
    const [newEmail, setNewEmail] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");

    const initialButton = () => {
        setCurrentStep('Inicial'); 
    };

    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
    }

    const handlePasswordChange = async (data) => {
        const { cpf, newPassword, confirmPassword } = data;
        
        if (newPassword !== confirmPassword) {
            toast.error('As senhas não correspondem');
            return;
        }
    
        try {
            const res = await fetch('/api/getCop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, newPassword, confirmPassword }),  
            });
    
            if (!res.ok) {
                const result = await res.json();
                toast.error(result.error || 'Erro ao alterar a senha');
                return;
            }
    
            toast.success('Senha alterada com sucesso!');
            setValue('cpf', '');
            setValue('newPassword', '');
            setValue('confirmPassword', '');
        } catch (error) {
            toast.error('Erro ao alterar a senha.');
            console.error('Erro ao alterar a senha: ', error);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
    
        try {
            const res = await fetch('/api/getCop', {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentEmail, newEmail }), 
            });
    
            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || 'Erro ao atualizar o e-mail');
                return;
            }
    
            toast.success('E-mail atualizado com sucesso!');
            setCurrentEmail(''); 
            setNewEmail('');
    
        } catch (error) {
            console.error('Erro ao atualizar o e-mail:', error);
            toast.error('Erro ao atualizar o e-mail');
        }
    }

    const fetchUserData = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/getCop');
          const data = await res.json();
          console.log("Resposta da API:", data);
      
          if (data.ocorrencias && data.ocorrencias.length > 0) {
            setOcorrencias(data.ocorrencias); 
          } else {
            console.log("Nenhuma ocorrência encontrada.");
          }
      
          setUserFullName(data.fullName);
        } catch (error) {
          console.error('Erro ao buscar informações do usuário', error);
          setError('Erro ao buscar informações do usuário');
        } finally {
          setLoading(false);
        }
      };
      
      const fetchAdressFromCoordinates = async (latitude, longitude) => {
        if (!latitude || !longitude) {
            return 'Localização não disponível';
        }
    
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
    
            if (data && data.address) {
                const { road, city, state } = data.address;
                const formattedAddress = `${road || ''}, ${city || ''}, ${state || ''}`;
                return formattedAddress.trim().replace(/(^,)|(,$)/g, ""); 
            } else {
                return 'Endereço não encontrado';
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            return 'Erro ao obter endereço';
        }
    };

    useEffect(() => {
        const loadEnderecos = async () => {
            setLoading(true);
            const novosEnderecos = await Promise.all(
                ocorrencias.map(async (ocorrencia) => {
                    const endereco = await fetchAdressFromCoordinates(
                        ocorrencia.localizacao.latitude,
                        ocorrencia.localizacao.longitude
                    );
                    return endereco;
                })
            );
            setEnderecos(novosEnderecos);
            setLoading(false);
        };
    
        loadEnderecos();
    }, [ocorrencias]);
    
    useEffect(() => {
        fetchUserData();
    },
    []);
    
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
                      onClick={() => handleStepChange('historico')}
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
                      onClick={() => handleStepChange('informacao')}
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
                      onClick={() => handleStepChange('termosUsuario')}
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
                      onClick={() => handleStepChange('desconectar')}
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
          </div>
      </div>
        <div className={styles.rightContainer}>
            <ToastContainer />
            {currentStep === 'Inicial' && (
                <>
                    <p className={styles.boxOptionInitial}>Selecione uma opção</p>
                    <p className={styles.boxOptionSecond}>Para desbloquear a página</p>
                    <div className={styles.lockCircle}>
                        <FaLock className={styles.boxLock}/>
                    </div>
                </>
            )}

            {currentStep === 'historico' && (
                <table>
                    <thead>
                        <tr>
                            <th>Últimas ocorrências</th>
                        </tr>
                        <tr>
                            <th>Data:</th>
                            <th>Motivo:</th>
                            <th>Localização:</th>
                            <th>Nome do Socorrido:</th>
                            <th>CPF do Socorrido:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ocorrencias.map((ocorrencia, index) => (
                            <tr key={index}>
                                <td>{new Date(ocorrencia.data).toLocaleDateString()}</td>
                                <td>{ocorrencia.motivo}</td>
                                <td>{enderecos[index] || 'Carregando endereço...'}</td>
                                <td>{ocorrencia.user?.fullName || 'Nome não disponível'}</td>
                                <td>{ocorrencia.user?.cpf || 'CPF não disponível'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {currentStep === 'informacao' && (
                <>
                    <p className={styles.boxOption}>Alterar informações pessoais</p>
                    <div className={styles.boxEmail}>
                        <button
                            type='button'
                            onClick={() => handleStepChange('email')}
                            className={styles.boxNavigation}
                        >
                            <p className={styles.navigationText}>Alterar email</p>
                            <div className={styles.navigationCircle}>
                                    <AiOutlineMail className={styles.navigationIcons}/>
                            </div>
                        </button>
                    </div>

                    <div className={styles.boxEmail}>
                        <button
                            type='button'
                            onClick={() => handleStepChange('senha')}
                            className={styles.boxNavigation}
                        >
                            <p className={styles.navigationText}>Alterar senha</p>
                            <div className={styles.navigationCircle}>
                                <AiOutlineMail className={styles.navigationIcons}/>
                            </div>
                        </button>
                    </div>

                </>
            )}

            {currentStep === 'email' && (
                <>
                <form onSubmit={handleEmailChange}>
                    <label className={styles.changeInfo}>Digite o email atual: </label>
                    <input 
                        type="email"
                        placeholder="Email atual"
                        className={styles.inputChange}
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        required
                    />

                    <label className={styles.changeInfo}>Digite o novo email: </label>
                    <input 
                        type="email"
                        placeholder="Novo email"
                        className={styles.inputChange}
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />

                    <button type="submit" className={styles.submitButton}>Atualizar o email</button>
                </form>

                {message && <p className={styles.message}>{message}</p>}
                </>
            )}

            {currentStep === 'senha' && (
                <>
                    <form onSubmit={handleSubmit(handlePasswordChange)}>
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
                            id="newPassword"
                            name="newPassword"
                            className={styles.inputChange}
                            {...register('newPassword', {required: "Nova senha é obrigatória"})}
                        />

                        <label className={styles.changeInfo}>Confirme a nova senha: </label>
                        <input 
                            type="password" 
                            placeholder="Nova senha"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={styles.inputChange}
                            {...register('confirmPassword', {required: "Confirmação de senha é obrigatória"})}
                        />

                        <button type="submit">Atualizar senha</button>
                    </form>
                </>
            )}

            {currentStep == 'termosUsuario' && (
                <>
                    <p className={styles.boxOptionTitle}> Termos de Uso - Red Line Call</p>
                    <div className={styles.userTermsText}>
                        <span className={styles.boxOptionTitle}>1. Definições e Descrição do Serviço</span>
                        O Red Line Call é uma plataforma digital que permite a interação entre cidadãos e viaturas policiais...
                    </div>
                    <p className={styles.boxOptionTitle}>2. Aceitação dos termos</p>    
                    <div className={styles.userTermsText}>
                        Ao acessar, navegar ou usar qualquer funcionalidade do site, você reconhece que leu, entendeu e concorda em estar
                        vinculado a estes termos de uso. Caso não concorde com algum item, você não 
                        deverá utilizar o site.
                    </div>
                    <p className={styles.boxOptionTitle}>3. </p>
                    <div className={styles.userTermsText}> XDDD XDDDD XDDDD </div>
                </>
            )}

            {currentStep === 'desconectar' && (
                <>
                    <p className={styles.boxOption}>Deseja desconectar?</p>
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
        </div>
      <NavBar/>
    </>
    )
}