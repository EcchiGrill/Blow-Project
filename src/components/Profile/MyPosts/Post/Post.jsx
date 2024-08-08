import styles from "./Post.module.css";

const Post = (props) => {
  return (
    <article className={styles.post}>
      <img
        className={styles.avatar}
        src="https://i.pinimg.com/564x/4b/42/94/4b42947415fd2cd8fe2ca8d2c40bcd08.jpg"
        alt=""
      />
      <p>{props.text}</p>
      <img src={props.img} alt="" />
      <div>Likes: {props.likeCount}</div>
    </article>
  );
};

export default Post;
