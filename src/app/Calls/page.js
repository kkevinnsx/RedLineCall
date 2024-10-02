import { TiLocation } from "react-icons/ti";
import styles from "../styles/Calls.module.css";
import NavBar from "../components/nav";
import { BiError } from "react-icons/bi";

export default function Calls (){
    return (
    <div>
        <div>
            <h1 className={styles.text}>SISTEMA DE OCORRÊNCIAS E DENÚNCIAS</h1>
        </div>
            <div className={styles.locationContainer}>
                <TiLocation className={styles.location} />
                <input
                  type="checkbox"
                  id="sliderLoc"
                  className={styles.input}
                />
                <label
                  htmlFor="sliderLoc"
                  className={styles.slider}
                />
            </div>
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