import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navlogo from '../../public/icons/Navlogo.svg';
import { UserAuth } from '../api/AuthContext';
import styles from '../app/styles/navbar.module.css';
const Navbar = () => {
  const { user, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);
  console.log('User:', user);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.titleContainer} onClick={() => router.push('/')}>
        <Image src={Navlogo} alt="Nav Logo" className={styles.logo} />
        <h1 className={styles.title}>MusicJournal</h1>
      </div>
      {loading ? null : !user ? (
        <div className={styles.navLinksContainer}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/logIn" className={styles.navLink}>
                Login
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/signUp" className={styles.navLink}>
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className={styles.navLinksContainer}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/createEntry" className={styles.navLink}>
                Create Entry
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/viewEntry" className={styles.navLink}>
                View Entries
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/createPlayList" className={styles.navLink}>
                Create PlayList
              </Link>
            </li>
            <li className={styles.navItem} onClick={handleSignOut}>
              Sign out
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
