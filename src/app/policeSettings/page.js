import styles from "../styles/Calls.module.css";
import NavBar from "../components/navPolice";
import { BiError } from "react-icons/bi";

export default function policeSettings (){
    return (
    <div>
        <div>
            <h1 className={styles.text}>SISTEMA DE OCORRÊNCIAS E DENÚNCIAS</h1>
        </div>
        <div className={styles.boxError}>
                <BiError className={styles.BiError}/>
            </div>
            <h1 className={styles.Alert}>
                AVISO!
            </h1>
            <h3 className={styles.AlertText}>
                Pagina ainda em desenvolvimento!
                Retorne após conclusão
            </h3>
        <NavBar/>
    </div>
    )
}