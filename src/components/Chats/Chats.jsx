import styles from "./Chats.module.css";
import Chat from "components/Chats/Chat/Chat";
import MessageIncome from "components/Chats/Messages/MessageIncome";
import MessageOutcome from "components/Chats/Messages/MessageOutcome";

const Chats = (props) => {
  let chatsElements = props.data.chats.map((chat) => {
    return (
      <Chat
        id={chat.id}
        username={chat.username}
        avatar={chat.avatar}
        status={chat.status}
      />
    );
  });

  let messagesElementsIncome = props.data.messages.msgIn.map((msg) => {
    return <MessageIncome text={msg.text} img={msg.img} date={msg.date} />;
  });

  let messagesElementsOutcome = props.data.messages.msgOut.map((msg) => {
    return <MessageOutcome text={msg.text} img={msg.img} date={msg.date} />;
  });

  return (
    <main className={styles.chats}>
      <div className={styles.chatsList}>{chatsElements}</div>
      <div className={styles.chatWindow}>
        <div className={styles.profile}>
          <div className={styles.avatarWrapper}>
            <img
              className={styles.avatar}
              src="https://i.pinimg.com/564x/be/c6/ce/bec6ce7cd23e943519e9d7bb3c359d0a.jpg"
              alt=""
            />
            <div className={`${styles.status} + ${styles.online}`}></div>
          </div>
          <h2 className={styles.username}>Ryo</h2>
        </div>
        <div className={styles.messages}>
          {messagesElementsIncome}
          {messagesElementsOutcome}
        </div>
      </div>
    </main>
  );
};

export default Chats;
