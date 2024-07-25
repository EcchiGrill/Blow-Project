import styles from './MyPosts.module.css'
import Post from './Post/Post';

const MyPosts = () => {
    return (
    <div className={styles.container}>
    <h2>My Posts</h2>
    <form action="POST">
        <h3>New Post</h3>
        <textarea name="" id=""></textarea>
        <button type="button">Add Post</button>
    </form>
        <div className={styles.feed}>
        <Post msg='This is my first post!' likeCount='5'/>
        <Post msg='No bitches??' img='https://i.pinimg.com/736x/45/7f/5c/457f5c7f1435df48e9c7765eda8c1748.jpg' likeCount='3'/>
        </div>
     </div>
    );
}

export default MyPosts;