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
    const [loading, setLoading]                   = useState("");
    const [ocorrencias, setOcorrencias]           = useState([]);
    const [enderecos, setEnderecos]               = useState([]);
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

    const fetchAdressFromCep = async (cep) => {
        if (!cep) {
            return "CEP não disponível";
        }
    
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
    
            if (data.erro) {
                return "CEP inválido ou não encontrado";
            }
    
            const { logradouro, bairro, localidade, uf } = data;
            return `${logradouro || ""}, ${bairro || ""}, ${localidade || ""} - ${uf || ""}`.trim();
        } catch (error) {
            console.error("Erro ao buscar endereço pelo CEP:", error);
            return "Erro ao obter endereço";
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
        
                        const ocorrencias = data.users.flatMap(user => user.ocorrencias || []);
                        setOcorrencias(ocorrencias);
                    } else {
                        setUsers([]);
                        setOcorrencias([]); 
                    }
                } catch (error) {
                    console.error("Erro ao buscar usuários pelo CPF:", error);
                    toast.error("Erro ao buscar usuários.");
                }
            } else {
                setUsers([]);
                setOcorrencias([]);
            }
        };
    
        fetchUsersByCpf();
      }, [cpf]);

      useEffect(() => {
        const loadEnderecos = async () => {
            setLoading(true);
    
            const novosEnderecos = await Promise.all(
                users.map(async (user) => {
                    const endereco = await fetchAdressFromCep(user.cep);
                    return { cpf: user.cpf, endereco };
                })
            );
    
            setEnderecos(novosEnderecos); 
            setLoading(false);
        };
    
        if (users.length > 0) {
            loadEnderecos();
        }
    }, [users]);
    
    
    return (
    <> 
        <ToastContainer />
        <div className={styles.leftContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.headerText}>ADMINISTRAÇÃO</h1>
                <RiAdminFill className={styles.headerIcon}/>
            </div>

            <div className={styles.admOptions}>
                <div className={styles.userBox}>
                    <button
                        type='button'
                        onClick={() => handleStepChange('usersCrud')}
                        disabled={currentStep === 'usersCrud'}
                        className={styles.navigationButton}
                    >
                        <div className={styles.boxCircle}>
                            <HiOutlineUserGroup className={styles.boxIcons} />
                            <p className={styles.boxText}>
                                Verificar Usuários
                            </p>
                            <IoIosArrowForward className={styles.boxArrow} />
                        </div>
                    </button>
                </div>

                <div className={styles.policeBox}>
                    <button
                        type='button'
                        onClick={() => handleStepChange('policesCrud')}
                        disabled={currentStep === 'policesCrud'}
                        className={styles.navigationButton}
                    >
                        <div className={styles.boxCircle}>
                            <GrUserPolice className={styles.boxIcons} />
                            <p className={styles.boxText}>
                                Verificar Policiais
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
                        <FaLock className={styles.boxLock} />
                    </div>
                </>
            )}

            {currentStep === 'usersCrud' && (
                <>
                    <p className={styles.boxOption}>Lista de Usuários</p>
                    <div className={styles.tableContainer}>
                        <div className={styles.headContainer}>
                            <label className={styles.searchLabel}>Pesquisar Usuário:</label>
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
                        </div>
                        <table className={styles.tableOccurrences}>
                            <thead>
                                <tr>
                                    <th>CPF:</th>
                                    <th>Nome:</th>
                                    <th>Email:</th>
                                    <th>Endereço:</th>
                                    <th>Motivo das Ocorrências:</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbodyBox}>
                                {users.map((user, index) => {
                                    const endereco =
                                        enderecos.find((end) => end.cpf === user.cpf)?.endereco ||
                                        "Carregando endereço...";
                                
                                    return (
                                        <tr key={user.cpf} className={styles.trBox}>
                                            <td className={styles.tdBox}>{user.cpf}</td>
                                            <td className={styles.tdBox}>{user.fullName}</td>
                                            <td className={styles.tdBox}>{user.email}</td>
                                            <td className={styles.tdBox}>{endereco}</td>
                                            <td className={styles.tdBox}>
                                                {user.ocorrencias.map((ocorrencia, ocorrenciaIndex) => (
                                                    <p key={ocorrenciaIndex}>{ocorrencia.motivo}</p>
                                                ))}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteUser(user.cpf)}
                                                >
                                                    <p className={styles.deleteText}>Deletar Usuário</p>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {currentStep === 'policesCrud' && (
                <>
                    <p className={styles.copBoxOption}>Lista de Viaturas</p>
                    <div className={styles.copTableContainer}>
                        <table className={styles.copTable}>
                            <thead>
                                <tr className={styles.copSearchRow}>
                                    <th colSpan="8" className={styles.copSearchHeader}>
                                        <span className={styles.copSearchLabel}>Pesquisar Viaturas:</span>
                                        <input
                                            type="text"
                                            className={styles.copInputChange}
                                            placeholder="Pesquise pelo número da viatura"
                                            id="searchCop"
                                            name="searchCop"
                                            value={copNumber}
                                            onChange={(e) => setCopNumber(e.target.value)}
                                            required
                                        />
                                    </th>
                                </tr>
                                <tr className={styles.copTableHeaderRow}>
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
                            <tbody className={styles.copTableBody}>
                                {cop.length > 0 ? (
                                    cop.map((viatura) => (
                                        <tr key={viatura.numeroViatura} className={styles.copTableRow}>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.copDynamicInput}
                                                    value={responsavelNome}
                                                    onChange={(e) => setResponsavelNome(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.copDynamicInput}
                                                    value={responsavelCpf}
                                                    onChange={(e) => setResponsavelCpf(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.copDynamicInput}
                                                    value={responsavelEmail}
                                                    onChange={(e) => setResponsavelEmail(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                {viatura.ocorrencias && viatura.ocorrencias.length > 0 ? (
                                                    viatura.ocorrencias.slice(0, 3).map((ocorrencia, index) => (
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            className={styles.copDynamicInput}
                                                            value={ocorrencia.motivo}
                                                            onChange={(e) => {
                                                                const updatedOcorrencias = [...viatura.ocorrencias];
                                                                updatedOcorrencias[index].motivo = e.target.value;
                                                                setCop([{ ...viatura, ocorrencias: updatedOcorrencias }]);
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <p className={styles.copNoData}>Nenhuma ocorrência encontrada</p>
                                                )}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.copDynamicInput}
                                                    value={numeroViatura}
                                                    onChange={(e) => setNumeroViatura(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.copDynamicInput}
                                                    value={modeloViatura}
                                                    onChange={(e) => setModeloViatura(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.copDynamicInput}
                                                    value={placaViatura}
                                                    onChange={(e) => setPlacaViatura(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.copDeleteButton}
                                                    onClick={() => handleDeleteUser(viatura.numeroViatura)}
                                                >
                                                    Deletar a Viatura
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.copUpdateButton}
                                                    onClick={handleUpdateCopData}
                                                >
                                                    Atualizar os Dados
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className={styles.copNoData}>
                                            Nenhuma viatura encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
        <NavBar/>
    </>
    )
}