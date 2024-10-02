import styles from "../styles/admControl.module.css";
import NavBar from "../components/navAdm";

export default function admControl (){
    return (
    <div>
        <div>
            <h1 className={styles.text}>SISTEMA DE OCORRÊNCIAS E DENÚNCIAS</h1>
        </div>
            
        <NavBar/>
    </div>
    )
}