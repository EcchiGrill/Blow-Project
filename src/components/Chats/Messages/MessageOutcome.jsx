import styles from "./Messages.module.css";

const MessageOutcome = (props) => {
  return (
    <div className={`${styles.message} + ${styles.outcome}`}>
      <div className={styles.messageWrapper}>
        <div
          className={`${styles.messageContent} + ${styles.outcomeColor} + ${styles.outcome}`}
        >
          <span>{props.text}</span>
          <img src={props.img} alt="" />
        </div>
      </div>
      <div className={`${styles.messageOptions} + ${styles.outcome}`}>
        <span className={styles.status}>Delivered</span>
        <span className={styles.date}>{props.date}</span>
        <div className={styles.avatar}>
          <img
            src="https://i.pinimg.com/564x/7c/d9/87/7cd987cfc4a123b44586791a7a2ec8ae.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default MessageOutcome;
