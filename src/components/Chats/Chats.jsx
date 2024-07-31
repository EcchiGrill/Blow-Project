import { NavLink } from "react-router-dom";
import styles from "./Chats.module.css";

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

const Message = (props) => {
  return <div className={styles.message}>{props.text}</div>;
};

const Chats = () => {
  let chatsData = [
    { id: 1, username: "Matr1x" },
    { id: 2, username: "Spike Spiegel" },
    { id: 3, username: "John Doe" },
  ];

  let messagesData = [
    { id: 1, text: "Hi John Doe!" },
    { id: 2, text: "Rofls" },
    { id: 3, text: "Fortnite balls" },
  ];

  let chatsElements = chatsData.map((chat) => {
    return <Chat id={chat.id} username={chat.username} />;
  });
  let messagesElements = messagesData.map((msg) => {
    return <Message text={msg.text} />;
  });

  return (
    <main className={styles.chats}>
      <div className={styles.chatsList}>{chatsElements}</div>
      <div className={styles.chatWindow}>
        <div className={styles.profile}>
          <img
            className={styles.avatar}
            src="https://i.pinimg.com/736x/0e/d3/8a/0ed38a5eafa6341394009c211f827e37.jpg"
            alt=""
          />
          <h2 className={styles.username}>Matr1x</h2>
        </div>
        <div className={styles.messages}>{messagesElements}</div>
      </div>
    </main>
  );
};

export default Chats;
