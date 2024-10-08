import styles from "../styles/Calls.module.css";
import NavBar from "../components/nav";
import { BiError } from "react-icons/bi";
import Location from "../components/locationComponent";

export default function Calls (){
    return (
    <div>
        <div>
            <h1 className={styles.text}>SISTEMA DE OCORRÊNCIAS E DENÚNCIAS</h1>
        </div>
        <Location />
            <div className={styles.boxError}>
                <BiError className={styles.BiError}/>
            </div>
            <h1 className={styles.Alert}>
                AVISO!
            </h1>
            <h3 className={styles.AlertText}>
                Nenhuma unidade policial ativa 
                na sua área, recomendamos que 
                você ligue na central pelo 190.
            </h3>
        <NavBar/>
    </div>
    )
}