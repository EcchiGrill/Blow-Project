import { NavLink } from "react-router-dom";
import styles from "./Chat.module.css";

const Chat = (props) => {
  let path = `/chats/${props.id}`;

  return (
    <li className={styles.chat}>
      <div className={styles.avatarWrapper}>
        <img className={styles.avatar} src={props.avatar} alt="" />
        <div
          className={`${styles.status} + ${
            props.status ? styles.online : styles.offline
          }`}
        ></div>
      </div>
      <NavLink
        to={path}
        className={({ isActive }) => (isActive ? styles.active : styles.chat)}
      >
        {props.username}
      </NavLink>
    </li>
  );
};

export default Chat;
