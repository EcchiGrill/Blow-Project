import styles from "./Chats.module.css";
import Chat from "components/Chats/Chat/Chat";
import Message from "components/Chats/Message/Message";

const Chats = (props) => {
  let chatsElements = props.chats.map((chat) => {
    return <Chat id={chat.id} username={chat.username} />;
  });
  let messagesElements = props.messages.map((msg) => {
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
