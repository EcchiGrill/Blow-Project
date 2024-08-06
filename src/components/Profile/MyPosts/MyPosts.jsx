import { createRef } from "react";
import styles from "./MyPosts.module.css";
import Post from "components/Profile/MyPosts/Post/Post";

const MyPosts = (props) => {
  let postsElements = props.data.posts.map((post) => {
    return <Post text={post.text} img={post.img} likeCount={post.likeCount} />;
  });

  let postRef = createRef();

  let addPost = () => {
    let value = postRef.current.value;
    return alert(value);
  };

  return (
    <div className={styles.container}>
      <h2>My Posts</h2>
      <form action="POST">
        <textarea name="" id="" ref={postRef}></textarea>
        <br />
        <button type="button" onClick={addPost}>
          Add Post
        </button>
      </form>
      <div className={styles.feed}>{postsElements}</div>
    </div>
  );
};

export default MyPosts;
