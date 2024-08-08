import MyPosts from "components/Profile/MyPosts/MyPosts";
import styles from "./Profile.module.css";
import ProfileInfo from "components/Profile/ProfileInfo/ProfileInfo";

const Profile = (props) => {
  return (
    <main>
      <ProfileInfo />
      <MyPosts
        data={props.data}
        addPost={props.addPost}
        updateNewPostText={props.updateNewPostText}
      />
    </main>
  );
};

export default Profile;
