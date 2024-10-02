"use client";

import styles from "../styles/nav.module.css";
import { BiPhone } from "react-icons/bi";
import { BiHomeAlt } from "react-icons/bi";
import { BsGear } from "react-icons/bs";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useState, useEffect } from 'react';

const NavBar = () => {
    const pathname = usePathname(); 
    const isActive = (path) => pathname === path;
    const [activeClass, setActiveClass] = useState(""); 

    return (
        <nav className={styles.navBar}>
            <div className={styles.container}>
                <div className={styles.details}>
                    <Link href="/HomePage" className={`${styles.link} ${isActive('/HomePage') ? `${styles.active} ${activeClass}` : ''}`}>
                        <div className={`${styles.iconContainer} ${styles.iconBackground}`}>
                            <BiHomeAlt className={styles.icons} />
                        </div>
                    </Link>

                    <Link href="/Calls" className={`${styles.link} ${isActive('/Calls') ? `${styles.active} ${activeClass}` : ''}`}>
                        <div className={`${styles.iconContainer} ${styles.iconBackground}`}>
                            <BiPhone className={styles.icons} />
                        </div>
                    </Link>

                    <Link href="/Settings" className={`${styles.link} ${isActive('/Settings') ? `${styles.active} ${activeClass}` : ''}`}>
                        <div className={`${styles.iconContainer} ${styles.iconBackground}`}>
                            <BsGear className={styles.icons} />
                        </div>
                    </Link>
                </div>
            </div>   
        </nav>
    );
};

export default NavBar;
