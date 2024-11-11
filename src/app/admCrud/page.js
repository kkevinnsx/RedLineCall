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

export default function admCrud (){
    let [currentStep, setCurrentStep] = useState('inicial');
    const [cpf, setCpf]     = useState("");
    const [users, setUsers] = useState([]);

    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
    }

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
                                <th>Motivo das Ocorrências: </th>
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

                </>
            )}
        </div>
        <NavBar/>
    </>
    )
}