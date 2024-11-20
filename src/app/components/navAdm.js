"use client";

import styles from "../styles/nav.module.css";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoExitOutline } from "react-icons/io5";

const NavBar = () => {
    const pathname = usePathname(); 
    const router = useRouter();
    const isActive = (path) => pathname === path;
    const [loading, setLoading] = useState(false);
    const [activeClass, setActiveClass] = useState(""); 

    const handleLogout = async () => {
        setLoading(true); 
        try {
            const response = await fetch('/api/logout', { method: 'POST' }); 
            
            if (!response.ok) {
                throw new Error('Erro ao fazer logout. Tente novamente.'); 
            }
             router.push('/LogIn'); 
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                        <button onClick={handleLogout} className={styles.exitContainer}>
                            <IoExitOutline className={styles.icons}/>
                        </button>
                    </div>
                </div>
            </div>   
        </nav>
    );
};

export default NavBar;
