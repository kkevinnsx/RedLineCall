import styles from "../styles/admControl.module.css";
import NavBar from "../components/navAdm";

export default function admControl (){
    return (
    <div>
        <div>
            <h1 className={styles.text}>ADMINISTRAÇÃO</h1>
        </div>
        <form className={styles.formCad}>
            <input type='text' placeholder="teste" className={styles.cadInputs}/>
            <input type='text' placeholder="teste" className={styles.cadInputs}/>
            <input type='text' placeholder="teste" className={styles.cadInputs}/>
            <input type='text' placeholder="teste" className={styles.cadInputs}/>

        </form>
        <NavBar/>
    </div>
    )
}