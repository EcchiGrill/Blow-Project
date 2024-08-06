import { NavLink } from "react-router-dom";
import styles from "./FavoriteChat.module.css";

const FavoriteChat = (props) => {
  let path = `/chats/${props.id}`;
  return (
    <NavLink className={styles.avatarWrapper} to={path}>
      <img className={styles.avatar} src={props.avatar} alt="" />
      <div
        className={`${styles.status} + ${
          props.status ? styles.online : styles.offline
        }`}
      ></div>
    </NavLink>
  );
};

export default FavoriteChat;
