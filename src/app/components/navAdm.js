"use client";

import styles from "../styles/nav.module.css";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import LogoutButton from "./LogoutButton";

const NavBar = () => {
    const pathname = usePathname(); 
    const isActive = (path) => pathname === path;
    const [activeClass, setActiveClass] = useState(""); 

    return (
        <nav className={styles.navBar}>
            <div className={styles.container}>
                <div className={styles.details}>
                    <Link href="/admCrud" className={`${styles.link} ${isActive('/admCrud') ? `${styles.active} ${activeClass}` : ''}`}>
                        <div className={`${styles.iconContainer} ${styles.iconBackground}`}>
                            <LuClipboardList className={styles.icons} />
                        </div>
                    </Link>

                    <Link href="/admControl" className={`${styles.link} ${isActive('/admControl') ? `${styles.active} ${activeClass}` : ''}`}>
                        <div className={`${styles.iconContainer} ${styles.iconBackground}`}>
                            <IoAddCircleOutline className={styles.icons} />
                        </div>
                    </Link>

                    <div className={`${styles.iconContainer} ${styles.iconBackground}`}>
                    <LogoutButton />
                    </div>
                </div>
            </div>   
        </nav>
    );
};

export default NavBar;
