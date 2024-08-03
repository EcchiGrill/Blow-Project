import MyPosts from "components/Profile/MyPosts/MyPosts";
import styles from "./Profile.module.css";
import ProfileInfo from "components/Profile/ProfileInfo/ProfileInfo";

const Profile = (props) => {
  return (
    <main>
      <ProfileInfo />
      <MyPosts data={props.data} />
    </main>
  );
};

export default Profile;
