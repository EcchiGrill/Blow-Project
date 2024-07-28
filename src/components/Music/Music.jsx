import { NavLink } from 'react-router-dom';
import styles from './Music.module.css'

const Music = () => {
    return (
    <main className={styles.music}>
        <h2>Music</h2>
        <nav className={styles.nav}>
        <li><NavLink>Overview</NavLink></li>
        <li><NavLink>Liked</NavLink></li>
        <li><NavLink>Playlists</NavLink></li>
        </nav>
    </main>
    );
} 

export default Music;