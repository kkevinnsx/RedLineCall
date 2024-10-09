import styles from "../styles/policeHome.module.css";
import NavBar from "../components/navPolice";
import Location from "../components/locationComponent";
import MapComponent from '../components/mapComponent';
import StartButton from "../components/startButton";

export default function policeHomePage() {
    // Aqui você pode puxar a viatura de uma API, do estado global, ou simular para testar
    const viatura = {
        id: 1, // Supondo que a viatura tenha um id. Substitua isso pela lógica de busca real.
        nome: 'Viatura N° 888', // Outros dados que você queira exibir.
        status: false, // Status inicial da viatura
    };

    return (
        <>
            <Location />
            <p className={styles.carName}>
                {viatura.nome} | Você está {viatura.status ? 'Online' : 'Offline'}
            </p>
            <p className={styles.vigilance}>
                Deseja iniciar vigilância?
            </p>
            {/* Passando a viatura como prop para o StartButton */}
            <StartButton viatura={viatura} />
            <MapComponent />
            <NavBar/>
        </>
    );
}
