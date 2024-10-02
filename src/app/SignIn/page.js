import styles from '../styles/SignIn.module.css'; 
import SignInForm from '../../modules/auth/components/signInForm';
import background from '../img/redLine.png';
import Image from 'next/image';

export default function SignIn (){
    return(
        <div className={styles.container}>
            <div className={styles.imgLayout}>
                <Image
                    className={styles.imgBackground}
                    src={background}
                    alt='RedLine Logo'
                />
            </div>
            <SignInForm/>
        </div>
    )
}