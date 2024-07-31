import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css'

const Navbar = () => {
    return (
      <nav className={styles.nav}>
      <li className={styles.item}><NavLink to='/profile' className={({isActive}) => isActive ? styles.active : styles.item}>Profile</NavLink></li>
      <li className={styles.item}><NavLink to='/chats' className={({isActive}) => isActive ? styles.active : styles.item}>Messages</NavLink></li>
      <li className={styles.item}><NavLink to='/gallery' className={({isActive}) => isActive ? styles.active : styles.item}>Gallery</NavLink></li>
      <li className={styles.item}><NavLink to='/music' className={({isActive}) => isActive ? styles.active : styles.item}>Music</NavLink></li>
      <li className={styles.item}><NavLink to='/settings' className={({isActive}) => isActive ? styles.active : styles.item}>Settings</NavLink></li>
    </nav>
    );
} 

export default Navbar;