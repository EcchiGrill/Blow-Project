import styles from "./../Chats.module.css";

const Message = (props) => {
  return <div className={styles.message}>{props.text}</div>;
};

export default Message;
