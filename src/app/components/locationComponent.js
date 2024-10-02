"use client";

import { TiLocation } from "react-icons/ti";
import styles from "../styles/location.module.css";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

const Location = () => {
    const [locationEnabled, setLocationEnabled] = useState(false);

    useEffect(() => {
        const latitude = getCookie('latitude');
        const longitude = getCookie('longitude');

        if (latitude && longitude) {
            setLocationEnabled(true); 
        }
    }, []);

    return (
        <div className={styles.locationContainer}>
            <TiLocation className={styles.location} />
            <input
                type="checkbox"
                id="sliderLoc"
                className={styles.input}
                checked={locationEnabled} 
                readOnly 
            />
            <label
                htmlFor="sliderLoc"
                className={styles.slider}
            />
        </div>
    );
};

export default Location;
