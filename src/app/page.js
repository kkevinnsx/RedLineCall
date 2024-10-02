import styles from './styles/page.module.css';
import Head from 'next/head';
import Image from 'next/image';
import logo from './img/fundoo.png';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>RedLine</title>
      </Head>
      <main className={styles.container}> 
        <Image
          className={styles.redLineLogo}
          src={logo}
          alt='RedLine Logo'
        />
        <Link href="/LogIn" className={styles.link}>
          <button className={styles.formSignIn_Button} type="submit">
            Sign In
          </button>
        </Link>
        <h2 className={styles.signInText}>Não possui uma conta?</h2>
        <Link href="/SignIn" className={styles.linkSignIn}> 
        <h2 className={styles.signInBot}>Fazer Cadastro</h2>
        </Link>
      </main>
    </>
  );
}
