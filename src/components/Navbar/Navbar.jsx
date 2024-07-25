import styles from './Navbar.module.css'

const Navbar = () => {
    return (
      <nav className={styles.nav}>
      <li><a className={`${styles.item} ${styles.active}`} href="/">Profile</a></li>
      <li><a className={styles.item} href="/">Messages</a></li>
      <li><a className={styles.item} href="/">News</a></li>
      <li><a className={styles.item} href="/">Music</a></li>
      <li><a className={styles.item} href="/">Settings</a></li>
    </nav>
    );
} 

export default Navbar;
