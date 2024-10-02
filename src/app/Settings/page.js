import styles from "../styles/settings.module.css";
import NavBar from "../components/nav";
import { BiSolidUserCircle } from "react-icons/bi";
import { BiHistory } from "react-icons/bi";
import { BiSolidInfoCircle } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { BiSolidTrash } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link';
import LogoutButton from "../components/LogoutButton";


export default function Settings (){
    return (
    <div>
        <div className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                Usuario: Aluno@teste.io
            </h1>
            <BiUserCircle className={styles.headerIcon} />
        </div>

        <LogoutButton />

        <div className={styles.settingBox}>
            <div className={styles.historyBox}>
                <div className={styles.boxCircle}>
                    <BiHistory className={styles.boxIcons} />
                    <p className={styles.boxText}>
                        Histórico de Ocorrências
                    </p>
                    <IoIosArrowForward className={styles.boxArrow} />
                </div>
            </div>

            <div className={styles.userInfoBox}>
                <div className={styles.boxCircle}>
                    <BiSolidInfoCircle className={styles.boxIcons}/>
                    <p className={styles.boxText}>
                        Editar Informações Pessoais
                    </p>
                    <IoIosArrowForward className={styles.boxArrow} />
                </div>
            </div>

            <div className={styles.userTermsBox}>
                <div className={styles.boxCircle}>
                    <BiSolidUserCircle className={styles.boxIcons}/>
                    <p className={styles.boxText}>
                        Termos de Uso
                    </p>
                    <IoIosArrowForward className={styles.boxArrow} />
                </div>
            </div>

            <div className={styles.desconectBox}>
                <div className={styles.boxCircle}>
                    <BiLogOut className={styles.boxIcons}/>
                    <p className={styles.boxText}>
                        Desconectar
                    </p>
                    <IoIosArrowForward className={styles.boxArrow} />
                </div>
            </div>

            <div className={styles.deleteBox}>
                <div className={styles.boxCircle}>
                    <BiSolidTrash className={styles.boxIcons}/>
                    <p className={styles.boxText}>
                        Apagar a conta
                    </p>
                    <IoIosArrowForward className={styles.boxArrow} />
                </div>
            </div>
        </div>
        <NavBar />
    </div>
    )
}