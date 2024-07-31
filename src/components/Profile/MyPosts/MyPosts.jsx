import styles from "./MyPosts.module.css";
import Post from "components/Profile/MyPosts/Post/Post";

const MyPosts = (props) => {
  let postsElements = props.posts.map((post) => {
    return <Post text={post.text} img={post.img} likeCount={post.likeCount} />;
  });

  return (
    <div className={styles.container}>
      <h2>My Posts</h2>
      <form action="POST">
        <textarea name="" id=""></textarea>
        <br />
        <button type="button">Add Post</button>
      </form>
      <div className={styles.feed}>{postsElements}</div>
    </div>
  );
};

export default MyPosts;
