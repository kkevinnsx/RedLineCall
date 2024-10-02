import styles from "../styles/GoogleButton.module.css";
import style from "../styles/LoginButton.module.css";
import {FcGoogle} from "react-icons/fc"

function LoginGoogleButton(){
    return(
    <button className={styles.button}>
        <FcGoogle />
        Acessar com Google
    </button>
    )
}

function SignInGoogleButton(){
    return(
    <button className={styles.button}>
        <FcGoogle />
        Registrar com Google
    </button>
    )
}

function LoginButton (){
    return(
        <button 
            className={style.button}>
            <h4 className={style.text}>LOGIN</h4>
    </button>
    )
}

export {LoginGoogleButton, SignInGoogleButton, LoginButton}

