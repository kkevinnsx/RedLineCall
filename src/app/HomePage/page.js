"use client";

import Image from "next/image";
import styles from "../styles/homePage.module.css";
import NavBar from "../components/nav";
import SOSbutton from "../components/SOSbutton";
import Location from "../components/locationComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import policeLoading from "../img/loadingPolice.png";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState("Inicial");
  const [timer, setTimer] = useState(0);

  return (
    <>
      <Location />
      <ToastContainer />
      <div className={styles.leftContainer}>
        <div>
          <h1 className={styles.text}>SISTEMA DE OCORRÊNCIAS E DENÚNCIAS</h1>
        </div>
        <SOSbutton setCurrentStep={setCurrentStep} setTimer={setTimer} />
      </div>
      <div className={styles.rightContainer}>
        {currentStep === "Inicial" && (
          <div className={styles.alertContainer}>
            <p className={styles.alertTitle}>Precisando de ajuda?</p>
            <p className={styles.alertSubtitle}>faça um chamado!</p>
            <Image
              className={styles.alertLoading}
              src={policeLoading}
              alt="RedLine Logo"
            />
          </div>
        )}

        {currentStep === "loading" && (
          <div className={styles.alertContainer}>
            <p className={styles.alertTitle}>Esperando....</p>
            <p className={styles.alertSubtitle}>
              Tempo: 00:0{timer < 10 ? timer : 5}
            </p>
            <div className={styles.loadingCircle}>
            </div>
            <Image
                className={styles.alertLoading}
                src={policeLoading}
                alt="RedLine Logo"
              />
          </div>
        )}
      </div>
      <NavBar />
    </>
  );
}
