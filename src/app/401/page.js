import styles from '../styles/401.module.css';
import Link from 'next/link';

export default function error() {
  return (
    <div className={styles.bgContainer}> 
        <Link href='/api/logout'>
            <button>LogOut</button>
        </Link>
      </div>
  );
}
