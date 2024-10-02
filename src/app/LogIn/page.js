import styles from '../styles/LogIn.module.css'; 
import background from '../img/redLine.png';
import Image from 'next/image';
import LoginForm from '../../modules/auth/components/loginForm';

export default function login (){
    return(
        <div className={styles.container}>
            <div className={styles.imgLayout}>
                <Image
                    className={styles.imgBackground}
                    src={background}
                    alt='RedLine Logo'
                />
            </div>
            <LoginForm />
        </div>
    )
}