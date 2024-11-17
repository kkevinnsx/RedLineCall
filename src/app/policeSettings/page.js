"use client";

import styles from "../styles/Calls.module.css";
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

export default function policeSettings (){
    let [currentStep, setCurrentStep] = useState('Inicial');
    const [userFullName, setUserFullName] = useState(null);
    const [error, setError]       = useState(null);
    
    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
    }


    
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

            <div className={styles.deleteBox}>
                <button
                    type='button'
                    onClick={() => handleStepChange('deletar')}
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
      <NavBar/>
    </>
    )
}