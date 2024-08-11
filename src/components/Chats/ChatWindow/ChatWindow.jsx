import styles from "./ChatWindow.module.css";
import MessageIncome from "components/Chats/ChatWindow/Messages/MessageIncome";
import MessageOutcome from "components/Chats/ChatWindow/Messages/MessageOutcome";
import { createRef } from "react";
import {
  sendMessageActionCreator,
  updateNewMessageTextActionCreator,
} from "redux/chatsReducer";

const ChatWindow = (props) => {
  let messagesSorted = props.messages.sort((a, b) => a.id - b.id);

  let messagesElements = messagesSorted.map((msg) => {
    if (msg.state === "in") {
      return (
        <MessageIncome
          avatar={props.avatar}
          text={msg.text}
          img={msg.img}
          date={msg.date}
        />
      );
    } else if (msg.state === "out") {
      return <MessageOutcome text={msg.text} img={msg.img} date={msg.date} />;
    }
  });

  let sendMessage = () => {
    props.dispatch(sendMessageActionCreator(props.usertag));
  };

  let updateNewMessageText = (e) => {
    let value = e.target.value;
    props.dispatch(updateNewMessageTextActionCreator(value));
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.profile}>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatar} src={props.avatar} alt="" />
          <div
            className={`${styles.status} + ${
              props.status ? styles.online : styles.offline
            }`}
          ></div>
        </div>
        <h2 className={styles.username}>{props.username}</h2>
      </div>
      <div className={styles.messages}>{messagesElements}</div>
      <div className={styles.messageFooter}>
        <div className={styles.attachment + " " + styles.item}>
          <button type="button">+</button>
        </div>
        <textarea
          className={styles.messageInput}
          onChange={updateNewMessageText}
          value={props.data.newMessageText}
          placeholder="Type your message here..."
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
        />
        <div className={styles.emoji + " " + styles.item}>
          <button type="button">:3</button>
        </div>
        <div className={styles.send + " " + styles.item}>
          <button type="button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
