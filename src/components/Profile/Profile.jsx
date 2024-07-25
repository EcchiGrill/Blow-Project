import MyPosts from 'components/MyPosts/MyPosts';
import styles from './Profile.module.css'

const Profile = () => {
    return (
        <main>
        <div>
          <img src="https://placehold.co/800x400" alt="" />
        </div>
        <div>
          ava + description
        </div>
        <MyPosts />
      </main>
    );
} 

export default Profile;