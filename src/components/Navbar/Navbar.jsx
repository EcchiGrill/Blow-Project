import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import FavoriteChat from "components/Navbar/FavoriteChat/FavoriteChat";

const Navbar = (props) => {
  let favoriteChatsElements = props.data.chats.map((chat, i) => {
    if (i < 3) {
      return (
        <FavoriteChat
          id={chat.usertag}
          avatar={chat.avatar}
          status={chat.status}
        />
      );
    }
  });

  return (
    <nav className={styles.nav}>
      <div className={styles.navItems}>
        <li className={styles.item}>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? styles.active : styles.item
            }
          >
            Profile
          </NavLink>
        </li>
        <li className={styles.item}>
          <NavLink
            to="/chats"
            className={({ isActive }) =>
              isActive ? styles.active : styles.item
            }
          >
            Messages
          </NavLink>
        </li>
        <li className={styles.item}>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive ? styles.active : styles.item
            }
          >
            Gallery
          </NavLink>
        </li>
        <li className={styles.item}>
          <NavLink
            to="/music"
            className={({ isActive }) =>
              isActive ? styles.active : styles.item
            }
          >
            Music
          </NavLink>
        </li>
        <div className={styles.favoriteChats}>{favoriteChatsElements}</div>
      </div>
      <div className={styles.settings}>
        <li className={styles.item}>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? styles.active : styles.item
            }
          >
            Settings
          </NavLink>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
