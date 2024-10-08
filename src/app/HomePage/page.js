import styles from "../styles/homePage.module.css";
import NavBar from "../components/nav";
import SOSbutton from "../components/SOSbutton";
import Location from "../components/locationComponent";

export default function HomePage() {
  return (
    <div>
        <div>
            <h1 className={styles.text}>SISTEMA DE OCORRÊNCIAS E DENÚNCIAS</h1>
        </div>
        <Location />
        <SOSbutton />
        <NavBar />
    </div>
  );
}