import styles from "./MyPosts.module.css";
import Post from "./Post/Post";

const MyPosts = () => {
  let postsData = [
    { id: 1, text: "This is my first post!", likeCount: 5 },
    {
      id: 2,
      text: "No bitches??",
      img: "https://i.pinimg.com/736x/45/7f/5c/457f5c7f1435df48e9c7765eda8c1748.jpg",
      likeCount: 13,
    },
  ];

  let postsElements = postsData.map((post) => {
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
