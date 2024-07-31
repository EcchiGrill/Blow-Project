import MyPosts from "components/Profile/MyPosts/MyPosts";
import styles from "./Profile.module.css";
import ProfileInfo from "components/Profile/ProfileInfo/ProfileInfo";

const Profile = () => {
  return (
    <main>
      <ProfileInfo />
      <MyPosts />
    </main>
  );
};

export default Profile;
