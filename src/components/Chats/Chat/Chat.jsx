import { NavLink } from "react-router-dom";
import styles from "./../Chats.module.css";

const Chat = (props) => {
  let path = `/chats/${props.id}`;

  return (
    <li className={styles.chat}>
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
