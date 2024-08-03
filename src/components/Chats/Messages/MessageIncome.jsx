import styles from "./Messages.module.css";

const MessageIncome = (props) => {
  return (
    <div className={`${styles.message} + ${styles.income}`}>
      <div className={styles.messageWrapper}>
        <div
          className={`${styles.messageContent} + ${styles.incomeColor} + ${styles.income}`}
        >
          <span>{props.text}</span>
          <img src={props.img} alt="" />
        </div>
      </div>
      <div className={`${styles.messageOptions} + ${styles.income}`}>
        <div className={styles.avatar}>
          <img
            src="https://i.pinimg.com/564x/be/c6/ce/bec6ce7cd23e943519e9d7bb3c359d0a.jpg"
            alt=""
          />
        </div>
        <span className={styles.date}>{props.date}</span>
        <span className={styles.status}>Delivered</span>
      </div>
    </div>
  );
};

export default MessageIncome;
