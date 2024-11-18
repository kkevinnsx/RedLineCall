"use client";

import styles from "../styles/crud.module.css";
import NavBar from "../components/navAdm";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";
import { useForm, useFormContext } from 'react-hook-form';
import { RiAdminFill } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi";
import { GrUserPolice } from "react-icons/gr";
import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import MaskedInput, { Masks } from "../masks/maskedInputs";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function AdmCrud (){ 
    let [currentStep, setCurrentStep]             = useState('inicial');
    const [cpf, setCpf]                           = useState("");
    const [users, setUsers]                       = useState([]);
    const [cop, setCop]                           = useState([]);
    const [copNumber, setCopNumber]               = useState("");
    const [numeroViatura, setNumeroViatura]       = useState("");
    const [modeloViatura, setModeloViatura]       = useState("");
    const [placaViatura, setPlacaViatura]         = useState("");
    const [responsavelNome, setResponsavelNome]   = useState("");
    const [responsavelCpf, setResponsavelCpf]     = useState("");
    const [responsavelEmail, setResponsavelEmail] = useState("");
    const debouncedCopNumber = useDebounce(copNumber, 500); 

    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
    }

    useEffect(() => {
        const fetchCopByNumber = async () => {
            try {
                const response = await fetch("/api/getCopsCrud", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ numeroViatura: debouncedCopNumber }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const viatura = data.viatura;
    
                    setCop(viatura ? [viatura] : []);  
    
                    setNumeroViatura(viatura.numeroViatura || "");
                    setModeloViatura(viatura.modeloViatura || "");
                    setPlacaViatura(viatura.placaViatura || "");
                    setResponsavelNome(viatura.responsavel?.fullName || "");
                    setResponsavelCpf(viatura.responsavel?.cpf || "");
                    setResponsavelEmail(viatura.responsavel?.email || "");
                } else {
                    setCop([]); 
                    toast.error("Não foi encontrada uma viatura com esse número");
                }
            } catch (error) {
                console.error("Erro ao buscar viaturas: ", error);
                toast.error("Erro ao buscar viatura");
            }
        };
    
        if (debouncedCopNumber) {
            fetchCopByNumber();
        }
    }, [debouncedCopNumber]); 
    
    const handleUpdateCopData = async (e) => {
        e.preventDefault(); 

        const dados = {
            numeroViatura, 
            modeloViatura, 
            placaViatura, 
            responsavelNome, 
            responsavelCpf, 
            responsavelEmail,
            ocorrencias: cop[0]?.ocorrencias,
        };
    
        try {
            const response = await fetch("/api/getCopsCrud", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });
    
            if (response.ok) {
                const data = await response.json();
                toast.success("Viatura atualizada com sucesso!");
                setCop([data.viatura]);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Erro ao atualizar viatura.");
            }
        } catch (error) {
            console.error("Erro ao atualizar viatura:", error);
            toast.error("Erro ao atualizar viatura.");
        }
    };

    useEffect(() => {
        const fetchUsersByCpf = async () => {
          if (cpf.length >= 11) { 
            try {
              const response = await fetch("/api/getUsersCrud", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cpf }),
              });
    
              if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
              } else {
                setUsers([]);
              }
            } catch (error) {
              console.error("Erro ao buscar usuários pelo CPF:", error);
              toast.error("Erro ao buscar usuários.");
            }
          } else {
            setUsers([]);
          }
        };
    
        fetchUsersByCpf();
      }, [cpf]);

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
                    onClick={() => handleStepChange('usersCrud')}
                    disabled={currentStep === 'usersCrud'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <HiOutlineUserGroup className={styles.optionsIcons} />
                        <p className={styles.optionsText}>
                            Verificar Usuários
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>

            <div className={styles.admOptions}>
                <button
                    type='button'
                    onClick={() => handleStepChange('policesCrud')}
                    disabled={currentStep === 'policesCrud'}
                    className={styles.navigationButton}
                >
                    <div className={styles.boxCircle}>
                        <GrUserPolice className={styles.optionsIcons} />
                        <p className={styles.optionsText}>
                            Verificar policiais
                        </p>
                        <IoIosArrowForward className={styles.boxArrow} />
                    </div>
                </button>
            </div>

        </div>

        <div className={styles.rightContainer}>
            {currentStep === 'inicial' && (
                <>
                    <p className={styles.optionsInitial}>Selecione uma opção</p>
                    <div className={styles.lockCircle}>
                        <FaLock className={styles.boxLock} />
                    </div>
                </>
            )}

            {currentStep === 'usersCrud' && (
                <>
                    <p className={styles.boxOptions}> Lista de Usuários</p>
                    <table className={styles.tableUsers}>
                        <thead>
                            <tr>
                                <th className={styles.tableTitle}>
                                  Pesquisar usuário:
                                  <MaskedInput
                                    mask={Masks.cpf}
                                    className={styles.inputChange}
                                    placeholder="Pesquise por CPF:"
                                    id="searchUser"
                                    name="searchUser"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    required={true}
                                  />
                                </th>
                            </tr>
                            <tr className={styles.trBox}>
                                <th>CPF:                    </th>
                                <th>Nome:                   </th>
                                <th>Email:                  </th>
                                <th>Endereço:               </th>
                                <th>Motivo das ocorrências: </th>
                                <th>Ações                   </th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbodyBox}>
                            {users.map((user) => (
                                <tr key={user.cpf}>
                                    <td>{user.cpf}                </td>
                                    <td>{user.fullName}           </td>
                                    <td>{user.email}              </td>
                                    <td>{user.cep} - {user.number}</td>
                                    <td>
                                        {user.ocorrencias.map((ocorrencia, index) => (
                                            <p key={index}>{ocorrencia.motivo}</p>
                                        ))}
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            className={styles.deleteButton}
                                            onclick={() => handleDeleteUser(user.cpf)}
                                        >
                                        <p className={styles.deleteText}>Deletar Usuário</p>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {currentStep === 'policesCrud' && (
              <>
                <p className="boxOption">Lista de Viaturas</p>
                    <table className="tableCops">
                      <thead>
                        <tr>
                          <th className="tableTitle">
                            Pesquisar Viaturas
                            <input
                              type="text"
                              className="inputChange"
                              placeholder="Pesquise pelo número da viatura"
                              id="searchCop"
                              name="searchCop"
                              value={copNumber}
                              onChange={(e) => setCopNumber(e.target.value)}
                              required
                            />
                          </th>
                        </tr>
                        <tr className="trBox">
                          <th>Nome:</th>
                          <th>CPF:</th>
                          <th>Email:</th>
                          <th>Motivo das Ocorrências:</th>
                          <th>Número da Viatura:</th>
                          <th>Modelo da Viatura:</th>
                          <th>Placa da Viatura:</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody className="tbodyBox">
                        {cop.length > 0 ? (
                            cop.map((viatura) => (
                                <tr key={viatura.numeroViatura}>
                                    <td>
                                        <input
                                            type="text"
                                            value={responsavelNome}
                                            onChange={(e) => setResponsavelNome(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={responsavelCpf}
                                            onChange={(e) => setResponsavelCpf(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={responsavelEmail}
                                            onChange={(e) => setResponsavelEmail(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        {viatura.ocorrencias && viatura.ocorrencias.length > 0 ? (
                                            viatura.ocorrencias.slice(0, 3).map((ocorrencia, index) => (
                                                <input
                                                    key={ocorrencia.id}
                                                    type="text"
                                                    value={ocorrencia.motivo}
                                                    onChange={(e) => {
                                                        const updatedOcorrencias = [...viatura.ocorrencias];
                                                        updatedOcorrencias[index].motivo = e.target.value;
                                                        setCop([{ ...viatura, ocorrencias: updatedOcorrencias }]);
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <p>Nenhuma ocorrência encontrada</p>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={numeroViatura}
                                            onChange={(e) => setNumeroViatura(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={modeloViatura}
                                            onChange={(e) => setModeloViatura(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={placaViatura}
                                            onChange={(e) => setPlacaViatura(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="deleteButton"
                                            onClick={() => handleDeleteUser(viatura.numeroViatura)}
                                        >
                                            <p className="deleteText">Deletar a Viatura</p>
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="updateButton"
                                            onClick={handleUpdateCopData}
                                        >
                                            <p className="updateText">Atualizar os Dados</p>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="8">Nenhuma viatura encontrada.</td></tr>
                        )}
                      </tbody>
                    </table>
              </>
            )}
        </div>
        <NavBar/>
    </>
    )
}