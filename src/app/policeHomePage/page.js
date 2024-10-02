import styles from "../styles/policeHome.module.css";
import NavBar from "../components/navPolice";
import Location from "../components/locationComponent";
import MapComponent from '../components/mapComponent';

export default function policeHomePage (){
    return (
        <>
            <Location />
            <p className={styles.carName}>
                Viatura N° 888 | Você está Offline
            </p>
            <p className={styles.vigilance}>
                Deseja iniciar vigilância?
            </p>
            <button className={styles.button}>
                <h1 className={styles.buttonText}>INICIAR</h1>
            </button>
            <MapComponent />
            <NavBar/>
        </>
    )
}