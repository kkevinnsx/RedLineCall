import styles from "../styles/homePage.module.css";
import NavBar from "../components/nav";
import SOSbutton from "../components/SOSbutton";
import Location from "../components/locationComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  return (
    <>
      <ToastContainer />
      <div className={styles.leftContainer}>
        <Location />
        <div>
            <h1 className={styles.text}>SISTEMA DE OCORRÊNCIAS E DENÚNCIAS</h1>
        </div>
        <SOSbutton />
      </div>
      <div className={styles.rightContainer}>
        <p className={styles.messageBox} />
      </div>
      <NavBar />
    </>
  );
}
