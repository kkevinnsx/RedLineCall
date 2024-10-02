import styles from "../styles/homePage.module.css";
import NavBar from "../components/nav";
import SOSbutton from "../components/SOSbutton";
import { TiLocation } from "react-icons/ti";

export default function HomePage() {
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
        <SOSbutton />
        <NavBar />
    </div>
  );
}