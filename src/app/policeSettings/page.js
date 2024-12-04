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
import { useRouter } from 'next/navigation';
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";

export default function PoliceSettings (){
    let [currentStep, setCurrentStep] = useState('Inicial');
    const router = useRouter();
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

    const handleLogout = async () => {
        setLoading(true);
        try{
            const response = await fetch('/api/logout', { method: 'POST'});
            
            if(!response.ok) {
                throw new Error('Erro ao fazer logout. Tente Novamente.');
            }
            router.push('/LogIn');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            toast.error('Erro ao fazer desconectar')
        } finally {
            setLoading(false);
        }
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
                  {error ? error : `Bem vindo, ${userFullName}`}
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
                                    <th>Data:</th>
                                    <th>Motivo:</th>
                                    <th>Localização:</th>
                                    <th>Nome do Auxiliado:</th>
                                    <th>CPF do Auxiliado:</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbodyBox}>
                                {ocorrencias.map((ocorrencia, index) => (
                                    <tr key={index} className={styles.trBox}>
                                        <td className={styles.tdBox}>{new Date(ocorrencia.data).toLocaleDateString()}</td>
                                        <td className={styles.tdBox}>{ocorrencia.motivo}</td>
                                        <td className={styles.tdBox}>{enderecos[index] || 'Carregando Endereço...'}</td>
                                        <td className={styles.tdBox}>{ocorrencia.user?.fullName || 'Nome não Disponível'}</td>
                                        <td className={styles.tdBox}>{ocorrencia.user?.cpf || 'CPF não Disponível'}</td>
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
                                    onClick={() => handleStepChange('email')}
                                    className={styles.boxNavigation}
                                >
                                    <div className={styles.navigationCircle}>
                                        <p className={styles.navigationText}>Alterar Email</p>
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
                                    <div className={styles.navigationCircle}>
                                        <p className={styles.navigationText}>Alterar Senha</p>
                                        <RiLockPasswordFill className={styles.navigationIcons}/>
                                    </div>
                                </button>
                            </div>
                    </div>
                </>
            )}

            {currentStep === 'email' && (
                <>
                    <form onSubmit={handleEmailChange}>
                        <div className={styles.changeInfoGrid}>
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
                        </div>
                    </form>
                {message && <p className={styles.message}>{message}</p>}
                </>
            )}

            {currentStep === 'senha' && (
                <>
                    <form onSubmit={handleSubmit(handlePasswordChange)}>
                        <div className={styles.changeInfoGrid}>
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

                            <label className={styles.changeInfo}>Digite a Nova Senha: </label>
                            <input 
                                type="password"
                                placeholder="Nova Senha"
                                id="newPassword"
                                name="newPassword"
                                className={styles.inputChange}
                                {...register('newPassword', {required: "Nova senha é obrigatória"})}
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

                            <button type="submit" className={styles.submitButton}>Atualizar Senha</button>
                        </div>
                    </form>
                </>
            )}

            {currentStep == 'termosUsuario' && (
                <>
                    <p className={styles.boxOption}> Termos de Uso - Red Line Call</p>
                    <div className={styles.userTermsGrid}>
                        <div className={styles.userTermsLayout}>
                            <p className={styles.boxOptionTitle}>1. Definições e Descrição do Serviço</p>
                            <p className={styles.userTermsText}>
                                    O Red Line Call é uma plataforma digital que permite a interação entre cidadãos e
                                viaturas policiais, oferecendo serviços como visualização da localização das
                                viaturas, envio de solicitações de ajuda, notificação de ocorrências em tempo real,
                                etc. Nosso objetivo é promover  a segurança pública e a eficiência 
                                no atendimento emergencial, por meio da interação direta com a polícia.
                            </p>

                            <p className={styles.boxOptionTitle}>2. Aceitação dos termos</p>
                            <p className={styles.userTermsText}>
                                    Ao acessar, navegar ou usar qualquer 
                                funcionalidade do site, você reconhece que leu, entendeu e concorda em estar
                                vinculado a estes termos de uso. Caso não concorde com algum item, você não 
                                deverá utilizar o site.
                            </p>

                            <p className={styles.boxOptionTitle}>3. Responsabilidades do Usuário</p>
                            <p className={styles.userTermsText}>
                                    O Usuário compromete-se a:
                                <br />● Utilizar o site de maneira responsável e conforme a legislação vigente.
                                <br />● Fornecer informações verdadeiras e precisas durante o processo de interação com as viaturas policiais.
                                <br />● Não utilizar o serviço para fins ilegais, prejudiciais, ou qualquer outro uso que possa afetar negativamente 
                                a segurança e a integridade da plataforma ou de outros usuários.
                                <br />● Não enviar mensagens ou solicitações falsas ou fraudulentas.
                                <br />● Manter a confidencialidade de informações pessoais, quando solicitado.
                            </p>

                            <p className={styles.boxOptionTitle}>4. Responsabilidades da Viatura Policial</p>
                            <p className={styles.userTermsText}>
                                    As viaturas policiais comprometem-se a:
                                <br />● Responder de forma adequada e no tempo hábil às interações enviadas pelos cidadãos, dentro da capacidade operacional.
                                <br />● Manter o sigilo de informações pessoais dos cidadãos e não divulgar dados obtidos durante a interação, salvo quando exigido por lei.
                                <br />● Seguir as normas de conduta e o protocolo de segurança pública ao utilizar a plataforma.
                            </p>

                            <p className={styles.boxOptionTitle}>5. Propriedade Intelectual</p>
                            <p className={styles.userTermsText}>
                                    Todo o conteúdo do site, incluindo textos, imagens, logotipos, gráficos, marcas, códigos fonte e outros materiais relacionados, 
                                são de propriedade exclusiva do site Red Line Call ou de seus licenciadores. O uso de qualquer conteúdo do site sem autorização 
                                prévia é estritamente proibido.
                            </p>

                            <p className={styles.boxOptionTitle}>6. Privacidade e Proteção de Dados Pessoais</p>
                            <p className={styles.userTermsText}>
                                O site Red Line Call respeita a privacidade dos usuários e está comprometido em proteger os dados pessoais de acordo com as leis de proteção 
                            de dados aplicáveis (como a Lei Geral de Proteção de Dados Pessoais - LGPD no Brasil). Para mais informações, consulte nossa Política de Privacidade.
                            </p>

                            <p className={styles.boxOptionTitle}>7. Proibição de Uso Indevido</p>
                            <p className={styles.userTermsText}>
                                <br />● Usar o serviço para transmitir conteúdos difamatórios, ameaçadores, discriminatórios, ou ilegais.
                            Interferir ou interromper o funcionamento do site ou da plataforma.
                            <br />● Usar o site para atividades que possam prejudicar o bom funcionamento do serviço ou comprometer a segurança pública.
                            </p> 

                            <p className={styles.boxOptionTitle}>8. Limitação de Responsabilidade</p>
                            <p className={styles.userTermsText}>
                                O site Red Line Call não será responsável por quaisquer danos, perdas ou prejuízos resultantes da utilização do site, 
                            exceto nos casos de dolo ou negligência grave. O serviço depende de fatores técnicos, como a conectividade à internet 
                            e o funcionamento das viaturas, e pode não estar disponível em determinadas situações.
                            </p>

                            <p className={styles.boxOptionTitle}>9. Suspensão ou Cancelamento de Acesso</p>
                            <p className={styles.userTermsText}>
                            O site Red Line Call reserva-se o direito de suspender ou cancelar o acesso do usuário à plataforma caso identifique comportamentos 
                            indevidos, violação dos Termos de Uso, ou atividades que comprometam a segurança da plataforma ou a integridade dos dados.
                            </p>

                            <p className={styles.boxOptionTitle}>10. Modificações no Serviço</p>
                            <p className={styles.userTermsText}>
                            O site Red Line Call poderá modificar ou descontinuar seus serviços a qualquer momento, a seu exclusivo critério. 
                            Nenhuma modificação do serviço resultará em qualquer obrigação para o Red Line Call, exceto quando previsto em contrato específico.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {currentStep === 'desconectar' && (
                <>
                    <p className={styles.boxOption}>Deseja Desconectar?</p>
                    <div className={styles.actionsGrid}>
                        <button
                            type="button"
                            onClick={initialButton}
                            className={styles.desconectButtonOne}
                        >
                            <p className={styles.desconectText}>Cancelar</p>
                        </button>

                        <button 
                            type="button"
                            onClick={handleLogout}
                            className={styles.desconectButtonTwo}
                        >
                            <p className={styles.desconectText}>Desconectar</p>
                        </button>
                    </div>
                </>
            )}
        </div>
      <NavBar/>
    </>
    )
}